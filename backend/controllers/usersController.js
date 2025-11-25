import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserById, getUserRowByEmail } from "../models/userModel.js";

// =========================== REGISTER ===========================
export async function register(req, res) {
  try {
    const { email, password, username, riot_id } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Проверяем, есть ли пользователь
    const existing = await getUserRowByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Хешируем пароль
    const password_hash = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await createUser({
      email,
      username,
      password_hash,
      riot_id: riot_id || null,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}



// =========================== LOGIN ===========================
export async function login(req, res) {
  try {
    console.log("Login body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    const user = await getUserRowByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const sanitized = await getUserById(user.id);

    res.json({ message: "Login success", token, user: sanitized });
  } catch (err) {
    console.error("Login error:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
}

// Получить профиль
export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Обновить профиль
export async function editProfile(req, res) {
  try {
    const { username, email, avatar } = req.body;
    const updated = await updateUser(req.user.id, { username, email, avatar_url: avatar });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserByIdController(req, res) {
  const id = Number(req.params.id);
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}