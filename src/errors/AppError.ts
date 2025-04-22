export class AppError extends Error {
  public status: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status || 500;
    this.code = code || "internal.error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
