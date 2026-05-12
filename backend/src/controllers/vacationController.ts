import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../config/database";
import { VacationRequest } from "../entities/VacationRequest";
import { User } from "../entities/User";

const requestRepository = () => AppDataSource.getRepository(VacationRequest);
const userRepository = () => AppDataSource.getRepository(User);

// POST /api/vacations — submit a new vacation request
export const createVacationRequest = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { userId, startDate, endDate, reason } = req.body;

  // Ensure start date is not in the past
  const today = new Date().toISOString().split("T")[0];
  if (startDate < today) {
    res.status(400).json({ message: "Start date cannot be in the past" });
    return;
  }

  // Ensure end date is not before start date
  if (new Date(endDate) < new Date(startDate)) {
    res.status(400).json({ message: "End date cannot be before start date" });
    return;
  }

  try {
    const vacation = requestRepository().create({
      userId,
      startDate,
      endDate,
      reason: reason || null,
      status: "Pending",
    });
    const saved = await requestRepository().save(vacation);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create vacation request" });
  }
};

// GET /api/vacations?userId=x — requests for a specific user (requester view)
// GET /api/vacations?status=Pending — all requests filtered by status (validator view)
// GET /api/vacations — all requests (validator view)
export const getVacationRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, status } = req.query;

    const queryBuilder = requestRepository()
      .createQueryBuilder("vacation")
      .leftJoinAndSelect("vacation.user", "user")
      .orderBy("vacation.createdAt", "DESC");

    if (userId) {
      queryBuilder.andWhere("vacation.userId = :userId", { userId: Number(userId) });
    }

    if (status) {
      const allowedStatuses = ["Pending", "Approved", "Rejected"];
      if (!allowedStatuses.includes(status as string)) {
        res.status(400).json({ message: "Invalid status filter" });
        return;
      }
      queryBuilder.andWhere("vacation.status = :status", { status });
    }

    const requests = await queryBuilder.getMany();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve vacation requests" });
  }
};

// PATCH /api/vacations/:id/approve — approve a request
export const approveVacationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vacation = await requestRepository().findOne({ where: { id: Number(id) } });

    if (!vacation) {
      res.status(404).json({ message: "Vacation request not found" });
      return;
    }

    if (vacation.status !== "Pending") {
      res.status(409).json({ message: "Only pending requests can be approved" });
      return;
    }

    vacation.status = "Approved";
    vacation.comments = req.body.comments || null;
    await requestRepository().save(vacation);

    // Deduct approved days from the user's balance
    const start = new Date(vacation.startDate);
    const end = new Date(vacation.endDate);
    const daysUsed = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    await userRepository().decrement({ id: vacation.userId }, "vacationDaysBalance", daysUsed);

    const updated = await requestRepository().findOne({ where: { id: Number(id) }, relations: ["user"] });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve vacation request" });
  }
};

// PATCH /api/vacations/:id/reject — reject a request (comment required)
export const rejectVacationRequest = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { id } = req.params;
    const vacation = await requestRepository().findOne({ where: { id: Number(id) } });

    if (!vacation) {
      res.status(404).json({ message: "Vacation request not found" });
      return;
    }

    if (vacation.status !== "Pending") {
      res.status(409).json({ message: "Only pending requests can be rejected" });
      return;
    }

    vacation.status = "Rejected";
    vacation.comments = req.body.comments;
    await requestRepository().save(vacation);
    const updated = await requestRepository().findOne({ where: { id: Number(id) }, relations: ["user"] });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject vacation request" });
  }
};

// PATCH /api/vacations/:id — edit a pending request (requester only)
export const updateVacationRequest = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { id } = req.params;
    const vacation = await requestRepository().findOne({ where: { id: Number(id) } });

    if (!vacation) {
      res.status(404).json({ message: "Vacation request not found" });
      return;
    }

    if (vacation.status !== "Pending") {
      res.status(409).json({ message: "Only pending requests can be edited" });
      return;
    }

    const { startDate, endDate, reason } = req.body;

    // Ensure start date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) {
      res.status(400).json({ message: "Start date cannot be in the past" });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      res.status(400).json({ message: "End date cannot be before start date" });
      return;
    }

    vacation.startDate = startDate;
    vacation.endDate = endDate;
    vacation.reason = reason ?? null;
    const updated = await requestRepository().save(vacation);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update vacation request" });
  }
};

// DELETE /api/vacations/:id — delete a pending request (requester only)
export const deleteVacationRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vacation = await requestRepository().findOne({ where: { id: Number(id) } });

    if (!vacation) {
      res.status(404).json({ message: "Vacation request not found" });
      return;
    }

    if (vacation.status !== "Pending") {
      res.status(409).json({ message: "Only pending requests can be deleted" });
      return;
    }

    await requestRepository().remove(vacation);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vacation request" });
  }
};
