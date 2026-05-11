import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import vacationRoutes from "./routes/vacations";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/vacations", vacationRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server only when DB is ready
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
