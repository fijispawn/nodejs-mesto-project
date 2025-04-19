import { Request, Response } from "express";
import Card from "../models/card";

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch {
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании карточки",
      });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return res.status(404).json({ message: 'Карточка не найдена' });
    }

    if (card.owner.toString() !== req.user?._id) {
      return res.status(403).json({ message: 'Нельзя удалять чужую карточку' });
    }

    await card.deleteOne();

    res.status(200).json({ message: 'Карточка удалена' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректный ID карточки' });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );
    if (!card) return res.status(404).json({ message: "Карточка не найдена" });
    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Некорректный ID карточки" });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    );
    if (!card) return res.status(404).json({ message: "Карточка не найдена" });
    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Некорректный ID карточки" });
    }
    res.status(500).json({ message: "На сервере произошла ошибка" });
  }
};
