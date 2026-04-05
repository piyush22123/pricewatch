require('dotenv').config();

const app = require("./src/app");
const connectDB = require("./src/db/db");
const { startCronJob } = require("./src/services/cron.service");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // wait for DB connection
    await connectDB();
    console.log("Database connected ✅");

    // start server after DB is ready
    app.listen(PORT, () => {
      console.log("Server running on PORT ->", PORT);
    });

    // start cron after everything is ready
    startCronJob();

  } catch (error) {
    console.error("Failed to start server ❌", error);
    process.exit(1); // stop app if DB fails
  }
};

startServer();