import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

////////////////////////////////// LOGIN USER //////////////////////////////////

export const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      res.status(400).send("Username or email and password is required");
      return;
    }
    // Проверяем, существует ли пользователь (по username или email)
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      res.status(401).send("Wrong password or username");
      return;
    }
    if (process.env.JWT_KEY) {
      const info = { username: user.username, id: user._id.toString() };
      const token = jwt.sign(info, process.env.JWT_KEY, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true, // Запрещает доступ к cookie через JavaScript
        secure: true, // Установите false для HTTP
        sameSite: "none", // Настройка для кросс-доменных запросов
        maxAge: 3600 * 1000, // 1 час в миллисекундах
        path: "/",
      });
      res.status(200).json({
        message: "Successfully logged in with token",
        data: {
          username: user.username,
          id: user._id,
          profile_image: user.profile_image,
        },
      });
    } else {
      res.status(401).send("Something went wrong");
    }
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).send("Error logging in");
  }
};

////////////////////////////////// REGISTER USER //////////////////////////////////

export const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    if (!username || !password || !email || !fullName) {
      res
        .status(400)
        .send("Username, email, full name and password are required");
      return;
    }
    // Проверяем, существует ли пользователь
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(404).send("User already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      full_name: fullName,
      email,
      password: hashedPassword,
    });
    res.status(200).send("Successfully registered!");
  } catch (error) {
    console.error("Error registering a user: ", error);
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

    const info = await transporter.sendMail(mailOptions);
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
  if (req.user) {
    res
      .status(200)
      .json({ message: "Token is valid", username: req.user.username });
  } else {
    res.status(200).json({ message: "Token is not valid" });
  }
};
