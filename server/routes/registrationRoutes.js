import express from "express";

import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventParticipants,
} from "../controllers/registrationController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student registers
router.post("/", protect, authorizeRoles("student"), registerForEvent);

// Student views their registrations
router.get("/my", protect, authorizeRoles("student"), getMyRegistrations);

// Organizer views participants
router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("organizer"),
  getEventParticipants,
);

// Student cancels registration
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("student"),
  cancelRegistration,
);

export default router;
