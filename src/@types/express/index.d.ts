import { ObjectId } from "mongoose";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string | ObjectId;
    };
  }
}
