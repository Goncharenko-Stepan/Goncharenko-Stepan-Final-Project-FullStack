import express from "express";
import {
  sendMessage,
  deleteMessage,
  getMessages,
  getChat,
  getUserChats,
} from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Импортируем мидлвару

const router = express.Router();

// Применяем authMiddleware для защиты этих маршрутов
router.post("/sendMessage", authMiddleware, sendMessage);
router.get("/getMessages/:recipientId", authMiddleware, getMessages);
router.delete("/deleteMessage/:messageId", authMiddleware, deleteMessage);
router.post("/getUserChats", authMiddleware, getUserChats);
router.post("/getChat", authMiddleware, getChat);
export default router;
