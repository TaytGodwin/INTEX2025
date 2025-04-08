import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/theme.css';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This is the javascript
import { AuthProvider } from './context/AuthContext.tsx'; //This is helping to authenticate, if there's an autheticated user 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
