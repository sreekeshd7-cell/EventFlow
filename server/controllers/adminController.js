import Event from "../models/Event.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import Feedback from "../models/Feedback.js";
import Attendance from "../models/Attendance.js";

// GET PENDING EVENTS
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "pending",
    })
      .populate("organizer", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// APPROVE EVENT
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.status = "approved";

    await event.save();

    res.status(200).json({
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// REJECT EVENT
export const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.status = "rejected";

    await event.save();

    res.status(200).json({
      message: "Event rejected",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
// ADMIN DASHBOARD ANALYTICS
export const getDashboardAnalytics = async (req, res) => {
  try {
    // -----------------------------
    // BASIC COUNTS
    // -----------------------------

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalOrganizers = await User.countDocuments({
      role: "organizer",
    });

    const totalEvents = await Event.countDocuments();

    const approvedEvents = await Event.countDocuments({
      status: "approved",
    });

    const pendingEvents = await Event.countDocuments({
      status: "pending",
    });

    const totalRegistrations = await Registration.countDocuments({
      status: "registered",
    });

    const totalAttendance = await Attendance.countDocuments({
      attended: true,
    });

    // -----------------------------
    // EVENTS BY CATEGORY
    // -----------------------------

    const eventsByCategory = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          totalEvents: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalEvents: -1,
        },
      },
    ]);

    // -----------------------------
    // MOST POPULAR EVENTS
    // -----------------------------

    const popularEvents = await Registration.aggregate([
      // Only active registrations
      {
        $match: {
          status: "registered",
        },
      },

      // Count registrations for each event
      {
        $group: {
          _id: "$event",

          registrations: {
            $sum: 1,
          },
        },
      },

      // Join with events collection
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },

      // Convert array to object
      {
        $unwind: "$eventDetails",
      },

      // Select fields
      {
        $project: {
          _id: 0,

          eventId: "$_id",

          title: "$eventDetails.title",

          category: "$eventDetails.category",

          registrations: 1,
        },
      },

      // Most popular first
      {
        $sort: {
          registrations: -1,
        },
      },

      // Top 5
      {
        $limit: 5,
      },
    ]);

    // -----------------------------
    // EVENT RATINGS
    // -----------------------------

    const eventRatings = await Feedback.aggregate([
      {
        $group: {
          _id: "$event",

          averageRating: {
            $avg: "$rating",
          },

          totalFeedback: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },

      {
        $unwind: "$eventDetails",
      },

      {
        $project: {
          _id: 0,

          eventId: "$_id",

          title: "$eventDetails.title",

          averageRating: {
            $round: ["$averageRating", 2],
          },

          totalFeedback: 1,
        },
      },

      {
        $sort: {
          averageRating: -1,
        },
      },
    ]);

    // -----------------------------
    // ATTENDANCE RATE
    // -----------------------------

    const attendanceStats = await Registration.aggregate([
      // Active registrations
      {
        $match: {
          status: "registered",
        },
      },

      // Join attendance
      {
        $lookup: {
          from: "attendances",

          localField: "_id",

          foreignField: "registration",

          as: "attendance",
        },
      },

      // Group by event
      {
        $group: {
          _id: "$event",

          totalRegistered: {
            $sum: 1,
          },

          totalAttended: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$attendance",
                          as: "a",

                          cond: {
                            $eq: ["$$a.attended", true],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      // Join event information
      {
        $lookup: {
          from: "events",

          localField: "_id",

          foreignField: "_id",

          as: "eventDetails",
        },
      },

      {
        $unwind: "$eventDetails",
      },

      // Calculate percentage
      {
        $project: {
          _id: 0,

          eventId: "$_id",

          title: "$eventDetails.title",

          totalRegistered: 1,

          totalAttended: 1,

          attendanceRate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: ["$totalAttended", "$totalRegistered"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },

      {
        $sort: {
          attendanceRate: -1,
        },
      },
    ]);

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(200).json({
      overview: {
        totalUsers,
        totalStudents,
        totalOrganizers,
        totalEvents,
        approvedEvents,
        pendingEvents,
        totalRegistrations,
        totalAttendance,
      },

      eventsByCategory,

      popularEvents,

      eventRatings,

      attendanceStats,
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
