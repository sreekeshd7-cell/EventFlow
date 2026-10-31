import express from "express";

import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getDashboardAnalytics,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Everything below requires admin
router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/events/pending", getPendingEvents);
router.get("/dashboard", getDashboardAnalytics);
router.patch("/events/:id/approve", approveEvent);

router.patch("/events/:id/reject", rejectEvent);

export default router;
