class BadRequestError extends Error {
  statusCode: number;

  constructor(message = "Некорректный запрос") {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
