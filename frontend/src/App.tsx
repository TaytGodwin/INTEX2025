import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import HomePage from './pages/HomePage';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/Admin';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage'
import { AuthProvider } from './context/AuthContext';
import AuthorizeView from './components/authentication/AuthorizeView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          {/* Protected Routes */}
          <Route element={<AuthorizeView children={undefined} />}>
            <Route element={<Layout />}>
              {/* Set the default page to MoviePage */}
              <Route index element={<MoviePage />} />
              <Route path="/movies" element={<MoviePage />} />
              {/* MovieDetailPage for a specific movie */}
              <Route path="/movies/:movieId" element={<MovieDetailPage />} />
              {/* Redirect unknown paths to /movies */}
              <Route path="*" element={<Navigate to="/movies" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;