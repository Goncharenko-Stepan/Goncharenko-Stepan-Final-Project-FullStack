import { Server } from "socket.io";
import attachSocketEvents from "./events.js";

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    attachSocketEvents(io, socket); // EVENTS
  });

  return io;
};
