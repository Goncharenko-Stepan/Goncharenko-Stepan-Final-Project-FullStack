import Post from "../models/Post.js";
import Photo from "../models/Photo.js";
import Like from "../models/Like.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";
import multer from "multer";

// /////////////////// CREATE POST /////////////////////

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedPhotos = await Promise.all(
      req.files.map(async (file) => {
        try {
          const { width, height } = await sharp(file.buffer).metadata();
          let transformation = {};

          if (width / height >= 1.5) {
            transformation = {
              aspect_ratio: "16:9",
              crop: "fill",
              gravity: "auto",
            };
          } else if (height / width >= 1.5) {
            transformation = {
              aspect_ratio: "3:4",
              crop: "fill",
              gravity: "auto",
            };
          }

          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "posts", transformation },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          });
        } catch (error) {
          console.error("Image processing error:", error);
          return null;
        }
      })
    );

    const photoDocuments = await Promise.all(
      uploadedPhotos.map(async (url) => {
        const photo = new Photo({ url, post: null });
        await photo.save();
        return photo._id;
      })
    );

    const post = await Post.create({
      photos: photoDocuments,
      content,
      author: user._id,
    });

    await Promise.all(
      photoDocuments.map(async (photoId) => {
        await Photo.findByIdAndUpdate(photoId, { post: post._id });
      })
    );

    user.posts.push(post._id);
    await user.save();

    await post.populate("photos", "url");

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post: ", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

// /////////////////// GET POST BY ID /////////////////////

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId)
      .populate("author", "profile_image username followers")
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "author", select: "profile_image username" },
          { path: "likes", select: "user" },
        ],
      })
      .populate("photos", "url");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting post by id: ", error);
    res.status(500).json({ message: "Error getting post" });
  }
};

// /////////////////// GET RANDOM POSTS /////////////////////

export const getRandomPosts = async (req, res) => {
  try {
    const count = Number(req.query.count) || 5;
    const posts = await Post.aggregate().sample(count);
    const populatedPosts = await Post.populate(posts, [
      { path: "author", select: "username" },
      { path: "photos", select: "url" },
    ]);

    res.status(200).json(populatedPosts);
  } catch (error) {
    console.error("Error getting random posts: ", error);
    res.status(500).json({ message: "Error getting posts" });
  }
};

// /////////////////// LIKE POST /////////////////////

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const receiver = await User.findById(post.author);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLike = await Like.create({ user: req.user.id, post: postId });
    post.likes.push(newLike._id);
    post.like_count += 1;
    await post.save();

    const newNotification = await Notification.create({
      user: post.author,
      actionMaker: req.user.id,
      post: postId,
      type: "liked your post",
    });

    receiver.notifications.push(newNotification._id);
    await receiver.save();

    res.status(201).json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error liking post: ", error);
    res.status(500).json({ message: "Error liking post" });
  }
};

// /////////////////// UNLIKE POST /////////////////////

export const unLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post || !req.user) {
      return res.status(404).json({ message: "Post or user not found" });
    }

    const like = await Like.findOne({ user: req.user.id, post: post._id });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await Like.deleteOne({ _id: like._id });

    post.likes = post.likes.filter(
      (likeId) => likeId.toString() !== like._id.toString()
    );
    post.like_count -= 1;
    await post.save();

    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    console.error("Error unliking post: ", error);
    res.status(500).json({ message: "Error unliking post" });
  }
};

// /////////////////// DELETE POST /////////////////////

export const deletePost = async (req, res) => {
  try {
    const post = req.post;
    if (!post || !req.user) return;

    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

// /////////////////// UPDATE POST /////////////////////

export const updatePost = async (req, res) => {
  try {
    const post = req.post;
    if (!post || !req.user) return;

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    post.content = content;
    await post.save();
    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post: ", error);
    res.status(500).json({ message: "Error updating post" });
  }
};

// /////////////////// GET FOLLOWED POSTS /////////////////////

export const getFollowedPosts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("User is not authorized");
    }

    const userId = req.user.id; // Устанавливается через authMiddleware
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // Находим список подписок пользователя
    const user = await User.findById(userId).select("followings");
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Получаем посты от подписанных пользователей
    const posts = await Post.find({ author: { $in: user.followings } })
      .sort({ createdAt: -1 }) // Новые посты первыми
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username profile_image")
      .populate("likes", "user")
      .populate("photos", "url");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Server error");
  }
};
