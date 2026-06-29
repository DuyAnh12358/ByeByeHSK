const dns = require("dns");
let mongoose: typeof import("mongoose");
export const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    if (!mongoose) {
      const mod = await import("mongoose");
      mongoose = (mod as any).default ?? mod;
    }

    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://phamduyanhkg_db_user:e60zlvJGQoyzAlNO@byebyehsk.kvikmzd.mongodb.net/";
    const conn = await mongoose.connect(mongoUri);

    console.log(`Mongo Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};
