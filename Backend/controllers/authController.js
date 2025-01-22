import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import hashPasswordMiddleware from "../middlewares/hashPasswordMiddleware.js";
import "dotenv/config";

// /////////////////////////////////////////////////////////  Логин пользователя ///////////////////////////////////////////////////////
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Введите корректные пароль и почту" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Такого пользователя не существует" });
    }

    // Логи для отладки

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Результат сравнения пароля:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Вы вошли в аккаунт",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Ошибка при входе пользователя:", err);
    res.status(500).json({ message: "Ошибка при входе пользователя" });
  }
};

// ///////////////////////////////////////////////////////// Регистрация пользователя ///////////////////////////////////////////////////////////

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log("Register password: ", password);

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Все поля обязательны для заполнения" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Register hash: ", hashedPassword);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Пользователь зарегистрирован успешно",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка на сервере при регистрации" });
  }
};
