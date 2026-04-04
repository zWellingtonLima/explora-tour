import { userRepository } from "repositories/user.repository.ts";
import { passwordService } from "services/password.service.ts";
import { jwtService } from "services/jwt.service.ts";
import {
  LoginError,
  ConflictError,
  AuthError,
  TokenError,
} from "errors/Errors.ts";

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

// ─── Registrar ──────────────────────────────────────────────────────────────────

async function register(input: RegisterInput): Promise<AuthTokens> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) throw new ConflictError("email");

  const hashed_password = await passwordService.hash(input.password);

  const user = await userRepository.create({
    username: input.username,
    email: input.email,
    hashed_password,
    user_type: input.user_type,
  });

  // Emite tokens imediatamente — sem precisar de login separado
  return buildTokens(user.id, user.email, user.token_version);
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function login(email: string, password: string): Promise<AuthTokens> {
  const user = await userRepository.findByEmail(email);

  // Mesmo erro se o utilizador não existir ou a password estiver errada
  // Evita user enumeration attacks
  if (!user) {
    await passwordService.hash(password); // timing attack mitigation
    throw new LoginError();
  }

  const valid = await passwordService.compare(password, user.hashed_password);
  if (!valid) throw new LoginError();

  return buildTokens(user.id, user.email, user.token_version);
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

async function refresh(
  rawRefreshToken: string | undefined,
): Promise<AuthTokens> {
  if (!rawRefreshToken) throw new AuthError();

  const payload = jwtService.verifyRefreshToken(rawRefreshToken); // lança TokenError se inválido

  const user = await userRepository.findById(payload.userId);
  if (!user) throw new TokenError();

  // tokenVersion divergente → refresh token foi revogado (logout ou compromisso)
  if (user.token_version !== payload.tokenVersion) throw new TokenError();

  return buildTokens(user.id, user.email, user.token_version);
}

// ─── Logout ───────────────────────────────────────────────────────────────────

async function logout(userId: string): Promise<void> {
  // Incrementa a versão → invalida todos os refresh tokens ativos
  await userRepository.incrementTokenVersion(userId);
}

// ─── Helpers privados ─────────────────────────────────────────────────────────

function buildTokens(
  userId: string,
  userEmail: string,
  tokenVersion: number,
): AuthTokens {
  return {
    accessToken: jwtService.signAccessToken(userId, userEmail),
    refreshToken: jwtService.signRefreshToken(userId, tokenVersion),
  };
}

export const authService = { register, login, refresh, logout };
