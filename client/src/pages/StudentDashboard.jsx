import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const response = await api.get("/registrations/my");

      setRegistrations(response.data);
    } catch (error) {
      console.error(error);

      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const cancelRegistration = async (registrationId) => {
    const confirmed = window.confirm("Cancel this registration?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.patch(
        `/registrations/${registrationId}/cancel`,
      );

      setMessage(response.data.message);

      fetchRegistrations();
    } catch (error) {
      setError(error.response?.data?.message || "Cancellation failed");
    }
  };

  return (
    <div className="page">
      <h1>Student Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      <p>Department: {user?.department || "N/A"}</p>

      <Link to="/events">Browse Events</Link>

      <h2>My Events</h2>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && registrations.length === 0 && (
        <p>You haven't registered for any events yet.</p>
      )}

      {registrations.map((registration) => {
        const event = registration.event;

        if (!event) {
          return null;
        }

        return (
          <div key={registration._id}>
            <hr />
            <h3>{event.title}</h3>
            <p>
              <strong>Venue:</strong> {event.venue}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Registration Status:</strong> {registration.status}
            </p>
            <Link to={`/events/${event._id}`}>View Event</Link>{" "}
            {registration.status === "registered" && (
              <>
                <Link to={`/feedback/${event._id}`}>Give Feedback</Link>{" "}
                <button onClick={() => cancelRegistration(registration._id)}>
                  Cancel Registration
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StudentDashboard;
