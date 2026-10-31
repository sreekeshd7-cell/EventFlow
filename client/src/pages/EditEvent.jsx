import { useEffect, useState } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function EditEvent() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);

        const event = response.data;

        setFormData({
          title: event.title || "",

          description: event.description || "",

          category: event.category || "",

          venue: event.venue || "",

          eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",

          startTime: event.startTime || "",

          endTime: event.endTime || "",

          registrationDeadline: event.registrationDeadline
            ? event.registrationDeadline.split("T")[0]
            : "",

          capacity: event.capacity || "",
        });
      } catch (error) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/events/${id}`, {
        ...formData,

        capacity: Number(formData.capacity),
      });

      navigate("/organizer");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update event");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">
      <Link to="/organizer">← Back</Link>

      <h1>Edit Event</h1>

      <p>Editing an event will send it for admin approval again.</p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br />

        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br />

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

        <br />

        <label>Venue</label>

        <input
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />

        <br />

        <label>Event Date</label>

        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />

        <br />

        <label>Start Time</label>

        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <br />

        <label>End Time</label>

        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <br />

        <label>Registration Deadline</label>

        <input
          type="date"
          name="registrationDeadline"
          value={formData.registrationDeadline}
          onChange={handleChange}
          required
        />

        <br />

        <label>Capacity</label>

        <input
          type="number"
          min="1"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <br />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEvent;
