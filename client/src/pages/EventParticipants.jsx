import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import api from "../services/api";

function EventParticipants() {
  const { eventId } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [attendance, setAttendance] = useState([]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/registrations/event/${eventId}`);

      setData(response.data);
      const attendanceResponse = await api.get(`/attendance/event/${eventId}`);

      setAttendance(attendanceResponse.data.participants);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const markAttendance = async (registrationId) => {
    setMessage("");
    setError("");

    try {
      const response = await api.post("/attendance/mark", {
        registrationId,
      });

      setMessage(response.data.message);
      fetchParticipants();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  if (loading) {
    return <p>Loading participants...</p>;
  }
  const isPresent = (registrationId) => {
    const record = attendance.find(
      (item) => item.registrationId === registrationId,
    );

    return record?.attended || false;
  };
  return (
    <div className="page">
      <Link to="/organizer">← Back to Dashboard</Link>

      <h1>Event Participants</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {data && (
        <>
          <h2>{data.event.title}</h2>

          <p>Capacity: {data.event.capacity}</p>

          <p>Registered: {data.totalRegistrations}</p>

          {data.participants.length === 0 ? (
            <p>No participants yet.</p>
          ) : (
            data.participants.map((registration) => (
              <div key={registration._id}>
                <hr />

                <h3>{registration.user?.name}</h3>

                <p>Email: {registration.user?.email}</p>

                <p>Department: {registration.user?.department}</p>

                {isPresent(registration._id) ? (
                  <strong>Present ✓</strong>
                ) : (
                  <button onClick={() => markAttendance(registration._id)}>
                    Mark Present
                  </button>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default EventParticipants;
