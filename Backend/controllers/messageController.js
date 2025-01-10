import Message from "../models/Message.js";

// //////////// SEND MESSAGE //////////////

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !content) {
      return res
        .status(400)
        .json({ message: "Получатель и текст сообщения обязательны" });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    res.status(201).json({ message: "Сообщение отправлено", data: message });
  } catch (err) {
    console.error("Ошибка при отправке сообщения:", err);
    res.status(500).json({ message: "Ошибка при отправке сообщения" });
  }
};

// //////////// GET MESSAGES //////////////

export const getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Ошибка при получении сообщений:", err);
    res.status(500).json({ message: "Ошибка при получении сообщений" });
  }
};

// //////////// DELETE MESSAGE //////////////

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
