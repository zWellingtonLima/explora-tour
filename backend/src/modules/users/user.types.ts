export type UserCreatedRow = {
  id: string;
  email: string;
  name: string;
  role: "driver" | "traveler";
  token_version: number;
  created_at: Date;
};

export type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  token_version: number;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password_hash: string;
  role: "driver" | "traveler";
};

export type UserAuthRow = Pick<
  UserCreatedRow,
  "id" | "email" | "token_version"
>;
export type PublicUser = Omit<UserCreatedRow, "token_version" | "created_at">;
