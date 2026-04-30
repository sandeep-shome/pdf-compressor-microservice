interface ErrorJSONResponse {
  status: number;
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}
