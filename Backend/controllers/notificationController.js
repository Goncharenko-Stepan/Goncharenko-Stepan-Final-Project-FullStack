import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// //////////// CREATE NOTIFICATION //////////////

export const createNotification = async (req, res) => {
  try {
    const { userId, type, message, relatedPost, relatedUser } = req.body;
    //
    //
    // Проверка обязательных полей
    if (!userId || !type || !message) {
      return res.status(400).json({
        message: "Отсутствуют обязательные поля (userId, type, message)",
      });
    }
    //
    //
    //
    // Проверяем и конвертируем relatedPost и relatedUser в ObjectId, если они переданы
    const postId =
      relatedPost && mongoose.Types.ObjectId.isValid(relatedPost)
        ? relatedPost
        : null;

    const userRelatedId =
      relatedUser && mongoose.Types.ObjectId.isValid(relatedUser)
        ? relatedUser
        : null;
    //
    //
    //
    // Создаем уведомление
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      relatedPost: postId,
      relatedUser: userRelatedId,
    });

    res
      .status(201)
      .json({ message: "Уведомление успешно создано", notification });
  } catch (err) {
    console.error("Ошибка при создании уведомления:", err);
    res
      .status(500)
      .json({ message: "Ошибка при создании уведомления", error: err });
  }
};

// //////////// GET NOTIFICATIONS //////////////

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении уведомлений", error: err });
  }
};
// //////////// MARK AS READ //////////////

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });

    if (!notification) {
      return res.status(404).json({ message: "Уведомление не найдено" });
    }

    res
      .status(200)
      .json({ message: "Уведомление помечено как прочитанное", notification });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении уведомления", error: err });
  }
};

// //////////// DELETE NOTIFICATION //////////////

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Уведомление не найдено" });
    }

    res.status(200).json({ message: "Уведомление удалено" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении уведомления", error: err });
  }
};
