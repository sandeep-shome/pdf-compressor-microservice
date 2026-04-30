import { STATUS_CODES } from "node:http";

export class ErrorBuilder extends Error {
  public status: number;
  constructor(
    status: number,
    name: string | undefined,
    message: string,
    stack?: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = name || STATUS_CODES[status] || "Error";
    this.stack = stack || new Error().stack!;
    this.cause = cause;
    this.status = status;

    Object.setPrototypeOf(this, ErrorBuilder.prototype);
  }

  /**
   * Builds an error object in JSON format.
   *
   * @returns An object containing the status, name, message, stack, and cause of the error.
   */
  public buildErrorJSON(): ErrorJSONResponse {
    return {
      status: this.status,
      name: this.name,
      message: this.message,
      stack: this.stack!,
      cause: this.cause,
    };
  }
}
