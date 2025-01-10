import User from "../models/User.js";
import Post from "../models/Post.js";

// /////////// SEARCH USERS ////////////////

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ message: "Запрос поиска не может быть пустым" });
    }

    const users = await User.find({ name: { $regex: query, $options: "i" } });
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при поиске пользователей", error: err });
  }
};

// /////////// SEARCH POSTS ////////////////

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ message: "Запрос поиска не может быть пустым" });
    }

    const posts = await Post.find({ title: { $regex: query, $options: "i" } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при поиске постов", error: err });
  }
};
