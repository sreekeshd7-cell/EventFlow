import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// REGISTER FOR EVENT
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    // 1. Check event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // 2. Only approved events
    if (event.status !== "approved") {
      return res.status(400).json({
        message: "Registration is not available for this event",
      });
    }

    // 3. Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        message: "Registration deadline has passed",
      });
    }

    // 4. Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      // Allow previously cancelled registration to become active again
      if (existingRegistration.status === "cancelled") {
        // Check capacity before re-registering
        const registrationCount = await Registration.countDocuments({
          event: eventId,
          status: "registered",
        });

        if (registrationCount >= event.capacity) {
          return res.status(400).json({
            message: "Event is full",
          });
        }

        existingRegistration.status = "registered";
        existingRegistration.registeredAt = new Date();

        await existingRegistration.save();

        return res.status(200).json({
          message: "Registration restored successfully",
          registration: existingRegistration,
        });
      }

      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    // 5. Check capacity
    const registrationCount = await Registration.countDocuments({
      event: eventId,
      status: "registered",
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        message: "Event is full",
      });
    }

    // 6. Create registration
    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
    });

    res.status(201).json({
      message: "Registered successfully",
      registration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET LOGGED-IN USER'S REGISTRATIONS
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
    })
      .populate({
        path: "event",
        populate: {
          path: "organizer",
          select: "name email",
        },
      })
      .sort({ registeredAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CANCEL REGISTRATION
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    // User can cancel only their own registration
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only cancel your own registration",
      });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({
        message: "Registration is already cancelled",
      });
    }

    registration.status = "cancelled";

    await registration.save();

    res.status(200).json({
      message: "Registration cancelled successfully",
      registration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET PARTICIPANTS FOR AN EVENT
export const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Organizer can only view their own event participants
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only view participants of your own events",
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: "registered",
    })
      .populate("user", "name email department")
      .sort({ registeredAt: 1 });

    res.status(200).json({
      event: {
        id: event._id,
        title: event.title,
        capacity: event.capacity,
      },

      totalRegistrations: registrations.length,

      participants: registrations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
