import React, { useState, useEffect, useMemo } from 'react';
import {
  Image,
  Video,
  FileText,
  Search,
  Grid,
  List,
  Upload,
  Tag,
  Eye,
  Download,
  Edit,
  Star,
  Calendar,
  MapPin,
  User,
  Camera,
  Play,
  Zap
} from 'lucide-react';
import { empathyLedgerAPI } from '../services/empathy-ledger-api';
import { MediaAsset } from '../types/empathy-ledger';
import { useMetrics } from '../contexts/MetricsContext';

// Utility function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface MediaLibraryProps {
  onAssetSelect?: (asset: MediaAsset) => void;
  selectionMode?: boolean;
  selectedAssets?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onAssetSelect,
  selectionMode = false,
  selectedAssets = new Set(),
  onSelectionChange
}) => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    mood: 'all',
    dateRange: 'all'
  });
  
  // Connect to metrics system
  const { addActivity } = useMetrics();
  
  // Handle media upload and update metrics
  const handleUpload = async () => {
    // Simulate upload process (in real app, this would handle file selection and upload)
    try {
      // For demo, we'll just add a mock upload activity
      addActivity({
        type: 'content',
        message: 'New media asset uploaded to library'
      });
      
      // In a real implementation, you would:
      // 1. Open file picker
      // 2. Upload file to storage
      // 3. Create media asset record
      // 4. Refresh the media list
      // 5. Update content metrics
      
      alert('Upload functionality would be implemented here. Activity logged to dashboard.');
      
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  // Handle auto-tagging with metrics
  const handleAutoTag = async () => {
    const selectedCount = selectedAssets.size;
    const targetAssets = selectedCount > 0 ? Array.from(selectedAssets) : filteredAssets.map(a => a.id);
    
    addActivity({
      type: 'content',
      message: `Auto-tagging initiated for ${targetAssets.length} media assets`
    });
    
    // Simulate processing
    alert(`Auto-tagging ${targetAssets.length} assets. Activity logged to dashboard.`);
  };

  const categories = [
    { key: 'all', label: 'All Categories', count: 0 },
    { key: 'workplace', label: 'Workplace', count: 0, icon: Grid },
    { key: 'portrait', label: 'Portraits', count: 0, icon: User },
    { key: 'event', label: 'Events', count: 0, icon: Calendar },
    { key: 'community', label: 'Community', count: 0, icon: MapPin },
    { key: 'cultural', label: 'Cultural', count: 0, icon: Star },
    { key: 'training', label: 'Training', count: 0, icon: FileText }
  ];

  const mediaTypes = [
    { key: 'all', label: 'All Types', icon: Grid },
    { key: 'photo', label: 'Photos', icon: Image },
    { key: 'video', label: 'Videos', icon: Video },
    { key: 'document', label: 'Documents', icon: FileText }
  ];

  useEffect(() => {
    loadMediaAssets();
  }, [filters]);

  const loadMediaAssets = async () => {
    setLoading(true);
    try {
      const searchParams = {
        content_types: filters.type !== 'all' ? [filters.type as 'media' | 'story' | 'transcript'] : undefined,
        // Add other filter parameters as needed
      };

      const response = await empathyLedgerAPI.getMediaAssets(searchParams);
      if (response.success) {
        setMediaAssets(response.data);
        
        // Log media library access activity
        addActivity({
          type: 'content',
          message: `Media library accessed - ${response.data.length} assets loaded`
        });
      }
    } catch (error) {
      console.error('Failed to load media assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mediaAssets.filter(asset => {
      const matchesSearch = 
        asset.title.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query) ||
        asset.alt_text.toLowerCase().includes(query);

      const matchesType = filters.type === 'all' || asset.type === filters.type;
      const matchesCategory = filters.category === 'all' || asset.category === filters.category;
      const matchesMood = filters.mood === 'all' || asset.mood === filters.mood;

      return matchesSearch && matchesType && matchesCategory && matchesMood;
    });
  }, [mediaAssets, searchQuery, filters]);

  const handleAssetSelect = (asset: MediaAsset) => {
    if (selectionMode && onSelectionChange) {
      const newSelected = new Set(selectedAssets);
      if (newSelected.has(asset.id)) {
        newSelected.delete(asset.id);
      } else {
        newSelected.add(asset.id);
      }
      onSelectionChange(newSelected);
    } else if (onAssetSelect) {
      onAssetSelect(asset);
    }
  };

  const getAssetStats = () => {
    const totalSize = mediaAssets.reduce((sum, asset) => sum + asset.file_size, 0);
    const typeBreakdown = mediaAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: mediaAssets.length,
      totalSize: formatFileSize(totalSize),
      photos: typeBreakdown.photo || 0,
      videos: typeBreakdown.video || 0,
      documents: typeBreakdown.document || 0
    };
  };

  const stats = getAssetStats();

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
          <h1 className="text-3xl font-light text-gray-900 mb-2">Media Library</h1>
          <p className="text-gray-600">Manage and organize your empathy ledger media assets</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <button 
            onClick={handleAutoTag}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Auto-Tag
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Grid className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-semibold text-blue-600">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Assets</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Image className="h-6 w-6 text-green-600" />
            <span className="text-2xl font-semibold text-green-600">{stats.photos}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Photos</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Video className="h-6 w-6 text-purple-600" />
            <span className="text-2xl font-semibold text-purple-600">{stats.videos}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Videos</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <FileText className="h-6 w-6 text-orange-600" />
            <span className="text-2xl font-semibold text-orange-600">{stats.documents}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Documents</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <Star className="h-6 w-6 text-gray-600" />
            <span className="text-lg font-semibold text-gray-600">{stats.totalSize}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Storage Used</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search media by title, description, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              {mediaTypes.map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>

            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>{category.label}</option>
              ))}
            </select>

            <div className="flex bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <MediaGrid 
          assets={filteredAssets}
          onAssetSelect={handleAssetSelect}
          selectionMode={selectionMode}
          selectedAssets={selectedAssets}
        />
      ) : (
        <MediaList 
          assets={filteredAssets}
          onAssetSelect={handleAssetSelect}
          selectionMode={selectionMode}
          selectedAssets={selectedAssets}
        />
      )}

      {filteredAssets.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Image className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

// Media Grid Component
const MediaGrid: React.FC<{
  assets: MediaAsset[];
  onAssetSelect: (asset: MediaAsset) => void;
  selectionMode: boolean;
  selectedAssets: Set<string>;
}> = ({ assets, onAssetSelect, selectionMode, selectedAssets }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <MediaCard 
          key={asset.id} 
          asset={asset} 
          onSelect={onAssetSelect}
          selectionMode={selectionMode}
          isSelected={selectedAssets.has(asset.id)}
        />
      ))}
    </div>
  );
};

