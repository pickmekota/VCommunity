import express from "express";
import auth from "../middleware/auth.js";
import { getUserByIdController, editProfileController } from "../controllers/usersController.js";

const router = express.Router();

// GET /users/:id
router.get("/:id", getUserByIdController);

// GET /users/me
router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

// PUT /users/me — обновление профиля с Base64 аватаром
router.put("/me", auth, editProfileController);

export default router;
