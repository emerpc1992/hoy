import { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { signIn, signOut, changePassword, getCurrentUser } from '../services/firebase/auth/operations';

interface UseAuthReturn {
  isLoggedIn: boolean;
  error: string;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (username: string, currentPassword: string, newPassword: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = await signIn(username, password);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setError('');
    } catch (err) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  const updatePassword = async (username: string, currentPassword: string, newPassword: string) => {
    try {
      await changePassword(username, currentPassword, newPassword);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
      throw err;
    }
  };

  return {
    isLoggedIn,
    error,
    currentUser,
    login,
    logout,
    updatePassword,
  };
}