import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";

const { JWT_SECRET = "default-secret" } = process.env;

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

// Локальный тип запроса с user
type AuthedRequest = Request & { user?: { _id: string } };

export default (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = { _id: payload._id };
    return next();
  } catch {
    return next(new UnauthorizedError("Неверный токен"));
  }
};
