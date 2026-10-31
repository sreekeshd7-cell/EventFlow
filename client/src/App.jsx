import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";

import StudentDashboard from "./pages/StudentDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import Feedback from "./pages/Feedback";
import CreateEvent from "./pages/CreateEvent";
import EventParticipants from "./pages/EventParticipants";
import EventFeedback from "./pages/EventFeedback";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/events" element={<Events />} />

        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/feedback/:eventId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:eventId/participants"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventParticipants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:eventId/feedback"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <EventFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="page">
              <div className="card">
                <h1>404</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/">Return Home</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
