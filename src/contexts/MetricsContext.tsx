import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService, DatabaseMetrics, DatabaseActivity } from '../services/database-service';
import { useAuth } from './AuthContext';

export interface DashboardMetrics {
  storiesAnalyzed: number;
  brandTestsActive: number;
  contentItems: number;
  brandScore: number;
  lastUpdated: Date;
}

export interface ActivityItem {
  id: string;
  type: 'content' | 'brand' | 'analytics' | 'system';
  message: string;
  timestamp: Date;
  userId?: string;
}

interface MetricsContextType {
  // Metrics
  metrics: DashboardMetrics;
  activities: ActivityItem[];
  loading: boolean;
  
  // Actions
  refreshMetrics: () => Promise<void>;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  incrementStoriesAnalyzed: () => void;
  updateBrandScore: (score: number) => void;
  setActiveBrandTests: (count: number) => void;
}

const MetricsContext = createContext<MetricsContextType | null>(null);

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    storiesAnalyzed: 0,
    brandTestsActive: 0,
    contentItems: 0,
    brandScore: 0,
    lastUpdated: new Date()
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get current user for database operations
  const { user } = useAuth();

  // Initialize with saved data or defaults
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    setLoading(true);
    try {
      const userId = user?.id;
      
      // Load metrics from database service
      const storedMetrics = await databaseService.getMetrics(userId);
      if (storedMetrics) {
        setMetrics(storedMetrics);
      }
      
      // Load activities from database service
      const storedActivities = await databaseService.getActivities(userId);
      if (storedActivities.length > 0) {
        // Convert DatabaseActivity to ActivityItem format
        const activities = storedActivities.map(activity => ({
          ...activity,
          id: activity.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
        setActivities(activities);
      } else {
        // Add initial welcome activity
        await addActivity({
          type: 'system',
          message: 'Welcome! Your dashboard is ready with database integration.'
        });
      }
    } catch (error) {
      console.error('Failed to load stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newMetrics: DashboardMetrics) => {
    try {
      const userId = user?.id;
      await databaseService.saveMetrics(newMetrics, userId);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const refreshMetrics = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last refreshed time
      const updatedMetrics = {
        ...metrics,
        lastUpdated: new Date()
      };
      
      setMetrics(updatedMetrics);
      
      addActivity({
        type: 'system',
        message: 'Dashboard metrics refreshed'
      });
      
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    try {
      const userId = user?.id;
      await databaseService.addActivity(activity, userId);
      
      // Refresh activities from database
      const updatedActivities = await databaseService.getActivities(userId);
      // Convert DatabaseActivity to ActivityItem format
      const convertedActivities = updatedActivities.map(activity => ({
        ...activity,
        id: activity.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      setActivities(convertedActivities);
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  const incrementStoriesAnalyzed = async () => {
    const updatedMetrics = {
      ...metrics,
      storiesAnalyzed: metrics.storiesAnalyzed + 1,
      contentItems: metrics.contentItems + 1,
      lastUpdated: new Date()
    };
    
    setMetrics(updatedMetrics);
    await saveData(updatedMetrics);
    
    await addActivity({
      type: 'content',
      message: `New story analyzed - Total: ${updatedMetrics.storiesAnalyzed}`
    });
  };

  const updateBrandScore = async (score: number) => {
    const previousScore = metrics.brandScore;
    const updatedMetrics = {
      ...metrics,
      brandScore: score,
      lastUpdated: new Date()
    };
    
    setMetrics(updatedMetrics);
    await saveData(updatedMetrics);
    
    const change = score > previousScore ? 'increased' : 'decreased';
    await addActivity({
      type: 'analytics',
      message: `Brand score ${change} to ${score}%`
    });
  };

  const setActiveBrandTests = async (count: number) => {
    const updatedMetrics = {
      ...metrics,
      brandTestsActive: count,
      lastUpdated: new Date()
    };
    
    setMetrics(updatedMetrics);
    await saveData(updatedMetrics);
    
    if (count > metrics.brandTestsActive) {
      await addActivity({
        type: 'brand',
        message: `New brand test started - Active tests: ${count}`
      });
    }
  };

  const contextValue: MetricsContextType = {
    metrics,
    activities,
    loading,
    refreshMetrics,
    addActivity,
    incrementStoriesAnalyzed,
    updateBrandScore,
    setActiveBrandTests
  };

  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};