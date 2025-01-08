import express from "express";
import { likePost, getLikes } from "../controllers/likeController.js";

const router = express.Router();

router.post("/:postId", likePost);
router.get("/:postId", getLikes);

export default router;
