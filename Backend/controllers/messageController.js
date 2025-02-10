import Message from "../models/Message.js";

// ////////////////// SEND MESSAGE ////////////////////

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.user.userId; // Извлечение userId из миддлвары

    if (!receiver || !content) {
      return res
        .status(400)
        .json({ message: "Получатель и текст сообщения обязательны" });
    }

    const message = new Message({
      sender, // Установите sender из токена
      receiver,
      content,
    });

    await message.save();
    res.status(201).json({ message: "Сообщение отправлено", data: message });
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

// ////////////////// GET MESSAGES ////////////////////

export const getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params; // Получение ID получателя из параметров маршрута
    const senderId = req.user.id; // Получение ID отправителя из авторизации

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ createdAt: 1 }); // Сортировка сообщений по времени создания

    res.status(200).json(messages);
  } catch (err) {
    console.error("Ошибка при получении сообщений:", err);
    res.status(500).json({ message: "Ошибка при получении сообщений" });
  }
};

// ////////////////// DELETE MESSAGE ////////////////////

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Сообщение не найдено" });
    }

    res.status(200).json({ message: "Сообщение успешно удалено" });
  } catch (err) {
    console.error("Ошибка при удалении сообщения:", err);
    res.status(500).json({ message: "Ошибка при удалении сообщения" });
  }
};

// ////////////////// GET USER CHATS ////////////////////

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $last: "$$ROOT" }, // Последнее сообщение в чате
        },
      },
      {
        $project: {
          participantId: "$_id",
          lastMessage: 1,
        },
      },
    ]);

    // Возвращаем чаты (список участников)
    res.status(200).json(chats);
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    res.status(500).json({ message: "Ошибка при получении чатов" });
  }
};

// ///////////////////////// GET CHAT /////////////////////////

export const getChat = async (req, res) => {
  try {
    const { receiverUsername } = req.body; // Получаем имя пользователя получателя из тела запроса
    const senderId = req.user.id; // Получаем ID текущего пользователя из мидлвары

    if (!receiverUsername) {
      return res.status(400).json({ message: "Имя получателя обязательно" });
    }

    // Ищем ID получателя по его username (это можно сделать через вашу модель User)
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(404).json({ message: "Получатель не найден" });
    }

    // Получаем все сообщения между текущим пользователем и найденным получателем
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiver._id },
        { sender: receiver._id, receiver: senderId },
      ],
    }).sort({ createdAt: 1 }); // Сортируем по времени

    res.status(200).json(messages); // Возвращаем сообщения
  } catch (error) {
    console.error("Ошибка при получении чата:", error);
    res.status(500).json({ message: "Ошибка при получении чата" });
  }
};
