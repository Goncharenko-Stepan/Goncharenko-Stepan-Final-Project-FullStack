import express from "express";
import "dotenv/config";
import connectDB from "./db/index.js";
import authRouter from "./routes/authorizationRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
import followRouter from "./routes/followRouter.js";
import notificationRouter from "./routes/notificationRouter.js";
import searchRouter from "./routes/searchRouter.js";
import messageRouter from "./routes/messageRouter.js";
import likeRouter from "./routes/likeRouter.js";

(async () => {
  try {
    const app = express();
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

    app.listen(PORT, () => {
      console.log(`Приложение запущено на порту localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска приложения", error);
  }
})();
