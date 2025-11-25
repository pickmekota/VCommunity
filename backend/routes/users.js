import express from "express";
import auth from "../middleware/auth.js";
import { updateUser } from "../models/userModel.js";
import { getUserByIdController } from "../controllers/usersController.js";

const router = express.Router();

// GET /users/me — текущий пользователь
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

router.get("/:id", getUserByIdController);


// PUT /users/me — обновить профиль
router.put("/me", auth, async (req, res) => {
  try {
    const allowed = ["username", "avatar_url", "rank", "role", "xp", "riot_id"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await updateUser(req.user.id, updates);

    res.json({ message: "Updated", user: updated });
  } catch (e) {
    console.error("Update error:", e.message);
    console.error(e.stack);
    res.status(500).json({ message: "Server error", detail: e.message });
  }
});

export default router;
