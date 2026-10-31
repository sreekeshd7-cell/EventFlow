import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import api from "../services/api";

function EventFeedback() {
  const { eventId } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/feedback/event/${eventId}`);

        setData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [eventId]);

  if (loading) {
    return <p>Loading feedback...</p>;
  }

  return (
    <div className="page">
      <Link to="/organizer">← Back to Dashboard</Link>

      <h1>Event Feedback</h1>

      {error && <p>{error}</p>}

      {data && (
        <>
          <h2>{data.event.title}</h2>

          <p>Total Feedback: {data.totalFeedback}</p>

          <p>Average Rating: {data.averageRating} / 5</p>

          {data.feedback.length === 0 ? (
            <p>No feedback yet.</p>
          ) : (
            data.feedback.map((feedback) => (
              <div key={feedback._id}>
                <hr />

                <p>
                  <strong>{feedback.user?.name}</strong>
                </p>

                <p>Rating: {feedback.rating} / 5</p>

                <p>{feedback.comment || "No comment"}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default EventFeedback;
