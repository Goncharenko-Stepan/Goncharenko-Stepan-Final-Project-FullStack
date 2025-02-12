import { axiosInstance } from "./index.js";

// Лайкнуть пост
export const likePost = async (postId) => {
  try {
    const response = await axiosInstance.post(`/post/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking post", error);
  }
};

// Убрать лайк
export const unLikePost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/post/${postId}/unlike`);
    return response.data;
  } catch (error) {
    console.error("Error unliking post", error);
  }
};

// Удаление поста
export const deletePost = async (postId) => {
  try {
    const response = await axiosInstance.delete(`/post/deletePost/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post", error);
  }
};

// Получение постов от подписанных авторов
export const fetchFollowedPosts = async (page) => {
  try {
    const response = await axiosInstance.get(`/post/followed?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching followed posts", error);
  }
};

// Получение случайных постов
export const getRandomPosts = async (fetchCount) => {
  try {
    const response = await axiosInstance.get(
      `/post/random?count=${fetchCount}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting random posts", error);
  }
};
