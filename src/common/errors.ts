/* eslint-disable max-classes-per-file */

/**
 * An error
 * @link https://jsonapi.org/format/#errors
 */
export interface ErrorObject {
  /**
   * An application-specific error code
   * @example "0"
   */
  code?: any;
  /**
   * A human-readable summary of the problem. SHOULD NOT change between occurrences of the problem
   */
  title?: string;
  /**
   * A human-readable explanation of the problem. SHOULD NOT change between occurrences of the problem
   */
  detail: string;
  /**
   * A set of links that lead to further detail on the problem
   */
  links?: {
    /**
     * A link to further detail
     */
    about: string;
    /**
     * Additional links
     */
    [x: string]: string;
  };
  /**
   * An object containing extra information about the error
   */
  meta?: object;
}

export class BaseError extends Error {
  name = "BaseError";

  public readonly error: ErrorObject;

  constructor(detail: string, error: Omit<ErrorObject, "detail"> = {}) {
    super(detail);
    this.error = { detail, ...error };
  }
}

export class NotYetImplementedError extends BaseError {
  name = "NotYetImplementedError";
}

/**
 * Container for multiple child errors
 */
export class MultiError extends Error {
  readonly name = "MultiError";

  readonly errors: Error[];

  /**
   * Create a new MultiError
   * @param errors List of child errors
   */
  constructor(errors: Error[]) {
    super();

    // Flatten errors if one of them is a MultiError
    this.errors = ([] as Error[]).concat(
      ...errors.map((error) =>
        error instanceof MultiError ? error.errors : error
      )
    );
  }
}

export class IllegalStateError extends BaseError {
  name = "IllegalStateError";
}
