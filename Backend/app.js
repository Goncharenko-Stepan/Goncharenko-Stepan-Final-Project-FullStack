import express from "express";
import "dotenv/config";
import connectDB from "./db/index.js";

(async () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;
    await connectDB();
    app.use(express.json());

    app.get("/", (_, res) => {
      res.send("Вы находитесь на главной странице приложения");
    });

    app.use();

    app.listen(PORT, () => {
      console.log(`Приложение запущенно на порту localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска приложения " + error);
  }
})();
