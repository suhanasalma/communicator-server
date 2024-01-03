import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.URL}/communicator`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};


export default connectDB;