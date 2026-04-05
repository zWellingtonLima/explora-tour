export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  user_type: "driver" | "traveler";
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
