import React, { useState } from 'react';
import { PlaceholderImage, MEDIA_ASSETS } from '../components/MediaAssets';
import { Camera, Grid, Monitor, Smartphone, Eye, Settings } from 'lucide-react';

const PhotoPreviewPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showLabels, setShowLabels] = useState(true);

  const photoMappings = [
    {
      section: 'HOMEPAGE HERO',
      description: 'Full-screen hero image with text overlay',
      asset: MEDIA_ASSETS.community.group,
      aspectRatio: 'aspect-video',
      size: 'Large (1200x800px recommended)',
      className: 'w-full h-96 lg:h-[500px]',
      usage: 'Main impact photo - should show people working/community'
    },
    {
      section: 'HOMEPAGE FEATURED',
      description: 'Large featured training photo',
      asset: MEDIA_ASSETS.program.training,
      aspectRatio: 'aspect-[4/3]',
      size: 'Large (800x600px recommended)',
      className: 'w-full h-96',
      usage: 'Training/programme in action'
    },
    {
      section: 'HOMEPAGE GALLERY - Square 1',
      description: 'Square photo in 3-column grid',
      asset: MEDIA_ASSETS.aden.working,
      aspectRatio: 'aspect-square',
      size: 'Medium (400x400px recommended)',
      className: 'w-full h-80',
      usage: 'Person working/employment success'
    },
    {
      section: 'HOMEPAGE GALLERY - Square 2',
      description: 'Square photo in 3-column grid',
      asset: MEDIA_ASSETS.community.mentoring,
      aspectRatio: 'aspect-square',
      size: 'Medium (400x400px recommended)',
      className: 'w-full h-80',
      usage: 'Mentoring/community connection'
    },
    {
      section: 'HOMEPAGE GALLERY - Square 3',
      description: 'Square photo in 3-column grid',
      asset: MEDIA_ASSETS.troy.portrait,
      aspectRatio: 'aspect-square',
      size: 'Medium (400x400px recommended)',
      className: 'w-full h-80',
      usage: 'Success story portrait'
    },
    {
      section: 'HOMEPAGE LARGE PORTRAIT',
      description: 'Large portrait photo (left side)',
      asset: MEDIA_ASSETS.keiron.portrait,
      aspectRatio: 'aspect-[4/5]',
      size: 'Large (400x500px recommended)',
      className: 'w-full h-96',
      usage: 'Leadership/founder photo'
    },
    {
      section: 'HOMEPAGE STACKED 1',
      description: 'Horizontal photo (top right)',
      asset: MEDIA_ASSETS.aden.portrait,
      aspectRatio: 'aspect-[5/3]',
      size: 'Medium (500x300px recommended)',
      className: 'w-full h-48',
      usage: 'Community building moment'
    },
    {
      section: 'HOMEPAGE STACKED 2',
      description: 'Horizontal photo (bottom right)',
      asset: MEDIA_ASSETS.community.group,
      aspectRatio: 'aspect-[5/3]',
      size: 'Medium (500x300px recommended)',
      className: 'w-full h-48',
      usage: 'Team celebration/achievement'
    },
    {
      section: 'IMPACT PAGE - Story Cards',
      description: 'Small portrait photos in story cards',
      asset: MEDIA_ASSETS.troy.portrait,
      aspectRatio: 'aspect-square',
      size: 'Small (200x200px recommended)',
      className: 'w-24 h-24',
      usage: 'Individual story portraits'
    },
    {
      section: 'MODEL PAGE - Process Sections',
      description: 'Various photos throughout model explanation',
      asset: MEDIA_ASSETS.program.workshop,
      aspectRatio: 'aspect-video',
      size: 'Medium (600x400px recommended)',
      className: 'w-full h-64',
      usage: 'Process and methodology photos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Camera className="w-8 h-8 text-gray-600" />
              <div>
                <h1 className="text-2xl font-light text-gray-900">Photo Preview & Placement</h1>
                <p className="text-gray-500">See exactly where each photo appears on the site</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    showLabels ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Eye size={16} />
                  Labels
                </button>
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === 'desktop' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Monitor size={16} />
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    viewMode === 'mobile' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Smartphone size={16} />
                  Mobile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`mx-auto px-6 py-8 ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-7xl'}`}>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Settings size={20} />
            How to Use This Preview
          </h2>
          <div className="text-blue-800 space-y-2">
            <p>• Each photo below shows exactly where it appears on your website</p>
            <p>• Check if photos look good at the displayed size and aspect ratio</p>
            <p>• Replace photos by adding new files to the assets folder with the same name</p>
            <p>• Toggle mobile view to see how photos look on phones</p>
            <p>• Use the labels to understand the context of each placement</p>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid gap-8">
          {photoMappings.map((photo, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Header */}
              {showLabels && (
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{photo.section}</h3>
                      <p className="text-gray-600 mb-2">{photo.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📐 {photo.size}</span>
                        <span>📱 {photo.aspectRatio}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Usage:</div>
                      <div className="text-sm text-gray-700 max-w-xs">{photo.usage}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Photo Preview */}
              <div className="p-6">
                <div className="relative">
                  <PlaceholderImage
                    src={photo.asset}
                    alt={`Preview: ${photo.section}`}
                    className={`${photo.className} rounded-lg shadow-sm border border-gray-200`}
                  />
                  
                  {/* Overlay Label */}
                  {showLabels && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm font-medium">
                      {photo.section}
                    </div>
                  )}
                  
                  {/* Aspect Ratio Indicator */}
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
                    {photo.aspectRatio}
                  </div>
                </div>
                
                {/* File Path */}
                {showLabels && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">File location:</div>
                    <div className="text-sm font-mono text-gray-700">{photo.asset}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* File Structure Help */}
        <div className="mt-12 bg-gray-900 text-white rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Grid size={20} />
            Your Current File Structure
          </h3>
          <div className="font-mono text-sm space-y-1 text-gray-300">
            <div>📁 src/assets/images/</div>
            <div className="ml-4">📁 community/</div>
            <div className="ml-8">📷 aden-portrait.jpg</div>
            <div className="ml-8">📷 aden-working.jpg</div>
            <div className="ml-8">📷 keiron-portrait.jpg</div>
            <div className="ml-8">📷 troy-portrait.jpg</div>
            <div className="ml-4">📁 people/</div>
            <div className="ml-8">📷 group-photo.jpg</div>
            <div className="ml-8">📷 mentoring-session.jpg</div>
            <div className="ml-4">📁 program/</div>
            <div className="ml-8">📷 training-session.jpg</div>
            <div className="ml-8">📷 workshop.jpg</div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-300">
              <strong>💡 Tip:</strong> To replace a photo, just add a new file with the same name to the same folder. 
              The website will automatically use the new image!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoPreviewPage;