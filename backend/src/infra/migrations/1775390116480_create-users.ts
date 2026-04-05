import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  /*
   * Função partilhada por todas as tabelas com updated_at.
   * Criada aqui (primeira migration) e destruída no down desta mesma migration,
   * uma vez que users é sempre a última tabela a ser removida num rollback total.
   */
  pgm.sql(`
    CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.createTable("users", {
    id: {
      type: "varchar(26)",
      primaryKey: true,
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "varchar(255)",
      notNull: true,
    },
    role: {
      type: "varchar(20)",
      notNull: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    phone: {
      type: "varchar(20)",
    },
    is_email_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    email_verified_at: {
      type: "timestamptz",
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    token_version: {
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
    "users",
    "users_role_check",
    `CHECK (role IN ('traveler', 'driver'))`,
  );

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);

  pgm.addIndex("users", ["email"]);
  pgm.addIndex("users", ["role", "is_active"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users", { cascade: true });
  pgm.sql("DROP FUNCTION IF EXISTS trigger_set_updated_at CASCADE;");
}
