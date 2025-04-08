import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/theme.css';
import HomePage from './pages/HomePage';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/Admin';
import MovieDetailPage from './pages/MovieDetailPage'
import { AuthProvider } from './context/AuthContext';
import AuthorizeView from './components/authentication/AuthorizeView';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import AdminDatabasePage from './pages/AdminDatabasePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/menu" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/menu" />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movieDetails" element={<MovieDetailPage/>} />
          <Route path="/movies" element={<MoviePage/>} />
          <Route path="search" element={<SearchPage/>} />
          <Route path="/admin" element={<AdminDatabasePage />} />
          {/* Protected Routes */}
          <Route element={<AuthorizeView children={undefined} />}>
            
            {/* Add other protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;