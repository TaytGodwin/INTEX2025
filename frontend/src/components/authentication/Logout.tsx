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
          style={{
            display: 'block',
            backgroundColor: '#151515',
          }}
          tabIndex={-1}
          aria-labelledby="logoutModal"
          aria-hidden="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-dialog" style={{ maxWidth: '400px' }}>
            <div className="modal-content" 
            style={{
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="modal-header"
              style={{
                backgroundColor: '#57c8f4',
                color: '#fff',
                padding: '1rem 1.5rem',
              }}
            >
                <h5 className="modal-title" id="logoutModal">
                  Are you sure you want to log out?
                </h5>
              </div>
              <div className="modal-body"
                  style={{
                      backgroundColor: '#fff',
                      color: '#333',
                      padding: '1.5rem',
                    }}
                  >
                <p>Do you really want to log out?</p>
              </div>
              <div
                className="modal-footer"
                style={{
                  backgroundColor: '#151515',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#ccc',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#d9534f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
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
