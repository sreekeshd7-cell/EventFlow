import express from "express";

import {
  markAttendance,
  getEventAttendance,
} from "../controllers/attendanceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only organizers can access attendance routes
router.use(protect);
router.use(authorizeRoles("organizer"));

// Mark attendance
router.post("/mark", markAttendance);

// View event attendance
router.get("/event/:eventId", getEventAttendance);

export default router;
