import express from "express";
import { likePost, unlikePost } from "../controllers/likeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/likePost/:postId", authMiddleware, likePost);
router.delete("/unlikePost/:postId", authMiddleware, unlikePost);

export default router;
