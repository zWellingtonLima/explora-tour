import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

async function hash(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function compare(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export const passwordService = { hash, compare };
