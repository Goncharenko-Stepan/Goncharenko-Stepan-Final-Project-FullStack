import express from "express";
import {
  addComment,
  deleteComment,
  likeComment,
  unLikeComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addComment/:postId", authMiddleware, addComment);
router.delete("/deleteComment/:commentId", authMiddleware, deleteComment);
router.post("/likeComment/:commentId", authMiddleware, likeComment);
router.delete("/unLikeComment/:commentId", authMiddleware, unLikeComment);

export default router;
