import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Индексирование для быстрого поиска по user
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message", "other"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // Автоматическое добавление createdAt и updatedAt
);

export default mongoose.model("Notification", notificationSchema);
