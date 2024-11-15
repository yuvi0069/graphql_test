const ENUM = {
  HTTP_CODES: {
    BAD_REQUEST: 400,
    DUPLICATE_VALUE: 409,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    METHOD_NOT_ALLOWED: 405,
    MOVED_PERMANENTLY: 301,
    NOT_ACCEPTABLE: 406,
    NOT_FOUND: 404,
    NO_CONTENT_FOUND: 204,
    OK: 200,
    PERMANENT_REDIRECT: 308,
    UNAUTHORIZED: 401,
    UPGRADE_REQUIRED: 426,
    VALIDATION_ERROR: 422,
  },
  ROLE: {
    USER: "user",
    ADMIN: "admin",
  },
};

const MESSAGE = {
  API_KEY_REQUIRED: "Authorization header Api Key missing.",
  INVALID_API_KEY: "Invalid Api Key.",
  UNAUTHORIZED: "Unauthorized.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
  SUCCESS: "Success.",
  FAILED: "Failed.",
  NOT_FOUND: "Not found.",
};

export { ENUM, MESSAGE };
