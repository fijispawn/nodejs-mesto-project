import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };

  next();
});

const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/mestodb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
