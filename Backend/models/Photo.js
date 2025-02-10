import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Добавлен тип String
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const Photo = mongoose.model("Photo", PhotoSchema);
export default Photo;
