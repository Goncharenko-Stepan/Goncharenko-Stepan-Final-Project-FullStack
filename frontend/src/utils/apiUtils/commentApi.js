import { axiosInstance } from "./index.js";

export const addComment = async (content, postId) => {
  try {
    const response = await axiosInstance.post(`/comment/addComment/${postId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment", error);
    return false;
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await axiosInstance.post(
      `/comment/likeComment/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error liking comment", error);
    return false;
  }
};

export const unLikeComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(
      `/comment/unLikeComment/${commentId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error unliking comment", error);
    return false;
  }
};
