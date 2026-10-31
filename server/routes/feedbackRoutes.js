import express from "express";

import {
  submitFeedback,
  getEventFeedback,
} from "../controllers/feedbackController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student submits feedback
router.post("/", protect, authorizeRoles("student"), submitFeedback);

// View event feedback
router.get("/event/:eventId", protect, getEventFeedback);

export default router;
