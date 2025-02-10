import express from "express";
import {
  loginUser,
  registerUser,
  checkAccessToken,
} from "../controllers/authController.js";
// import hashPassword from "../middlewares/hashPasswordMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/checkAccessToken", checkAccessToken);

export default router;
