import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth-service';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, Info } from 'lucide-react';

interface StaffLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const StaffLogin: React.FC<StaffLoginProps> = ({ onSuccess, redirectTo }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(formData.username, formData.password);
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      }
      // Redirect will be handled by the router
    } else {
      setError('Invalid username or password');
    }
  };

  const handleDemoLogin = async (type: 'staff' | 'admin') => {
    const credentials = type === 'staff' 
      ? { username: 'staff', password: 'custodian2024' }
      : { username: 'admin', password: 'admin2024' };
    
    setFormData(credentials);
    setError('');
    
    const success = await login(credentials.username, credentials.password);
    if (!success) {
      setError('Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
          Staff Access Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Login to access content management and strategic tools
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Demo Access Info */}
          <div className="mb-6">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 mb-3"
            >
              <Info className="h-4 w-4" />
              Demo Access Information
            </button>
            
            {showDemo && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="text-sm text-blue-800 space-y-3">
                  <div>
                    <p className="font-medium">Staff Access:</p>
                    <div className="mt-1 space-y-1">
                      <p>Username: <code className="bg-blue-100 px-1 rounded">staff</code></p>
                      <p>Password: <code className="bg-blue-100 px-1 rounded">custodian2024</code></p>
                    </div>
                    <button
                      onClick={() => handleDemoLogin('staff')}
                      className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Quick Login as Staff
                    </button>
                  </div>
                  
                  <div>
                    <p className="font-medium">Admin Access:</p>
                    <div className="mt-1 space-y-1">
                      <p>Username: <code className="bg-blue-100 px-1 rounded">admin</code></p>
                      <p>Password: <code className="bg-blue-100 px-1 rounded">admin2024</code></p>
                    </div>
                    <button
                      onClick={() => handleDemoLogin('admin')}
                      className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Quick Login as Admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Authorized personnel only
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};