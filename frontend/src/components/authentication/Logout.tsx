import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../../api/IdentityAPI';
import { useAuth } from '../../context/AuthContext';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
  );
}

export default Logout;
