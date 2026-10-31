import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrganizerDashboard() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/events/my-events");

      setEvents(response.data);
    } catch (error) {
      console.error(error);

      setError("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const cancelEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this event?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(`/events/${eventId}`);

      setMessage(response.data.message);

      fetchEvents();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to cancel event");
    }
  };

  return (
    <div className="page">
      <h1>Organizer Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      <Link to="/organizer/create-event">Create New Event</Link>

      <h2>My Events</h2>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && events.length === 0 && (
        <p>You haven't created any events yet.</p>
      )}

      {events.map((event) => (
        <div
          key={event._id}
          className="card"
          style={{
            marginBottom: "20px",
          }}
        >
          <hr />

          <h3>{event.title}</h3>

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

          <p>
            <strong>Status:</strong>{" "}
            <span className={`status status-${event.status}`}>
              {event.status}
            </span>
          </p>

          <Link to={`/events/${event._id}`}>View</Link>

          {" | "}

          <Link to={`/organizer/events/${event._id}/edit`}>Edit</Link>

          {" | "}

          <Link to={`/organizer/events/${event._id}/participants`}>
            Participants
          </Link>

          {" | "}

          <Link to={`/organizer/events/${event._id}/feedback`}>Feedback</Link>

          {" | "}

          {event.status !== "cancelled" && (
            <button onClick={() => cancelEvent(event._id)}>Cancel Event</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrganizerDashboard;
