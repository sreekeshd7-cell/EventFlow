import Feedback from "../models/Feedback.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Attendance from "../models/Attendance.js";

// SUBMIT FEEDBACK
export const submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating) {
      return res.status(400).json({
        message: "Event and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Find registration
    const registration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
      status: "registered",
    });

    if (!registration) {
      return res.status(403).json({
        message: "You were not registered for this event",
      });
    }

    // Check attendance
    const attendance = await Attendance.findOne({
      registration: registration._id,
      attended: true,
    });

    if (!attendance) {
      return res.status(403).json({
        message: "Only attendees can submit feedback",
      });
    }

    // Check duplicate feedback
    const existingFeedback = await Feedback.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: "You have already submitted feedback",
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      event: eventId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET FEEDBACK FOR EVENT
export const getEventFeedback = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const feedback = await Feedback.find({
      event: req.params.eventId,
    })
      .populate("user", "name department")
      .sort({ createdAt: -1 });

    let averageRating = 0;

    if (feedback.length > 0) {
      const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);

      averageRating = totalRating / feedback.length;
    }

    res.status(200).json({
      event: {
        id: event._id,
        title: event.title,
      },

      totalFeedback: feedback.length,

      averageRating: Number(averageRating.toFixed(2)),

      feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
