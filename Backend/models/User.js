import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: "", maxlength: 180 },
  website: { type: String, maxlength: 120 },
  profileImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dkmunyorn/image/upload/v1737282562/profiles/cxjlx87qkz06ucag1ny4.png",
  },
  notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  searchResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", UserSchema);

export default User;
