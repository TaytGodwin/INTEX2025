import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import HomePage from './pages/HomePage';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import AuthorizeView from './components/authentication/AuthorizeView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />

          {/* Protected routes */}
          <Route element={<AuthorizeView children={undefined} />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              <Route path="/menu" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/menu" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;