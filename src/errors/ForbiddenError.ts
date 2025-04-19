class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = "Доступ запрещён") {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
