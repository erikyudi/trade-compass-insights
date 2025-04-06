
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  setNewPassword: (token: string, password: string) => Promise<void>;
};

// Mock data for now - will be replaced with real auth later
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    role: 'mentored',
    mentorId: '1',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Mentor User',
    email: 'mentor@example.com',
    role: 'mentor',
    createdAt: new Date()
  }
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tradeAppUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock authentication - will be replaced with real auth
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === '123456') { // Mock password check
        setUser(foundUser);
        localStorage.setItem('tradeAppUser', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tradeAppUser');
  };

  // Mock reset password functionality
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email exists - in a real app, we wouldn't reveal this
      const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userExists) {
        // In a real app, we would still return success even if email doesn't exist
        // to prevent email enumeration attacks
        console.log('User not found, but returning success for security');
      }
      
      // In a real app, this would send an email with a reset link
      console.log(`Reset password requested for ${email}`);
      
      return;
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock set new password functionality
  const setNewPassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, we would validate the token and update the password
      console.log(`Setting new password with token ${token}`);
      
      if (!token || token.length < 10) {
        throw new Error('Invalid token');
      }
      
      return;
    } catch (err: any) {
      setError(err.message || 'Setting new password failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      error,
      resetPassword,
      setNewPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
