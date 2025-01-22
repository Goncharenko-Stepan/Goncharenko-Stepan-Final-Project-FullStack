import Post from "../models/Post.js";
import Like from "../models/Like.js"; // Модель для лайков

// //////////// LIKE POST //////////////
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.userId; // ID текущего пользователя из токена

    // Находим пост по ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    // Проверяем, поставил ли уже пользователь лайк на этот пост
    const existingLike = await Like.findOne({
      post: postId,
      user: currentUserId,
    });

    if (existingLike) {
      return res.status(400).json({ message: "Вы уже лайкнули этот пост" });
    }

    // Если лайк не существует, создаем новый лайк
    const like = new Like({
      user: currentUserId,
      post: postId,
    });

    await like.save();

    // Увеличиваем количество лайков на посте
    post.likes += 1;
    await post.save();

    res.status(200).json({ message: "Пост лайкнут", likes: post.likes });
  } catch (err) {
    console.error("Ошибка при лайке поста:", err);
    res.status(500).json({ message: "Ошибка при лайке поста", error: err });
  }
};

// //////////// UNLIKE POST //////////////
export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.userId; // ID текущего пользователя из токена

    // Находим пост по ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    // Проверяем, поставил ли пользователь лайк на этот пост
    const existingLike = await Like.findOne({
      post: postId,
      user: currentUserId,
    });

    if (!existingLike) {
      return res.status(400).json({ message: "Вы не лайкнули этот пост" });
    }

    // Удаляем лайк
    await Like.findOneAndDelete({ post: postId, user: currentUserId });

    // Уменьшаем количество лайков на посте
    post.likes = Math.max(post.likes - 1, 0);
    await post.save();

    res.status(200).json({ message: "Лайк убран", likes: post.likes });
  } catch (err) {
    console.error("Ошибка при удалении лайка:", err);
    res.status(500).json({ message: "Ошибка при удалении лайка", error: err });
  }
};
