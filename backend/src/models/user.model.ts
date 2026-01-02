import { ulid } from "ulid";

import query from "infra/database/pool.ts";

export type UserInsert = {
  username: string;
  email: string;
  hashed_password: string;
  user_type: "driver" | "traveler";
  extra_data?: Record<string, unknown>;
};

export async function createUser(data: UserInsert) {
  const insertUserQuery = {
    text: `
          INSERT INTO users (id, user_type, username, email, hashed_password, extra_data)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, user_type, username, email, created_at
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
