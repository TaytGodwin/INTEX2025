import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/IdentityAPI';
function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const loggedOut = await logout();
      if (loggedOut) {
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {props.children}
    </a>
  );
}
export default Logout;
