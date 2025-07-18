import React, { useState } from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  onPhotosUploaded?: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotosUploaded,
  maxFiles = 10,
  accept = "image/*"
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Simulate upload process
      const uploadedUrls = selectedFiles.map(file => URL.createObjectURL(file));
      
      // In a real app, you'd upload to a cloud service like:
      // - Cloudinary
      // - AWS S3
      // - Firebase Storage
      
      if (onPhotosUploaded) {
        onPhotosUploaded(uploadedUrls);
      }

      setSelectedFiles([]);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload Photos
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Images
        </label>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Image className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || uploading}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? 's' : ''}
          </>
        )}
      </button>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Upload Instructions:</strong>
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Select multiple images at once</li>
          <li>Maximum file size: 5MB per image</li>
          <li>Supported formats: JPG, PNG, GIF, WebP</li>
          <li>Images are stored locally in your browser</li>
        </ul>
      </div>
    </div>
  );
};

// Simple backend setup instructions
export const BackendSetup: React.FC = () => (
  <div className="bg-blue-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-blue-900 mb-3">Backend Setup Guide</h3>
    
    <div className="space-y-3 text-sm text-blue-800">
      <p>
        <strong>For Production:</strong> Use these cloud services for photo storage:
      </p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded">
          <strong>Cloudinary</strong>
          <br />
          <code className="text-xs">npm install cloudinary-react</code>
        </div>
        
        <div className="bg-white p-3 rounded">
          <strong>AWS S3</strong>
          <br />
          <code className="text-xs">npm install aws-sdk</code>
        </div>
        
        <div className="bg-white p-3 rounded">
          <strong>Firebase</strong>
          <br />
          <code className="text-xs">npm install firebase</code>
        </div>
      </div>
      
      <p className="mt-3">
        The current setup uses local storage for demo purposes. 
        Replace the upload handler with cloud service integration.
      </p>
    </div>
  </div>
);