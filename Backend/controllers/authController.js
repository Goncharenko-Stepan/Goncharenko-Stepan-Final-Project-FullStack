import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import hashPassword from "../middlewares/hashPassword.js";
import "dotenv/config";

// Логин пользователя
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка на заполнение всех полей
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Введите корректные пароль и почту" });
    }

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Такого пользователя не существует" });
    }

    // Сравнение пароля с хешем в базе
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    // Генерация jwt-токена
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Успешный ответ
    return res.status(200).json({
      message: "Успешный вход",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Ошибка при входе пользователя: ", err);
    res.status(500).json({ message: "Ошибка при входе пользователя" });
  }
};

// Регистрация пользователя
export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Все поля обязательны для заполнения!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с данным email уже существует" });
    }

    // Использование хеширования пароля через миддлвар
    req.body.password = await hashPassword(req, res, () => {});

    // Создание нового пользователя
    const newUser = new User({
      name,
      email,
      password: req.body.password,
    });

    await newUser.save();

    // Генерация JWT-токена
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
