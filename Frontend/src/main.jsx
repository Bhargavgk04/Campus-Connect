import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Ensure all axios requests send credentials (cookies) by default
axios.defaults.withCredentials = true;
// Set Authorization header from stored token on app boot
const storedToken = localStorage.getItem('authToken');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

// Get the root element and ensure it exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
); 