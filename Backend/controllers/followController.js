import Follow from "../models/Follow.js";

// /////////////////// FOLLOW USER /////////////////////

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const follow = new Follow({ follower: currentUserId, following: userId });
    await follow.save();

    res.status(201).json({ message: "Подписка успешно оформлена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при подписке", error: err });
  }
};

// /////////////////// UNFOLLOW USER /////////////////////

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userId,
    });

    res.status(200).json({ message: "Подписка отменена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при отмене подписки", error: err });
  }
};
