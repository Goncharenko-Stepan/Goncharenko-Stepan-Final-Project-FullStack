import mongoose from "mongoose";

const exploreSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    trendingScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Explore", exploreSchema);
