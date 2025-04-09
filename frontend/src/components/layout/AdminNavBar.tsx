import { Link } from 'react-router-dom';
import logo from '../../assets/Website_Logo.png'
import '../../css/theme.css'; // For custom tweaks
import Logout from '../authentication/Logout';

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'transparent' }}>
      <div className="container-fluid">
      <Link to="/" className="navbar-brand">
          <img src={logo} alt="My Logo" style={{ width: '50px', height: 'auto' }} />
        </Link>
        <Link to="/admin" className="navbar-brand">Admin Home</Link>

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
            <li className="nav-item my-3 text-center">
              <Link to="/admin" className="nav-link"
              style={{
                fontSize: '1rem',
                borderRadius: '50px',
                padding: '0.5rem 1.5rem',
              }}
              
              >Movie Database</Link>
            </li>
            <li className="nav-item my-3 text-center">
            <Logout />
            </li>

            {/* Add more links here if needed */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;