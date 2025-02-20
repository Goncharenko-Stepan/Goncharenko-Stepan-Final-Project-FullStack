import express from "express";
import {
  loginUser,
  registerUser,
  checkAccessToken,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Регистрация пользователя
router.post("/register", registerUser);

// Логин пользователя
router.post("/login", loginUser);

// Сброс пароля
router.post("/reset", resetPassword);

// Проверка токена с использованием middleware
router.get("/checkAccessToken", authMiddleware, checkAccessToken);

export default router;
