import Post from "../models/Post.js";

// /////////////////// CREATE COMMENT /////////////////////
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    post.comments.push({ user: userId, content });
    await post.save();

    res
      .status(200)
      .json({ message: "Комментарий добавлен", comments: post.comments });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при добавлении комментария", error: err });
  }
};

// /////////////////// DELETE COMMENT /////////////////////

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await post.save();

    res
      .status(200)
      .json({ message: "Комментарий удален", comments: post.comments });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении комментария", error: err });
  }
};
