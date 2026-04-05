import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("booking_status_history", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    booking_id: {
      type: "uuid",
      notNull: true,
      references: '"bookings"',
      onDelete: "CASCADE",
    },
    /*
     * from_status: NULL na primeira entrada (criação da reserva).
     * Permite reconstruir o histórico completo de estados da reserva.
     */
    from_status: {
      type: "varchar(20)",
    },
    to_status: {
      type: "varchar(20)",
      notNull: true,
    },
    /*
     * changed_by: quem efetuou a mudança de estado.
     * NULL para transições automáticas (ex: expiração por job de background).
     * SET NULL em onDelete para não perder o histórico se o utilizador for removido.
     */
    changed_by: {
      type: "varchar(26)",
      references: '"users"',
      onDelete: "SET NULL",
    },
    /*
     * reason: justificação legível.
     * Exemplos: "Pagamento confirmado pelo condutor",
     *           "Reserva expirada — sem confirmação em 24h",
     *           "Cancelado pelo viajante a pedido",
     *           "Viagem cancelada pelo condutor"
     */
    reason: {
      type: "text",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  /*
   * Trigger que regista automaticamente cada mudança de status em bookings.
   * O serviço de aplicação não precisa de chamar INSERT manualmente —
   * qualquer UPDATE em bookings.status cria o registo de auditoria.
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_record_booking_status_change()
    RETURNS TRIGGER AS $$
    BEGIN
      IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO booking_status_history (booking_id, from_status, to_status)
        VALUES (NEW.id, OLD.status, NEW.status);
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER record_booking_status_change
    AFTER UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_record_booking_status_change();
  `);

  /*
   * Trigger para o INSERT inicial em bookings (criação da reserva).
   * Regista a entrada inicial com from_status = NULL.
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_record_booking_initial_status()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO booking_status_history (booking_id, from_status, to_status)
      VALUES (NEW.id, NULL, NEW.status);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER record_booking_initial_status
    AFTER INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION trigger_record_booking_initial_status();
  `);

  pgm.addIndex("booking_status_history", ["booking_id", "created_at"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("booking_status_history", { cascade: true });
  pgm.sql(
    "DROP FUNCTION IF EXISTS trigger_record_booking_status_change CASCADE;",
  );
  pgm.sql(
    "DROP FUNCTION IF EXISTS trigger_record_booking_initial_status CASCADE;",
  );
}