// Media List Component
const MediaList: React.FC<{
  assets: MediaAsset[];
  onAssetSelect: (asset: MediaAsset) => void;
  selectionMode: boolean;
  selectedAssets: Set<string>;
}> = ({ assets, onAssetSelect, selectionMode, selectedAssets }) => {
  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <MediaListItem 
          key={asset.id} 
          asset={asset} 
          onSelect={onAssetSelect}
          selectionMode={selectionMode}
          isSelected={selectedAssets.has(asset.id)}
        />
      ))}
    </div>
  );
};

// Individual Media Card
const MediaCard: React.FC<{
  asset: MediaAsset;
  onSelect: (asset: MediaAsset) => void;
  selectionMode: boolean;
  isSelected: boolean;
}> = ({ asset, onSelect, selectionMode, isSelected }) => {
  const getTypeIcon = () => {
    switch (asset.type) {
      case 'photo': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div 
      className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={() => onSelect(asset)}
    >
      <div className="relative aspect-square">
        {asset.type === 'photo' ? (
          <img 
            src={asset.thumbnail_url || asset.file_url} 
            alt={asset.alt_text}
            className="w-full h-full object-cover"
          />
        ) : asset.type === 'video' ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
            <Play className="h-8 w-8 text-white opacity-80" />
            {asset.thumbnail_url && (
              <img 
                src={asset.thumbnail_url} 
                alt={asset.alt_text}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <TypeIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        {selectionMode && (
          <div className="absolute top-2 left-2">
            <div className={`w-5 h-5 rounded border-2 ${
              isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
            } flex items-center justify-center`}>
              {isSelected && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
            {asset.category}
          </span>
        </div>

        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
            {formatFileSize(asset.file_size)}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">{asset.title}</h4>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{asset.description}</p>
        
        {/* Smart Tags */}
        {asset.suitable_for && asset.suitable_for.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {asset.suitable_for.slice(0, 2).map((tag) => (
              <span key={tag} className="px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(asset.date_created).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Camera className="h-3 w-3" />
            {asset.format.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Media List Item Component
const MediaListItem: React.FC<{
  asset: MediaAsset;
  onSelect: (asset: MediaAsset) => void;
  selectionMode: boolean;
  isSelected: boolean;
}> = ({ asset, onSelect, selectionMode, isSelected }) => {
  const getTypeIcon = () => {
    switch (asset.type) {
      case 'photo': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div 
      className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={() => onSelect(asset)}
    >
      <div className="flex items-start gap-4">
        {selectionMode && (
          <div className={`w-5 h-5 rounded border-2 mt-1 ${
            isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          } flex items-center justify-center`}>
            {isSelected && <span className="text-white text-xs">✓</span>}
          </div>
        )}
        
        <div className="flex-shrink-0">
          {asset.type === 'photo' && asset.thumbnail_url ? (
            <img 
              src={asset.thumbnail_url} 
              alt={asset.alt_text}
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <TypeIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 truncate">{asset.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{asset.description}</p>
            </div>
            <div className="text-sm text-gray-500 ml-4">
              {formatFileSize(asset.file_size)}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TypeIcon className="h-3 w-3" />
              {asset.type}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {asset.category}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(asset.date_created).toLocaleDateString()}
            </div>
            {asset.photographer_videographer && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {asset.photographer_videographer}
              </div>
            )}
          </div>
          
          {/* Smart Tags */}
          {asset.suitable_for && asset.suitable_for.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {asset.suitable_for.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-1 ml-4">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;