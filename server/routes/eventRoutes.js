import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  cancelEvent,
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - approved events
router.get("/", getEvents);

// Organizer's own events
router.get("/my-events", protect, authorizeRoles("organizer"), getMyEvents);

// Create event
router.post("/", protect, authorizeRoles("organizer"), createEvent);

// Get event by ID
router.get("/:id", getEventById);

// Update event
router.put("/:id", protect, authorizeRoles("organizer"), updateEvent);

// Cancel event
router.delete("/:id", protect, authorizeRoles("organizer"), cancelEvent);

export default router;
