import bcrypt from "bcrypt";

const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "Пароль обязателен" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    next(); // Продолжаем выполнение следующего middleware или контроллера
  } catch (err) {
    console.error("Ошибка при хешировании пароля: ", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export default hashPassword;
