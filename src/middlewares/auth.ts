import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";

const { JWT_SECRET = "default-secret" } = process.env;

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Неверный токен"));
  }
};
