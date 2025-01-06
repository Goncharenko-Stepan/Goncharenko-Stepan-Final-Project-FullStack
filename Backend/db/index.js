import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Вы были подключены к базе данных");
  } catch (error) {
    console.error("Ошибка при подключении к базе данных " + error);
  }
};

export default connectDB;
