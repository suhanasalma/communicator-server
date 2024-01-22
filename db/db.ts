import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/communicator`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection errors:', error);
  }
};


export default connectDB;