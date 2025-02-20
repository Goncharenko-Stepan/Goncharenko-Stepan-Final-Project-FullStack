import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

////////////////////////////////// LOGIN USER //////////////////////////////////

export const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Username or email and password is required" });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Wrong password or username" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not set" });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Токен создан:", token); // 👈 ЛОГ ВАЖЕН!

    res.status(200).json({
      message: "Successfully logged in",
      token,
      user: {
        username: user.username,
        id: user._id,
        profile_image: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

////////////////////////////////// REGISTER USER //////////////////////////////////

export const registerUser = async (req, res) => {
  try {
    console.log("Полученные данные от клиента:", req.body); // Логируем запрос

    const { username, fullName, email, password } = req.body;

    if (!username || !password || !email || !fullName) {
      res
        .status(400)
        .send("Username, email, full name and password are required");
      return;
    }

    const user = await User.findOne({ username });
    if (user) {
      res.status(400).send("User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      fullName, // Должно совпадать с названием в схеме
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Successfully registered!", user: newUser });
  } catch (error) {
    console.error("Error registering a user:", error);
    res.status(500).send("Error registering");
  }
};

////////////////////////////////// RESET PASSWORD //////////////////////////////////

export const resetPassword = async (req, res) => {
  try {
    const { usernameOrEmail } = req.body;
    if (!usernameOrEmail) {
      res.status(400).send("Username or email is required");
      return;
    }
    // Проверяем, существует ли пользователь
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Создаем транспортёр для отправки email через nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Можно использовать другой сервис
      auth: {
        user: process.env.EMAIL, // Укажите вашу почту в .env
        pass: process.env.EMAIL_KEY, // Укажите пароль или App Password
      },
    });

    // Опции для письма
    const mailOptions = {
      from: "insta_clone@gmail.com", // Адрес отправителя
      to: user.email, // Адрес получателя
      subject: "Reset password", // Тема письма
      text: "<b>Reset your password - </b> <a href='/'>Link</a>", // Текст письма
    };

    const info = transporter.sendMail(mailOptions);
    res.status(201).json({
      msg: "Email sent",
      info: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error resetting password: ", error);
    res.status(500).send("Error resetting password");
  }
};

////////////////////////////////// Check Access Token //////////////////////////////////

export const checkAccessToken = (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ message: "Token is valid", username: req.user });
    } else {
      res.status(200).json({ message: "Token is not valid" });
    }
  } catch (error) {
    console.error("Error:" + error);
  }
};
