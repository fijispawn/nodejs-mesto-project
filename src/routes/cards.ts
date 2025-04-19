import { Router } from "express";
import {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

import { validateCardCreate, validateCardId } from "../middlewares/validators";

const router = Router();

router.get("/", getCards);
router.post("/", validateCardCreate, createCard);
router.delete("/:cardId", validateCardId, deleteCard);
router.put("/:cardId/likes", validateCardId, likeCard);
router.delete("/:cardId/likes", validateCardId, dislikeCard);

export default router;
