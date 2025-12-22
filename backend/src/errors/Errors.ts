import { AppError } from "./AppError.ts";

class ValidationError extends AppError {
  constructor(details: unknown) {
    super("Validation error", 400, "VALIDATION ERROR", details);
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

export { ValidationError, EmailAlreadyExistsError };
