import { ulid } from "ulid";
import query from "infra/database/pool.ts";

// ─── Tipos de domínio ─────────────────────────────────────────────────────────

export type UserRow = {
  id: string;
  email: string;
  username: string;
  hashed_password: string;
  token_version: number;
};

export type UserPublicRow = Omit<UserRow, "hashed_password">;

export type CreateUserInput = {
  username: string;
  email: string;
  hashed_password: string;
  user_type: "driver" | "traveler";
  extra_data?: Record<string, unknown>;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

async function findByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await query({
    text: `SELECT id, email, username, hashed_password, token_version
           FROM users WHERE email = $1 LIMIT 1`,
    values: [email.toLowerCase().trim()],
  });
  return (rows[0] as UserRow) ?? null;
}

async function findById(id: string): Promise<UserPublicRow | null> {
  const { rows } = await query({
    text: `SELECT id, email, username, token_version
           FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  });
  return (rows[0] as UserPublicRow) ?? null;
}

async function create(data: CreateUserInput): Promise<UserPublicRow> {
  const { rows } = await query({
    text: `INSERT INTO users (id, user_type, username, email, hashed_password, extra_data)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, email, username, token_version`,
    values: [
      ulid(),
      data.user_type,
      data.username.toLowerCase(),
      data.email.toLowerCase().trim(),
      data.hashed_password,
      data.extra_data ?? {},
    ],
  });
  return rows[0] as UserPublicRow;
}

async function incrementTokenVersion(userId: string): Promise<number> {
  const { rows } = await query({
    text: `UPDATE users SET token_version = token_version + 1
           WHERE id = $1 RETURNING token_version`,
    values: [userId],
  });
  if (!rows[0])
    throw new Error(`User ${userId} not found during token invalidation`);
  return rows[0].token_version;
}

export const userRepository = {
  findByEmail,
  findById,
  create,
  incrementTokenVersion,
};
