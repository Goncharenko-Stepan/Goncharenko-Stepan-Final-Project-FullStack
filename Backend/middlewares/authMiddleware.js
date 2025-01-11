import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Ошибка аутентификации:", err);
    res.status(401).json({ message: "Неверный или истекший токен" });
  }
};

export default authMiddleware;
