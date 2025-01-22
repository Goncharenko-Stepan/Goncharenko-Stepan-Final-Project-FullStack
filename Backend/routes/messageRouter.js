import express from "express";
import {
  sendMessage,
  deleteMessage,
  getMessages,
} from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Импортируем мидлвару

const router = express.Router();

// Применяем authMiddleware для защиты этих маршрутов
router.post("/sendMessage", authMiddleware, sendMessage);
router.get("/getMessages/:recipientId", authMiddleware, getMessages);
router.delete("/deleteMessage/:messageId", authMiddleware, deleteMessage);

export default router;
