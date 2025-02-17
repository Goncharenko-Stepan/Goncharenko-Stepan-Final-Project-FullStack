import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Проверяем токен в cookies

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Пытаемся декодировать токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Получаем пользователя, основываясь на декодированном токене
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Присваиваем пользователя в объект req
    req.user = user;
    next(); // Переходим к следующему обработчику запроса
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
