import { Router } from "express";
import { body } from "express-validator";
import {
  createVacationRequest,
  getVacationRequests,
  approveVacationRequest,
  rejectVacationRequest,
  updateVacationRequest,
} from "../controllers/vacationController";

const router = Router();

// POST /api/vacations
router.post(
  "/",
  [
    body("userId").isInt({ min: 1 }).withMessage("userId must be a positive integer"),
    body("startDate").isDate().withMessage("startDate must be a valid date (YYYY-MM-DD)"),
    body("endDate").isDate().withMessage("endDate must be a valid date (YYYY-MM-DD)"),
    body("reason").optional().isString().trim().isLength({ max: 500 }),
  ],
  createVacationRequest
);

// GET /api/vacations
router.get("/", getVacationRequests);

// PATCH /api/vacations/:id/approve
router.patch("/:id/approve", approveVacationRequest);

// PATCH /api/vacations/:id/reject
router.patch(
  "/:id/reject",
  [
    body("comments")
      .notEmpty()
      .withMessage("A comment is required when rejecting a request")
      .isString()
      .trim()
      .isLength({ max: 500 }),
  ],
  rejectVacationRequest
);

// PATCH /api/vacations/:id — edit a pending request
router.patch(
  "/:id",
  [
    body("startDate").isDate().withMessage("startDate must be a valid date (YYYY-MM-DD)"),
    body("endDate").isDate().withMessage("endDate must be a valid date (YYYY-MM-DD)"),
    body("reason").optional({ nullable: true }).isString().trim().isLength({ max: 500 }),
  ],
  updateVacationRequest
);

export default router;
