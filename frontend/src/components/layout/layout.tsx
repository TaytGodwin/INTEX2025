import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GuestNavBar from './GuestNavBar';
import UserNavBar from './UserNavBar';
import AdminNavBar from './AdminNavBar';
import Footer from './Footer';
import TopHeader from './TopHeader';

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Hide navbar on specific routes (e.g., /login)
  const hideNavbarRoutes = ['/login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // For routes where we hide the navbar, simply render the Outlet and Footer
  if (shouldHideNavbar) {
    return (


      <div className="layout">
        <TopHeader/>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

  // If the user is logged in as a regular user, use a vertical sidebar layout
  if (user && user.role === 'user') {
    return (
      <div className="layout d-flex">
        <aside className="side-navbar">
          <UserNavBar />
        </aside>
        <div className="main-content" style={{ marginLeft: '80px', flex: 1 }}>
          <Outlet />
          <Footer />
        </div>
      </div>
    );
  }

  // For guests or for admins, use the default header layout
  let NavBar;
  if (!user) {
    NavBar = GuestNavBar;
  } else if (user.role === 'admin') {
    NavBar = AdminNavBar;
  } else {
    // Although we covered 'user' above, you can still have a fallback
    NavBar = UserNavBar;
  }

  return (
    <div className="layout">
      <header>
        <NavBar />
      </header>
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
