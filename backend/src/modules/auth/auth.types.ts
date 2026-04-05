export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "driver" | "traveler";
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
