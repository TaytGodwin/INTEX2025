import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import Index from './pages/Index';
import Layout from './components/layout/layout';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        {/* This will match "/menu" */}
        <Route path="menu" element={<Index />} />

        <Route path="*" element={<Navigate to="/menu" />} />{' '}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
