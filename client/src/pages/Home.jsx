import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  const getDashboard = () => {
    if (user?.role === "admin") {
      return "/admin";
    }

    if (user?.role === "organizer") {
      return "/organizer";
    }

    return "/student";
  };

  return (
    <main>
      <section
        style={{
          background: "linear-gradient(135deg, #111827, #312e81)",
          color: "white",
          padding: "100px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#a5b4fc",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            University Event Management
          </p>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(42px, 7vw, 72px)",
              margin: "10px 0",
            }}
          >
            Discover. Participate. Connect.
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "19px",
              maxWidth: "650px",
              margin: "20px auto 35px",
            }}
          >
            EventFlow brings university events, registrations, attendance and
            feedback together in one platform.
          </p>

          <div
            className="actions"
            style={{
              justifyContent: "center",
            }}
          >
            <Link
              to="/events"
              style={{
                background: "#4f46e5",
                color: "white",
                padding: "12px 22px",
                borderRadius: "8px",
              }}
            >
              Explore Events
            </Link>

            {user ? (
              <Link
                to={getDashboard()}
                style={{
                  background: "white",
                  color: "#111827",
                  padding: "12px 22px",
                  borderRadius: "8px",
                }}
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                style={{
                  background: "white",
                  color: "#111827",
                  padding: "12px 22px",
                  borderRadius: "8px",
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="page">
        <div className="card-grid">
          <div className="card">
            <h2>Discover Events</h2>

            <p>
              Browse approved university events and find opportunities based on
              your interests.
            </p>
          </div>

          <div className="card">
            <h2>Easy Registration</h2>

            <p>
              Register for events and manage your participation directly from
              your dashboard.
            </p>
          </div>

          <div className="card">
            <h2>Smarter Management</h2>

            <p>
              Organizers and administrators can manage approvals, attendance,
              feedback and analytics.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
