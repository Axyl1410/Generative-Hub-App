/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: "genhub",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
