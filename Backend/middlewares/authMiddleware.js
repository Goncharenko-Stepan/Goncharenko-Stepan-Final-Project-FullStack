import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Токен не найден в заголовке" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Не удалось декодировать токен" });
    }

    req.user = decoded; // Добавляем данные пользователя в запрос

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Токен истёк. Пожалуйста, войдите снова." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Неверный токен" });
    }
    console.error("Ошибка в мидлваре авторизации:", err);
    return res.status(500).json({ message: "Ошибка авторизации" });
  }
};

export default authMiddleware;
