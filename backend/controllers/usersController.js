import { getUserById, updateUser } from "../models/userModel.js";

// GET /users/:id
export async function getUserByIdController(req, res) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /users/me
export async function editProfileController(req, res) {
  const userId = req.user.id;
  const { username, email, avatar } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Username and email required" });
  }

  try {
    const updated = await updateUser(userId, { username, email, avatar_url: avatar });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
