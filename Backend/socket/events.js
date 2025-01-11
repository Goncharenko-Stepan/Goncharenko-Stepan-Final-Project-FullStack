const attachSocketEvents = (io, socket) => {
  socket.on("sendMessage", (data) => {
    console.log("Новое сообщение: ", data);
    io.to(data.recipientId).emit("recivientMessage", data);
  });
  socket.on("sendNotification", (data) => {
    console.log("Уведомление:", data);
    io.to(data.userId).emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};

export default attachSocketEvents;
