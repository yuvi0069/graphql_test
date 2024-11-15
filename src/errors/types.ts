import { ErrorObject as CommonErrorObject } from '../common/errors';

/**
 * An error
 * @link https://jsonapi.org/format/#errors
 */
export interface ErrorObject extends CommonErrorObject {
  /**
   * A unique identifier for this particular occurrence of the problem
   */
  id: string;
  /**
   * The HTTP status code applicable to this problem
   */
  status?: string;
  /**
   * An object describing the source of the problem
   */
  source?: {
    /**
     * A reference to the entity in the requests that caused the problem
     * @link https://tools.ietf.org/html/rfc6901
     * @example "/foo/bar/0"
     */
    pointer?: string;
    /**
     * The name of the query parameter that caused the problem
     */
    parameter?: string;
    /**
     * Additional references
     */
    [x: string]: string | undefined;
  };
}
