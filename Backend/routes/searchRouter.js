import express from "express";
import { searchPosts, searchUsers } from "../controllers/searchController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/posts", authMiddleware, searchPosts);
router.get("/users", authMiddleware, searchUsers);

export default router;
