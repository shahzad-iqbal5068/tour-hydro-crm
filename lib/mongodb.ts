import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tourhydro";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

