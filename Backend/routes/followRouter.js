import express from "express";
import { followUser, getFollowers } from "../controllers/followController.js";

const router = express.Router();

router.post("/follow", followUser);
router.get("/:userId/followers", getFollowers);

export default router;
