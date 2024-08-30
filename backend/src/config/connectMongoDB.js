import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const connectMongodb = async () => {
  try {
    const dbUrl = `${process.env.DB_URL}/todo-list`;
    if (!dbUrl) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    await mongoose.connect(dbUrl);

    console.log("MongoDB is connected!");
  } catch (error) {
    console.error("MongoDB connection failed!", error);
  }
};

export default connectMongodb;
