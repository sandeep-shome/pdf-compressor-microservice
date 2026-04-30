import { connect } from "mongoose";
import "dotenv/config";

if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

export const dbConn = async (retries = 5): Promise<void> => {
  while (retries > 0) {
    try {
      await connect(process.env.MONGO_URI!);
      console.log("✅ Database Connected");
      return;
    } catch (error) {
      console.error("❌ Database Connection Failed. Retrying in 5s...");
      retries--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Failed to connect to database");
};
