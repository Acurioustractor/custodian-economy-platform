import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Settings, Palette } from 'lucide-react';
import { PlaceholderImage, MEDIA_ASSETS } from './MediaAssets';

const HeroOverlayTester: React.FC = () => {
  const [overlayStyle, setOverlayStyle] = useState('gradient-dark');
  const [showControls, setShowControls] = useState(true);

  const overlayOptions = [
    {
      id: 'none',
      name: 'No Overlay',
      description: 'Pure image, no overlay',
      className: ''
    },
    {
      id: 'light',
      name: 'Light Overlay',
      description: 'Subtle dark overlay',
      className: 'bg-black bg-opacity-20'
    },
    {
      id: 'medium',
      name: 'Medium Overlay',
      description: 'Balanced dark overlay',
      className: 'bg-black bg-opacity-40'
    },
    {
      id: 'dark',
      name: 'Dark Overlay',
      description: 'Strong dark overlay',
      className: 'bg-black bg-opacity-60'
    },
    {
      id: 'gradient-dark',
      name: 'Gradient Dark',
      description: 'Gradient from dark to transparent',
      className: 'bg-gradient-to-t from-black/70 via-black/40 to-black/20'
    },
    {
      id: 'gradient-bottom',
      name: 'Bottom Gradient',
      description: 'Dark bottom, clear top',
      className: 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
    },
    {
      id: 'gradient-top',
      name: 'Top Gradient',
      description: 'Dark top, clear bottom',
      className: 'bg-gradient-to-b from-black/60 via-black/20 to-transparent'
    },
    {
      id: 'centre-fade',
      name: 'Centre Focus',
      description: 'Dark edges, light centre',
      className: 'bg-radial-gradient from-transparent via-black/20 to-black/60'
    },
    {
      id: 'blur-overlay',
      name: 'Blur Background',
      description: 'Background blur with overlay',
      className: 'bg-black bg-opacity-30 backdrop-blur-sm'
    }
  ];

  const currentOverlay = overlayOptions.find(o => o.id === overlayStyle);

  return (
    <div className="relative">
      {/* Controls Panel */}
      {showControls && (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Hero Overlay Tester</h3>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {overlayOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setOverlayStyle(option.id)}
                className={`w-full text-left p-2 rounded-lg border transition-colors ${
                  overlayStyle === option.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm text-gray-900">{option.name}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowControls(false)}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Hide Controls
          </button>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-screen">
          {/* Hero Image */}
          <PlaceholderImage 
            src={MEDIA_ASSETS.community.group}
            alt="Young people working together in the Custodian Economy"
            className="w-full h-full object-cover"
          />
          
          {/* Dynamic Overlay */}
          <div className={`absolute inset-0 ${currentOverlay?.className || ''}`}></div>
          
          {/* Text Readability Test Box */}
          <div className="absolute top-8 left-8 bg-white bg-opacity-90 p-4 rounded-lg max-w-sm">
            <div className="text-sm text-gray-900">
              <strong>Current:</strong> {currentOverlay?.name}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {currentOverlay?.description}
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-6">
              
              {/* Main Title */}
              <h1 className="text-5xl lg:text-7xl font-light text-white mb-8 leading-tight drop-shadow-lg">
                The Custodian 
                <br />
                Economy
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-white mb-12 leading-relaxed font-light max-w-3xl mx-auto drop-shadow-md">
                A proven model that transforms lives by prioritizing stability before employment. 
                Not charity. Not a programme. A sustainable economic system.
              </p>
              
              {/* Stats */}
              <div className="flex justify-center items-center gap-8 mb-12 text-center">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-light text-white drop-shadow-md">85%</div>
                  <div className="text-sm text-gray-200">retention rate</div>
                </div>
                <div className="w-px h-12 bg-white bg-opacity-30"></div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-light text-white drop-shadow-md">$1.1M</div>
                  <div className="text-sm text-gray-200">saved annually</div>
                </div>
                <div className="w-px h-12 bg-white bg-opacity-30"></div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-light text-white drop-shadow-md">400+</div>
                  <div className="text-sm text-gray-200">lives transformed</div>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/impact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  See the Impact
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                
                <Link
                  to="/model"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors backdrop-blur-sm"
                >
                  Learn the Model
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Readability Test Area */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="text-sm opacity-75 mb-2">Text readability test area:</div>
              <div className="text-lg font-light">Can you read this text clearly?</div>
              <div className="text-sm opacity-90 mt-1">
                This sample text helps you judge if the overlay provides enough contrast for good readability.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroOverlayTester;