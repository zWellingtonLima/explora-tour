import { AppError } from "./AppError.ts";

class ValidationError extends AppError {
  constructor(details: unknown) {
    super("Validation error", 400, "VALIDATION ERROR", details);
  }
}

class LoginValidationError extends AppError {
  constructor(details: unknown) {
    super("Login Validation error", 401, "VALIDATION ERROR", details);
  }
}

class NotFound extends AppError {
  constructor(details: unknown) {
    super("Not  Found", 404, "NOT FOUND", details);
  }
}

class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("Email already registered", 409, "EMAIL_ALREADY_REGISTERED", {
      field: "email",
    });
  }
}

export class AuthError extends AppError {
  constructor() {
    super("Invalid access token", 401, "INVALID_TOKEN");
  }
}

export class TokenError extends AppError {
  constructor() {
    super("Invalid or expired token", 403, "INVALID_OR_EXPIRED_TOKEN");
  }
}

export {
  ValidationError,
  LoginValidationError,
  NotFound,
  EmailAlreadyExistsError,
};
