import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:postId", addComment);
router.get("/:postId", getComments);

export default router;
