import mongoose from "mongoose";

// Схема для пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePicture: {
    type: String,
    default: "https://www.example.com/default-profile-pic.png",
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Возможные роли
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Модель пользователя
const User = mongoose.model("User", userSchema);

export default User;
