import winston from "winston";
import expressWinston from "express-winston";
import path from "path";

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join("logs", "request.log"),
    }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
    }),
  ],
  format: winston.format.json(),
});

export { requestLogger, errorLogger };
