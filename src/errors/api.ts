// eslint-disable-next-line max-classes-per-file
import { v4 as uuid } from 'uuid';
import { MultiError } from '../common/errors';
import { ErrorObject } from './types';

/**
 * An error with fields for a JSON API error
 * @link https://jsonapi.org/format/#errors
 */
export class ApiError extends Error {
  readonly name = 'ApiError';

  readonly id: string = uuid();

  /**
   * Create a new ApiError
   * @param error JSON API error definition
   */
  constructor(readonly error: Omit<ErrorObject, 'id'>) {
    super(error.detail);
  }
}

/**
 * A warning level error with fields for a JSON API error
 * @link https://jsonapi.org/format/#errors
 *
 * This is used to communicate errors to end users. But it is a warning for the system as it is not something we expect to need to support them with.
 */
export class ApiWarning extends Error {
  readonly name = 'ApiWarning';

  readonly id: string = uuid();

  /**
   * Create a new ApiWarning
   * @param error JSON API warning definition
   */
  constructor(readonly error: Omit<ErrorObject, 'id'>) {
    super(error.detail);
  }
}

export { MultiError };
