import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions = {
  id: {
    type: "serial",
    primaryKey: true,
  },
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("user_type", ["driver", "traveler"]);

  pgm.createTable("users", {
    id: "id",

    user_type: {
      type: "user_type",
      notNull: true,
    },

    username: {
      type: "text",
      notNull: true,
    },

    email: {
      type: "text",
      notNull: true,
      unique: true,
    },

    hashed_password: {
      type: "text",
      notNull: true,
    },

    extra_data: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'{}'::jsonb"),
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },

    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.createIndex("users", "email");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("users");
  pgm.dropType("user_type");
}
