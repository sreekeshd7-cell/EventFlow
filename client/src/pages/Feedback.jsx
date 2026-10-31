import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

function Feedback() {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await api.post("/feedback", {
        eventId,
        rating: Number(rating),
        comment,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/student");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="page">
      <h1>Event Feedback</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating</label>

          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 - Excellent</option>

            <option value="4">4 - Very Good</option>

            <option value="3">3 - Good</option>

            <option value="2">2 - Fair</option>

            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div>
          <label>Comment</label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
          />
        </div>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
