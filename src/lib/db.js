import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.DB_URI.replace("<user>", process.env.DB_USER).replace(
        "<password>",
        process.env.DB_PASSWORD
      )
    );
    console.log(`MongoDB Connected!`);
  } catch (err) {
    console.log(`MongoDB Connection Error: ${err.message}`);
  }
};
