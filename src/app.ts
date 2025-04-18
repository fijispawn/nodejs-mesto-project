import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

dotenv.config();

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } =
  process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с этого IP, попробуйте позже',
});
app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.use(express.json());

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose
  .connect(DB_ADDRESS)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
