// Automated Backup and Data Recovery Service
// Provides comprehensive backup, restoration, and disaster recovery capabilities

import { apiService } from './api-service';
import { databaseService } from './database-service';
import { authService } from './auth-service';
import { validationService } from './validation-service';
import { errorHandlingService } from './error-handling-service';
import { emailNotificationService } from './email-notification-service';

export interface BackupConfiguration {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  includedDataTypes: string[];
  encryptionEnabled: boolean;
  cloudStorage?: {
    provider: 'aws' | 'gcp' | 'azure' | 'local';
    bucket?: string;
    credentials?: any;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    emailList: string[];
  };
}

export interface BackupMetadata {
  id: string;
  timestamp: Date;
  size: number;
  checksum: string;
  dataTypes: string[];
  version: string;
  compression: string;
  encryption: boolean;
  status: 'creating' | 'completed' | 'failed' | 'corrupted';
  createdBy: string;
  description?: string;
}

export interface RestoreOptions {
  backupId: string;
  selectiveRestore?: {
    dataTypes?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    userIds?: string[];
  };
  validateBeforeRestore: boolean;
  createBackupBeforeRestore: boolean;
  dryRun?: boolean;
}

export interface RecoveryReport {
  backupId: string;
  startTime: Date;
  endTime: Date;
  status: 'success' | 'partial' | 'failed';
  restoredItems: {
    dataType: string;
    count: number;
    errors: string[];
  }[];
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  warnings: string[];
  errors: string[];
}

class BackupRecoveryService {
  private config: BackupConfiguration;
  private scheduledBackupId: number | null = null;
  private backupHistory: BackupMetadata[] = [];

  constructor() {
    this.config = this.loadConfiguration();
    this.initializeService();
  }

  /**
   * Initialize the backup service and start scheduled backups
   */
  private async initializeService(): Promise<void> {
    await this.loadBackupHistory();
    
    if (this.config.enabled) {
      this.scheduleAutomaticBackups();
    }

    // Clean up old backups based on retention policy
    await this.cleanupOldBackups();
  }

  /**
   * Update backup configuration
   */
  async updateConfiguration(newConfig: Partial<BackupConfiguration>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfiguration();

    // Restart scheduled backups with new configuration
    if (this.scheduledBackupId) {
      clearInterval(this.scheduledBackupId);
      this.scheduledBackupId = null;
    }

    if (this.config.enabled) {
      this.scheduleAutomaticBackups();
    }

    await apiService.logSystemActivity(
      'Backup configuration updated by ' + (authService.getAuthState().user?.name || 'System')
    );
  }

  /**
   * Create a manual backup
   */
  async createBackup(description?: string): Promise<{ success: boolean; backupId?: string; error?: string }> {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = authService.getAuthState().user;

      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date(),
        size: 0,
        checksum: '',
        dataTypes: this.config.includedDataTypes,
        version: '1.0',
        compression: 'gzip',
        encryption: this.config.encryptionEnabled,
        status: 'creating',
        createdBy: user?.name || 'System',
        description
      };

      // Add to backup history
      this.backupHistory.push(metadata);
      await this.saveBackupHistory();

      // Collect all data
      const backupData = await this.collectBackupData();

      // Compress and encrypt if configured
      const processedData = await this.processBackupData(backupData);

      // Calculate size and checksum
      metadata.size = this.calculateDataSize(processedData);
      metadata.checksum = await this.calculateChecksum(processedData);

      // Store backup
      await this.storeBackup(backupId, processedData);

      // Update metadata
      metadata.status = 'completed';
      await this.updateBackupMetadata(metadata);

      // Send notification
      if (this.config.notifications.onSuccess) {
        await this.notifyBackupSuccess(metadata);
      }

      await apiService.logSystemActivity(
        `Backup created successfully: ${backupId} (${this.formatFileSize(metadata.size)})`
      );

