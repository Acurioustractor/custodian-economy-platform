import React, { useState, useEffect } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, Clock, Database, HardDrive } from 'lucide-react';

interface BackupRecord {
  id: string;
  date: Date;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
  description: string;
}

interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  includeFiles: boolean;
  includeDatabase: boolean;
  compressBackups: boolean;
}

const BackupManagement: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackupEnabled: false,
    frequency: 'weekly',
    retentionDays: 30,
    includeFiles: true,
    includeDatabase: true,
    compressBackups: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = async () => {
    try {
      // Mock backup history data
      const mockBackups: BackupRecord[] = [
        {
          id: 'backup_001',
          date: new Date(Date.now() - 86400000), // 1 day ago
          size: '245 MB',
          type: 'auto',
          status: 'completed',
          description: 'Automated weekly backup'
        },
        {
          id: 'backup_002',
          date: new Date(Date.now() - 604800000), // 1 week ago
          size: '238 MB',
          type: 'manual',
          status: 'completed',
          description: 'Manual backup before system update'
        },
        {
          id: 'backup_003',
          date: new Date(Date.now() - 1209600000), // 2 weeks ago
          size: '221 MB',
          type: 'auto',
          status: 'completed',
          description: 'Automated weekly backup'
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      setError('Failed to load backup history');
    }
  };

  const createBackup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup: BackupRecord = {
        id: `backup_${Date.now()}`,
        date: new Date(),
        size: '251 MB',
        type: 'manual',
        status: 'completed',
        description: 'Manual backup created by admin'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setSuccess('Backup created successfully');
    } catch (error) {
      setError('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuccess(`Backup ${backupId} restored successfully`);
    } catch (error) {
      setError('Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackup = async (backupId: string) => {
    try {
      console.log(`Downloading backup: ${backupId}`);
      setSuccess(`Backup ${backupId} download started`);
    } catch (error) {
      setError('Failed to download backup');
    }
  };

  const updateSettings = async (newSettings: Partial<BackupSettings>) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      setSuccess('Backup settings updated successfully');
    } catch (error) {
      setError('Failed to update backup settings');
    }
  };

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Backup Management</h3>
          <p className="text-sm text-gray-600">Manage system backups and restore points</p>
        </div>
        <button
          onClick={createBackup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Backup Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Backup Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoBackupEnabled}
                onChange={(e) => updateSettings({ autoBackupEnabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable automatic backups</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Frequency
            </label>
            <select
              value={settings.frequency}
              onChange={(e) => updateSettings({ frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retention Period (days)
            </label>
            <input
              type="number"
              value={settings.retentionDays}
              onChange={(e) => updateSettings({ retentionDays: parseInt(e.target.value) })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="365"
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.includeFiles}
                onChange={(e) => updateSettings({ includeFiles: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include uploaded files</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.includeDatabase}
                onChange={(e) => updateSettings({ includeDatabase: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include database</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.compressBackups}
                onChange={(e) => updateSettings({ compressBackups: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Compress backups</span>
            </label>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900">Backup History</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(backup.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {backup.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      backup.type === 'auto' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {backup.type === 'auto' ? 'Automatic' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {backup.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadBackup(backup.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Download backup"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {backup.status === 'completed' && (
                        <button
                          onClick={() => restoreBackup(backup.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-800 disabled:text-gray-400 transition-colors"
                          title="Restore from backup"
                        >
                          <Database className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {backups.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            <HardDrive className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No backups found</p>
            <p className="text-sm">Create your first backup to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManagement;