import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`Connect to mongodb Database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in mongodb: ${error}`);
  }
};

export default connectDB;
