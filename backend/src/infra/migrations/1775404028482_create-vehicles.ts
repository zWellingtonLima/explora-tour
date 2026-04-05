import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("vehicles", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    driver_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    plate: {
      type: "varchar(20)",
      notNull: true,
    },
    brand: {
      type: "varchar(100)",
      notNull: true,
    },
    model: {
      type: "varchar(100)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
    color: {
      type: "varchar(50)",
    },
    /*
     * total_seats: capacidade numérica simples (Fase 1).
     * Este valor é copiado para trips.available_seats no momento de criação
     * da viagem, para que a trip tenha o seu próprio contador independente.
     */
    total_seats: {
      type: "integer",
      notNull: true,
    },
    /*
     * seat_layout: reservado para o editor visual de assentos (Fase 2/3).
     * NULL por enquanto — a coluna existe desde o início para evitar
     * uma migration de ALTER TABLE quando a feature for implementada.
     *
     * A estrutura futura esperada é:
     * {
     *   "rows": 4, "cols": 4,
     *   "aisleAfterCol": 1,
     *   "seats": [{ "id": "A1", "row": 0, "col": 0, "type": "window" }],
     *   "blockedCells": [{ "row": 3, "col": 2 }]
     * }
     */
    seat_layout: {
      type: "jsonb",
    },
    /*
     * photos: array de URLs (MinIO/S3).
     * Estrutura: ["https://storage.../vehicle-uuid/foto1.jpg", ...]
     * JSONB permite queries como: photos @> '["url"]'::jsonb
     */
    photos: {
      type: "jsonb",
      notNull: true,
      default: pgm.func(`'[]'::jsonb`),
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
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
    "vehicles",
    "vehicles_total_seats_check",
    "CHECK (total_seats > 0)",
  );
  pgm.addConstraint(
    "vehicles",
    "vehicles_year_check",
    `CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM now()) + 1)`,
  );

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);

  pgm.addIndex("vehicles", ["driver_id"]);
  pgm.addIndex("vehicles", ["driver_id", "is_active"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("vehicles", { cascade: true });
}
