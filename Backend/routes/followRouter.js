import express from "express";
import { followUser, unfollowUser } from "../controllers/followController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/followUser/:userId", authMiddleware, followUser);
router.delete("/unfollowUser/:userId", authMiddleware, unfollowUser);

export default router;
