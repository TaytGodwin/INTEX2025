import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/theme.css';
import HomePage from './pages/HomePage';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import AuthorizeView from './components/authentication/AuthorizeView';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import AdminDatabasePage from './pages/AdminDatabasePage';
import Logout from './components/authentication/Logout';
import ForgotPass from './pages/ForgotPass';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="menu" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPass />} />
          </Route>

          {/* Protected Routes for all authenticated users (User and Administrator) */}
          <Route
            element={<AuthorizeView allowedRoles={['Administrator', 'User']} />}
          >
            <Route element={<Layout />}>
              <Route path="movies" element={<MoviePage />} />
              {/* <Route path="movieDetails" element={<MovieDetailPage />} />*/}
              <Route path="search" element={<SearchPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="logout" element={<Logout />} />
            </Route>
          </Route>

          {/* Protected Routes only for administrators */}
          <Route element={<AuthorizeView allowedRoles={['Administrator']} />}>
            <Route element={<Layout />}>
              <Route path="admin" element={<AdminDatabasePage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
