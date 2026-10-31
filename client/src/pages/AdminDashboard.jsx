import { useEffect, useState } from "react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);

  const [pendingEvents, setPendingEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, pendingResponse] = await Promise.all([
        api.get("/admin/dashboard"),

        api.get("/admin/events/pending"),
      ]);

      setAnalytics(analyticsResponse.data);

      setPendingEvents(pendingResponse.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const approveEvent = async (eventId) => {
    try {
      setMessage("");
      setError("");

      const response = await api.patch(`/admin/events/${eventId}/approve`);

      setMessage(response.data.message);

      fetchDashboard();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to approve event");
    }
  };

  const rejectEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this event?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.patch(`/admin/events/${eventId}/reject`);

      setMessage(response.data.message);

      fetchDashboard();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reject event");
    }
  };

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {/* OVERVIEW */}

      {analytics && (
        <>
          <h2>Overview</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <p>
                <strong>Total Users:</strong> {analytics.overview.totalUsers}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Students:</strong> {analytics.overview.totalStudents}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Organizers:</strong>{" "}
                {analytics.overview.totalOrganizers}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Total Events:</strong> {analytics.overview.totalEvents}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Approved Events:</strong>{" "}
                {analytics.overview.approvedEvents}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Pending Events:</strong>{" "}
                {analytics.overview.pendingEvents}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Active Registrations:</strong>{" "}
                {analytics.overview.totalRegistrations}
              </p>
            </div>
            <div className="stat-card">
              <p>
                <strong>Total Attendance:</strong>{" "}
                {analytics.overview.totalAttendance}
              </p>
            </div>
          </div>
        </>
      )}

      {/* PENDING EVENTS */}

      <hr />

      <h2>Pending Event Approvals</h2>

      {pendingEvents.length === 0 ? (
        <p>No events waiting for approval.</p>
      ) : (
        pendingEvents.map((event) => (
          <div key={event._id}>
            <hr />
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              <strong>Organizer:</strong> {event.organizer?.name}
            </p>
            <p>
              <strong>Department:</strong>{" "}
              {event.organizer?.department || "N/A"}
            </p>
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p>
              <strong>Venue:</strong> {event.venue}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Capacity:</strong> {event.capacity}
            </p>
            <button onClick={() => approveEvent(event._id)}>Approve</button>{" "}
            <button onClick={() => rejectEvent(event._id)}>Reject</button>
          </div>
        ))
      )}

      {/* POPULAR EVENTS */}

      {analytics && (
        <>
          <hr />

          <h2>Most Popular Events</h2>

          {analytics.popularEvents.length === 0 ? (
            <p>No registration data yet.</p>
          ) : (
            analytics.popularEvents.map((event, index) => (
              <div key={event.eventId}>
                <p>
                  <strong>
                    {index + 1}. {event.title}
                  </strong>
                  {" — "}
                  {event.registrations} registrations
                </p>
              </div>
            ))
          )}

          {/* EVENTS BY CATEGORY */}

          <hr />

          <h2>Events by Category</h2>

          {analytics.eventsByCategory.map((category) => (
            <p key={category._id}>
              <strong>{category._id || "Uncategorized"}:</strong>{" "}
              {category.totalEvents}
            </p>
          ))}

          {/* RATINGS */}

          <hr />

          <h2>Event Ratings</h2>

          {analytics.eventRatings.length === 0 ? (
            <p>No feedback data yet.</p>
          ) : (
            analytics.eventRatings.map((event) => (
              <p key={event.eventId}>
                <strong>{event.title}</strong>
                {" — "}
                {event.averageRating} / 5{" ("}
                {event.totalFeedback} reviews)
              </p>
            ))
          )}

          {/* ATTENDANCE */}

          <hr />

          <h2>Attendance Statistics</h2>

          {analytics.attendanceStats.length === 0 ? (
            <p>No attendance data yet.</p>
          ) : (
            analytics.attendanceStats.map((event) => (
              <div key={event.eventId}>
                <p>
                  <strong>{event.title}</strong>
                </p>

                <p>
                  Registered: {event.totalRegistered}
                  {" | "}
                  Attended: {event.totalAttended}
                  {" | "}
                  Attendance Rate: {event.attendanceRate}%
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
