import "reflect-metadata";
import express from "express";
import cors from "cors";
import vacationRoutes from "./routes/vacations";
import userRoutes from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vacations", vacationRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export { app };
