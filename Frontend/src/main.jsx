import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Get the root element and ensure it exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />); 