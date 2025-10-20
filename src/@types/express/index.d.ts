import { ObjectId } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: { _id: string | ObjectId };
  }
}
