import { axiosInstance } from "./index.js";

export const fetchChat = async (receiverUsername) => {
  try {
    const response = await axiosInstance.post("/message/getChat", {
      receiverUsername,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return null;
  }
};

export const fetchUserChats = async () => {
  try {
    const response = await axiosInstance.get("/message/getUserChats");
    return response.data;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return null;
  }
};
