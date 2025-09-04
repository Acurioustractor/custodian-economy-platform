// Admin Panel - Comprehensive administration interface for user management, system settings, and data export
// Provides full system administration capabilities for admin users

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Download, 
  Database, 
  Activity, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useMetrics } from '../contexts/MetricsContext';
import { authService } from '../services/auth-service';
import { apiService } from '../services/api-service';
import { databaseService } from '../services/database-service';
import { validationService } from '../services/validation-service';
import { errorHandlingService } from '../services/error-handling-service';
import { emailNotificationService } from '../services/email-notification-service';
import { dataExportService, ExportOptions } from '../services/data-export-service';
import BackupManagement from './BackupManagement';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'staff' | 'admin';
  permissions: string[];
  name: string;
  lastLogin: Date;
  createdAt: Date;
  status: 'active' | 'suspended' | 'pending';
}

interface SystemSettings {
  siteName: string;
  adminEmail: string;
  dataRetentionDays: number;
  maxFileSize: number;
  allowedFileTypes: string[];
  enableEmailNotifications: boolean;
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  brandAnalysisEnabled: boolean;
  aiAnalysisEnabled: boolean;
}

export const AdminPanel: React.FC = () => {
  const { metrics } = useMetrics();
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'export' | 'backup' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User Management State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    name: '',
    role: 'staff' as 'staff' | 'admin',
    permissions: [] as string[]
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Custodian Economy Staff Portal',
    adminEmail: 'admin@custodianeconomy.org',
    dataRetentionDays: 365,
    maxFileSize: 50,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'doc', 'docx'],
    enableEmailNotifications: true,
    enableAutoBackup: false,
    backupFrequency: 'weekly',
    brandAnalysisEnabled: true,
    aiAnalysisEnabled: true
  });

  // Export State
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    type: 'csv',
    dateRange: 'last_month',
    includeMetrics: true,
    includeActivities: true,
    includeUsers: false,
    includeContent: true,
    includeBrandAnalysis: true,
    includeTestResults: true,
    template: 'stakeholder'
  });

  // System Status State
  const [systemStatus, setSystemStatus] = useState({
    database: { connected: false, type: 'localStorage' as 'supabase' | 'localStorage' },
    lastBackup: null as Date | null,
    totalUsers: 0,
    totalContent: 0,
    systemHealth: 'good' as 'good' | 'warning' | 'error'
  });

  useEffect(() => {
    if (authService.isAdmin()) {
      loadUsers();
      loadSystemStatus();
    }
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      if (response.success && response.data) {
        // Map DatabaseUser to User with status field
        const mappedUsers: User[] = response.data.map(dbUser => ({
          ...dbUser,
          status: 'active' as const // Default status for existing users
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const statusResponse = await apiService.getSystemStatus();
      if (statusResponse.success && statusResponse.data) {
        setSystemStatus(prev => ({
          ...prev,
          database: statusResponse.data.database,
          totalUsers: users.length,
          totalContent: metrics?.contentItems || 0
        }));
      }
    } catch (error) {
      console.warn('Failed to load system status:', error);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate user data
      const validation = validationService.validate(newUser, 'register', 'auth');
      if (!validation.isValid) {
        setError(validationService.formatErrors(validation.errors).join(', '));
        return;
      }

      // Create user (mock implementation)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userToAdd: User = {
        id: userId,
        ...newUser,
        lastLogin: new Date(),
        createdAt: new Date(),
        status: 'active'
      };

      setUsers(prev => [...prev, userToAdd]);
      setNewUser({
        username: '',
        email: '',
        name: '',
        role: 'staff',
        permissions: []
      });
      setShowAddUser(false);
      setSuccess('User created successfully');

      // Log activity
      await apiService.logSystemActivity(`Admin created new user: ${userToAdd.username}`);
      
      // Send notification for admin-level user creation
      if (userToAdd.role === 'admin') {
        await emailNotificationService.notifySystemAlert({
          level: 'medium',
          title: 'New Admin User Created',
          component: 'User Management',
          description: `A new admin user '${userToAdd.username}' (${userToAdd.email}) has been created by ${authService.getAuthState().user?.name || 'Unknown Admin'}`,
          actionRequired: false
        });
      }
      
    } catch (error) {
      const appError = errorHandlingService.handleError(error);
      setError(appError.message);
      
      // Send error notification
      await emailNotificationService.notifySystemAlert({
        level: 'medium',
        title: 'User Creation Failed',
        component: 'User Management',
        description: `Failed to create user '${newUser.username}': ${appError.message}`,
        actionRequired: true,
        actionDescription: 'Check user data validation and retry operation'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'staff' | 'admin') => {
    setLoading(true);
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setSuccess(`User role updated to ${newRole}`);
      
      // Log activity
      await apiService.logSystemActivity(`Admin updated user role: ${userId} -> ${newRole}`);
      
    } catch (error) {
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSuccess('User deleted successfully');
      
      // Log activity
      await apiService.logSystemActivity(`Admin deleted user: ${userId}`);
      
    } catch (error) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save settings (mock implementation)
      setSuccess('Settings saved successfully');
      
      // Log activity
      await apiService.logSystemActivity('Admin updated system settings');
      
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dataExportService.exportData(exportOptions);
      
      if (result.success) {
        setSuccess(`Data exported successfully as ${exportOptions.type.toUpperCase()}: ${result.filename}`);
        
        // Send email notification for export
        await emailNotificationService.notifySystemAlert({
          level: 'low',
          title: 'Data Export Completed',
          component: 'Admin Panel',
          description: `Admin user ${authService.getAuthState().user?.name || 'Unknown'} completed data export: ${result.filename}`,
          actionRequired: false
        });
      } else {
        setError(result.error || 'Export failed');
      }
      
    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'exportData' });
      setError(appError.message);
      
      // Send error notification
      await emailNotificationService.notifySystemAlert({
        level: 'medium',
        title: 'Data Export Failed',
        component: 'Admin Panel',
        description: `Data export operation failed: ${appError.message}`,
        actionRequired: true,
        actionDescription: 'Check export settings and retry operation'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStakeholderReport = async () => {
    setLoading(true);
    try {
      const stakeholderOptions: ExportOptions = {
        ...exportOptions,
        type: 'pdf',
        template: 'stakeholder',
        includeMetrics: true,
        includeActivities: true,
        includeContent: true,
        includeBrandAnalysis: true,
        includeTestResults: true
      };
      
      const result = await dataExportService.exportData(stakeholderOptions);
      
      if (result.success) {
        setSuccess(`Stakeholder report generated successfully: ${result.filename}`);
      } else {
        setError(result.error || 'Report generation failed');
      }
      
    } catch (error) {
      setError('Failed to generate stakeholder report');
    } finally {
      setLoading(false);
    }
  };



  const handleClearAllData = async () => {
    if (!confirm('WARNING: This will permanently delete all data. Are you sure?')) return;
    if (!confirm('This action cannot be undone. Type CONFIRM to proceed.')) return;
    
    setLoading(true);
    try {
      // Send system alert notification before clearing data
      await emailNotificationService.notifySystemAlert({
        level: 'critical',
        title: 'Data Deletion Initiated',
        component: 'Admin Panel',
        description: `Admin user ${authService.getAuthState().user?.name || 'Unknown'} initiated complete data deletion at ${new Date().toLocaleString()}`,
        actionRequired: false
      });

      await apiService.clearAllData();
      setSuccess('All data cleared successfully');
      
      // Send confirmation notification
      await emailNotificationService.notifySystemAlert({
        level: 'high',
        title: 'Data Deletion Completed',
        component: 'Admin Panel',
        description: 'All system data has been permanently deleted. System reset to initial state.',
        actionRequired: false
      });
      
      // Reload data
      loadUsers();
      loadSystemStatus();
      
    } catch (error) {
      setError('Failed to clear data');
      
      // Send error notification
      await emailNotificationService.notifySystemAlert({
        level: 'high',
        title: 'Data Deletion Failed',
        component: 'Admin Panel',
        description: `Data deletion operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        actionRequired: true,
        actionDescription: 'Check system logs and retry operation or contact technical support'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authService.isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, system settings, and data exports</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'users', label: 'User Management', icon: Users },
                { key: 'settings', label: 'System Settings', icon: Settings },
                { key: 'export', label: 'Data Export', icon: Download },
                { key: 'backup', label: 'Backup & Recovery', icon: Database },
                { key: 'system', label: 'System Status', icon: Activity }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'staff' | 'admin')}
                            className="text-sm border-gray-300 rounded-md"
                          >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                    <input
                      type="email"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (Days)</label>
                    <input
                      type="number"
                      value={systemSettings.dataRetentionDays}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, dataRetentionDays: parseInt(e.target.value) }))}
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                    <input
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                      className="w-full border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Feature Toggles</h3>
                  
                  {[
                    { key: 'enableEmailNotifications', label: 'Email Notifications' },
                    { key: 'enableAutoBackup', label: 'Automatic Backups' },
                    { key: 'brandAnalysisEnabled', label: 'Brand DNA Analysis' },
                    { key: 'aiAnalysisEnabled', label: 'AI-Powered Analysis' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings[key as keyof SystemSettings] as boolean}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="mr-3"
                      />
                      <label className="text-sm text-gray-700">{label}</label>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Data Export & Reports</h2>
              
              <div className="space-y-8">
                {/* Quick Export Section */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Quick Export</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <button
                      onClick={() => { setExportOptions(prev => ({ ...prev, type: 'csv', template: 'technical' })); handleExportData(); }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      📊 Export CSV
                    </button>
                    <button
                      onClick={() => { setExportOptions(prev => ({ ...prev, type: 'json', template: 'technical' })); handleExportData(); }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      📄 Export JSON
                    </button>
                    <button
                      onClick={handleGenerateStakeholderReport}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                      📋 Stakeholder Report
                    </button>
                    <button
                      onClick={() => { setExportOptions(prev => ({ ...prev, type: 'excel', template: 'executive' })); handleExportData(); }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                    >
                      📈 Excel Report
                    </button>
                  </div>
                </div>

                {/* Detailed Export Configuration */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-6">Custom Export Configuration</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                        <select
                          value={exportOptions.type}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full border-gray-300 rounded-md"
                        >
                          <option value="csv">CSV (Excel Compatible)</option>
                          <option value="json">JSON (Technical)</option>
                          <option value="pdf">PDF (Stakeholder Report)</option>
                          <option value="excel">Excel Workbook</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Template</label>
                        <select
                          value={exportOptions.template}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, template: e.target.value as any }))}
                          className="w-full border-gray-300 rounded-md"
                        >
                          <option value="stakeholder">Stakeholder Report</option>
                          <option value="executive">Executive Summary</option>
                          <option value="technical">Technical Data Export</option>
                          <option value="custom">Custom Export</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select
                          value={exportOptions.dateRange}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value as any }))}
                          className="w-full border-gray-300 rounded-md"
                        >
                          <option value="all">All Time</option>
                          <option value="last_week">Last Week</option>
                          <option value="last_month">Last Month</option>
                          <option value="last_quarter">Last Quarter</option>
                          <option value="last_year">Last Year</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                    </div>

                    {exportOptions.dateRange === 'custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            value={exportOptions.customStartDate || ''}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, customStartDate: e.target.value }))}
                            className="w-full border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={exportOptions.customEndDate || ''}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, customEndDate: e.target.value }))}
                            className="w-full border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-lg font-medium mb-4">Include Data Types</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { key: 'includeMetrics', label: 'System Metrics', desc: 'Performance indicators and KPIs' },
                          { key: 'includeActivities', label: 'Activity Logs', desc: 'User actions and system events' },
                          { key: 'includeUsers', label: 'User Data', desc: 'Staff and admin information' },
                          { key: 'includeContent', label: 'Content Data', desc: 'Stories, media, and analysis' },
                          { key: 'includeBrandAnalysis', label: 'Brand Analysis', desc: 'Brand DNA scores and insights' },
                          { key: 'includeTestResults', label: 'Test Results', desc: 'A/B testing outcomes' }
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="border border-gray-200 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                checked={exportOptions[key as keyof ExportOptions] as boolean}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                                className="mr-3"
                              />
                              <label className="text-sm font-medium text-gray-900">{label}</label>
                            </div>
                            <p className="text-xs text-gray-600">{desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex gap-4">
                        <button
                          onClick={handleExportData}
                          disabled={loading}
                          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 flex items-center disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {loading ? 'Generating...' : 'Generate Export'}
                        </button>
                        
                        <button
                          onClick={handleGenerateStakeholderReport}
                          disabled={loading}
                          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 flex items-center disabled:opacity-50"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Generate Stakeholder Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Templates Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Report Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-800">📋 Stakeholder Report</h5>
                      <p className="text-gray-600">Executive summary with key metrics, brand health analysis, and strategic recommendations.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">📊 Technical Export</h5>
                      <p className="text-gray-600">Raw data export for analysis, integration, or backup purposes.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">💼 Executive Summary</h5>
                      <p className="text-gray-600">High-level overview focused on business impact and ROI metrics.</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800">🔧 Custom Export</h5>
                      <p className="text-gray-600">Flexible format with custom data selection and date ranges.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <BackupManagement />
          )}

          {activeTab === 'system' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">System Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Database</h3>
                      <p className="text-sm text-gray-600">
                        {systemStatus.database.type} • {systemStatus.database.connected ? 'Connected' : 'Disconnected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Users</h3>
                      <p className="text-sm text-gray-600">{systemStatus.totalUsers} active users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Content</h3>
                      <p className="text-sm text-gray-600">{systemStatus.totalContent} items</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-red-200">
                <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete all system data. This action cannot be undone.
                </p>
                <button
                  onClick={handleClearAllData}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};