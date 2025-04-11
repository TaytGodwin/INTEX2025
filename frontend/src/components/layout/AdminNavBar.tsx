import logo from '../../assets/Cineniche.svg'
import '../../css/theme.css'; // For custom tweaks
import { useState } from 'react';
import { Link} from 'react-router-dom';

import Logout from '../authentication/Logout';

const AdminNavbar = () => {
  
  const [showModal, setModal] = useState(false);
  
  
    const confirmLogout = () => {
      setModal(true); // Show the modal
    };
  
    const closeModal = () => {
      setModal(false); // Hide the modal
    };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'transparent' }}>
      <div className="container-fluid d-flex align-items-center">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="My Logo" style={{ width: '70px', height: 'auto' }} />
        </Link>

        <div className="nav-main flex-grow-1 d-flex flex-row justify-content-between align-items-center">
          <ul className="nav flex-row text-center">
            {/* Search */}
            <li className="nav-item my-3">
              <Link to="/search" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-search fs-2"></i>
                  <span style={labelStyle}>Search</span>
                </div>
              </Link>
            </li>
            {/* Home */}
            <li className="nav-item my-3">
              <Link to="/movies" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-house fs-2"></i>
                  <span style={labelStyle}>Home</span>
                </div>
              </Link>
            </li>
            {/* Movie Database Button */}
            <li className="nav-item my-3">
              <Link to="/admin" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-film fs-2"></i>
                  <span style={labelStyle}>Movie Database</span>
                </div>
              </Link>
            </li>
          </ul>

          {/* Centered heading for "Administration" placed after Movie Database and before Privacy Policy */}
          <div style={adminTitleStyle}>
            <h4 style={{ color: 'white', margin: 0, textAlign: 'center' }}>
              ADMINISTRATOR SETTINGS
            </h4>
          </div>

          <div className="nav-bottom">
            <ul className="nav flex-row text-center">
              {/* Privacy Policy */}
              <li className="nav-item my-3">
                <Link to="/privacy" className="nav-link text-white">
                  <div style={iconWrapperStyle}>
                    <i className="bi bi-shield-lock fs-2"></i> {/* Lock icon for Privacy Policy */}
                    <span style={labelStyle}>Privacy</span>
                  </div>
                </Link>
              </li>
              {/* Logout */}
              <li className="nav-item my-3">
                <button onClick={confirmLogout} className="nav-link text-white btn btn-link">
                  <div style={iconWrapperStyle}>
                    <i className="bi bi-box-arrow-right fs-2"></i>
                    <span style={labelStyle}>Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
          
          <Logout setShowCookieModal={closeModal}/>
)}
    </nav>
  );
};

const iconWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#fff',
  marginTop: '0.25rem',
};

// Style for centering the Admin title
const adminTitleStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
};

export default AdminNavbar;
