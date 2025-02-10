import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// /////////////////// CREATE COMMENT /////////////////////
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      content: content,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(200)
      .json({ message: "Комментарий добавлен", comment: newComment });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ошибка при добавлении комментария", error: err });
  }
};

// /////////////////// DELETE COMMENT /////////////////////
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    res
      .status(200)
      .json({ message: "Комментарий удалён", comment: deletedComment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении комментария", error: err });
  }
};

// /////////////////// LIKE COMMENT /////////////////////
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Вы уже лайкнули этот комментарий" });
    }

    comment.likes.push(userId);
    await comment.save();

    res
      .status(200)
      .json({ message: "Комментарий лайкнут", likes: comment.likes.length });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ошибка при лайке комментария", error: err });
  }
};

// /////////////////// UNLIKE COMMENT /////////////////////
export const unLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    if (!comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Вы ещё не лайкали этот комментарий" });
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    await comment.save();

    res
      .status(200)
      .json({ message: "Лайк удалён", likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении лайка", error: err });
  }
};
