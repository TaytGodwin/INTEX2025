import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../../api/IdentityAPI';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showModal, setModal] = useState(false);

  const handleLogout = async () => {
    // Call your backend logout endpoint
    const result = await apiLogout();
    if (result) {
      // Clear the AuthContext
      logout();
      // Navigate to the login page or home
      navigate('/login');
    } else {
      console.error('Logout failed');
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
      {/* Button to trigger logout */}
      <div className="nav-bottom">
        <ul className="nav flex-column text-center">
          <li className="nav-item my-3">
            <button
              onClick={confirmLogout}
              className="nav-link text-white btn btn-link"
            >
              <i className="bi bi-box-arrow-right fs-2"></i>
            </button>
          </li>
        </ul>
      </div>

      {/* Confirmation Modal */}
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
                <h5 className="modal-title" id="logoutModal">
                  Are you sure you want to log out?
                </h5>
              </div>
              <div className="modal-body">
                <p>Do you really want to log out?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Logout;
