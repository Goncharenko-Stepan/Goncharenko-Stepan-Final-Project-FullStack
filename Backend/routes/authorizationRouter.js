import express from "express";
import {
  loginUser,
  registerUser,
  checkAccessToken,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reset", resetPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/checkAccessToken", authMiddleware, checkAccessToken);

export default router;
