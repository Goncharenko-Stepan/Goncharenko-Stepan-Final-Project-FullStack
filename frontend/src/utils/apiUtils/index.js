import axios from "axios";

export const backendURL =
  import.meta.env.VITE_ENV === "local"
    ? "http://localhost:3000/api" // Если окружение 'local', то используется localhost
    : import.meta.env.VITE_BACKEND_URL; // Иначе, используется значение VITE_BACKEND_URL

export const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});
