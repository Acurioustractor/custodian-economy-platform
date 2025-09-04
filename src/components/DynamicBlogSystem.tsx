import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Edit, 
  Filter,
  Search,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  Download,
  Sparkles,
  Target,
  Users2,
  Building2
} from 'lucide-react';
import { empathyLedgerAPI } from '../services/empathy-ledger-api';
import { BlogPost, Story } from '../types/empathy-ledger';

interface DynamicBlogSystemProps {
  onPostSelect?: (post: BlogPost) => void;
}

export const DynamicBlogSystem: React.FC<DynamicBlogSystemProps> = ({ onPostSelect }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [generationConfig, setGenerationConfig] = useState({
    category: 'success_stories',
    sourceStories: [] as string[],
    targetAudience: 'partners'
  });

  const categories = [
    { key: 'all', label: 'All Posts', count: 0 },
    { key: 'success_stories', label: 'Success Stories', count: 0, icon: TrendingUp },
    { key: 'business_innovation', label: 'Business Innovation', count: 0, icon: Target },
    { key: 'cultural_strength', label: 'Cultural Strength', count: 0, icon: Users2 },
    { key: 'industry_leadership', label: 'Industry Leadership', count: 0, icon: Building2 }
  ];

  useEffect(() => {
    loadBlogPosts();
  }, [selectedCategory]);

  const loadBlogPosts = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const response = await empathyLedgerAPI.getBlogPosts(category);
      
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const handleGeneratePost = async () => {
    try {
      const response = await empathyLedgerAPI.generateBlogPost(
        generationConfig.sourceStories,
        generationConfig.category
      );
      
      if (response.success) {
        setPosts([response.data, ...posts]);
        setShowGenerator(false);
      }
    } catch (error) {
      console.error('Failed to generate blog post:', error);
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      const response = await empathyLedgerAPI.publishBlogPost(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, status: 'published' } : post
        ));
      }
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Dynamic Blog System</h1>
          <p className="text-gray-600">AI-powered content generation from your empathy ledger</p>
        </div>
        <button 
          onClick={() => setShowGenerator(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          Generate Post
        </button>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {categories.map((category) => {
            const Icon = category.icon || Filter;
            const count = posts.filter(p => 
              category.key === 'all' || p.category === category.key
            ).length;
            
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedCategory === category.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search posts by title, content, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {filteredPosts.map((post) => (
            <BlogPostCard 
              key={post.id} 
              post={post} 
              onSelect={onPostSelect}
              onPublish={handlePublishPost}
            />
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <button 
                onClick={() => setShowGenerator(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Generate Your First Post
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BlogInsightsSidebar posts={posts} />
          <RecentActivitySidebar />
        </div>
      </div>

      {/* Post Generator Modal */}
      {showGenerator && (
        <BlogPostGenerator
          config={generationConfig}
          onConfigChange={setGenerationConfig}
          onGenerate={handleGeneratePost}
          onClose={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
};

// Individual Blog Post Card Component
const BlogPostCard: React.FC<{
  post: BlogPost;
  onSelect?: (post: BlogPost) => void;
  onPublish: (id: string) => void;
}> = ({ post, onSelect, onPublish }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success_stories': return TrendingUp;
      case 'business_innovation': return Target;
      case 'cultural_strength': return Users2;
      case 'industry_leadership': return Building2;
      default: return MessageCircle;
    }
  };

  const CategoryIcon = getCategoryIcon(post.category);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <CategoryIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
              {post.status}
            </span>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              {new Date(post.publish_date).toLocaleDateString()}
              <User className="h-3 w-3 ml-2" />
              {post.author}
            </div>
          </div>
        </div>
        
        {post.featured_image && (
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Content */}
      <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
        {post.title}
      </h2>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {post.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            #{tag}
          </span>
        ))}
        {post.tags.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
            +{post.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.view_count || 0}
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            {post.engagement_metrics?.shares || 0}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.engagement_metrics?.comments || 0}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400">Conversion Rate</div>
          <div className="font-medium">
            {post.conversion_tracking ? 
              Math.round((post.conversion_tracking.inquiries_generated / Math.max(post.view_count || 1, 1)) * 100) 
              : 0}%
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onSelect?.(post)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        
        {post.status !== 'published' && (
          <button 
            onClick={() => onPublish(post.id)}
            className="px-3 py-2 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Publish
          </button>
        )}
        
        <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100">
          <Edit className="h-4 w-4" />
        </button>
        
        <button className="px-3 py-2 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

// Blog Insights Sidebar
const BlogInsightsSidebar: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const stats = useMemo(() => {
    const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
    const avgEngagement = posts.reduce((sum, post) => 
      sum + ((post.engagement_metrics?.shares || 0) + (post.engagement_metrics?.comments || 0)), 0
    ) / Math.max(posts.length, 1);
    
    const topCategory = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + (post.view_count || 0);
      return acc;
    }, {} as Record<string, number>);
    
    const bestCategory = Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0];
    
    return {
      totalViews: totalViews.toLocaleString(),
      avgEngagement: Math.round(avgEngagement),
      bestCategory: bestCategory ? bestCategory[0].replace('_', ' ') : 'N/A',
      publishedCount: posts.filter(p => p.status === 'published').length
    };
  }, [posts]);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Blog Performance
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-green-600">{stats.publishedCount}</div>
          <div className="text-sm text-gray-600">Published Posts</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgEngagement}</div>
          <div className="text-sm text-gray-600">Avg. Engagement</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-900 capitalize">{stats.bestCategory}</div>
          <div className="text-sm text-gray-600">Top Category</div>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Sidebar
const RecentActivitySidebar: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {[
          { action: 'Published', post: 'Troy\'s Leadership Journey', time: '2 hours ago' },
          { action: 'Generated', post: 'Business Innovation Series #3', time: '5 hours ago' },
          { action: 'Reviewed', post: 'Cultural Strength in Action', time: '1 day ago' }
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {item.action} "{item.post}"
              </div>
              <div className="text-xs text-gray-500">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Blog Post Generator Modal
const BlogPostGenerator: React.FC<{
  config: any;
  onConfigChange: (config: any) => void;
  onGenerate: () => void;
  onClose: () => void;
}> = ({ config, onConfigChange, onGenerate, onClose }) => {
  const [availableStories, setAvailableStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableStories();
  }, []);

  const loadAvailableStories = async () => {
    try {
      const response = await empathyLedgerAPI.getStories({ permission_level: ['public', 'partner'] });
      if (response.success) {
        setAvailableStories(response.data);
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Generate Blog Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Category
            </label>
            <select 
              value={config.category}
              onChange={(e) => onConfigChange({ ...config, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="success_stories">Success Stories</option>
              <option value="business_innovation">Business Innovation</option>
              <option value="cultural_strength">Cultural Strength</option>
              <option value="industry_leadership">Industry Leadership</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select 
              value={config.targetAudience}
              onChange={(e) => onConfigChange({ ...config, targetAudience: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="partners">Corporate Partners</option>
              <option value="community">Indigenous Community</option>
              <option value="government">Government & Policy</option>
              <option value="philanthropic">Philanthropic Sector</option>
            </select>
          </div>

          {/* Story Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Stories ({config.sourceStories.length} selected)
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {availableStories.map((story) => (
                <label key={story.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={config.sourceStories.includes(story.id)}
                    onChange={(e) => {
                      const newStories = e.target.checked 
                        ? [...config.sourceStories, story.id]
                        : config.sourceStories.filter((id: string) => id !== story.id);
                      onConfigChange({ ...config, sourceStories: newStories });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{story.title}</div>
                    <div className="text-xs text-gray-500">by {story.participant_name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || config.sourceStories.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicBlogSystem;