import Post from "../models/Post.js";

// /////////////////// CREATE POST /////////////////////

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;
    const post = new Post({ title, content, author: userId });
    await post.save();
    res.status(201).json({ message: "Пост был успешно создан", post });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании поста", error: err });
  }
};

// /////////////////// GET POSTS /////////////////////

export const getAllPost = async (_, res) => {
  try {
    const posts = await Post.find().populate("author", "name");
    res.send(201).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при получении постов", error: err });
  }
};

// /////////////////// UPDATE POST /////////////////////

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    res.status(200).json({ message: "Пост обновлен", updatedPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении поста", error: err });
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
