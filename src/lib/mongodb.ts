// import mongoose from "mongoose";

// const MONGODB_URI =
//   process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tourhydro";

// let isConnected = false;

// export async function connectToDatabase() {
//   if (isConnected) {
//     return;
//   }

//   await mongoose.connect(MONGODB_URI);
//   isConnected = true;
// }

import mongoose from "mongoose";

const uriFromEnv = process.env.MONGODB_URI;

if (!uriFromEnv) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI: string = uriFromEnv;

// TypeScript-safe cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose?: MongooseCache;
}

const globalWithMongoose = globalThis as typeof globalThis & GlobalWithMongoose;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  globalWithMongoose.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        console.log(
          "MongoDB connected:",
          mongooseInstance.connection.db?.databaseName
        );
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}