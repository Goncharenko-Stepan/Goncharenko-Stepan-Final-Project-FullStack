import { axiosInstance } from "./index.js";

const API_URL = "/auth";

export const loginUser = async (usernameOrEmail, password) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/login`, {
      usernameOrEmail,
      password,
    });

    console.log("Ответ сервера при логине:", response.data);

    if (response.data.token) {
      console.log("Сохраняем токен:", response.data.token);
      localStorage.setItem("token", response.data.token);
    } else {
      console.error("Сервер не вернул токен");
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при логине", error);
    throw error;
  }
};

export const checkJWTToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/checkAccessToken`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Token is expired or invalid");
      localStorage.removeItem("token");
    } else {
      console.error("Unexpected error while checking token:", error);
    }
    return null;
  }
};
