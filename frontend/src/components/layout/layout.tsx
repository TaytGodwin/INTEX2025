import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GuestNavBar from './GuestNavBar';
import UserNavBar from './UserNavBar';
import AdminNavBar from './AdminNavBar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Determine which navbar to render based on user's auth state
  let NavBar;
  if (!user) {
    NavBar = GuestNavBar;
  } else if (user.role === 'admin') {
    NavBar = AdminNavBar;
  } else {
    NavBar = UserNavBar;
  }

  // Optionally hide the navbar on specific routes (e.g., login)
  const hideNavbarRoutes = ['/login']; // add more routes if needed
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="layout">
      {!shouldHideNavbar && (
        <header>
          <NavBar />
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;