import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  TrendingUp, 
  Beaker, 
  Settings, 
  Users,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Mail,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMetrics } from '../contexts/MetricsContext';
import { emailNotificationService } from '../services/email-notification-service';
import { dataExportService } from '../services/data-export-service';
import { GlobalSearch } from './GlobalSearch';
import { SearchResult } from '../services/search-service';

export const StaffDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { 
    metrics, 
    activities, 
    loading, 
    refreshMetrics, 
    incrementStoriesAnalyzed, 
    updateBrandScore, 
    setActiveBrandTests,
    addActivity 
  } = useMetrics();

  // Demo functions to show real system in action
  const handleDemoAddStory = () => {
    incrementStoriesAnalyzed();
    addActivity({
      type: 'content',
      message: 'Demo story "Community Success Story" analyzed'
    });
  };

  const handleDemoStartBrandTest = () => {
    const newCount = metrics.brandTestsActive + 1;
    setActiveBrandTests(newCount);
    addActivity({
      type: 'brand',
      message: `Demo brand test "Messaging Test ${newCount}" started`
    });
  };

  const handleDemoUpdateBrandScore = () => {
    const newScore = Math.min(100, metrics.brandScore + Math.floor(Math.random() * 10) + 1);
    updateBrandScore(newScore);
  };

  const handleResetSystem = () => {
    if (confirm('This will reset all metrics to zero. Are you sure?')) {
      localStorage.removeItem('custodian_metrics');
      localStorage.removeItem('custodian_activities');
      window.location.reload();
    }
  };

  const handleSendWeeklySummary = async () => {
    try {
      const success = await emailNotificationService.sendWeeklySummary();
      if (success) {
        addActivity({
          type: 'system',
          message: 'Weekly summary email sent to staff members'
        });
        alert('Weekly summary email sent successfully!');
      } else {
        alert('Failed to send weekly summary email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending weekly summary:', error);
      alert('Error sending weekly summary email.');
    }
  };

  const handleQuickExport = async () => {
    try {
      const result = await dataExportService.exportData({
        type: 'csv',
        dateRange: 'last_week',
        includeMetrics: true,
        includeActivities: true,
        includeUsers: false,
        includeContent: true,
        includeBrandAnalysis: true,
        includeTestResults: true,
        template: 'executive'
      });
      
      if (result.success) {
        addActivity({
          type: 'system',
          message: `Quick export generated: ${result.filename}`
        });
        alert(`Export generated successfully: ${result.filename}`);
      } else {
        alert('Export failed. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Handle search result selection from GlobalSearch
  const handleSearchResultSelect = (result: SearchResult) => {
    // Add activity for search usage
    addActivity({
      type: 'content',
      message: `Quick search result selected: "${result.title}"`
    });
    
    // You could navigate to the specific content or open it in a modal
    console.log('Search result selected:', result);
  };
  const calculateChange = (current: number, _label: string) => {
    if (current === 0) return 'Ready to start';
    if (current < 5) return 'Getting started';
    if (current < 20) return 'Building momentum';
    return 'Active system';
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return FileText;
      case 'brand': return Beaker;
      case 'analytics': return BarChart3;
      case 'system': return Settings;
      default: return FileText;
    }
  };

  // Convert real metrics to display format
  const stats = [
    {
      label: 'Stories Analyzed',
      value: metrics.storiesAnalyzed.toString(),
      change: calculateChange(metrics.storiesAnalyzed, 'stories'),
      trend: 'up' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Brand Tests Active',
      value: metrics.brandTestsActive.toString(),
      change: metrics.brandTestsActive > 0 ? 'Active' : 'None',
      trend: 'up' as const,
      icon: Beaker,
      color: 'green'
    },
    {
      label: 'Content Items',
      value: metrics.contentItems.toString(),
      change: calculateChange(metrics.contentItems, 'content'),
      trend: 'up' as const,
      icon: Database,
      color: 'purple'
    },
    {
      label: 'Brand Score',
      value: `${metrics.brandScore}%`,
      change: metrics.brandScore > 0 ? 'Calculated' : 'Pending',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  // Format recent activities for display
  const recentActivities = activities.slice(0, 4).map(activity => ({
    type: activity.type,
    message: activity.message,
    time: formatTimeAgo(activity.timestamp),
    icon: getActivityIcon(activity.type)
  }));

  // Quick actions - streamlined to match actual functionality
  const quickActions = [
    {
      title: 'Brand Development Hub',
      description: 'Upload, create, test, and analyze all brand content in one place',
      href: '/staff/brand-hub',
      icon: Upload,
      color: 'bg-blue-600 hover:bg-blue-700',
      featured: true
    },
    {
      title: 'System Demo',
      description: 'See the metrics system in action with demo controls below',
      onClick: () => document.getElementById('demo-controls')?.scrollIntoView({ behavior: 'smooth' }),
      icon: Beaker,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your custodian economy platform
            </p>
            {metrics.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {metrics.lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={refreshMetrics}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Quick Search Widget */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Search</h3>
          <GlobalSearch 
            embedded={true}
            onResultSelect={handleSearchResultSelect}
            defaultFilters={{
              contentTypes: ['story', 'media', 'analysis', 'test']
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Main Tools</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const Component = action.href ? Link : 'button';
              const props = action.href 
                ? { to: action.href }
                : { onClick: action.onClick };
              
              return (
                <Component
                  key={index}
                  {...props}
                  className={`group bg-white p-6 rounded-lg border transition-all hover:shadow-md w-full text-left ${
                    action.featured 
                      ? 'border-blue-300 bg-blue-50 hover:border-blue-400' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    action.featured ? 'text-blue-900' : 'text-gray-900'
                  }`}>{action.title}</h3>
                  <p className={`text-sm ${
                    action.featured ? 'text-blue-700' : 'text-gray-600'
                  }`}>{action.description}</p>
                  {action.featured && (
                    <div className="mt-3 text-xs text-blue-600 font-medium">
                      ✨ Primary workflow - Upload → Create → Test → Align
                    </div>
                  )}
                </Component>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-500">
                All activity is shown here - no separate page needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Content Management</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Brand Testing</p>
                <p className="text-sm text-gray-600">
                  {metrics.brandTestsActive > 0 
                    ? `${metrics.brandTestsActive} active tests running`
                    : 'Ready to start testing'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-gray-900">Analytics Engine</p>
                <p className="text-sm text-gray-600">Processing daily reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Controls - Shows Real System in Action */}
      <div id="demo-controls" className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">🎯 Demo Controls - See Real System in Action</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Test the Real Metrics System</h3>
            <p className="text-blue-800 text-sm mb-4">
              Click these buttons to see how the dashboard updates with <strong>real data</strong> (not mock numbers):
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDemoAddStory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📖 Add Demo Story
            </button>
            <button
              onClick={handleDemoStartBrandTest}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🧪 Start Brand Test
            </button>
            <button
              onClick={handleDemoUpdateBrandScore}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📊 Update Brand Score
            </button>
            <button
              onClick={handleQuickExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              📊 Quick Export
            </button>
            <button
              onClick={handleSendWeeklySummary}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              📬 Send Weekly Summary
            </button>
            <button
              onClick={handleResetSystem}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Reset to Zero
            </button>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin() && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Tools</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Administrator Access</h3>
            </div>
            <p className="text-amber-800 mb-4">
              Admin features are available but not yet implemented. Focus on Brand Hub for now.
            </p>
            <div className="flex space-x-4">
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                User Management (Coming Soon)
              </button>
              <button
                disabled
                className="border border-gray-400 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                System Settings (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};