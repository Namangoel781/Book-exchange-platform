import mongoose from "mongoose";
import "dotenv/config";

export const connectDb = async () => {
  const URL = process.env.DB;
  try {
    await mongoose.connect(URL);
    console.log("connection established");
  } catch (error) {
    console.log("database fail");
    console.log(error);
    process.exit(0);
  }
};

export default connectDb;
