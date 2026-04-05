import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("reviews", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    /*
     * booking_id: a review está ligada a uma reserva específica.
     * Garante contexto (viagem, data, participantes) e evita reviews
     * sem experiência real — só quem viajou pode avaliar.
     * RESTRICT: não deve ser possível apagar uma reserva com reviews.
     */
    booking_id: {
      type: "uuid",
      notNull: true,
      references: '"bookings"',
      onDelete: "RESTRICT",
    },
    reviewer_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },
    reviewed_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      onDelete: "RESTRICT",
    },
    /*
     * rating: escala 1-5.
     * A média é desnormalizada em driver_profiles.rating_average
     * e actualizada via trigger abaixo.
     */
    rating: {
      type: "integer",
      notNull: true,
    },
    comment: {
      type: "text",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "reviews",
    "reviews_rating_check",
    "CHECK (rating BETWEEN 1 AND 5)",
  );

  /* Um utilizador só pode avaliar outro uma vez por reserva */
  pgm.addConstraint("reviews", "reviews_unique_per_booking_reviewer", {
    unique: ["booking_id", "reviewer_id"],
  });

  /* Um utilizador não pode avaliar-se a si próprio */
  pgm.addConstraint(
    "reviews",
    "reviews_no_self_review_check",
    "CHECK (reviewer_id <> reviewed_id)",
  );

  pgm.addIndex("reviews", ["reviewed_id", "created_at"]);
  pgm.addIndex("reviews", ["reviewer_id"]);
  pgm.addIndex("reviews", ["booking_id"]);

  /*
   * Trigger que actualiza rating_average em driver_profiles sempre que
   * uma nova review é inserida para um utilizador com role='driver'.
   *
   * Alternativa considerada: calcular no momento da query (AVG + GROUP BY).
   * Rejeitada por performance — rating aparece em listagens de viagens
   * com muitas rows, o custo de AVG por cada row seria desnecessário.
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_update_driver_rating()
    RETURNS TRIGGER AS $$
    DECLARE
      v_role VARCHAR(20);
    BEGIN
      SELECT role INTO v_role FROM users WHERE id = NEW.reviewed_id;

      IF v_role = 'driver' THEN
        UPDATE driver_profiles
        SET
          rating_average = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE reviewed_id = NEW.reviewed_id
          )
        WHERE user_id = NEW.reviewed_id;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER update_driver_rating
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION trigger_update_driver_rating();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("reviews", { cascade: true });
  pgm.sql("DROP FUNCTION IF EXISTS trigger_update_driver_rating CASCADE;");
}
