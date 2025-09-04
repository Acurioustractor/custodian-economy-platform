import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, User } from '../services/auth-service';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    try {
      const authState = authService.getAuthState();
      if (authState.isAuthenticated && authState.user) {
        setUser(authState.user);
        
        // Auto-redirect to staff dashboard if already authenticated and on login page
        if (location.pathname === '/staff/login') {
          navigate('/staff/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await authService.login({ username, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        
        // Redirect to staff dashboard after successful login
        const from = location.state?.from?.pathname || '/staff/dashboard';
        navigate(from, { replace: true });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/staff/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = (): boolean => {
    return authService.getAuthState().isAuthenticated;
  };

  const isAdmin = (): boolean => {
    const authState = authService.getAuthState();
    return authState.isAuthenticated && authState.user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};