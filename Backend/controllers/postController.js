import Post from "../models/Post.js";
import mongoose from "mongoose";

// /////////////////// CREATE POST /////////////////////

export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body; // Добавляем author в тело запроса

    // Проверка обязательных полей
    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Поля title, content и author обязательны" });
    }

    // Создание поста
    const post = new Post({ title, content, author });

    // Сохранение в базе
    await post.save();

    // Успешный ответ
    res.status(201).json({ message: "Пост был успешно создан", post });
  } catch (err) {
    // Логирование ошибки и ответ клиенту
    console.error("Ошибка при создании поста:", err);
    res.status(500).json({
      message: "Ошибка при создании поста",
      error: err.message || "Неизвестная ошибка",
    });
  }
};

// /////////////////// GET POSTS /////////////////////

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name");
    res.status(200).json(posts);
  } catch (err) {
    console.error("Ошибка при получении постов:", err);
    res
      .status(500)
      .json({ message: "Ошибка при получении постов", error: err.message });
  }
};

// /////////////////// UPDATE POST /////////////////////

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Убедимся, что ID валиден
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Невалидный ID поста" });
    }

    // Обновление поста
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() }, // Данные для обновления
      { new: true } // Вернуть обновленный документ
    );

    // Если пост не найден
    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.status(200).json({ message: "Пост обновлен", updatedPost });
  } catch (err) {
    console.error("Ошибка при обновлении поста:", err);
    res
      .status(500)
      .json({ message: "Ошибка при обновлении поста", error: err.message });
  }
};

// /////////////////// DELETE POST /////////////////////

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.status(200).json({ message: "Пост удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении поста", error: err });
  }
};
