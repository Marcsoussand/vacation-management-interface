import { Router } from "express";
import { getAllUsers } from "../controllers/userController";

const router = Router();

// GET /api/users
router.get("/", getAllUsers);

export default router;