      return { success: true, backupId };

    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'createBackup' });
      
      // Send failure notification
      if (this.config.notifications.onFailure) {
        await this.notifyBackupFailure(appError.message);
      }

      return { success: false, error: appError.message };
    }
  }

  /**
   * Restore data from backup
   */
  async restoreFromBackup(options: RestoreOptions): Promise<RecoveryReport> {
    const startTime = new Date();
    const report: RecoveryReport = {
      backupId: options.backupId,
      startTime,
      endTime: new Date(),
      status: 'failed',
      restoredItems: [],
      totalItems: 0,
      successfulItems: 0,
      failedItems: 0,
      warnings: [],
      errors: []
    };

    try {
      // Validate backup exists and is accessible
      const backup = await this.getBackup(options.backupId);
      if (!backup) {
        throw new Error(`Backup ${options.backupId} not found`);
      }

      // Create safety backup if requested
      if (options.createBackupBeforeRestore) {
        const safetyBackup = await this.createBackup('Pre-restore safety backup');
        if (!safetyBackup.success) {
          report.warnings.push('Failed to create safety backup before restore');
        }
      }

      // Load and validate backup data
      const backupData = await this.loadBackupData(options.backupId);
      const validationResult = await this.validateBackupData(backupData);
      
      if (!validationResult.isValid) {
        throw new Error(`Backup validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Perform dry run if requested
      if (options.dryRun) {
        report.status = 'success';
        report.warnings.push('Dry run mode - no data was actually restored');
        return report;
      }

      // Process restoration
      for (const dataType of Object.keys(backupData)) {
        if (options.selectiveRestore?.dataTypes && 
            !options.selectiveRestore.dataTypes.includes(dataType)) {
          continue;
        }

        const itemReport = await this.restoreDataType(dataType, backupData[dataType], options);
        report.restoredItems.push(itemReport);
        report.totalItems += itemReport.count;
        report.successfulItems += itemReport.count - itemReport.errors.length;
        report.failedItems += itemReport.errors.length;
      }

      report.status = report.failedItems === 0 ? 'success' : 
                     report.successfulItems > 0 ? 'partial' : 'failed';

      await apiService.logSystemActivity(
        `Data restored from backup ${options.backupId}: ${report.successfulItems}/${report.totalItems} items`
      );

      // Send notification
      await this.notifyRestoreComplete(report);

    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'restoreFromBackup' });
      report.errors.push(appError.message);
      report.status = 'failed';
    }

    report.endTime = new Date();
    return report;
  }

  /**
   * List available backups
   */
  getBackupHistory(): BackupMetadata[] {
    return this.backupHistory
      .filter(backup => backup.status === 'completed')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove from storage
      await this.removeBackupFromStorage(backupId);

      // Remove from history
      this.backupHistory = this.backupHistory.filter(b => b.id !== backupId);
      await this.saveBackupHistory();

      await apiService.logSystemActivity(`Backup deleted: ${backupId}`);
      return { success: true };

    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'deleteBackup' });
      return { success: false, error: appError.message };
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupId: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const backup = this.backupHistory.find(b => b.id === backupId);
      if (!backup) {
        return { valid: false, errors: ['Backup not found'] };
      }

      const data = await this.loadBackupData(backupId);
      const currentChecksum = await this.calculateChecksum(data);

      if (currentChecksum !== backup.checksum) {
        return { valid: false, errors: ['Checksum mismatch - backup may be corrupted'] };
      }

      const validation = await this.validateBackupData(data);
      return { valid: validation.isValid, errors: validation.errors };

    } catch (error) {
      return { valid: false, errors: [error instanceof Error ? error.message : 'Unknown error'] };
    }
  }

  /**
   * Get backup configuration
   */
  getConfiguration(): BackupConfiguration {
    return { ...this.config };
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStatistics(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup?: Date;
    newestBackup?: Date;
    averageSize: number;
  }> {
    const completedBackups = this.backupHistory.filter(b => b.status === 'completed');
    const totalSize = completedBackups.reduce((sum, backup) => sum + backup.size, 0);

    return {
      totalBackups: completedBackups.length,
      totalSize,
      oldestBackup: completedBackups.length > 0 ? 
        new Date(Math.min(...completedBackups.map(b => b.timestamp.getTime()))) : undefined,
      newestBackup: completedBackups.length > 0 ? 
        new Date(Math.max(...completedBackups.map(b => b.timestamp.getTime()))) : undefined,
      averageSize: completedBackups.length > 0 ? totalSize / completedBackups.length : 0
    };
  }

  // Private methods

  private async collectBackupData(): Promise<any> {
    const data: any = {};

    if (this.config.includedDataTypes.includes('metrics')) {
      const metricsResponse = await apiService.getMetrics();
      data.metrics = metricsResponse.data;
    }

    if (this.config.includedDataTypes.includes('activities')) {
      const activitiesResponse = await apiService.getActivities();
      data.activities = activitiesResponse.data;
    }

    if (this.config.includedDataTypes.includes('content')) {
      const contentResponse = await apiService.getContent();
      data.content = contentResponse.data;
    }

    if (this.config.includedDataTypes.includes('users')) {
      const usersResponse = await apiService.getUsers();
      data.users = usersResponse.data;
    }

    if (this.config.includedDataTypes.includes('brandTests')) {
      const testsResponse = await apiService.getBrandTests();
      data.brandTests = testsResponse.data;
    }

    if (this.config.includedDataTypes.includes('settings')) {
      data.settings = {
        backupConfig: this.config,
        systemSettings: await this.getSystemSettings()
      };
    }

    return data;
  }

  private async processBackupData(data: any): Promise<string> {
    let processedData = JSON.stringify(data);

    // Encrypt data if enabled
    if (this.config.encryptionEnabled) {
      processedData = await this.encryptData(processedData);
    }

    return processedData;
  }

  private async storeBackup(backupId: string, data: string): Promise<void> {
    // Store locally first
    localStorage.setItem(`custodian_backup_${backupId}`, data);

    // Upload to cloud storage if configured
    if (this.config.cloudStorage?.provider && this.config.cloudStorage.provider !== 'local') {
      await this.uploadToCloudStorage(backupId, data);
    }
  }

  private async uploadToCloudStorage(backupId: string, data: string): Promise<void> {
    // Mock implementation - in production, would integrate with actual cloud providers
    console.log(`Uploading backup ${backupId} to ${this.config.cloudStorage?.provider}`);
  }

  private scheduleAutomaticBackups(): void {
    const intervalMap = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    const interval = intervalMap[this.config.frequency];
    
    this.scheduledBackupId = window.setInterval(async () => {
      await this.createBackup('Scheduled automatic backup');
    }, interval);
  }

  private async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    const backupsToDelete = this.backupHistory.filter(
      backup => backup.timestamp < cutoffDate && backup.status === 'completed'
    );

    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup.id);
    }
  }

  private loadConfiguration(): BackupConfiguration {
    try {
      const stored = localStorage.getItem('custodian_backup_config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load backup configuration:', error);
    }

    // Default configuration
    return {
      enabled: true,
      frequency: 'daily',
      retentionDays: 30,
      includedDataTypes: ['metrics', 'activities', 'content', 'users', 'brandTests'],
      encryptionEnabled: true,
      cloudStorage: {
        provider: 'local'
      },
      notifications: {
        onSuccess: true,
        onFailure: true,
        emailList: ['admin@custodianeconomy.com']
      }
    };
  }

  private async saveConfiguration(): Promise<void> {
    localStorage.setItem('custodian_backup_config', JSON.stringify(this.config));
  }

  private async loadBackupHistory(): Promise<void> {
    try {
      const stored = localStorage.getItem('custodian_backup_history');
      if (stored) {
        this.backupHistory = JSON.parse(stored).map((backup: any) => ({
          ...backup,
          timestamp: new Date(backup.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load backup history:', error);
      this.backupHistory = [];
    }
  }

  private async saveBackupHistory(): Promise<void> {
    localStorage.setItem('custodian_backup_history', JSON.stringify(this.backupHistory));
  }

  private calculateDataSize(data: string): number {
    return new Blob([data]).size;
  }

  private async calculateChecksum(data: string | any): Promise<string> {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async compressData(data: string): Promise<string> {
    // Mock compression - in production, would use actual compression library
    return btoa(data);
  }

  private async encryptData(data: string): Promise<string> {
    // Mock encryption - in production, would use actual encryption
    return btoa(data);
  }

  private async getBackup(backupId: string): Promise<BackupMetadata | null> {
    return this.backupHistory.find(b => b.id === backupId) || null;
  }

  private async loadBackupData(backupId: string): Promise<any> {
    const data = localStorage.getItem(`custodian_backup_${backupId}`);
    if (!data) {
      throw new Error(`Backup data not found: ${backupId}`);
    }

    // Decrypt if necessary
    let processedData = data;
    if (this.config.encryptionEnabled) {
      processedData = await this.decryptData(processedData);
    }

    return JSON.parse(processedData);
  }

  private async decryptData(data: string): Promise<string> {
    // Mock decryption
    return atob(data);
  }

  private async decompressData(data: string): Promise<string> {
    // Mock decompression
    return atob(data);
  }

  private async validateBackupData(data: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Invalid backup data format');
    }

    // Validate each data type
    for (const dataType of this.config.includedDataTypes) {
      if (data[dataType] === undefined) {
        errors.push(`Missing data type: ${dataType}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  private async restoreDataType(
    dataType: string, 
    data: any[], 
    options: RestoreOptions
  ): Promise<{ dataType: string; count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      switch (dataType) {
        case 'metrics':
          await this.restoreMetrics(data);
          count = 1;
          break;
        case 'activities':
          count = await this.restoreActivities(data, options);
          break;
        case 'content':
          count = await this.restoreContent(data, options);
          break;
        case 'users':
          count = await this.restoreUsers(data, options);
          break;
        case 'brandTests':
          count = await this.restoreBrandTests(data, options);
          break;
        default:
          errors.push(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      errors.push(`Failed to restore ${dataType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { dataType, count, errors };
  }

  private async restoreMetrics(data: any): Promise<void> {
    // Restore metrics data
    localStorage.setItem('custodian_metrics', JSON.stringify(data));
  }

  private async restoreActivities(data: any[], options: RestoreOptions): Promise<number> {
    // Filter by date range if specified
    let filteredData = data;
    if (options.selectiveRestore?.dateRange) {
      filteredData = data.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= options.selectiveRestore!.dateRange!.start &&
               activityDate <= options.selectiveRestore!.dateRange!.end;
      });
    }

    // Restore activities
    localStorage.setItem('custodian_activities', JSON.stringify(filteredData));
    return filteredData.length;
  }

  private async restoreContent(data: any[], options: RestoreOptions): Promise<number> {
    // Mock content restoration
    return data.length;
  }

  private async restoreUsers(data: any[], options: RestoreOptions): Promise<number> {
    // Filter by user IDs if specified
    let filteredData = data;
    if (options.selectiveRestore?.userIds) {
      filteredData = data.filter(user => 
        options.selectiveRestore!.userIds!.includes(user.id)
      );
    }

    // Mock user restoration
    return filteredData.length;
  }

  private async restoreBrandTests(data: any[], options: RestoreOptions): Promise<number> {
    // Mock brand tests restoration
    return data.length;
  }

  private async updateBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const index = this.backupHistory.findIndex(b => b.id === metadata.id);
    if (index !== -1) {
      this.backupHistory[index] = metadata;
      await this.saveBackupHistory();
    }
  }

  private async removeBackupFromStorage(backupId: string): Promise<void> {
    localStorage.removeItem(`custodian_backup_${backupId}`);
    // Also remove from cloud storage if configured
  }

  private async getSystemSettings(): Promise<any> {
    // Mock system settings
    return {
      version: '1.0.0',
      environment: 'production'
    };
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  private async notifyBackupSuccess(metadata: BackupMetadata): Promise<void> {
    await emailNotificationService.notifySystemAlert({
      level: 'low',
      title: 'Backup Completed Successfully',
      component: 'Backup System',
      description: `Backup ${metadata.id} completed successfully`,
      actionRequired: false
    });
  }

  private async notifyBackupFailure(error: string): Promise<void> {
    await emailNotificationService.notifySystemAlert({
      level: 'high',
      title: 'Backup Failed',
      component: 'Backup System',
      description: `Automated backup failed: ${error}`,
      actionRequired: true
    });
  }

  private async notifyRestoreComplete(report: RecoveryReport): Promise<void> {
    await emailNotificationService.notifySystemAlert({
      level: report.status === 'success' ? 'low' : 'medium',
      title: 'Data Restore Completed',
      component: 'Backup System',
      description: `Data restore from backup ${report.backupId} completed with status: ${report.status}`,
      actionRequired: report.status !== 'success'
    });
  }
}

export const backupRecoveryService = new BackupRecoveryService();