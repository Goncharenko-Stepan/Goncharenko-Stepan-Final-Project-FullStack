import Follow from "../models/Follow.js";
import User from "../models/User.js";

// /////////////////// FOLLOW USER /////////////////////

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params; // userId из параметров URL
    const currentUserId = req.user.userId; // id текущего пользователя из токена

    if (!currentUserId) {
      return res.status(400).json({
        message: "Не удалось получить информацию о текущем пользователе",
      });
    }

    if (currentUserId === userId) {
      return res
        .status(400)
        .json({ message: "Невозможно подписаться на самого себя" });
    }

    // Проверка на существование пользователя
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверка на существование подписки
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "Вы уже подписаны на этого пользователя" });
    }

    // Создаем запись о подписке
    const follow = new Follow({
      follower: currentUserId,
      following: userId,
    });

    // Сохраняем подписку в базе данных
    await follow.save();

    res.status(201).json({ message: "Подписка успешно оформлена" });
  } catch (err) {
    console.error("Ошибка при подписке:", err);
    res.status(500).json({ message: "Ошибка при подписке", error: err });
  }
};

// /////////////////// UNFOLLOW USER /////////////////////

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params; // userId из параметров URL
    const currentUserId = req.user.userId; // id текущего пользователя из токена

    // Проверка, существует ли уже подписка
    const follow = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Подписка не найдена" });
    }

    // Удаление подписки
    await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userId,
    });

    res.status(200).json({ message: "Подписка успешно отменена" });
  } catch (err) {
    console.error("Ошибка при отмене подписки:", err);
    res.status(500).json({ message: "Ошибка при отмене подписки", error: err });
  }
};
