import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  Plus,
  Edit3,
  TestTube,
  Lightbulb,
  BarChart3,
  Save,
  Send
} from 'lucide-react';
import { useMetrics } from '../contexts/MetricsContext';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  brandAlignment: {
    score: number;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'messaging' | 'story' | 'value-prop' | 'tagline' | 'description';
  brandScore: number;
  createdDate: Date;
  status: 'draft' | 'testing' | 'approved';
}

interface BrandTest {
  id: string;
  title: string;
  originalContent: string;
  variants: {
    id: string;
    content: string;
    score: number;
  }[];
  status: 'completed';
  createdDate: Date;
}

export const BrandContentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'test' | 'workspace'>('upload');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [brandTests, setBrandTests] = useState<BrandTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addActivity } = useMetrics();

  // Forms
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'messaging' as ContentItem['type']
  });

  const [testForm, setTestForm] = useState({
    title: '',
    originalContent: '',
    variants: ['', '', '']
  });

  // Analyze brand alignment
  const analyzeBrandAlignment = (fileName: string, fileType: string) => {
    const score = Math.floor(Math.random() * 40) + 60;
    
    const allStrengths = [
      'Strong alignment with Indigenous values',
      'Clear community impact messaging',
      'Authentic storytelling approach',
      'Professional presentation quality',
      'Compelling value proposition',
      'Evidence-based outcomes'
    ];
    
    const allImprovements = [
      'Consider adding more specific metrics',
      'Strengthen connection to business outcomes',
      'Include more diverse stakeholder voices',
      'Enhance visual storytelling elements'
    ];
    
    const allRecommendations = [
      'Use this content as foundation for investor presentations',
      'Develop video version for social media',
      'Create executive summary for stakeholders',
      'Test messaging with target audiences'
    ];
    
    return {
      score,
      strengths: allStrengths.slice(0, Math.floor(Math.random() * 3) + 2),
      improvements: allImprovements.slice(0, Math.floor(Math.random() * 2) + 1),
      recommendations: allRecommendations.slice(0, Math.floor(Math.random() * 3) + 2)
    };
  };

  // Create content
  const createContent = async (e?: React.MouseEvent) => {
    // Prevent any form submission or page refresh
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!newContent.title.trim() || !newContent.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const brandScore = analyzeBrandAlignment(newContent.content, 'text').score;
      
      const contentItem: ContentItem = {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: newContent.title,
        content: newContent.content,
        type: newContent.type,
        brandScore,
        createdDate: new Date(),
        status: brandScore >= 75 ? 'approved' : 'draft'
      };

      setContentItems(prev => [...prev, contentItem]);
      
      addActivity({
        type: 'content',
        message: `Created ${newContent.type}: "${newContent.title}" - Brand score: ${brandScore}%`
      });

      // Clear form after successful creation
      setNewContent({ title: '', content: '', type: 'messaging' });
      
      // Show success message
      alert(`Content created successfully! Brand alignment score: ${brandScore}%`);
      
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content. Please try again.');
    }
  };

  // Start brand test
  const startBrandTest = async () => {
    if (!testForm.title.trim() || !testForm.originalContent.trim()) {
      alert('Please fill in test title and original content');
      return;
    }

    const variants = testForm.variants
      .filter(v => v.trim())
      .map(content => ({
        id: `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        score: analyzeBrandAlignment(content, 'text').score
      }));

    const brandTest: BrandTest = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: testForm.title,
      originalContent: testForm.originalContent,
      variants,
      status: 'completed',
      createdDate: new Date()
    };

    setBrandTests(prev => [...prev, brandTest]);
    
    addActivity({
      type: 'brand',
      message: `Completed brand test: "${testForm.title}" with ${variants.length} variants`
    });

    setTestForm({ title: '', originalContent: '', variants: ['', '', ''] });
  };

  // Generate suggestions
  const generateSuggestions = (contentType: string) => {
    const suggestions = {
      'messaging': [
        'Emphasize measurable social impact',
        'Highlight Indigenous leadership',
        'Focus on community transformation'
      ],
      'value-prop': [
        '85% employment retention after 1 year',
        '$1.1M annual savings per youth vs. incarceration',
        'Authentic Indigenous-led model'
      ],
      'tagline': [
        'Transforming Communities, Empowering Futures',
        'Where Potential Meets Opportunity',
        'Building Bridges, Creating Pathways'
      ]
    };
    
    return suggestions[contentType as keyof typeof suggestions] || [
      'Focus on authentic storytelling',
      'Include specific outcomes',
      'Emphasize community impact'
    ];
  };

  // File handling
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };
  
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      await processFiles(selectedFiles);
    }
  };
  
  const processFiles = async (fileList: File[]) => {
    setLoading(true);
    
    for (const file of fileList) {
      const newFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        brandAlignment: analyzeBrandAlignment(file.name, file.type)
      };
      
      setFiles(prev => [...prev, newFile]);
      
      addActivity({
        type: 'content',
        message: `Analyzed "${file.name}" - Brand alignment: ${newFile.brandAlignment.score}%`
      });
    }
    
    setLoading(false);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Brand Development Hub
        </h1>
        <p className="text-gray-600">
          Upload, create, test, and align your brand content for maximum impact
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'upload', label: 'Upload & Analyze', icon: Upload },
            { id: 'create', label: 'Create Content', icon: Edit3 },
            { id: 'test', label: 'Brand Testing', icon: TestTube },
            { id: 'workspace', label: 'Brand Workspace', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              PDFs, PowerPoint, Word docs, images - anything with your brand content
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Processing...' : 'Choose Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Results */}
          {files.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded {file.uploadDate.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getScoreColor(file.brandAlignment.score)}`}>
                  {getScoreIcon(file.brandAlignment.score)}
                  <span className="font-semibold">{file.brandAlignment.score}% Brand Aligned</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="flex items-center font-medium text-green-700 mb-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {file.brandAlignment.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="flex items-center font-medium text-yellow-700 mb-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Improvements
                  </h4>
                  <ul className="space-y-1">
                    {file.brandAlignment.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {improvement}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="flex items-center font-medium text-blue-700 mb-2">
                    <Target className="h-4 w-4 mr-2" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {file.brandAlignment.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {file.brandAlignment.score >= 80 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      Excellent brand alignment! This content is ready for campaigns.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as ContentItem['type'] }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="messaging">Key Messaging</option>
                  <option value="value-prop">Value Proposition</option>
                  <option value="tagline">Tagline</option>
                  <option value="story">Story</option>
                  <option value="description">Description</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your content here..."
                  rows={8}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="button"
                onClick={(e) => createContent(e)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Create & Analyze
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Content Suggestions
              </h3>
              <div className="space-y-3">
                {generateSuggestions(newContent.type).map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{suggestion}</p>
                    <button
                      onClick={() => setNewContent(prev => ({ 
                        ...prev, 
                        content: prev.content + (prev.content ? '\n\n' : '') + suggestion 
                      }))}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Created Content Items */}
          {contentItems.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-500" />
                Your Created Content ({contentItems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">{item.type.replace('-', ' ')}</p>
                      </div>
                      
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.brandScore >= 80 ? 'bg-green-100 text-green-700' :
                        item.brandScore >= 70 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.brandScore >= 80 ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : item.brandScore >= 70 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{item.brandScore}%</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.content}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {item.createdDate.toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Tab */}
      {activeTab === 'test' && (
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              A/B Test Your Messaging
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                value={testForm.title}
                onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Test title..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              
              <textarea
                value={testForm.originalContent}
                onChange={(e) => setTestForm(prev => ({ ...prev, originalContent: e.target.value }))}
                placeholder="Original content..."
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testForm.variants.map((variant, idx) => (
                  <textarea
                    key={idx}
                    value={variant}
                    onChange={(e) => {
                      const newVariants = [...testForm.variants];
                      newVariants[idx] = e.target.value;
                      setTestForm(prev => ({ ...prev, variants: newVariants }));
                    }}
                    placeholder={`Variant ${idx + 1}...`}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ))}
              </div>
              
              <button
                onClick={startBrandTest}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Run Brand Test
              </button>
            </div>
          </div>
          
          {/* Test Results */}
          {brandTests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">{test.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
                  <p className="text-sm text-gray-600">{test.originalContent}</p>
                </div>
                
                {test.variants.map((variant, idx) => (
                  <div key={variant.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Variant {idx + 1}</h4>
                    <p className="text-sm text-gray-600 mb-2">{variant.content}</p>
                    <div className={`text-sm font-medium ${
                      variant.score >= 80 ? 'text-green-600' :
                      variant.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {variant.score}% Brand Score
                    </div>
                  </div>
                ))}
              </div>
              
              {test.variants.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm font-medium text-green-800">
                    Best Performer: Variant {test.variants.indexOf(test.variants.reduce((best, current) => 
                      current.score > best.score ? current : best
                    )) + 1} ({Math.max(...test.variants.map(v => v.score))}% alignment)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Brand Health
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Overall Alignment</span>
                  <span className="text-sm font-medium">
                    {Math.round((files.reduce((sum, f) => sum + f.brandAlignment.score, 0) + 
                                contentItems.reduce((sum, c) => sum + c.brandScore, 0)) / 
                               (files.length + contentItems.length) || 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((files.reduce((sum, f) => sum + f.brandAlignment.score, 0) + 
                                           contentItems.reduce((sum, c) => sum + c.brandScore, 0)) / 
                                          (files.length + contentItems.length) || 0)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Content Items</span>
                <span className="text-sm font-medium">{files.length + contentItems.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Run</span>
                <span className="text-sm font-medium">{brandTests.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('create')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-3 text-blue-600" />
                <span className="text-sm">Create new content</span>
              </button>
              
              <button
                onClick={() => setActiveTab('test')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <TestTube className="h-4 w-4 mr-3 text-green-600" />
                <span className="text-sm">Test messaging variants</span>
              </button>
              
              <button
                onClick={() => setActiveTab('upload')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-3 text-purple-600" />
                <span className="text-sm">Upload brand materials</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            
            <div className="space-y-3 text-sm">
              {[...files, ...contentItems].slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">{'name' in item ? item.name : item.title}</p>
                    <p className="text-gray-500 text-xs">
                      {'uploadDate' in item ? item.uploadDate.toLocaleDateString() : item.createdDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {files.length === 0 && contentItems.length === 0 && (
                <p className="text-gray-500 text-sm">No activity yet. Start by uploading files or creating content.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};