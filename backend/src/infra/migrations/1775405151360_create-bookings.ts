import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("bookings", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    trip_id: {
      type: "uuid",
      notNull: true,
      references: '"trips"',
      onDelete: "RESTRICT",
    },
    traveler_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },
    /*
     * boarding_stop_id / alighting_stop_id: onde o viajante embarca e desembarca.
     * Ambos devem pertencer à mesma trip_id — validado via trigger abaixo.
     * Permite precificação por segmento com trip_stops.price_from_origin.
     */
    boarding_stop_id: {
      type: "uuid",
      notNull: true,
      references: '"trip_stops"',
      onDelete: "RESTRICT",
    },
    alighting_stop_id: {
      type: "uuid",
      notNull: true,
      references: '"trip_stops"',
      onDelete: "RESTRICT",
    },
    /*
     * seat_identifier: identificador legível do assento.
     * Fase 1: número simples ("1", "5", "12").
     * Fase 2/3: identificador do editor visual ("A1", "B3").
     */
    seat_identifier: {
      type: "varchar(10)",
      notNull: true,
    },
    /*
     * price: valor fixado no momento da reserva.
     * Importante guardar o preço no momento do booking — o condutor
     * pode alterar price_per_seat depois, mas reservas existentes
     * não devem ser afectadas.
     */
    price: {
      type: "numeric(10,2)",
      notNull: true,
    },
    /*
     * status — ciclo de vida da reserva:
     *   awaiting_payment → reserva criada, assento reservado, aguarda confirmação
     *   confirmed        → condutor confirmou o pagamento
     *   cancelled        → cancelado pelo viajante ou condutor
     *   completed        → viagem terminada com sucesso
     *   expired          → prazo de confirmação esgotado (assento libertado)
     */
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "awaiting_payment",
    },
    traveler_notes: {
      type: "text",
    },
    /*
     * expires_at: prazo para o condutor confirmar o pagamento.
     * Após este timestamp, um job de background muda o status para 'expired'
     * e liberta o assento.
     */
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "bookings",
    "bookings_status_check",
    `CHECK (status IN ('awaiting_payment', 'confirmed', 'cancelled', 'completed', 'expired'))`,
  );

  pgm.addConstraint("bookings", "bookings_price_check", "CHECK (price >= 0)");

  pgm.addConstraint(
    "bookings",
    "bookings_stops_different_check",
    "CHECK (boarding_stop_id <> alighting_stop_id)",
  );

  /*
   * Índice parcial único: garante que não existem dois bookings activos
   * para o mesmo assento na mesma viagem.
   * Reservas canceladas/expiradas não bloqueiam o mesmo assento no futuro.
   *
   * Isto é a defesa ao nível da banco de dados contra race conditions —
   * mesmo que dois requests cheguem simultaneamente, só um consegue inserir.
   * O segundo recebe um erro de constraint violation que o serviço deve
   * tratar e devolver ao cliente como "assento já ocupado".
   */
  pgm.addIndex("bookings", ["trip_id", "seat_identifier"], {
    unique: true,
    where: `status NOT IN ('cancelled', 'expired')`,
    name: "bookings_active_seat_unique",
  });

  pgm.addIndex("bookings", ["trip_id", "status"]);
  pgm.addIndex("bookings", ["traveler_id", "status"]);
  pgm.addIndex("bookings", ["expires_at"], {
    where: `status = 'awaiting_payment'`,
    name: "bookings_pending_expiry_idx",
  });

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);

  /*
   * Trigger de gestão de available_seats.
   *
   * Problema resolvido: race condition no último assento.
   * Quando dois viajantes tentam reservar o último assento ao mesmo tempo:
   *   1. O índice parcial único (bookings_active_seat_unique) garante
   *      que só um INSERT tem sucesso.
   *   2. Este trigger garante que available_seats é decrementado atomicamente.
   *   3. O CHECK (available_seats >= 0) em trips impede que o valor fique negativo.
   *
   * Fluxo de decremento/incremento:
   *   INSERT awaiting_payment → available_seats - 1
   *   UPDATE → cancelled/expired → available_seats + 1 (se vinha de estado activo)
   *   UPDATE → confirmed        → sem alteração (assento já estava reservado)
   *   UPDATE → completed        → sem alteração (viagem terminou, contador não importa)
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_manage_available_seats()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' AND NEW.status = 'awaiting_payment' THEN

        UPDATE trips
        SET available_seats = available_seats - 1
        WHERE id = NEW.trip_id
          AND available_seats > 0;

        IF NOT FOUND THEN
          RAISE EXCEPTION
            'Sem assentos disponíveis para a viagem %', NEW.trip_id
            USING ERRCODE = 'P0001';
        END IF;

      ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status IN ('awaiting_payment', 'confirmed')
           AND NEW.status IN ('cancelled', 'expired') THEN

          UPDATE trips
          SET available_seats = available_seats + 1
          WHERE id = NEW.trip_id;

        END IF;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER manage_available_seats
    AFTER INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_manage_available_seats();
  `);

  /*
   * Trigger de validação: boarding e alighting devem pertencer à mesma trip
   * e boarding deve ter order_index menor que alighting.
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_validate_booking_stops()
    RETURNS TRIGGER AS $$
    DECLARE
      v_boarding_order  INTEGER;
      v_alighting_order INTEGER;
      v_boarding_trip   UUID;
      v_alighting_trip  UUID;
    BEGIN
      SELECT trip_id, order_index INTO v_boarding_trip, v_boarding_order
      FROM trip_stops WHERE id = NEW.boarding_stop_id;

      SELECT trip_id, order_index INTO v_alighting_trip, v_alighting_order
      FROM trip_stops WHERE id = NEW.alighting_stop_id;

      IF v_boarding_trip <> NEW.trip_id OR v_alighting_trip <> NEW.trip_id THEN
        RAISE EXCEPTION
          'boarding_stop e alighting_stop devem pertencer à viagem %', NEW.trip_id
          USING ERRCODE = 'P0002';
      END IF;

      IF v_boarding_order >= v_alighting_order THEN
        RAISE EXCEPTION
          'boarding_stop deve ser anterior a alighting_stop na ordem da viagem'
          USING ERRCODE = 'P0003';
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER validate_booking_stops
    BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_validate_booking_stops();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("bookings", { cascade: true });
  pgm.sql("DROP FUNCTION IF EXISTS trigger_manage_available_seats CASCADE;");
  pgm.sql("DROP FUNCTION IF EXISTS trigger_validate_booking_stops CASCADE;");
}
