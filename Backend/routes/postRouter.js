import express from "express";
import upload from "../middlewares/uploadMiddleware.js"; // Multer-конфигурация для загрузки (локально или через CloudinaryStorage)
import {
  createPost,
  getPostById,
  getRandomPosts,
  updatePost,
  deletePost,
  getFollowedPosts,
  likePost,
  unLikePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Создание поста с загрузкой изображений (до 8 файлов)
router.post(
  "/createPost",
  authMiddleware,
  upload.array("photos", 8),
  createPost
);

// Создать пост
router.post("/create", upload.array("photos", 8), authMiddleware, createPost);

// Лайкнуть пост
router.post("/:postId/like", authMiddleware, likePost);

// убрать лайк
router.delete("/:postId/unlike", authMiddleware, unLikePost);

// Получение поста по ID
router.get("/getPost/:id", authMiddleware, getPostById);

// Получение случайных постов
router.get("/random", authMiddleware, getRandomPosts);

// Получение постов от подписанных авторов
router.get("/followed", authMiddleware, getFollowedPosts);

// Обновление поста по ID
router.put("/updatePost/:id", authMiddleware, updatePost);

// Удаление поста по ID
router.delete("/deletePost/:id", authMiddleware, deletePost);

export default router;
