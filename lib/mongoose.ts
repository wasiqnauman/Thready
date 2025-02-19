import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "threads_clone",
    });

    isConnected = true;
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error);
  }
};
