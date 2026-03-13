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

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  return uri;
}

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
    const uri = getMongoUri();
    cached!.promise = mongoose
      .connect(uri)
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