import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();

  const { user } = useAuth();

  const [event, setEvent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);

        setEvent(response.data);
      } catch (error) {
        console.error(error);

        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setMessage("");
    setError("");

    try {
      const response = await api.post("/registrations", {
        eventId: id,
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (!event) {
    return (
      <div>
        <p>Event not found.</p>

        <Link to="/events">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/events">← Back to Events</Link>

      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <p>
        <strong>Category:</strong> {event.category}
      </p>

      <p>
        <strong>Venue:</strong> {event.venue}
      </p>

      <p>
        <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
      </p>

      <p>
        <strong>Time:</strong> {event.startTime}
        {" - "}
        {event.endTime}
      </p>

      <p>
        <strong>Registration Deadline:</strong>{" "}
        {new Date(event.registrationDeadline).toLocaleDateString()}
      </p>

      <p>
        <strong>Capacity:</strong> {event.capacity}
      </p>

      <p>
        <strong>Organizer:</strong> {event.organizer?.name}
      </p>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {!user && (
        <p>
          <Link to="/login">Login</Link> to register for this event.
        </p>
      )}

      {user?.role === "student" && (
        <button onClick={handleRegister}>Register for Event</button>
      )}
    </div>
  );
}

export default EventDetails;
