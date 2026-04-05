import { ulid } from "ulid";
import query from "infra/database/pool.ts";

import { NotFoundError } from "shared/errors/Errors.ts";
import {
  CreateUserInput,
  PublicUser,
  UserAuthRow,
  UserCreatedRow,
  UserRow,
} from "./user.types.ts";

async function findByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await query({
    text: `SELECT id, email, name, password_hash, token_version
           FROM users WHERE email = $1 LIMIT 1`,
    values: [email.toLowerCase().trim()],
  });
  return (rows[0] as UserRow) ?? null;
}

async function findById(id: string): Promise<UserAuthRow | null> {
  const { rows } = await query({
    text: `SELECT id, email, name, token_version
           FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  });
  return (rows[0] as UserAuthRow) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function findPublicById(id: string): Promise<PublicUser | null> {
  const { rows } = await query({
    text: `SELECT id, email, name, role
           FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  });
  return (rows[0] as PublicUser) ?? null;
}

async function create(data: CreateUserInput): Promise<UserCreatedRow> {
  const { rows } = await query({
    text: `INSERT INTO users (id, role, name, email, password_hash)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, email, name, token_version`,
    values: [
      ulid(),
      data.role,
      data.name.toLowerCase(),
      data.email.toLowerCase().trim(),
      data.password_hash,
    ],
  });
  return rows[0] as UserCreatedRow;
}

async function incrementTokenVersion(userId: string): Promise<number> {
  const { rows } = await query({
    text: `UPDATE users SET token_version = token_version + 1
           WHERE id = $1 RETURNING token_version`,
    values: [userId],
  });
  if (!rows[0]) throw new NotFoundError("User");
  return rows[0].token_version;
}

export const userRepository = {
  findByEmail,
  findById,
  create,
  incrementTokenVersion,
};
