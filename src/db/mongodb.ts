/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";

export const DB_CONNECT = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      // These options are automatically managed by Mongoose >= 6.x
      // so no need to specify them anymore:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  } catch (error) {
    process.exit(1);
  }
};
