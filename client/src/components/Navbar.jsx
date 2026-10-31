import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const dashboardPath = () => {
    if (user?.role === "admin") {
      return "/admin";
    }

    if (user?.role === "organizer") {
      return "/organizer";
    }

    return "/student";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="brand" to="/">
          EventFlow
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/events">Events</NavLink>

          {user && <NavLink to={dashboardPath()}>Dashboard</NavLink>}
        </div>

        <div className="nav-user">
          {!user ? (
            <>
              <Link to="/login">Login</Link>

              <Link className="nav-register" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="user-info">
                <span>{user.name}</span>

                <small>{user.role}</small>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
