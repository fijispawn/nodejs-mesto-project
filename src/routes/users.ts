import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from "../controllers/users";
import {
  validateUserId,
  validateProfileUpdate,
  validateAvatarUpdate,
} from "../middlewares/validators";

const router = Router();

router.get("/me", getCurrentUser);
router.get("/", getUsers);
router.get("/:userId", validateUserId, getUserById);
router.patch("/me", validateProfileUpdate, updateProfile);
router.patch("/me/avatar", validateAvatarUpdate, updateAvatar);

export default router;
