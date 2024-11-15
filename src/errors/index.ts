export class HttpStatusError extends Error {
  readonly name = "HttpStatusError";

  httpStatusCode: number | undefined = undefined;

  constructor(message: string, errorCode: number) {
    super(message);
    this.httpStatusCode = errorCode;
    this.message = message;
  }
}

export class ExternalAPIError extends HttpStatusError {
  providerCode?: string;

  constructor(message: string, errorCode: number, providerCode?: string) {
    super(message, errorCode);
    this.providerCode = providerCode;
  }
}

export class NotFoundInDBError extends Error {
  readonly name = "NotFoundInDBError";
}

export class PasswordError extends Error {
  readonly name = "PasswordError";
}

export class NoParametersError extends Error {
  readonly name = "NoParametersError";
}

export class BadParametersError extends Error {
  readonly name = "BadParameterError";
}

export class IllegalArgumentError extends Error {
  readonly name = "IllegalArgumentError";
}

export class IllegalAccessError extends Error {
  readonly name = "IllegalAccessError";
}
