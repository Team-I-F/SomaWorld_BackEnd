class HttpError extends Error {
  constructor(httpcode = 500, message = "Internal Server Error") {
    super(message);
    this.httpcode = httpcode;
  }
}
class BadRequestException extends Error {
  constructor() {
    super(400, "Bad Request");
  }
}
class NotFoundException extends Error {
  constructor() {
    super(404, "Not Found");
  }
}
class InternalServerException extends Error {
  constructor() {
    super(500, "Internal Server Error");
  }
}

class UnAuthorizedException extends Error {
  constructor() {
    super(401, "UnAuthorized");
  }
}
module.exports = {
  UnAuthorizedException,
  HttpError,
  BadRequestException,
  NotFoundException,
  InternalServerException,
};
