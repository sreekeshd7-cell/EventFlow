import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search) {
        params.search = search;
      }

      if (category) {
        params.category = category;
      }

      const response = await api.get("/events", { params });

      setEvents(response.data);
    } catch (error) {
      console.error(error);

      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    fetchEvents();
  };

  return (
    <div className="page">
      <h1>Browse Events</h1>

      <form
        onSubmit={handleSearch}
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr auto",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>

          <option value="Technical">Technical</option>

          <option value="Cultural">Cultural</option>

          <option value="Sports">Sports</option>

          <option value="Workshop">Workshop</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading events...</p>}

      {error && <p>{error}</p>}

      {!loading && events.length === 0 && <p>No events found.</p>}

      <div className="card-grid">
        {events.map((event) => (
          <div key={event._id} className="card">
            <h2>{event.title}</h2>

            <p>{event.description}</p>

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
              <strong>Time:</strong> {event.startTime}
              {" - "}
              {event.endTime}
            </p>

            <p>
              <strong>Capacity:</strong> {event.capacity}
            </p>

            <p>
              <strong>Organizer:</strong> {event.organizer?.name}
            </p>

            <Link to={`/events/${event._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
