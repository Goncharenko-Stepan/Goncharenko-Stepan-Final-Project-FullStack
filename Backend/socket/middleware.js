import jwt from "jsonwebtoken";

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Токен не предоставлен"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Неверный или истекший токен"));
  }
};

export default socketAuthMiddleware;
