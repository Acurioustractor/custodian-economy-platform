// Simple media management system for easy URL/embed input
import React, { useState } from 'react';

// Simple form component for adding media URLs
export const MediaInputForm = ({ onMediaUpdate, type = 'image' }: {
  onMediaUpdate: (url: string) => void;
  type?: 'image' | 'video' | 'youtube';
}) => {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onMediaUpdate(url.trim());
      setUrl('');
      setLabel('');
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'youtube':
        return 'YouTube video ID (e.g., abc123xyz)';
      case 'video':
        return 'Video URL (e.g., https://vimeo.com/123456)';
      default:
        return 'Image URL (e.g., https://images.unsplash.com/photo...)';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <h4 className="font-semibold mb-2">Add {type === 'youtube' ? 'YouTube' : type} Media</h4>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        {type === 'image' && (
          <input
            type="text"
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Add {type === 'youtube' ? 'Video' : type}
        </button>
      </form>
    </div>
  );
};

// Quick reference for common URLs
export const MediaReference = () => (
  <div className="bg-gray-50 p-4 rounded-lg text-sm">
    <h4 className="font-semibold mb-2">Quick Reference</h4>
    <div className="space-y-1">
      <div><strong>Unsplash:</strong> https://images.unsplash.com/photo-ID?w=800&h=600&fit=crop</div>
      <div><strong>YouTube:</strong> Use video ID only (e.g., dQw4w9WgXcQ)</div>
      <div><strong>Vimeo:</strong> Use video ID only (e.g., 123456789)</div>
    </div>
  </div>
);

// Simple gallery component
export const ImageGallery = ({ images = [] }: { images: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {images.map((image, index) => (
      <div key={index} className="relative group">
        <img
          src={image}
          alt={`Gallery image ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
      </div>
    ))}
  </div>
);