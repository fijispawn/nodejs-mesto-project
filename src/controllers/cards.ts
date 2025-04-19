import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import ForbiddenError from "../errors/ForbiddenError";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    if (card.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError("Нельзя удалять чужую карточку"));
    }

    await card.deleteOne();
    res.status(200).json({ message: "Карточка удалена" });
  } catch (err: any) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный ID карточки"));
    }
    next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный ID карточки"));
    }
    next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true }
    );

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Некорректный ID карточки"));
    }
    next(err);
  }
};
