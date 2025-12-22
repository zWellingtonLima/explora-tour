export type errorType = {
  message: string;
  status: number;
  code: string;
  details?: unknown;
};

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
