import express from "express";
import "dotenv/config";
import connectDB from "./db/index.js";

// ////////////// IMPORT ROUTES ////////////////////
import authRouter from "./routes/authorizationRouter.js";
import commentRouter from "./routes/commentRouter.js";

import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";

import http from "http";
import { Server } from "socket.io";
import attachSocketEvents from "./socket/events.js";

(async () => {
  try {
    const app = express();

    const server = http.createServer(app); // HTTP-сервер
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // Разрешаем только этот адрес
        methods: ["GET", "POST"], // Разрешаем только GET и POST запросы
        credentials: true, // Включаем поддержку кук и токенов
      },
    });

    const PORT = process.env.PORT || 3000;
    await connectDB();
    app.use(express.json());

    // /////////////// HOME PAGE ///////////////

    app.get("/", (_, res) => {
      res.send("Вы находитесь на главной странице приложения");
    });

    app.use("/auth", authRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter);

    // /////////////// Socket.IO EVENTS ///////////////

    io.on("connection", (socket) => {
      console.log(`Пользователь подключился: ${socket.id}`);
      attachSocketEvents(io, socket);

      socket.on("disconnect", () => {
        console.log(`Пользователь отключился: ${socket.id}`);
      });
    });

    server.listen(PORT, () => {
      console.log(`Приложение запущено на порту localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска приложения", error);
  }
})();
