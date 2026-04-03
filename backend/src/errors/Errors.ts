import { AppError } from "./AppError.ts";

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super("Validation error", 400, "VALIDATION_ERROR", details);
  }
}

export class LoginError extends AppError {
  constructor() {
    super("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }
}

export class AuthError extends AppError {
  constructor() {
    super("Missing or invalid access token", 401, "INVALID_TOKEN");
  }
}

export class TokenError extends AppError {
  constructor() {
    super("Invalid or expired token", 403, "INVALID_OR_EXPIRED_TOKEN");
  }
}

export class ConflictError extends AppError {
  constructor(field: string) {
    super(`${field} already in use`, 409, "CONFLICT", { field });
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}
