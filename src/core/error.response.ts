type ErrorResponseType = {
  message?: string;
  statusCode?: number;
};

class ErrorResponse extends Error {
  message = "";
  statusCode = 403;

  constructor({ message = "", statusCode = 403 }: ErrorResponseType) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor({ message = "Unauthorized", statusCode = 401 }: ErrorResponseType) {
    super({ message, statusCode });
  }
}

class BadRequestError extends ErrorResponse {
  constructor({ message = "Bad request", statusCode = 403 }: ErrorResponseType) {
    super({ message, statusCode });
  }
}

class ForbiddenError extends ErrorResponse {
  constructor({ message = "Forbidden", statusCode = 403 }: ErrorResponseType) {
    super({ message, statusCode });
  }
}

class NotFoundError extends ErrorResponse {
  constructor({ message = "Not found", statusCode = 404 }: ErrorResponseType) {
    super({ message, statusCode });
  }
}

export { ErrorResponse, UnauthorizedError, BadRequestError, ForbiddenError, NotFoundError };
