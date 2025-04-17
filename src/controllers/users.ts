import { Request, Response } from "express";
import User from "../models/user";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Запрашиваемый пользователь не найден" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.status(201).json(newUser);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании пользователя",
      });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Переданы некорректные данные при обновлении аватара",
      });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};
