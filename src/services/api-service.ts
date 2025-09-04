// API Service - Provides RESTful endpoints for metrics, activities, and content management
// Centralizes all API operations with proper error handling and response formatting
// Integrates with database service, authentication, validation, and error handling

import { databaseService, DatabaseMetrics, DatabaseActivity, DatabaseUser } from './database-service';
import { authService } from './auth-service';
import { validationService } from './validation-service';
import { errorHandlingService } from './error-handling-service';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: any;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Content types for API operations
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'story' | 'transcript' | 'media' | 'analysis';
  status: 'draft' | 'published' | 'archived';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tags: string[];
}

export interface BrandTest {
  id: string;
  name: string;
  description: string;
  type: 'messaging' | 'visual' | 'voice' | 'positioning';
  status: 'active' | 'completed' | 'archived';
  results: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  authorId: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  metadata: Record<string, any>;
  tags: string[];
  uploadedAt: Date;
  uploadedBy: string;
}

class ApiService {
  private baseUrl: string = '/api'; // Will be configured based on environment
  
  constructor() {
    // In production, this would be configured via environment variables
    if (import.meta.env.PROD) {
      this.baseUrl = import.meta.env.VITE_API_URL || '/api';
    }
  }

  // === AUTHENTICATION ENDPOINTS ===

  async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      // Validate credentials
      const validation = validationService.validateLogin(credentials);
      if (!validation.isValid) {
        const error = errorHandlingService.createError(
          'VALIDATION_ERROR',
          'Login validation failed',
          'low',
          'validation',
          validation.errors
        );
        return this.createErrorResponse(error.message, validation.errors);
      }

      // Sanitize input
      const sanitizedCredentials = {
        username: validationService.sanitizeInput(credentials.username),
        password: credentials.password // Don't sanitize passwords
      };

      const result = await authService.login(sanitizedCredentials);
      
