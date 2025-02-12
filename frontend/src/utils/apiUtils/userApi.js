import { axiosInstance } from "./index.js";

// Получение профиля пользователя
export const fetchProfile = async (username) => {
  try {
    const response = await axiosInstance.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile", error);
    throw error;
  }
};

// Подписка на пользователя
export const followUser = async (username) => {
  try {
    const response = await axiosInstance.post(`/user/${username}/follow`);
    return response.data;
  } catch (error) {
    console.error("Error following user", error);
    throw error;
  }
};

// Отписка от пользователя
export const unfollowUser = async (username) => {
  try {
    const response = await axiosInstance.delete(`/user/${username}/unFollow`);
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user", error);
    throw error;
  }
};

// Получение всех пользователей для поиска
export const getAllUsersForSearch = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error getting users for search", error);
    throw error;
  }
};

// Добавление пользователя в результаты поиска
export const addUserToSearchResults = async (username) => {
  try {
    const response = await axiosInstance.post("/user/addToSearchResults", {
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user to search results", error);
    throw error;
  }
};
