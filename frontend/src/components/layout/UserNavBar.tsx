import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout as apiLogout, pingAuth } from '../../api/IdentityAPI';
import logo from '../../assets/Website_Logo.png';
import '../../css/theme.css';
import { useAuth } from '../../context/AuthContext';

function UserNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await pingAuth();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const result = await apiLogout();
    if (result) {
      logout();
      navigate('/login');
    } else {
      console.error('Logout failed');
    }
  };

  const confirmLogout = () => setModal(true);
  const closeModal = () => setModal(false);
  const username = userEmail?.split('@')[0] ?? null;

  return (
    <>
      <nav
        className="side-navbar d-flex flex-column text-white"
        style={{
          backgroundColor: '#111',
          width: '130px',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <div className="nav-top">
          <ul className="nav flex-column text-center">
            {/* Logo */}
            <li className="nav-item mt-3 mb-2">
              <Link to="/" className="navbar-brand">
                <img src={logo} alt="My Logo" style={{ width: '70px', height: 'auto' }} />
              </Link>
            </li>

            {/* Logged-in Username */}
            {username && (
              <li className="nav-item mb-3">
                <div className="nav-link text-white">
                  <div style={iconWrapperStyle}>
                    <i className="bi bi-person-check fs-2"></i>
                    <span style={labelStyle}>{username}</span>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="nav-main flex-grow-1 d-flex flex-column justify-content-center">
          <ul className="nav flex-column text-center">
            <li className="nav-item" style={navItemStyle}>
              <Link to="/search" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-search fs-2"></i>
                  <span style={labelStyle}>Search</span>
                </div>
              </Link>
            </li>
            <li className="nav-item" style={navItemStyle}>
              <Link to="/movies" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-house fs-2"></i>
                  <span style={labelStyle}>Home</span>
                </div>
              </Link>
            </li>
            <li className="nav-item" style={navItemStyle}>
              <Link to="/favorites" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-heart fs-2"></i>
                  <span style={labelStyle}>Favorites</span>
                </div>
              </Link>
            </li>
            <li className="nav-item" style={navItemStyle}>
              <Link to="/add" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-plus fs-2"></i>
                  <span style={labelStyle}>Add</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-bottom">
          <ul className="nav flex-column text-center">
            <li className="nav-item" style={navItemStyle}>
              <Link to="/privacy" className="nav-link text-white">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-shield-lock fs-2"></i>
                  <span style={labelStyle}>Privacy</span>
                </div>
              </Link>
            </li>
            <li className="nav-item" style={navItemStyle}>
              <button onClick={confirmLogout} className="nav-link text-white btn btn-link">
                <div style={iconWrapperStyle}>
                  <i className="bi bi-box-arrow-right fs-2"></i>
                  <span style={labelStyle}>Logout</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {showModal && (
        <div
          className="modal show"
          style={{ display: 'block' }}
          tabIndex={-1}
          aria-labelledby="logoutModal"
          aria-hidden="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="logoutModal">Are you sure you want to log out?</h5>
              </div>
              <div className="modal-body">
                <p>Do you really want to log out?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Shared icon and text style
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

const navItemStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  marginBottom: '0.75rem',
};

export default UserNavbar;
