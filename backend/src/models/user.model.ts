import { ULID, ulid } from "ulid";

import query from "infra/database/pool.ts";

export type UserInsert = {
  username: string;
  email: string;
  hashed_password: string;
  user_type: "driver" | "traveler";
  extra_data?: Record<string, unknown>;
};

export type UserCreated = {
  id: ULID;
  user_type: "driver" | "traveler";
  username: string;
  email: string;
  created_at: Date;
};

export type UserData = {
  id: string;
  email: string;
  username: string;
  hashed_password: string;
  token_version: number;
};

async function findUserByEmail(email: string): Promise<UserData | null> {
  const { rows } = await query({
    text: `SELECT id, email, username, token_version, hashed_password
           FROM users WHERE email = $1 LIMIT 1`,
    values: [email.toLowerCase().trim()],
  });
  return rows[0] ?? null;
}

async function findUserById(id: string) {
  const { rows } = await query({
    text: `SELECT id, email, username, token_version FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  });

  return rows[0] ?? null;
}

async function incrementTokenVersion(userId: string): Promise<number> {
  const { rows } = await query({
    text: `UPDATE users SET token_version = token_version + 1
           WHERE id = $1 RETURNING token_version`,
    values: [userId],
  });
  return rows[0].token_version;
}

async function createUser(data: UserInsert): Promise<UserCreated> {
  const insertUserQuery = {
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
      data.extra_data,
    ],
  };

  const { rows } = await query(insertUserQuery);
  return rows[0];
}

async function getLoginUserData(email: string) {
  const getUserQuery = {
    text: `
      SELECT id, token_version FROM users WHERE email = $1 LIMIT 1
    `,
    values: [email],
  };

  const { rows } = await query(getUserQuery);
  return rows[0];
}

export {
  findUserByEmail,
  findUserById,
  incrementTokenVersion,
  createUser,
  getLoginUserData,
};
