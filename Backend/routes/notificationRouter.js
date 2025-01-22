import express from "express";
import {
  getNotifications,
  deleteNotification,
  markAsRead,
  createNotification,
} from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createNotification", authMiddleware, createNotification);
router.get("/getNotifications", authMiddleware, getNotifications);
router.delete(
  "/deleteNotification/:notificationId",
  authMiddleware,
  deleteNotification
);
router.put("/markAsRead/:notificationId", authMiddleware, markAsRead);

export default router;
