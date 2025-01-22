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

    // Индексация поиска по имени пользователей для улучшения производительности
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    }).exec(); // Явное выполнение запроса

    if (users.length === 0) {
      return res.status(404).json({ message: "Пользователи не найдены" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ошибка при поиске пользователей", error: err.message });
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
