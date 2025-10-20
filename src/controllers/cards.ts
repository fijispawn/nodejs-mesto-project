import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Card from "../models/card";
import BadRequestError from "../errors/BadRequestError";
import ForbiddenError from "../errors/ForbiddenError";
import NotFoundError from "../errors/NotFoundError";

// Локальный тип запроса с user (как в users.ts)
type AuthedRequest = Request & { user?: { _id: string } };

export const getCards = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate(["owner", "likes"]);
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    next(err);
  }
};

export const deleteCard = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("Некорректный ID карточки");
    }

    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    // Сравниваем как строки, чтобы не споткнуться о ObjectId
    const isOwner = String(card.owner) === String(req.user?._id);

    if (!isOwner) {
      throw new ForbiddenError("Нельзя удалить чужую карточку");
    }

    await card.deleteOne();
    res.status(200).json({ message: "Карточка удалена" });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("Некорректный ID карточки");
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    ).populate(["owner", "likes"]);

    if (!card) throw new NotFoundError("Карточка не найдена");

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("Некорректный ID карточки");
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    ).populate(["owner", "likes"]);

    if (!card) throw new NotFoundError("Карточка не найдена");

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};
