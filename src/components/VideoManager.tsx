import React, { useState } from 'react';
import { EMBEDDED_VIDEOS, getVideosByCategory } from './MediaIntegration';
import { Play, Clock, MapPin, Tag, Eye, Grid, Monitor } from 'lucide-react';

export const VideoManager: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'placement'>('grid');

  const categories = ['all', 'leadership', 'story', 'educational'];
  
  const filteredVideos = selectedCategory === 'all' 
    ? Object.values(EMBEDDED_VIDEOS)
    : getVideosByCategory(selectedCategory);

  const categoryColors = {
    leadership: 'bg-gray-900 text-white border-2 border-gray-700',
    story: 'bg-green-600 text-white border-2 border-green-500', 
    educational: 'bg-purple-600 text-white border-2 border-purple-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Play className="w-8 h-8 text-gray-600" />
              <div>
                <h1 className="text-2xl font-light text-gray-900">Video Library Manager</h1>
                <p className="text-gray-500">Manage and track video placement across the site</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Grid size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('placement')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === 'placement' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Monitor size={16} />
                  Placement
                </button>
              </div>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  showDetails ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Eye size={16} />
                Details
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                      selectedCategory === category ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {viewMode === 'grid' ? (
          /* Video Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Thumbnail */}
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-lg">
                  <Clock size={14} />
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                    categoryColors[video.category as keyof typeof categoryColors]
                  }`}>
                    <Tag size={12} />
                    {video.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{video.title}</h3>
                
                {showDetails && (
                  <>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{video.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Used on:</div>
                          <div className="text-sm text-gray-700">{video.location}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      ID: <code className="bg-gray-100 px-1 rounded">{video.id}</code>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                      Copy Embed Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        ) : (
          /* Placement View */
          <div className="space-y-8">
            {/* Homepage */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor size={20} />
                Homepage
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">Hero Section (Large)</h3>
                  <p className="text-sm text-gray-600 mb-2">Keiron Testimonial - Founder credibility video</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs">leadership</span>
                    <span className="text-xs text-gray-500">Size: Medium (md:w-96)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Page */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor size={20} />
                Model Page
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">Header Section</h3>
                  <p className="text-sm text-gray-600 mb-2">Keiron Testimonial - Same as homepage</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs">leadership</span>
                    <span className="text-xs text-gray-500">Size: Medium (md:w-96)</span>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">Transformation Section</h3>
                  <p className="text-sm text-gray-600 mb-2">Aden's Story - Shows programme impact</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">story</span>
                    <span className="text-xs text-gray-500">Size: Grid half-width</span>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900">Programme Overview (Large)</h3>
                  <p className="text-sm text-gray-600 mb-2">Detailed system explanation</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">educational</span>
                    <span className="text-xs text-gray-500">Size: Full-width hero</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Page */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor size={20} />
                Impact Page
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">Stories Section</h3>
                  <p className="text-sm text-gray-600 mb-2">Aden's Story - Personal transformation</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">story</span>
                    <span className="text-xs text-gray-500">Size: Grid half-width</span>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">Transformation Showcase</h3>
                  <p className="text-sm text-gray-600 mb-2">Troy's Story - Long-term success</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">story</span>
                    <span className="text-xs text-gray-500">Size: Grid half-width</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Video Guide */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-lg font-medium text-blue-900 mb-4">🎥 Adding New Videos</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">1. Choose Location</h3>
                  <p className="text-sm text-gray-600">Pick where the video will appear based on the placement guide above</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">2. Set Category</h3>
                  <p className="text-sm text-gray-600">Leadership, Story, or Educational based on content purpose</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">3. Update Code</h3>
                  <p className="text-sm text-gray-600">Add to EMBEDDED_VIDEOS in MediaIntegration.tsx</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Grid size={20} />
            How to Use Videos
          </h2>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Categories:</strong> Filter videos by their purpose (leadership, story, educational)</p>
            <p>• <strong>Placement:</strong> See exactly where each video is used across the site</p>
            <p>• <strong>Duration:</strong> Check video length to ensure appropriate placement</p>
            <p>• <strong>Thumbnails:</strong> Preview what visitors will see before playing</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>💡 Adding New Videos:</strong> Edit the EMBEDDED_VIDEOS object in MediaIntegration.tsx. 
              Include embed code, thumbnail, duration, location, and category for best organization.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};