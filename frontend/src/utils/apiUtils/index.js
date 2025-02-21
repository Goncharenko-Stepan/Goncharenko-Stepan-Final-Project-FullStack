import axios from "axios"; // Здесь мы импортируем axios

// Создаём экземпляр axios с базовым URL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// Интерцептор запросов
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Получаем токен из localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Функция для проверки токена
export async function checkToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Нет токена, пропускаем проверку");
    return false; // Если токена нет, сразу возвращаем false
  }

  try {
    const response = await axiosInstance.get("/auth/checkAccessToken");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Токен недействителен. Удаляем...");
      localStorage.removeItem("token");
    } else {
      console.error("Ошибка проверки токена:", error);
    }
    return false;
  }
}
