import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  addUserToSearchResults,
  followUser,
  getUserByUsername,
  searchUsers,
  unfollowUser,
  updateProfile,
} from "../controllers/userController.js";
import { ifFollowed } from "../middlewares/followMiddleware.js";

const router = express.Router();

router.get("/:username", authMiddleware, getUserByUsername);
router.get("/", authMiddleware, searchUsers);
router.post("/:username/follow", authMiddleware, ifFollowed, followUser);
router.delete("/:username/unfollow", authMiddleware, ifFollowed, unfollowUser);
router.post(
  "/:username/edit",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);
router.post("/add_to_search_results", authMiddleware, addUserToSearchResults);

export default router;
