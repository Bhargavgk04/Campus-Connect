// API Configuration
// Uses environment variables with fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const API_URL = API_BASE_URL;
export const SOCKET_IO_URL = SOCKET_URL;

// Helper function to get full API endpoint
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Remove 'api/' prefix if already present to avoid duplication
  const finalEndpoint = cleanEndpoint.startsWith('api/') ? cleanEndpoint : `api/${cleanEndpoint}`;
  return `${API_BASE_URL}/${finalEndpoint}`;
};

export default {
  API_URL,
  SOCKET_IO_URL,
  getApiUrl,
};

