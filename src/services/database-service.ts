// Database Service - Provides database integration with Supabase and localStorage fallback
// Handles metrics, activities, authentication, and content management data

import { createClient } from '@supabase/supabase-js';

export interface DatabaseMetrics {
  id?: string;
  storiesAnalyzed: number;
  brandTestsActive: number;
  contentItems: number;
  brandScore: number;
  lastUpdated: Date;
  userId?: string;
}

export interface DatabaseActivity {
  id?: string;
  type: 'content' | 'brand' | 'analytics' | 'system';
  message: string;
  timestamp: Date;
  userId?: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  username: string;
  role: 'staff' | 'admin';
  permissions: string[];
  name: string;
  lastLogin: Date;
  createdAt: Date;
}

class DatabaseService {
  private supabase: any = null;
  private useSupabase = false;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Initialize Supabase if environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.useSupabase = true;
        console.log('Database: Using Supabase for data persistence');
      } catch (error) {
        console.warn('Database: Failed to initialize Supabase, falling back to localStorage', error);
        this.useSupabase = false;
      }
    } else {
      console.log('Database: Using localStorage for data persistence (development mode)');
      this.useSupabase = false;
    }
  }

  // === METRICS OPERATIONS ===

  async getMetrics(userId?: string): Promise<DatabaseMetrics | null> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('ce_metrics')
          .select('*')
          .eq('user_id', userId || 'anonymous')
          .single();

        if (error && error.code !== 'PGRST116') {
          if (error.code === '42P01') {
            console.log('Database: Tables not created yet. Please run the Supabase schema first.');
          } else {
            console.error('Database: Failed to get metrics from Supabase:', error);
          }
          throw error;
        }
        return data ? this.deserializeMetrics(data) : null;
      } catch (error) {
        console.error('Database: Failed to get metrics from Supabase:', error);
        // Fall back to localStorage
      }
    }

    // localStorage fallback
    const stored = localStorage.getItem('custodian_metrics');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      };
    }
    return null;
  }

  async saveMetrics(metrics: DatabaseMetrics, userId?: string): Promise<boolean> {
    const metricsToSave = {
      ...metrics,
      userId: userId || 'anonymous',
      lastUpdated: new Date()
    };

    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase
          .from('ce_metrics')
          .upsert(this.serializeMetrics(metricsToSave));

        if (!error) {
          // Also save to localStorage as backup
          localStorage.setItem('custodian_metrics', JSON.stringify(metricsToSave));
          return true;
        }
        console.error('Database: Failed to save metrics to Supabase:', error);
      } catch (error) {
        console.error('Database: Error saving metrics to Supabase:', error);
      }
    }

    // localStorage fallback
    try {
      localStorage.setItem('custodian_metrics', JSON.stringify(metricsToSave));
      return true;
    } catch (error) {
      console.error('Database: Failed to save metrics to localStorage:', error);
      return false;
    }
  }

  // === ACTIVITIES OPERATIONS ===

  async getActivities(userId?: string, limit: number = 50): Promise<DatabaseActivity[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('ce_activities')
          .select('*')
          .eq('user_id', userId || 'anonymous')
          .order('event_timestamp', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data ? data.map(this.deserializeActivity) : [];
      } catch (error) {
        console.error('Database: Failed to get activities from Supabase:', error);
        // Fall back to localStorage
      }
    }

    // localStorage fallback
    const stored = localStorage.getItem('custodian_activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      })).slice(0, limit);
    }
    return [];
  }

  async addActivity(activity: Omit<DatabaseActivity, 'id' | 'timestamp'>, userId?: string): Promise<boolean> {
    const newActivity: DatabaseActivity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: userId || 'anonymous'
    };

    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase
          .from('ce_activities')
          .insert([this.serializeActivity(newActivity)]);

        if (!error) {
          // Also update localStorage
          await this.updateLocalStorageActivities(newActivity);
          return true;
        }
        console.error('Database: Failed to add activity to Supabase:', error);
      } catch (error) {
        console.error('Database: Error adding activity to Supabase:', error);
      }
    }

    // localStorage fallback
    return await this.updateLocalStorageActivities(newActivity);
  }

  private async updateLocalStorageActivities(newActivity: DatabaseActivity): Promise<boolean> {
    try {
      const stored = localStorage.getItem('custodian_activities');
      const activities = stored ? JSON.parse(stored) : [];
      const updated = [newActivity, ...activities].slice(0, 50); // Keep last 50
      localStorage.setItem('custodian_activities', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Database: Failed to update localStorage activities:', error);
      return false;
    }
  }

  // === USER OPERATIONS ===

  async saveUser(user: DatabaseUser): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase
          .from('ce_users')
          .upsert([this.serializeUser(user)]);

        if (!error) return true;
        console.error('Database: Failed to save user to Supabase:', error);
      } catch (error) {
        console.error('Database: Error saving user to Supabase:', error);
      }
    }

    // localStorage fallback
    try {
      localStorage.setItem('custodian_user_data', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Database: Failed to save user to localStorage:', error);
      return false;
    }
  }

  async getUser(userId: string): Promise<DatabaseUser | null> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('ce_users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data ? this.deserializeUser(data) : null;
      } catch (error) {
        console.error('Database: Failed to get user from Supabase:', error);
      }
    }

    // localStorage fallback
    const stored = localStorage.getItem('custodian_user_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastLogin: new Date(parsed.lastLogin),
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date()
      };
    }
    return null;
  }

  // === UTILITY METHODS ===

  async clearAllData(userId?: string): Promise<boolean> {
    let success = true;

    if (this.useSupabase && this.supabase) {
      try {
        const userFilter = userId || 'anonymous';
        await Promise.all([
          this.supabase.from('ce_metrics').delete().eq('user_id', userFilter),
          this.supabase.from('ce_activities').delete().eq('user_id', userFilter)
        ]);
      } catch (error) {
        console.error('Database: Failed to clear Supabase data:', error);
        success = false;
      }
    }

    // Clear localStorage
    try {
      localStorage.removeItem('custodian_metrics');
      localStorage.removeItem('custodian_activities');
      localStorage.removeItem('custodian_user_data');
    } catch (error) {
      console.error('Database: Failed to clear localStorage:', error);
      success = false;
    }

    return success;
  }

  // === SERIALIZATION METHODS ===

  private serializeMetrics(metrics: DatabaseMetrics): any {
    return {
      id: metrics.id,
      user_id: metrics.userId || 'anonymous',
      stories_analyzed: metrics.storiesAnalyzed,
      brand_tests_active: metrics.brandTestsActive,
      content_items: metrics.contentItems,
      brand_score: metrics.brandScore,
      last_updated: metrics.lastUpdated.toISOString(),
      created_at: new Date().toISOString()
    };
  }

  private deserializeMetrics(data: any): DatabaseMetrics {
    return {
      id: data.id,
      userId: data.user_id,
      storiesAnalyzed: data.stories_analyzed || 0,
      brandTestsActive: data.brand_tests_active || 0,
      contentItems: data.content_items || 0,
      brandScore: data.brand_score || 0,
      lastUpdated: new Date(data.last_updated || data.created_at)
    };
  }

  private serializeActivity(activity: DatabaseActivity): any {
    return {
      id: activity.id,
      user_id: activity.userId || 'anonymous',
      activity_type: activity.type,
      message: activity.message,
      event_timestamp: activity.timestamp.toISOString(),
      metadata: {}
    };
  }

  private deserializeActivity(data: any): DatabaseActivity {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.activity_type,
      message: data.message,
      timestamp: new Date(data.event_timestamp)
    };
  }

  private serializeUser(user: DatabaseUser): any {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      user_role: user.role,
      permissions: user.permissions,
      password_hash: 'stored_securely', // In real app, hash the password
      last_login: user.lastLogin.toISOString(),
      created_at: user.createdAt.toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };
  }

  private deserializeUser(data: any): DatabaseUser {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      name: data.name,
      role: data.user_role,
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      lastLogin: new Date(data.last_login),
      createdAt: new Date(data.created_at)
    };
  }

  // === DATABASE STATUS ===

  getConnectionStatus(): { type: 'supabase' | 'localStorage'; connected: boolean } {
    return {
      type: this.useSupabase ? 'supabase' : 'localStorage',
      connected: this.useSupabase ? !!this.supabase : true
    };
  }
}

export const databaseService = new DatabaseService();