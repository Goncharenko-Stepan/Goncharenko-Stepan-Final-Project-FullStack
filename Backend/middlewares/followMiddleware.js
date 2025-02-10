import User from "../models/User.js";

export const ifFollowed = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username || !req.user || !req.user.id) {
      return res
        .status(400)
        .send("Username of follower and following is required");
    }

    // Поиск профиля и пользователя
    const [profile, user] = await Promise.all([
      User.findOne({ username }),
      User.findById(req.user.id),
    ]);

    if (!profile || !user) {
      return res.status(404).send("User not found");
    }

    req.followed = profile.followers.includes(user._id);
    req.userProfile = user;
    req.profile = profile;
    next();
  } catch (error) {
    console.error("Error in ifFollowed middleware:" + error);
  }
};
