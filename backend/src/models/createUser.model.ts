import bcrypt from "bcrypt";

import database from "infra/database.ts";

export type CreatedUser = {
  id: number;
  username: string;
  email: string;
  user_type: "driver" | "traveler";
  created_at: Date;
};

type CreateUserInput = {
  username: string;
  email: string;
  user_type: "driver" | "traveler";
  password: string;
};

export async function createUser(data: CreateUserInput): Promise<CreatedUser> {
  const hashedPassword = await getHashedPassword(data.password);
  const query = {
    text: `
          INSERT INTO users (user_type, username, email, hashed_password)
          VALUES ($1, $2, $3, $4)
          RETURNING id, user_type, username, email, created_at
        `,
    values: [
      data.user_type,
      data.username.toLowerCase(),
      data.email.toLowerCase().trim(),
      hashedPassword,
    ],
  };

  return (await database.query(query)).rows[0];
}

async function getHashedPassword(pass: string) {
  return await bcrypt.hash(pass, 10);
}
