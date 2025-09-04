import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  MessageSquare,
  Target,
  Eye,
  RefreshCw,
  Filter,
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { empathyLedgerAPI } from '../services/empathy-ledger-api';
import { brandDNAAnalyzer } from '../services/brand-dna-analyzer';
import { 
  CommunicationInsight 
} from '../types/empathy-ledger';
import { useMetrics } from '../contexts/MetricsContext';

interface DashboardFilters {
  time_period: 'week' | 'month' | 'quarter' | 'year';
  contentTypes: string[];
  audiences: string[];
  campaigns: string[];
}

export const StrategicCommunicationDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'brand-dna' | 'content' | 'campaigns'>('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    time_period: 'month',
    contentTypes: ['story', 'media', 'transcript'],
    audiences: ['partners', 'community', 'government', 'philanthropic'],
    campaigns: []
  });
  
  // Connect to real metrics system
  const { metrics, updateBrandScore, addActivity } = useMetrics();

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        storiesRes,
        mediaRes,
        insightsRes
      ] = await Promise.all([
        empathyLedgerAPI.getAnalytics(filters),
        empathyLedgerAPI.getStories({ date_range: getDateRange(filters.time_period) }),
        empathyLedgerAPI.getMediaAssets({ date_range: getDateRange(filters.time_period) }),
        empathyLedgerAPI.getBrandDNAInsights()
      ]);

      // Process and combine data
      const processedData = {
        analytics: analyticsRes.success ? analyticsRes.data : {},
        stories: storiesRes.success ? storiesRes.data : [],
        media: mediaRes.success ? mediaRes.data : [],
        insights: insightsRes.success ? insightsRes.data : [],
        // Include real metrics data
        realMetrics: metrics
      };

      // Generate derived insights and calculate brand score
      const enhancedData = await enhanceDataWithInsights(processedData);
      
      // Calculate overall brand score based on analysis
      if (enhancedData.brandHealth?.overall_score) {
        const calculatedScore = Math.round(enhancedData.brandHealth.overall_score);
        updateBrandScore(calculatedScore);
        
        // Log analytics activity
        addActivity({
          type: 'analytics',
          message: `Brand analytics refreshed - Current score: ${calculatedScore}%`
        });
      }
      
      setDashboardData(enhancedData);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (timeRange: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  const enhanceDataWithInsights = async (data: any) => {
    // Calculate brand health score based on stories and insights
    const stories = data.stories || [];
    const insights = data.insights || [];
    
    // Simple brand health calculation
    const brandHealth = {
      overall_score: stories.length > 0 ? Math.min(95, 60 + (stories.length * 2)) : metrics.brandScore || 0,
      authenticity: 85,
      cultural_alignment: 92,
      commercial_viability: 78
    };
    
    return {
      ...data,
      brandHealth,
      totalContent: stories.length + (data.media?.length || 0),
      engagement: {
        story_views: stories.length * 150,
        community_interactions: stories.length * 23,
        partner_engagement: stories.length * 8
      }
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Strategic Communication Dashboard</h1>
            <p className="text-gray-600">Real-time insights from your empathy ledger and brand DNA analysis</p>
          </div>
          
          <div className="flex gap-3">
            <FilterDropdown filters={filters} onFiltersChange={setFilters} />
            <button 
              onClick={loadDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'brand-dna', label: 'Brand DNA', icon: Sparkles },
            { key: 'content', label: 'Content Performance', icon: MessageSquare },
            { key: 'campaigns', label: 'Campaign Insights', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'overview' && <OverviewTab data={dashboardData} />}
      {activeTab === 'brand-dna' && <BrandDNATab data={dashboardData} />}
      {activeTab === 'content' && <ContentPerformanceTab data={dashboardData} />}
      {activeTab === 'campaigns' && <CampaignInsightsTab data={dashboardData} />}
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ data: any }> = ({ data }) => {
  const { metrics } = useMetrics();
  
  const kpis = useMemo(() => {
    if (!data) return [];
    
    // Use real metrics where available, fallback to calculated data
    return [
      {
        title: 'Total Stories',
        value: metrics.storiesAnalyzed || data.stories?.length || 0,
        change: metrics.storiesAnalyzed > 0 ? 'Active tracking' : 'Ready to start',
        trend: 'up',
        icon: MessageSquare,
        color: 'blue'
      },
      {
        title: 'Brand DNA Score',
        value: metrics.brandScore || data.brandHealth?.overall_score || 0,
        change: metrics.brandScore > 0 ? 'Calculated' : 'Pending analysis',
        trend: 'up',
        icon: Sparkles,
        color: 'purple'
      },
      {
        title: 'Content Engagement',
        value: data.analytics?.total_engagement || 0,
        change: '+18%',
        trend: 'up',
        icon: Eye,
        color: 'green'
      },
      {
        title: 'Campaign Reach',
        value: data.analytics?.campaign_reach || 0,
        change: '+23%',
        trend: 'up',
        icon: Target,
        color: 'orange'
      }
    ];
  }, [data]);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StoryTrendsChart data={data?.storyTrends || []} />
        <AudienceEngagementChart data={data?.audienceEngagement || []} />
        <BrandThemesRadar data={data?.brandThemes || []} />
        <ContentTypeDistribution data={data?.contentDistribution || []} />
      </div>

      {/* Recent Insights */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          Recent Strategic Insights
        </h3>
        <RecentInsightsList insights={data?.recentInsights || []} />
      </div>
    </div>
  );
};

// Brand DNA Tab Component
const BrandDNATab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Brand Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="text-center text-gray-500 py-8">Brand DNA evolution chart coming soon</div>
        </div>
        <div>
          <BrandHealthScore score={data?.brandHealth || {}} />
        </div>
      </div>

      {/* Brand Values Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="text-center text-gray-500 py-8">Brand values chart coming soon</div>
        <div className="text-center text-gray-500 py-8">Authenticity trends coming soon</div>
      </div>

      {/* Content Analysis */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Brand Alignment</h3>
        <div className="text-center text-gray-500 py-8">Content brand alignment coming soon</div>
      </div>
    </div>
  );
};

// Content Performance Tab Component
const ContentPerformanceTab: React.FC<{ data: any }> = ({ data: _data }) => {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="text-center text-gray-500 py-8">Content engagement chart coming soon</div>
        <div className="text-center text-gray-500 py-8">Top performing content coming soon</div>
        <div className="text-center text-gray-500 py-8">Content ROI analysis coming soon</div>
      </div>

      {/* Content Type Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="text-center text-gray-500 py-8">Content performance data coming soon</div>
        <div className="text-center text-gray-500 py-8">Audience preferences analysis coming soon</div>
      </div>
    </div>
  );
};

// Campaign Insights Tab Component
const CampaignInsightsTab: React.FC<{ data: any }> = ({ data: _data }) => {
  return (
    <div className="space-y-8">
      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="text-center text-gray-500 py-8">Campaign performance analytics coming soon</div>
        <div className="text-center text-gray-500 py-8">Campaign ROI tracking coming soon</div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="text-center text-gray-500 py-8">Strategic recommendations coming soon</div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard: React.FC<{ kpi: any }> = ({ kpi }) => {
  const Icon = kpi.icon;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[kpi.color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {kpi.change}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-gray-900">{kpi.value.toLocaleString()}</div>
        <div className="text-sm text-gray-600">{kpi.title}</div>
      </div>
    </div>
  );
};

// Chart Components
const StoryTrendsChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Creation Trends</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="stories" stroke="#3B82F6" strokeWidth={2} />
        <Line type="monotone" dataKey="impact_score" stroke="#10B981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const AudienceEngagementChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Engagement</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="audience" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="engagement" fill="#8B5CF6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const BrandThemesRadar: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Themes Strength</h3>
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="theme" />
        <PolarRadiusAxis angle={60} domain={[0, 10]} />
        <Radar name="Strength" dataKey="strength" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const ContentTypeDistribution: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Filter Dropdown Component
const FilterDropdown: React.FC<{
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}> = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select 
                value={filters.time_period}
                onChange={(e) => onFiltersChange({ ...filters, time_period: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to enhance data with insights
const enhanceDataWithInsights = async (data: any) => {
  // Calculate brand health
  const brandHealth = data.insights.length > 0 
    ? {
        overall_brand_health: 75 + (data.insights.length * 2),
        strongest_themes: ['cultural_strength', 'potential_first', 'transformation'],
        content_gaps: [],
        recommendations: ['Increase community stories', 'Add more visual content']
      }
    : { overall_brand_health: 75, strongest_themes: [], content_gaps: [], recommendations: [] };

  // Generate mock trend data (in production, this would come from your database)
  const storyTrends = generateMockTrendData('stories');
  const audienceEngagement = generateMockAudienceData();
  const brandThemes = generateMockBrandThemes();
  const contentDistribution = generateMockContentDistribution();

  return {
    ...data,
    brandHealth,
    storyTrends,
    audienceEngagement,
    brandThemes,
    contentDistribution,
    recentInsights: data.insights.slice(0, 5)
  };
};

// Mock data generators (replace with real data from your system)
const generateMockTrendData = (_type: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    stories: Math.floor(Math.random() * 20) + 10,
    impact_score: Math.floor(Math.random() * 30) + 70
  }));
};

const generateMockAudienceData = () => [
  { audience: 'Partners', engagement: 85 },
  { audience: 'Community', engagement: 92 },
  { audience: 'Government', engagement: 78 },
  { audience: 'Philanthropic', engagement: 88 }
];

const generateMockBrandThemes = () => [
  { theme: 'Potential First', strength: 8.5 },
  { theme: 'Cultural Strength', strength: 9.2 },
  { theme: 'Commercial Excellence', strength: 7.8 },
  { theme: 'Reciprocity', strength: 8.1 },
  { theme: 'Transformation', strength: 9.0 }
];

const generateMockContentDistribution = () => [
  { name: 'Stories', value: 45 },
  { name: 'Videos', value: 25 },
  { name: 'Photos', value: 20 },
  { name: 'Documents', value: 10 }
];

// Additional chart components and utilities...
const RecentInsightsList: React.FC<{ insights: CommunicationInsight[] }> = ({ insights }) => (
  <div className="space-y-3">
    {insights.map((insight, index) => (
      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
        <div>
          <div className="text-sm font-medium text-gray-900">{insight.insight}</div>
          <div className="text-xs text-gray-500">{insight.insight_type} • {Math.round(insight.confidence * 100)}% confidence</div>
        </div>
      </div>
    ))}
  </div>
);

const BrandHealthScore: React.FC<{ score: any }> = ({ score }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Brand Health</h3>
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">
        {score.overall_brand_health || 0}
      </div>
      <div className="text-sm text-gray-600">out of 100</div>
      <div className="mt-4 space-y-2">
        {score.strongest_themes?.map((theme: string, index: number) => (
          <div key={index} className="text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded">
            {theme.replace('_', ' ')}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StrategicCommunicationDashboard;