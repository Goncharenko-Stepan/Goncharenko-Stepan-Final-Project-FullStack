import mongoose from "mongoose";

// Схема для лайков
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Модель лайка
const Like = mongoose.model("Like", likeSchema);

export default Like;
