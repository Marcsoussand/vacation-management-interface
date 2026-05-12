import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { app } from "./app";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000");

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

export { app };
