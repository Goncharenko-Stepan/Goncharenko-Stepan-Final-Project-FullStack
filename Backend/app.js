import express from "express";
import "dotenv/config";
import connectDB from "./db/index.js";
import authorizationRouter from "./routes/authorizationRouter.js";
import commentRouter from "./routes/commentRouter.js";
import followRouter from "./routes/followRouter.js";
import likeRouter from "./routes/likeRouter.js";
import messageRouter from "./routes/messageRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import postRouter from "./routes/postRouter.js";
import searchRouter from "./routes/searchRouter.js";
import http from "http";
import { Server } from "socket.io";
import attachSocketEvents from "./socket/events.js";

(async () => {
  try {
    const app = express();

    const server = http.createServer(app); // HTTP-сервер
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    const PORT = process.env.PORT || 3000;
    await connectDB();
    app.use(express.json());

    app.get("/", (_, res) => {
      res.send("Вы находитесь на главной странице приложения");
    });

    app.use("/api/auth", authRouter);
    app.use("/api/post", postRouter);
    app.use("/api/comment", commentRouter);
    app.use("/api/follow", followRouter);
    app.use("/api/notification", notificationRouter);
    app.use("/api/search", searchRouter);
    app.use("/api/message", messageRouter);
    app.use("/api/like", likeRouter);

    // //////////// HOME PAGE ////////////////
    app.get("/", (_, res) => {
      res.send("Вы находитесь на главной странице приложения");
    });

    // //////////// Socket.IO EVENTS ////////////
    io.on("connection", (socket) => {
      console.log(`Пользователь подключился: ${socket.id}`);
      attachSocketEvents(io, socket);

      socket.on("disconnect", () => {
        console.log(`Пользователь отключился: ${socket.id}`);
      });
    });

    app.listen(PORT, () => {
      console.log(`Приложение запущено на порту localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска приложения", error);
  }
})();
