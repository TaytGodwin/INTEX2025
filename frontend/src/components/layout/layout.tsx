import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login']; // add more if needed
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="layout">
      {!shouldHideNavbar && (
        <header>
          <Navbar />
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
