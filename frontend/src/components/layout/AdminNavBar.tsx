import { Link } from 'react-router-dom';
import '../../css/theme.css'; // For custom tweaks

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/Admin" className="navbar-brand">Admin Page</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/AdminDatabasePage" className="nav-link">Database Page</Link>
            </li>
            <li className="nav-item">
              <Link to="/AdminUsers" className="nav-link">Users</Link>
            </li>
            {/* Add more links here if needed */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;