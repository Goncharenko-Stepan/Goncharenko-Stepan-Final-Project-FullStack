import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import hashPassword from "../middlewares/hashPassword.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", hashPassword, registerUser);

export default router;
