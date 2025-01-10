import Notification from "../models/Notification.js";

// //////////// GET NOTIFICATIONS //////////////

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

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
