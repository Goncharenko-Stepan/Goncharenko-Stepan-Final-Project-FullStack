import express from "express";
import { addComment, deleteComment } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addComment/:postId", authMiddleware, addComment); // POST-запрос для добавления комментария

router.delete("/deleteComment/:commentId", authMiddleware, deleteComment); // DELETE-запрос для удаления комментария

export default router;
