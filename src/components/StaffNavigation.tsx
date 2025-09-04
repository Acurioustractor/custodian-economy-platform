import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Database, 
  TrendingUp, 
  Beaker, 
  Settings, 
  GitBranch, 
  Menu, 
  X, 
  LogOut,
  User,
  Shield,
  UserCog,
  Search,
  Palette,
  ChevronDown,
  FileText,
  BarChart3,
  Image,
  BookOpen,
  FileSpreadsheet,
  MoreHorizontal,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const StaffNavigation: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  // Staff-only navigation items - streamlined to working functionality
  const navItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: TrendingUp },
    { path: '/staff/brand-hub', label: 'Brand Hub', icon: Palette },
    { path: '/staff/brand-strategy', label: 'Brand Strategy', icon: Target },
    { path: '/staff/search', label: 'Search', icon: Search },
  ];

  // More tools dropdown items
  const moreToolsItems = [
    { path: '/staff/content-library', label: 'Content Library', icon: Database },
    { path: '/staff/story-builder', label: 'Story Strategy Builder', icon: FileText },
    { path: '/staff/content', label: 'Content Management', icon: Database },
    { path: '/staff/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { path: '/staff/brand-testing', label: 'Brand Testing', icon: Beaker },
    { path: '/staff/brand-manager', label: 'Brand Manager', icon: Settings },
    { path: '/staff/version-control', label: 'Version Control', icon: GitBranch },
    { path: '/staff/media-library', label: 'Media Library', icon: Image },
    { path: '/staff/blog', label: 'Blog System', icon: BookOpen },
    { path: '/staff/prospectus', label: 'Prospectus Generator', icon: FileSpreadsheet },
  ];

  // Admin-only items - simplified
  const adminItems = [
    { path: '/staff/admin', label: 'Admin', icon: UserCog },
  ];

  const handleLogout = async () => {
    await logout();
    // Redirect will happen automatically via auth context
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreToolsOpen && !(event.target as Element).closest('.relative')) {
        setMoreToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreToolsOpen]);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/staff/dashboard" className="text-xl font-light text-white hover:text-gray-300 transition-colors">
              Staff Portal
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* More Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreToolsOpen(!moreToolsOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <MoreHorizontal size={16} />
                <span>More Tools</span>
                <ChevronDown size={14} className={`transition-transform ${moreToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {moreToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {moreToolsItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreToolsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Admin items */}
            {isAdmin() && adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-700 text-white'
                      : 'text-red-300 hover:bg-red-700 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User size={16} />
              <span className="text-sm">{user?.name}</span>
              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                {user?.role}
              </span>
            </div>
            
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              View Public Site
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              {/* User info */}
              <div className="px-4 py-2 border-b border-gray-700 mb-4">
                <div className="flex items-center space-x-2 text-gray-300 mb-2">
                  <User size={16} />
                  <span className="text-sm">{user?.name}</span>
                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Navigation items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* More Tools Section - Mobile */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="px-4 mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">More Tools</h3>
                </div>
                {moreToolsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Admin items */}
              {isAdmin() && adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-red-700 text-white'
                        : 'text-red-300 hover:bg-red-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile actions */}
              <div className="px-4 pt-4 border-t border-gray-700 space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center border border-gray-600 text-gray-300 px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-700 transition-colors"
                >
                  View Public Site
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};