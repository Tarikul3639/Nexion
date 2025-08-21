import mongoose from "mongoose";
import config from "config";
export const connectDB = async () => {
    try{
        await mongoose.connect(config.get("db.url"));
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}