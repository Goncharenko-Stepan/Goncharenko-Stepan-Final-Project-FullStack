import Post from "../db/models/Post.js";
import mongoose from "mongoose";

const ifPostAuthor = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (
      !req.user ||
      !new mongoose.Types.ObjectId(req.user.id).equals(post.author)
    ) {
      return res.status(401).send("User is not authorized");
    }

    req.post = post;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).send("Server error");
  }
};

export default ifPostAuthor;
