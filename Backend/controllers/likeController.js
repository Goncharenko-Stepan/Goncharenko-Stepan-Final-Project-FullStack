import Post from "../models/Post.js";

// //////////// LIKE POST //////////////

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    post.likes += 1;
    await post.save();

    res.status(200).json({ message: "Пост лайкнут", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при лайке поста", error: err });
  }
};

// //////////// UNLIKE POST //////////////

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    post.likes = Math.max(post.likes - 1, 0);
    await post.save();

    res.status(200).json({ message: "Лайк убран", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении лайка", error: err });
  }
};
