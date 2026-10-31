import Attendance from "../models/Attendance.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.body;

    // Find registration
    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.status !== "registered") {
      return res.status(400).json({
        message: "Cannot mark attendance for cancelled registration",
      });
    }

    // Find corresponding event
    const event = await Event.findById(registration.event);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Make sure organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only mark attendance for your own events",
      });
    }

    // Check whether attendance already exists
    let attendance = await Attendance.findOne({
      registration: registrationId,
    });

    if (attendance) {
      attendance.attended = true;
      attendance.markedAt = new Date();

      await attendance.save();

      return res.status(200).json({
        message: "Attendance updated successfully",
        attendance,
      });
    }

    // Create attendance
    attendance = await Attendance.create({
      registration: registrationId,
      attended: true,
      markedAt: new Date(),
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ATTENDANCE FOR EVENT
export const getEventAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only view attendance for your own events",
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: "registered",
    }).populate("user", "name email department");

    const result = [];

    for (const registration of registrations) {
      const attendance = await Attendance.findOne({
        registration: registration._id,
      });

      result.push({
        registrationId: registration._id,
        user: registration.user,
        attended: attendance ? attendance.attended : false,
        markedAt: attendance ? attendance.markedAt : null,
      });
    }

    res.status(200).json({
      event: {
        id: event._id,
        title: event.title,
      },

      totalRegistered: registrations.length,

      totalAttended: result.filter((item) => item.attended).length,

      participants: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
