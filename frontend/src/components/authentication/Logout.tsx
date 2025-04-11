import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../../api/IdentityAPI';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

type LogoutProps = {
  setShowCookieModal: (show: boolean) => void;
};

const Logout: React.FC<LogoutProps> = ({ setShowCookieModal }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [fadeOut, setFadeOut] = useState(false);

  const handleLogout = async () => {
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

  const handleLogoutClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      handleLogout();
      setShowCookieModal(false);
    }, 500); // Duration matches the CSS transition below
  };
  // Function to close the modal without logging out
 
  const closeModal = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowCookieModal(false);
    }, 500);
  };

  // Display THe logout modal
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1050,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        animation: 'slideDown 1s ease-out',
      }}
      tabIndex={-1}
      aria-labelledby="logoutModal"
      aria-hidden="true"
      onClick={(e) => e.stopPropagation()}
    >
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%) translateX(-50%);
              opacity: 0;
            }
            to {
              transform: translateY(0) translateX(-50%);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={{ maxWidth: '400px' }}>
        <div
          style={{
            width: '400px',
            height: 'auto',
            backgroundColor: 'rgba(21,21,21,0.9)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(87,200,244,0.9)',
              padding: '1.2rem',
            }}
          >
            <h5 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
              Are you sure you want to log out?
            </h5>
          </div>
        
          <div
            style={{
              padding: '0.75rem 1.2rem',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(32,32,32,0.9)',
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              style={{
                backgroundColor: '#ccc',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogoutClick}
              style={{
                backgroundColor: '#d9534f',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginLeft: '0.5rem',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;