      if (result.success && result.user && result.token) {
        return this.createSuccessResponse({
          user: result.user,
          token: result.token
        }, 'Login successful');
      } else {
        const error = errorHandlingService.handleAuthError(result, { username: credentials.username });
        return this.createErrorResponse(error.message);
      }
    } catch (error) {
      const appError = errorHandlingService.handleAuthError(error, { username: credentials.username });
      return this.createErrorResponse(appError.message);
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      await authService.logout();
      return this.createSuccessResponse(null, 'Logout successful');
    } catch (error) {
      return this.createErrorResponse('Logout failed');
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      const authState = authService.getAuthState();
      if (authState.isAuthenticated) {
        return this.createSuccessResponse(authState.user);
      } else {
        return this.createErrorResponse('Not authenticated', 401);
      }
    } catch (error) {
      return this.createErrorResponse('Failed to get current user');
    }
  }

  // === METRICS ENDPOINTS ===

  async getMetrics(userId?: string): Promise<ApiResponse<DatabaseMetrics>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      const metrics = await databaseService.getMetrics(userId);
      if (metrics) {
        return this.createSuccessResponse(metrics);
      } else {
        // Return default metrics if none exist
        const defaultMetrics: DatabaseMetrics = {
          storiesAnalyzed: 0,
          brandTestsActive: 0,
          contentItems: 0,
          brandScore: 0,
          lastUpdated: new Date(),
          userId: userId || 'anonymous'
        };
        return this.createSuccessResponse(defaultMetrics);
      }
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve metrics');
    }
  }

  async updateMetrics(metrics: Partial<DatabaseMetrics>, userId?: string): Promise<ApiResponse<DatabaseMetrics>> {
    try {
      if (!this.isAuthenticated()) {
        const error = errorHandlingService.handleAuthError({ message: 'Authentication required' });
        return this.createErrorResponse(error.message, undefined, 401);
      }

      // Validate metrics data
      const validation = validationService.validateMetrics(metrics);
      if (!validation.isValid) {
        const error = errorHandlingService.createError(
          'VALIDATION_ERROR',
          'Metrics validation failed',
          'low',
          'validation',
          validation.errors
        );
        return this.createErrorResponse(error.message, validation.errors);
      }

      // Sanitize input
      const sanitizedMetrics = validationService.sanitizeInput(metrics);

      // Get current metrics
      const currentMetrics = await databaseService.getMetrics(userId);
      const updatedMetrics: DatabaseMetrics = {
        storiesAnalyzed: currentMetrics?.storiesAnalyzed || 0,
        brandTestsActive: currentMetrics?.brandTestsActive || 0,
        contentItems: currentMetrics?.contentItems || 0,
        brandScore: currentMetrics?.brandScore || 0,
        ...sanitizedMetrics,
        lastUpdated: new Date(),
        userId: userId || 'anonymous'
      };

      const success = await databaseService.saveMetrics(updatedMetrics, userId);
      if (success) {
        return this.createSuccessResponse(updatedMetrics, 'Metrics updated successfully');
      } else {
        const error = errorHandlingService.createError(
          'DATABASE_ERROR',
          'Failed to save metrics',
          'medium',
          'database'
        );
        return this.createErrorResponse(error.message);
      }
    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'updateMetrics', userId });
      return this.createErrorResponse(appError.message);
    }
  }

  async incrementStoryCount(userId?: string): Promise<ApiResponse<DatabaseMetrics>> {
    try {
      const currentMetrics = await databaseService.getMetrics(userId);
      const newCount = (currentMetrics?.storiesAnalyzed || 0) + 1;
      
      return await this.updateMetrics({ storiesAnalyzed: newCount }, userId);
    } catch (error) {
      return this.createErrorResponse('Failed to increment story count');
    }
  }

  async updateBrandScore(score: number, userId?: string): Promise<ApiResponse<DatabaseMetrics>> {
    try {
      return await this.updateMetrics({ brandScore: score }, userId);
    } catch (error) {
      return this.createErrorResponse('Failed to update brand score');
    }
  }

  // === ACTIVITIES ENDPOINTS ===

  async getActivities(userId?: string, limit: number = 50): Promise<ApiResponse<DatabaseActivity[]>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      const activities = await databaseService.getActivities(userId, limit);
      return this.createSuccessResponse(activities);
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve activities');
    }
  }

  async addActivity(activity: Omit<DatabaseActivity, 'id' | 'timestamp'>, userId?: string): Promise<ApiResponse> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      const success = await databaseService.addActivity(activity, userId);
      if (success) {
        return this.createSuccessResponse(null, 'Activity logged successfully');
      } else {
        return this.createErrorResponse('Failed to log activity');
      }
    } catch (error) {
      return this.createErrorResponse('Failed to log activity');
    }
  }

  async logContentActivity(action: string, contentId: string, details?: string, userId?: string): Promise<ApiResponse> {
    return await this.addActivity({
      type: 'content',
      message: `${action}: ${contentId}${details ? ` - ${details}` : ''}`,
    }, userId);
  }

  async logBrandActivity(action: string, testId: string, details?: string, userId?: string): Promise<ApiResponse> {
    return await this.addActivity({
      type: 'brand',
      message: `${action}: ${testId}${details ? ` - ${details}` : ''}`,
    }, userId);
  }

  async logSystemActivity(message: string, userId?: string): Promise<ApiResponse> {
    return await this.addActivity({
      type: 'system',
      message,
    }, userId);
  }

  // === CONTENT MANAGEMENT ENDPOINTS ===

  async getContent(filters?: { type?: string; status?: string; author?: string }): Promise<ApiResponse<ContentItem[]>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation - in production, this would query the database
      const mockContent: ContentItem[] = [
        {
          id: 'content_001',
          title: 'Sample Story Analysis',
          content: 'Analysis of community story themes...',
          type: 'analysis',
          status: 'published',
          metadata: { wordCount: 1250, readingTime: 5 },
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 'staff_001',
          tags: ['community', 'analysis', 'themes']
        }
      ];

      // Apply filters
      let filteredContent = mockContent;
      if (filters?.type) {
        filteredContent = filteredContent.filter(item => item.type === filters.type);
      }
      if (filters?.status) {
        filteredContent = filteredContent.filter(item => item.status === filters.status);
      }
      if (filters?.author) {
        filteredContent = filteredContent.filter(item => item.authorId === filters.author);
      }

      return this.createSuccessResponse(filteredContent);
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve content');
    }
  }

  async createContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ContentItem>> {
    try {
      if (!this.isAuthenticated()) {
        const error = errorHandlingService.handleAuthError({ message: 'Authentication required' });
        return this.createErrorResponse(error.message, undefined, 401);
      }

      // Validate content data
      const validation = validationService.validateContent(content);
      if (!validation.isValid) {
        const error = errorHandlingService.createError(
          'VALIDATION_ERROR',
          'Content validation failed',
          'low',
          'validation',
          validation.errors
        );
        return this.createErrorResponse(error.message, validation.errors);
      }

      // Sanitize input
      const sanitizedContent = validationService.sanitizeInput(content);

      const newContent: ContentItem = {
        ...sanitizedContent,
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Log activity
      await this.logContentActivity('Created', newContent.id, newContent.title);

      return this.createSuccessResponse(newContent, 'Content created successfully');
    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'createContent' });
      return this.createErrorResponse(appError.message);
    }
  }

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ApiResponse<ContentItem>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation - in production, this would update the database
      const updatedContent: ContentItem = {
        id,
        title: 'Updated Content',
        content: 'Updated content...',
        type: 'story',
        status: 'published',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'staff_001',
        tags: [],
        ...updates
      };

      // Log activity
      await this.logContentActivity('Updated', id, updates.title || 'Content updated');

      return this.createSuccessResponse(updatedContent, 'Content updated successfully');
    } catch (error) {
      return this.createErrorResponse('Failed to update content');
    }
  }

  async deleteContent(id: string): Promise<ApiResponse> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation - in production, this would delete from database
      
      // Log activity
      await this.logContentActivity('Deleted', id);

      return this.createSuccessResponse(null, 'Content deleted successfully');
    } catch (error) {
      return this.createErrorResponse('Failed to delete content');
    }
  }

  // === BRAND TESTING ENDPOINTS ===

  async getBrandTests(filters?: { status?: string; type?: string }): Promise<ApiResponse<BrandTest[]>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation
      const mockTests: BrandTest[] = [
        {
          id: 'test_001',
          name: 'Messaging Clarity Test',
          description: 'Testing message clarity and impact',
          type: 'messaging',
          status: 'active',
          results: {},
          createdAt: new Date(),
          authorId: 'staff_001'
        }
      ];

      // Apply filters
      let filteredTests = mockTests;
      if (filters?.status) {
        filteredTests = filteredTests.filter(test => test.status === filters.status);
      }
      if (filters?.type) {
        filteredTests = filteredTests.filter(test => test.type === filters.type);
      }

      return this.createSuccessResponse(filteredTests);
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve brand tests');
    }
  }

  async createBrandTest(test: Omit<BrandTest, 'id' | 'createdAt'>): Promise<ApiResponse<BrandTest>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      const newTest: BrandTest = {
        ...test,
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      // Log activity
      await this.logBrandActivity('Created', newTest.id, newTest.name);

      return this.createSuccessResponse(newTest, 'Brand test created successfully');
    } catch (error) {
      return this.createErrorResponse('Failed to create brand test');
    }
  }

  async completeBrandTest(id: string, results: Record<string, any>): Promise<ApiResponse<BrandTest>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation
      const completedTest: BrandTest = {
        id,
        name: 'Completed Test',
        description: 'Test description',
        type: 'messaging',
        status: 'completed',
        results,
        createdAt: new Date(),
        completedAt: new Date(),
        authorId: 'staff_001'
      };

      // Log activity
      await this.logBrandActivity('Completed', id, 'Test completed with results');

      return this.createSuccessResponse(completedTest, 'Brand test completed successfully');
    } catch (error) {
      return this.createErrorResponse('Failed to complete brand test');
    }
  }

  // === MEDIA ENDPOINTS ===

  async uploadMedia(file: File, metadata?: Record<string, any>): Promise<ApiResponse<MediaItem>> {
    try {
      if (!this.isAuthenticated()) {
        const error = errorHandlingService.handleAuthError({ message: 'Authentication required' });
        return this.createErrorResponse(error.message, undefined, 401);
      }

      // Validate file
      const fileValidation = validationService.validateFileUpload(file);
      if (!fileValidation.isValid) {
        const error = errorHandlingService.handleFileError(file, { errors: fileValidation.errors });
        return this.createErrorResponse(error.message, fileValidation.errors);
      }

      // Validate metadata if provided
      if (metadata) {
        const metadataValidation = validationService.validate(metadata, 'metadata', 'media');
        if (!metadataValidation.isValid) {
          const error = errorHandlingService.createError(
            'VALIDATION_ERROR',
            'Metadata validation failed',
            'low',
            'validation',
            metadataValidation.errors
          );
          return this.createErrorResponse(error.message, metadataValidation.errors);
        }
        metadata = validationService.sanitizeInput(metadata);
      }

      // Mock implementation - in production, this would upload to cloud storage
      const mediaItem: MediaItem = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: validationService.sanitizeInput(file.name),
        type: this.getMediaType(file.type),
        url: URL.createObjectURL(file), // Mock URL
        size: file.size,
        metadata: metadata || {},
        tags: [],
        uploadedAt: new Date(),
        uploadedBy: authService.getAuthState().user?.id || 'unknown'
      };

      // Log activity
      await this.logContentActivity('Uploaded', mediaItem.id, `Media: ${mediaItem.filename}`);

      return this.createSuccessResponse(mediaItem, 'Media uploaded successfully');
    } catch (error) {
      const appError = errorHandlingService.handleFileError(file, error);
      return this.createErrorResponse(appError.message);
    }
  }

  async getMedia(filters?: { type?: string; author?: string }): Promise<ApiResponse<MediaItem[]>> {
    try {
      if (!this.isAuthenticated()) {
        return this.createErrorResponse('Authentication required', 401);
      }

      // Mock implementation
      const mockMedia: MediaItem[] = [];

      return this.createSuccessResponse(mockMedia);
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve media');
    }
  }

  // === USER MANAGEMENT ENDPOINTS ===

  async getUsers(): Promise<ApiResponse<DatabaseUser[]>> {
    try {
      if (!this.isAuthenticated() || !authService.isAdmin()) {
        return this.createErrorResponse('Admin access required', 403);
      }

      // Mock implementation - in production, this would query the database
      const mockUsers: DatabaseUser[] = [];

      return this.createSuccessResponse(mockUsers);
    } catch (error) {
      return this.createErrorResponse('Failed to retrieve users');
    }
  }

  async updateUserRole(userId: string, role: 'staff' | 'admin'): Promise<ApiResponse> {
    try {
      if (!this.isAuthenticated() || !authService.isAdmin()) {
        return this.createErrorResponse('Admin access required', 403);
      }

      // Mock implementation
      await this.logSystemActivity(`User role updated: ${userId} -> ${role}`);

      return this.createSuccessResponse(null, 'User role updated successfully');
    } catch (error) {
      return this.createErrorResponse('Failed to update user role');
    }
  }

  // === UTILITY METHODS ===

  private isAuthenticated(): boolean {
    return authService.getAuthState().isAuthenticated;
  }

  private getMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  }

  private createSuccessResponse<T>(data?: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date()
    };
  }

  private createErrorResponse(error: string, validationErrors?: any, statusCode?: number): ApiResponse {
    return {
      success: false,
      error,
      validationErrors,
      timestamp: new Date()
    };
  }

  // === SYSTEM ENDPOINTS ===

  async getSystemStatus(): Promise<ApiResponse<any>> {
    try {
      const dbStatus = databaseService.getConnectionStatus();
      const authState = authService.getAuthState();
      
      const status = {
        database: {
          connected: dbStatus.connected,
          type: dbStatus.type
        },
        authentication: {
          initialized: true,
          currentUser: authState.user?.username || null
        },
        services: {
          apiService: 'operational',
          databaseService: 'operational',
          authService: 'operational'
        },
        timestamp: new Date()
      };

      return this.createSuccessResponse(status);
    } catch (error) {
      return this.createErrorResponse('Failed to get system status');
    }
  }

  async clearAllData(): Promise<ApiResponse> {
    try {
      if (!this.isAuthenticated() || !authService.isAdmin()) {
        return this.createErrorResponse('Admin access required', 403);
      }

      const success = await databaseService.clearAllData();
      if (success) {
        await this.logSystemActivity('All data cleared by admin');
        return this.createSuccessResponse(null, 'All data cleared successfully');
      } else {
        return this.createErrorResponse('Failed to clear data');
      }
    } catch (error) {
      return this.createErrorResponse('Failed to clear data');
    }
  }
}

export const apiService = new ApiService();