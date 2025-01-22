import express from "express";
import {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createPost", authMiddleware, createPost); // Для создания поста
router.get("/getAllPost", authMiddleware, getAllPost); // Для получения всех постов
router.put("/updatePost/:id", authMiddleware, updatePost); // Для обновления поста
router.delete("/deletePost/:id", authMiddleware, deletePost); // Для удаления поста

export default router;
