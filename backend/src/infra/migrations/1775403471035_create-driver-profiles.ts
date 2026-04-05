import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("driver_profiles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    /*
     * UNIQUE em user_id: relação 1-para-1 com users.
     * Um utilizador com role='driver' tem exatamente um driver_profile.
     */
    user_id: {
      type: "varchar(26)",
      notNull: true,
      unique: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    bio: {
      type: "text",
    },
    document_number: {
      type: "varchar(20)",
    },
    document_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    /*
     * rating_average: média calculada a partir das reviews.
     * Desnormalização intencional para evitar GROUP BY em cada listagem
     * de condutores. Atualizado via trigger ou no serviço de reviews.
     * NUMERIC(3,2): valores entre 0.00 e 5.00.
     */
    rating_average: {
      type: "numeric(3,2)",
      notNull: true,
      default: 0,
    },
    total_trips_completed: {
      type: "integer",
      notNull: true,
      default: 0,
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
    "driver_profiles",
    "driver_profiles_rating_check",
    "CHECK (rating_average >= 0 AND rating_average <= 5)",
  );

  pgm.addConstraint(
    "driver_profiles",
    "driver_profiles_trips_check",
    "CHECK (total_trips_completed >= 0)",
  );

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON driver_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("driver_profiles", { cascade: true });
}
