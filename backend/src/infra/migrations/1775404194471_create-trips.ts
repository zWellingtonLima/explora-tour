import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("trips", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    driver_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      /*
       * RESTRICT: não permite apagar um utilizador que tenha viagens.
       * Preferimos RESTRICT a CASCADE aqui. A lógica de desativação
       * de condutores deve ser feita via is_active em vez de DELETE.
       */
      onDelete: "RESTRICT",
    },
    vehicle_id: {
      type: "uuid",
      notNull: true,
      references: '"vehicles"',
      onDelete: "RESTRICT",
    },
    /*
     * origin_city / destination_city: desnormalização intencional.
     * Os detalhes completos (morada, coordenadas) vivem em trip_stops.
     * Estes campos existem para a busca pública ser eficiente sem JOIN:
     *   WHERE origin_city ILIKE 'porto%' AND destination_city ILIKE 'lisboa%'
     */
    origin_city: {
      type: "varchar(255)",
      notNull: true,
    },
    destination_city: {
      type: "varchar(255)",
      notNull: true,
    },
    departure_at: {
      type: "timestamptz",
      notNull: true,
    },
    estimated_arrival_at: {
      type: "timestamptz",
    },
    /*
     * price_per_seat: preço base por assento para o trajeto completo.
     */
    price_per_seat: {
      type: "numeric(10,2)",
      notNull: true,
    },
    /*
     * available_seats: contador em tempo real de assentos livres.
     * Inicializado com vehicles.total_seats na criação da viagem.
     * Gerido pelo trigger trigger_manage_available_seats (da migration create_bookings)
     * que decrementa/incrementa automaticamente com as reservas.
     */
    available_seats: {
      type: "integer",
      notNull: true,
    },
    /*
     * status — ciclo de vida da viagem:
     *   draft        → criada pelo condutor, ainda não visível publicamente
     *   published    → visível na busca pública, aceita reservas
     *   in_progress  → viagem em curso (departure_at passou)
     *   completed    → viagem terminada, reviews desbloqueadas
     *   cancelled    → cancelada pelo condutor (reservas existentes são notificadas)
     */
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "draft",
    },
    notes: {
      type: "text",
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
    "trips",
    "trips_status_check",
    `CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled'))`,
  );

  pgm.addConstraint(
    "trips",
    "trips_price_check",
    "CHECK (price_per_seat >= 0)",
  );

  pgm.addConstraint(
    "trips",
    "trips_available_seats_check",
    "CHECK (available_seats >= 0)",
  );

  pgm.addConstraint(
    "trips",
    "trips_arrival_after_departure_check",
    "CHECK (estimated_arrival_at IS NULL OR estimated_arrival_at > departure_at)",
  );

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);

  /* Índices para a busca pública — queries mais frequentes da plataforma */
  pgm.addIndex("trips", ["status", "departure_at"]);
  pgm.addIndex("trips", ["origin_city", "destination_city", "status"]);
  pgm.addIndex("trips", ["driver_id"]);
  pgm.addIndex("trips", ["vehicle_id"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("trips", { cascade: true });
}
