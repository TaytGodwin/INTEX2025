import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import HomePage from './pages/HomePage';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/Admin';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          {/* This will match "/menu" "/terms-of-use"*/}
          <Route path="/menu" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/menu" />} />{' '}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
