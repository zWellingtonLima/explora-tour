export type UserCreatedRow = {
  id: string;
  email: string;
  username: string;
  user_type: "driver" | "traveler";
  token_version: number;
  created_at: Date;
};

export type UserRow = {
  id: string;
  email: string;
  username: string;
  hashed_password: string;
  token_version: number;
};

export type CreateUserInput = {
  username: string;
  email: string;
  hashed_password: string;
  user_type: "driver" | "traveler";
  extra_data?: Record<string, unknown>;
};

export type UserAuthRow = Pick<
  UserCreatedRow,
  "id" | "email" | "token_version"
>;
export type PublicUser = Omit<UserCreatedRow, "token_version" | "created_at">;
