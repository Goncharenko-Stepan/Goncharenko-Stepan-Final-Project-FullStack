import { axiosInstance } from "./index.js";

// Централизованная обработка ошибок
const handleAxiosError = (error) => {
  console.error("Axios Error:", error);
  if (error.response) {
    // Ошибка с ответом от сервера
    return error.response.data.message || "An unexpected error occurred";
  } else if (error.request) {
    // Ошибка при отправке запроса
    return "No response received from the server";
  } else {
    // Неизвестная ошибка
    return error.message || "An unexpected error occurred";
  }
};

// Получение профиля пользователя
export const fetchProfile = async (username) => {
  try {
    const response = await axiosInstance.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error)); // Используем централизованную обработку ошибок
  }
};

// Подписка на пользователя
export const followUser = async (username) => {
  try {
    const response = await axiosInstance.post(`/user/${username}/follow`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

// Отписка от пользователя
export const unfollowUser = async (username) => {
  try {
    const response = await axiosInstance.delete(`/user/${username}/unFollow`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

// Получение всех пользователей для поиска
export const getAllUsersForSearch = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
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
    throw new Error(handleAxiosError(error));
  }
};
