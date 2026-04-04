import { ulid } from "ulid";

import query from "infra/database/pool.ts";
import { NotFoundError } from "errors/Errors.ts";

export type UserInsert = {
  username: string;
  email: string;
  hashed_password: string;
  user_type: "driver" | "traveler";
  extra_data?: Record<string, unknown>;
};

export type UserCreated = {
  id: string;
  user_type: "driver" | "traveler";
  username: string;
  email: string;
  created_at: Date;
  token_version: number;
};

export type UserData = {
  id: string;
  email: string;
  username: string;
  hashed_password: string;
  token_version: number;
};

export type UserTokenData = {
  id: string;
  token_version: number;
};

// QUERIES

async function findUserByEmail(email: string): Promise<UserData | null> {
  const { rows } = await query({
    text: `SELECT id, email, username, token_version, hashed_password
           FROM users WHERE email = $1 LIMIT 1`,
    values: [email.toLowerCase().trim()],
  });
  return (rows[0] as UserData) ?? null;
}

async function findUserById(id: string): Promise<UserTokenData | null> {
  const { rows } = await query({
    text: `SELECT id, token_version FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  });

  return (rows[0] as UserData) ?? null;
}

async function incrementTokenVersion(userId: string): Promise<number> {
  const { rows } = await query({
    text: `UPDATE users SET token_version = token_version + 1
           WHERE id = $1 RETURNING token_version`,
    values: [userId],
  });

  if (!rows[0]) throw new NotFoundError("User not found");
  return rows[0].token_version;
}

async function createUser(data: UserInsert): Promise<UserCreated> {
  const { rows } = await query({
    text: `
          INSERT INTO users (id, user_type, username, email, hashed_password, extra_data)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, user_type, username, email, created_at, token_version
        `,
    values: [
      ulid(),
      data.user_type,
      data.username.toLowerCase(),
      data.email.toLowerCase().trim(),
      data.hashed_password,
      data.extra_data ?? {},
    ],
  });

  return rows[0] as UserCreated;
}

export { findUserByEmail, findUserById, incrementTokenVersion, createUser };
