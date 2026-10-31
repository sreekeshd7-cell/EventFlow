import Event from "../models/Event.js";

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      eventDate,
      startTime,
      endTime,
      registrationDeadline,
      capacity,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !venue ||
      !eventDate ||
      !startTime ||
      !endTime ||
      !registrationDeadline ||
      !capacity
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      eventDate,
      startTime,
      endTime,
      registrationDeadline,
      capacity,
      imageUrl,
      organizer: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      message: "Event created successfully and sent for approval",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL APPROVED EVENTS
export const getEvents = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {
      status: "approved",
    };

    // SEARCH
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          description: {
            $regex: search,
            $options: "i",
          },
        },

        {
          venue: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)

      .populate("organizer", "name email department")

      .sort({
        eventDate: 1,
      });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email department",
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ORGANIZER'S EVENTS
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizer: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Make sure organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own events",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "venue",
      "eventDate",
      "startTime",
      "endTime",
      "registrationDeadline",
      "capacity",
      "imageUrl",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Edited event must be approved again
    event.status = "pending";

    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event updated and sent for approval",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// CANCEL EVENT
export const cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only cancel your own events",
      });
    }

    event.status = "cancelled";

    await event.save();

    res.status(200).json({
      message: "Event cancelled successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
