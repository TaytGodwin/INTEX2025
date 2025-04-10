import { Link } from 'react-router-dom';
import logo from '../../assets/Website_Logo.png'
import '../../css/theme.css'; // For custom tweaks

const GuestNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'transparent' }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="My Logo" style={{ width: '150px', height: 'auto' }} />
        </Link>
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
              <Link to="/login" className="nav-link sign-in-button" style={{
                  fontSize: '2rem',
                  borderRadius: '50px',
                  padding: '0.5rem 1.5rem',
                  
                }}>
                Sign in
              </Link>
            </li>
            {/* Add more links here if needed */}
          </ul>
        
        </div>
      </div>
    </nav>
  );
};


export default GuestNavbar;