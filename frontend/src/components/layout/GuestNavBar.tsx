import { Link } from 'react-router-dom';
import '../../css/Navbar.css'; // For custom tweaks

const GuestNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">MySite</Link>

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
              <Link to="/HomePage" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/LoginPage" className="nav-link">Sign Up</Link>
            </li>
            {/* Add more links here if needed */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;