import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { errors } from "celebrate";

import { createUser, login } from "./controllers/users";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import errorHandler from "./middlewares/errorHandler";
import { validateSignin, validateSignup } from "./middlewares/validators";

dotenv.config();

const { PORT = 3000, DB_ADDRESS = "mongodb://localhost:27017/mestodb" } =
  process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Слишком много запросов с этого IP, попробуйте позже",
});
app.use(limiter);

app.use(express.json());

app.use(requestLogger);

app.post("/signup", validateSignup, createUser);
app.post("/signin", validateSignin, login);

app.use(auth);

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Запрашиваемый ресурс не найден" });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
