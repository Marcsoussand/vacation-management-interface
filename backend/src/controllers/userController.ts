import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepository = () => AppDataSource.getRepository(User);

// GET /api/users — return all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository().find({
      select: ["id", "name", "role", "vacationDaysBalance"],
      order: { id: "ASC" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};
