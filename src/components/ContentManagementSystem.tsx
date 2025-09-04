import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  BarChart3, 
  Image,
  Video,
  FileText,
  Tag,
  Calendar,
  MapPin,
  TrendingUp,
  Star
} from 'lucide-react';
import { empathyLedgerAPI, ContentHelper } from '../services/empathy-ledger-api';
import { Story, MediaAsset, ContentAnalysis, ContentSearchParams } from '../types/empathy-ledger';
import { useMetrics } from '../contexts/MetricsContext';
import { emailNotificationService } from '../services/email-notification-service';
import { authService } from '../services/auth-service';
import { dataExportService } from '../services/data-export-service';
import { GlobalSearch } from './GlobalSearch';
import { SearchResult } from '../services/search-service';

interface ContentManagementProps {
  onContentSelect?: (content: any) => void;
  selectedCampaign?: string;
}

export const ContentManagementSystem: React.FC<ContentManagementProps> = ({
  onContentSelect,
  selectedCampaign
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [analyses, setAnalyses] = useState<ContentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stories' | 'media' | 'insights'>('stories');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ContentSearchParams>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false);
  
  // Connect to metrics system
  const { incrementStoriesAnalyzed, addActivity } = useMetrics();

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, [filters]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [storiesRes, mediaRes, insightsRes] = await Promise.all([
        empathyLedgerAPI.getStories(filters),
        empathyLedgerAPI.getMediaAssets(filters),
        empathyLedgerAPI.getBrandDNAInsights()
      ]);

      if (storiesRes.success) setStories(storiesRes.data);
      if (mediaRes.success) setMediaAssets(mediaRes.data);
      if (insightsRes.success) setAnalyses(insightsRes.data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on search and filters
  const filteredContent = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    const filteredStories = stories.filter(story => 
      story.title.toLowerCase().includes(query) ||
      story.participant_name.toLowerCase().includes(query) ||
      story.content.toLowerCase().includes(query) ||
      story.themes.some(theme => theme.toLowerCase().includes(query))
    );

    const filteredMedia = mediaAssets.filter(asset =>
      asset.title.toLowerCase().includes(query) ||
      asset.description.toLowerCase().includes(query) ||
      asset.category.toLowerCase().includes(query)
    );

    return { stories: filteredStories, media: filteredMedia };
  }, [stories, mediaAssets, searchQuery]);

  // Content statistics
  const stats = useMemo(() => {
    const totalStories = stories.length;
    const totalMedia = mediaAssets.length;
    const highImpactStories = ContentHelper.getHighImpactContent(stories).length;
    const themes = [...new Set(stories.flatMap(s => s.themes))].length;

    return {
      totalStories,
      totalMedia,
      highImpactStories,
      themes,
      completionRate: stories.filter(s => s.transcript_id).length / totalStories * 100
    };
  }, [stories, mediaAssets]);

  const handleItemSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  // Handle search result selection from GlobalSearch
  const handleSearchResultSelect = (result: SearchResult) => {
    // Navigate to the selected content based on its type
    if (result.type === 'story') {
      setActiveTab('stories');
    } else if (result.type === 'media') {
      setActiveTab('media');
    } else if (result.type === 'analysis') {
      setActiveTab('insights');
    }
    
    // If there's a content select handler, call it
    if (onContentSelect) {
      onContentSelect(result);
    }
    
    // Add activity log
    addActivity({
      type: 'content',
      message: `Opened ${result.type}: "${result.title}" from search`
    });
  };

  const handleBulkAction = async (action: string) => {
    const selectedIds = Array.from(selectedItems);
    const currentUser = authService.getAuthState().user;
    
    switch (action) {
      case 'analyze':
        // Analyze content and update real metrics
        await Promise.all(
          selectedIds.map(async (id) => {
            const story = stories.find(s => s.id === id);
            await empathyLedgerAPI.analyzeContent(id, 'story');
            // Update real metrics for each story analyzed
            incrementStoriesAnalyzed();
            addActivity({
              type: 'content',
              message: `Story "${story?.title || 'Unknown'}" analyzed`
            });
            
            // Send email notification for completed analysis
            if (story) {
              await emailNotificationService.notifyNewStory({
                title: story.title,
                authorName: story.participant_name,
                category: story.themes.join(', '),
                submissionDate: new Date(story.date_recorded),
                storyId: story.id
              });
            }
          })
        );
        // Refresh the content to show updated analysis
        await loadContent();
        break;
      case 'export':
        // Export selected content using data export service
        try {
          const exportResult = await dataExportService.exportData({
            type: 'csv',
            dateRange: 'all',
            includeMetrics: false,
            includeActivities: false,
            includeUsers: false,
            includeContent: true,
            includeBrandAnalysis: true,
            includeTestResults: false,
            template: 'technical',
            filters: {
              contentTypes: ['story'],
              // Could add more specific filters based on selectedIds
            }
          });
          
          if (exportResult.success) {
            addActivity({
              type: 'content',
              message: `Exported ${selectedIds.length} content items: ${exportResult.filename}`
            });
          }
        } catch (error) {
          console.error('Export failed:', error);
          addActivity({
            type: 'content',
            message: `Failed to export ${selectedIds.length} content items`
          });
        }
        break;
      case 'campaign':
        // Add to campaign
        if (onContentSelect) {
          selectedIds.forEach(id => {
            const content = stories.find(s => s.id === id) || mediaAssets.find(m => m.id === id);
            if (content) onContentSelect(content);
          });
        }
        addActivity({
          type: 'content',
          message: `Added ${selectedIds.length} items to campaign`
        });
        break;
    }
    
    setSelectedItems(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage stories, media, and insights from your empathy ledger</p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-semibold text-blue-600">{stats.totalStories}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Stories</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Image className="h-6 w-6 text-green-600" />
            <span className="text-2xl font-semibold text-green-600">{stats.totalMedia}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Media Assets</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-semibold text-yellow-600">{stats.highImpactStories}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">High Impact</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Tag className="h-6 w-6 text-purple-600" />
            <span className="text-2xl font-semibold text-purple-600">{stats.themes}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Themes</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span className="text-2xl font-semibold text-indigo-600">{stats.completionRate.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Analyzed</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col gap-4">
          {/* Enhanced Search Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
            <button
              onClick={() => setShowEnhancedSearch(!showEnhancedSearch)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showEnhancedSearch 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {showEnhancedSearch ? 'Simple Search' : 'Enhanced Search'}
            </button>
          </div>
          
          {showEnhancedSearch ? (
            /* Enhanced Search with GlobalSearch */
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <GlobalSearch 
                embedded={true}
                onResultSelect={handleSearchResultSelect}
                defaultFilters={{
                  contentTypes: ['story', 'media', 'analysis']
                }}
              />
            </div>
          ) : (
            /* Simple Search Interface */
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search stories, participants, themes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.impact_level?.[0] || ''}
                  onChange={(e) => setFilters({...filters, impact_level: e.target.value ? [e.target.value] : undefined})}
                >
                  <option value="">All Impact Levels</option>
                  <option value="individual">Individual</option>
                  <option value="family">Family</option>
                  <option value="community">Community</option>
                  <option value="business">Business</option>
                </select>

                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.content_types?.[0] || ''}
                  onChange={(e) => setFilters({...filters, content_types: e.target.value ? [e.target.value as any] : undefined})}
                >
                  <option value="">All Types</option>
                  <option value="story">Stories</option>
                  <option value="media">Media</option>
                  <option value="transcript">Transcripts</option>
                </select>

                <button 
                  onClick={() => setShowEnhancedSearch(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  More Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'stories', label: 'Stories', icon: FileText, count: filteredContent.stories.length },
            { key: 'media', label: 'Media', icon: Image, count: filteredContent.media.length },
            { key: 'insights', label: 'Insights', icon: BarChart3, count: analyses.length }
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
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('analyze')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Analyze
              </button>
              <button 
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Export
              </button>
              {selectedCampaign && (
                <button 
                  onClick={() => handleBulkAction('campaign')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Add to Campaign
                </button>
              )}
              <button 
                onClick={() => setSelectedItems(new Set())}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Display */}
      <div className="space-y-6">
        {activeTab === 'stories' && (
          <StoriesGrid 
            stories={filteredContent.stories}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onContentSelect={onContentSelect}
          />
        )}
        
        {activeTab === 'media' && (
          <MediaGrid 
            mediaAssets={filteredContent.media}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onContentSelect={onContentSelect}
          />
        )}
        
        {activeTab === 'insights' && (
          <InsightsGrid 
            analyses={analyses}
            onContentSelect={onContentSelect}
          />
        )}
      </div>
    </div>
  );
};

// Stories Grid Component
const StoriesGrid: React.FC<{
  stories: Story[];
  selectedItems: Set<string>;
  onItemSelect: (id: string, checked: boolean) => void;
  onContentSelect?: (content: any) => void;
}> = ({ stories, selectedItems, onItemSelect, onContentSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <div key={story.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <input
              type="checkbox"
              checked={selectedItems.has(story.id)}
              onChange={(e) => onItemSelect(story.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex gap-1">
              {story.brand_values_demonstrated?.slice(0, 3).map((value) => (
                <span key={value.name} className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
              ))}
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-2">{story.title}</h3>
          <p className="text-sm text-gray-600 mb-2">by {story.participant_name}</p>
          <p className="text-sm text-gray-500 mb-4 line-clamp-3">{story.summary}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {story.themes.slice(0, 3).map((theme) => (
              <span key={theme} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {theme}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(story.date_recorded).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {story.location}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => onContentSelect?.(story)}
              className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              <Eye className="h-3 w-3 inline mr-1" />
              View
            </button>
            <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100">
              <Edit className="h-3 w-3 inline mr-1" />
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Media Grid Component  
const MediaGrid: React.FC<{
  mediaAssets: MediaAsset[];
  selectedItems: Set<string>;
  onItemSelect: (id: string, checked: boolean) => void;
  onContentSelect?: (content: any) => void;
}> = ({ mediaAssets, selectedItems, onItemSelect, onContentSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaAssets.map((asset) => (
        <div key={asset.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            {asset.type === 'photo' ? (
              <img 
                src={asset.thumbnail_url || asset.file_url} 
                alt={asset.alt_text}
                className="w-full h-32 object-cover"
              />
            ) : asset.type === 'video' ? (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <Video className="h-8 w-8 text-gray-400" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedItems.has(asset.id)}
                onChange={(e) => onItemSelect(asset.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                {asset.category}
              </span>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">{asset.title}</h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{asset.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{asset.format.toUpperCase()}</span>
              <span>{Math.round(asset.file_size / 1024)}KB</span>
            </div>
            
            <button 
              onClick={() => onContentSelect?.(asset)}
              className="w-full mt-2 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Insights Grid Component
const InsightsGrid: React.FC<{
  analyses: ContentAnalysis[];
  onContentSelect?: (content: any) => void;
}> = ({ analyses, onContentSelect }) => {
  return (
    <div className="space-y-6">
      {analyses.map((analysis) => (
        <div key={analysis.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Content Analysis - {analysis.content_type}
              </h3>
              <p className="text-sm text-gray-600">
                Analyzed on {new Date(analysis.analyzed_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-blue-600">
                {analysis.brand_dna_score.overall_score}
              </div>
              <div className="text-xs text-gray-500">Overall Score</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {Object.entries(analysis.brand_dna_score).filter(([key]) => key !== 'overall_score').map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-medium text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Key Insights</h4>
            {analysis.communication_insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-1">
                      {insight.insight_type}
                    </span>
                    <p className="text-sm text-gray-900">{insight.insight}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(insight.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => onContentSelect?.(analysis)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
            >
              View Full Analysis
            </button>
            <button className="px-4 py-2 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100">
              Export Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentManagementSystem;