import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} loading
 * @property {(email: string, password: string) => Promise<{success: boolean, error?: string}>} login
 * @property {(userData: Object) => Promise<{success: boolean, error?: string}>} register
 * @property {() => Promise<void>} logout
 * @property {(formData: FormData) => Promise<{success: boolean, error?: string}>} updateProfile
 */

/** @type {AuthContextType} */
const defaultContext = {
  user: null,
  loading: true,
  login: () => Promise.resolve({ success: false }),
  register: () => Promise.resolve({ success: false }),
  logout: () => Promise.resolve(),
  updateProfile: () => Promise.resolve({ success: false })
};

const AuthContext = createContext(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/status', {
        withCredentials: true
      });
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'An error occurred during login'
      };
    }
  };

  /**
   * @param {Object} userData
   */
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/register', userData, {
        withCredentials: true
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'An error occurred during registration'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * @param {FormData} formData
   */
  const updateProfile = async (formData) => {
    try {
      const response = await axios.patch('http://localhost:8080/api/profile', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(prev => ({ ...prev, ...response.data }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || 'An error occurred while updating profile'
      };
    }
  };
 
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext; 