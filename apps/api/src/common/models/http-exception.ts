import { HttpException, HttpStatus } from '@nestjs/common';

export class Exception extends HttpException {
  constructor(
    message: string,
    exception?: Error | string,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    const error =
      typeof exception === 'string' ? new Error(exception) : exception;

    super(
      {
        message,
        exception: error?.name || 'UnknownError',
        stack: error?.stack,
        status: httpStatus,
      },
      httpStatus,
    );
  }

  private static createException(
    message: string,
    status: HttpStatus,
    exception?: Error | string,
  ) {
    return new Exception(message, exception, status);
  }

  static BadRequest(message: string) {
    return this.createException(
      message,
      HttpStatus.BAD_REQUEST,
      'BadRequestException',
    );
  }

  static Unauthorized(message: string) {
    return this.createException(
      message,
      HttpStatus.UNAUTHORIZED,
      'UnauthorizedException',
    );
  }

  static Forbidden(message: string) {
    return this.createException(
      message,
      HttpStatus.FORBIDDEN,
      'ForbiddenException',
    );
  }

  static NotFound(message: string) {
    return this.createException(
      message,
      HttpStatus.NOT_FOUND,
      'NotFoundException',
    );
  }

  static Conflict(message: string) {
    return this.createException(
      message,
      HttpStatus.CONFLICT,
      'ConflictException',
    );
  }

  static UnprocessableEntity(message: string) {
    return this.createException(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'UnprocessableEntityException',
    );
  }

  static InternalServerError(message: string) {
    return this.createException(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'InternalServerErrorException',
    );
  }

  static NotImplemented(message: string) {
    return this.createException(
      message,
      HttpStatus.NOT_IMPLEMENTED,
      'NotImplementedException',
    );
  }

  static BadGateway(message: string) {
    return this.createException(
      message,
      HttpStatus.BAD_GATEWAY,
      'BadGatewayException',
    );
  }

  static ServiceUnavailable(message: string) {
    return this.createException(
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      'ServiceUnavailableException',
    );
  }
}
