import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    capacity: "",
  });

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await api.post("/events", {
        ...formData,

        capacity: Number(formData.capacity),
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/organizer");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="page">
      <Link to="/organizer">← Back to Dashboard</Link>

      <h1>Create Event</h1>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Technical">Technical</option>

            <option value="Cultural">Cultural</option>

            <option value="Sports">Sports</option>

            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div>
          <label>Venue</label>

          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Event Date</label>

          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Start Time</label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Time</label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Registration Deadline</label>

          <input
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Capacity</label>

          <input
            type="number"
            name="capacity"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
