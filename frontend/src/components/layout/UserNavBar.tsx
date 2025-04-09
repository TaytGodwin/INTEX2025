import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {logout as apiLogout} from '../../api/IdentityAPI'
import logo from '../../assets/Website_Logo.png'
import '../../css/theme.css'; // Custom CSS for the sidebar
import { useAuth } from '../../context/AuthContext';

function UserNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setModal] = useState(false);

  const handleLogout = async () => {
    const result = await apiLogout();
    if (result) {
      logout();
      navigate('/login');
    }
    else {
      console.error('Logout failed')
    }
  };

  // Function to show the confirmation modal
  const confirmLogout = () => {
    setModal(true); // Show the modal
  };

  // Function to close the modal without logging out
  const closeModal = () => {
    setModal(false); // Hide the modal
  };

  return (
    <>
      <nav className="side-navbar d-flex flex-column text-white" style={{ background: 'transparent' }}>
        {/* Logo or brand at the top */}
        <div className="nav-top">
          <ul className="nav flex-column text-center">
            <li className="nav-item my-3">
              <Link to="/" className="navbar-brand">
                <img src={logo} alt="My Logo" style={{ width: '70px', height: 'auto' }} />
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-main flex-grow-1 d-flex flex-column justify-content-center">
          <ul className="nav flex-column text-center">
            {/* Search */}
            <li className="nav-item my-3">
              <Link to="/search" className="nav-link text-white">
                <i className="bi bi-search fs-2"></i>
              </Link>
            </li>
            {/* Home */}
            <li className="nav-item my-3">
              <Link to="/movies" className="nav-link text-white">
                <i className="bi bi-house fs-2"></i>
              </Link>
            </li>
            {/* Favorites */}
            <li className="nav-item my-3">
              <Link to="/favorites" className="nav-link text-white">
                <i className="bi bi-heart fs-2"></i>
              </Link>
            </li>
            {/* Add to Favorites or extra functionality */}
            <li className="nav-item my-3">
              <Link to="/add" className="nav-link text-white">
                <i className="bi bi-plus fs-2"></i>
              </Link>
            </li>
          </ul>
        </div>
        {/* Logout button anchored at the bottom */}
        <div className="nav-bottom">
          <ul className="nav flex-column text-center">
            <li className="nav-item my-3">
              <button onClick={confirmLogout} className="nav-link text-white btn btn-link">
                <i className="bi bi-box-arrow-right fs-2"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
  
      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex={-1} aria-labelledby="logoutModal" aria-hidden="true" onClick={(e) => e.stopPropagation()}>
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

export default UserNavbar;