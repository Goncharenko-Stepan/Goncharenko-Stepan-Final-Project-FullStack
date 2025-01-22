import Post from "../models/Post.js";
import Comment from "../models/Comment.js"; // Убедитесь, что модель Comment существует

// /////////////////// CREATE COMMENT /////////////////////

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params; // Получаем postId из параметров
    const { content } = req.body; // Получаем content из тела запроса
    const userId = req.user.userId; // Получаем ID текущего пользователя из токена

    // Находим пост по ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    // Создаем новый комментарий с использованием модели Comment
    const newComment = new Comment({
      user: userId,
      post: postId,
      content: content,
    });

    // Сохраняем комментарий в базе данных
    await newComment.save();

    // Добавляем новый комментарий
    post.comments.push({ user: userId, content });
    await post.save();

    res
      .status(200)
      .json({ message: "Комментарий добавлен", comments: post.comments });
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

    // Удаляем комментарий по его ID
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
