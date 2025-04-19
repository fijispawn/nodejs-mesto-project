import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import BadRequestError from "../errors/BadRequestError";
import ConflictError from "../errors/ConflictError";
import UnauthorizedError from "../errors/UnauthorizedError";

const { JWT_SECRET = "default-secret" } = process.env;

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new BadRequestError("Пользователь не найден");
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный ID пользователя"));
    }
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new BadRequestError("Пользователь не найден");
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (err: any) {
    if (err.code === 11000) {
      return next(
        new ConflictError("Пользователь с таким email уже существует")
      );
    }
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании пользователя"
        )
      );
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new BadRequestError("Пользователь не найден");
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Некорректные данные при обновлении профиля")
      );
    }
    next(err);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new BadRequestError("Пользователь не найден");
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Некорректные данные при обновлении аватара")
      );
    }
    next(err);
  }
};
