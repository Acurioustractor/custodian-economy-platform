import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  FileText,
  Video,
  Image,
  Quote,
  Star,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Grid,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  CheckSquare,
  Square,
  Wand2,
  Brain,
  Lightbulb,
  Target,
  Copy,
  ExternalLink,
  Sparkles,
  Zap,
  MessageSquare,
  Upload,
  File,
  X,
  Paperclip
} from 'lucide-react';
import { stories } from '../utils/constants';

interface ContentItem {
  id: string;
  type: 'story' | 'quote' | 'metric' | 'video' | 'image' | 'pdf' | 'website' | 'partner' | 'sponsor' | 'business';
  title: string;
  content: string;
  category: string;
  status: 'raw' | 'draft' | 'ready' | 'published';
  tags: string[];
  created: Date;
  lastModified: Date;
  source: 'participant' | 'young-guns' | 'partner' | 'sponsor' | 'program' | 'website' | 'internal';
  audience: 'government' | 'corporate' | 'philanthropic' | 'community' | 'internal' | 'public';
  metadata: any;
  files?: {
    original: File;
    url: string;
    type: string;
    size: number;
    name: string;
  }[];
}

export const ContentLibrary: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'story' | 'quote' | 'metric' | 'video' | 'image' | 'pdf' | 'website' | 'partner' | 'sponsor' | 'business'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'participant' | 'young-guns' | 'partner' | 'sponsor' | 'program' | 'website' | 'internal'>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<'title' | 'type' | 'source' | 'audience' | 'created' | 'status'>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [aiAnalysisModal, setAiAnalysisModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [addContentModal, setAddContentModal] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    type: 'story',
    title: '',
    content: '',
    category: '',
    status: 'draft',
    tags: [],
    source: 'internal',
    audience: 'public',
    metadata: {}
  });
  const [newTag, setNewTag] = useState('');
  const [metadataKey, setMetadataKey] = useState('');
  const [metadataValue, setMetadataValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load all existing content into structured format
    const allContent: ContentItem[] = [
      // Stories
      ...stories.map((story, index) => ({
        id: `story-${index}`,
        type: 'story' as const,
        title: `${story.name}'s Transformation`,
        content: `${story.before} → ${story.after}`,
        category: 'Personal Stories',
        status: 'ready' as const,
        tags: ['transformation', 'employment', 'personal-growth'],
        created: new Date(2024, 0, index + 1),
        lastModified: new Date(),
        source: 'participant' as const,
        audience: 'public' as const,
        metadata: {
          participant: story.name,
          location: story.location,
          before: story.before,
          after: story.after,
          quote: story.quote,
          videos: story.videos.length
        }
      })),
      
      // Quotes
      {
        id: 'quote-callum',
        type: 'quote',
        title: 'Hope for the Programme',
        content: "I hope the programme keeps going. I think it helps out a lot of young indigenous people and I have family members that have come outta prison and it's hard for them to find work.",
        category: 'Participant Quotes',
        status: 'ready',
        tags: ['hope', 'family', 'employment', 'justice-system'],
        created: new Date(2024, 0, 15),
        lastModified: new Date(),
        source: 'participant',
        audience: 'public',
        metadata: { speaker: 'Callum', context: 'Interview', emotion: 'hopeful' }
      },
      {
        id: 'quote-troy',
        type: 'quote',
        title: 'Personal Growth',
        content: "Since I've been at Young Guns, it's been going good. I've become more reliable, more motivated, more positive.",
        category: 'Participant Quotes',
        status: 'ready',
        tags: ['growth', 'motivation', 'reliability', 'positive'],
        created: new Date(2024, 0, 20),
        lastModified: new Date(),
        source: 'participant',
        audience: 'public',
        metadata: { speaker: 'Troy', context: 'Interview', emotion: 'confident' }
      },
      {
        id: 'quote-supervisor',
        type: 'quote',
        title: 'Leadership Recognition',
        content: "One of my best now. He's my crew leader as well.",
        category: 'Supervisor Quotes',
        status: 'ready',
        tags: ['leadership', 'recognition', 'workplace', 'promotion'],
        created: new Date(2024, 0, 25),
        lastModified: new Date(),
        source: 'young-guns',
        audience: 'corporate',
        metadata: { speaker: 'George (Supervisor)', context: 'About Tyson', emotion: 'proud' }
      },
      
      // Key Metrics
      {
        id: 'metric-retention',
        type: 'metric',
        title: '85% Employment Retention',
        content: 'After 1 year in the program',
        category: 'Impact Metrics',
        status: 'ready',
        tags: ['employment', 'retention', 'success', 'long-term'],
        created: new Date(2024, 0, 1),
        lastModified: new Date(),
        source: 'program',
        audience: 'government',
        metadata: { value: 85, unit: 'percent', timeframe: '1 year', benchmark: 'industry average 40%' }
      },
      {
        id: 'metric-savings',
        type: 'metric',
        title: '$1.1M Annual Savings',
        content: 'Per youth vs. incarceration costs',
        category: 'Economic Impact',
        status: 'ready',
        tags: ['savings', 'economic', 'cost-benefit', 'government'],
        created: new Date(2024, 0, 1),
        lastModified: new Date(),
        source: 'program',
        audience: 'government',
        metadata: { value: 1100000, unit: 'dollars', comparison: 'vs incarceration', audience: 'government' }
      },
      {
        id: 'metric-lives',
        type: 'metric',
        title: '400+ Lives Transformed',
        content: 'And counting',
        category: 'Social Impact',
        status: 'ready',
        tags: ['impact', 'scale', 'transformation', 'community'],
        created: new Date(2024, 0, 1),
        lastModified: new Date(),
        source: 'program',
        audience: 'philanthropic',
        metadata: { value: 400, unit: 'people', growth: 'ongoing', scope: 'individual+family' }
      },
      
      // Video Content
      {
        id: 'video-keiron',
        type: 'video',
        title: "Keiron's Vision",
        content: 'Founder explains the Custodian Economy approach',
        category: 'Leadership Content',
        status: 'ready',
        tags: ['leadership', 'vision', 'founder', 'strategy'],
        created: new Date(2024, 0, 10),
        lastModified: new Date(),
        source: 'young-guns',
        audience: 'corporate',
        metadata: { duration: '3:45', platform: 'descript', usage: 'hero sections' }
      },
      {
        id: 'video-aden',
        type: 'video',
        title: "Aden's Journey",
        content: 'From crisis to stability - personal transformation',
        category: 'Personal Stories',
        status: 'ready',
        tags: ['transformation', 'personal', 'journey', 'crisis-to-stability'],
        created: new Date(2024, 0, 12),
        lastModified: new Date(),
        source: 'participant',
        audience: 'public',
        metadata: { duration: '4:12', platform: 'descript', usage: 'story sections' }
      },
      {
        id: 'video-troy',
        type: 'video',
        title: "Troy's Transformation",
        content: 'Long-term impact and mentorship role',
        category: 'Success Stories',
        status: 'ready',
        tags: ['mentorship', 'long-term', 'leadership', 'success'],
        created: new Date(2024, 0, 14),
        lastModified: new Date(),
        source: 'participant',
        audience: 'public',
        metadata: { duration: '2:30', platform: 'descript', usage: 'impact showcase' }
      },
      
      // Young Guns Business Content
      {
        id: 'business-productivity',
        type: 'metric',
        title: '3-4x Productivity vs Industry Average',
        content: 'Young Guns teams consistently outperform industry benchmarks',
        category: 'Business Performance',
        status: 'ready',
        tags: ['productivity', 'performance', 'competitive-advantage', 'business'],
        created: new Date(2024, 0, 5),
        lastModified: new Date(),
        source: 'young-guns',
        audience: 'corporate',
        metadata: { value: '3-4x', comparison: 'industry average', evidence: 'client testimonials' }
      },
      {
        id: 'business-absenteeism',
        type: 'metric',
        title: '3% Absenteeism Rate',
        content: 'vs 25% industry average',
        category: 'Business Performance',
        status: 'ready',
        tags: ['absenteeism', 'reliability', 'workplace', 'performance'],
        created: new Date(2024, 0, 5),
        lastModified: new Date(),
        source: 'young-guns',
        audience: 'corporate',
        metadata: { value: 3, unit: 'percent', benchmark: '25% industry average' }
      },
      {
        id: 'business-savings',
        type: 'metric',
        title: '$3-4M Annual Savings for Partners',
        content: 'Operational cost reductions through improved productivity',
        category: 'Business Value',
        status: 'ready',
        tags: ['savings', 'partnership', 'roi', 'operational'],
        created: new Date(2024, 0, 5),
        lastModified: new Date(),
        source: 'young-guns',
        audience: 'corporate',
        metadata: { value: '3-4M', unit: 'dollars', timeframe: 'annual' }
      },
      
      // Partner Prospects
      {
        id: 'partner-corporate',
        type: 'partner',
        title: 'Major Corporations - RAP Commitments',
        content: 'Companies with Reconciliation Action Plans seeking authentic Indigenous partnerships',
        category: 'Partnership Prospects',
        status: 'draft',
        tags: ['corporate', 'RAP', 'reconciliation', 'partnership'],
        created: new Date(2024, 1, 1),
        lastModified: new Date(),
        source: 'partner',
        audience: 'corporate',
        metadata: { sectors: ['mining', 'banking', 'construction'], stage: 'prospecting' }
      },
      {
        id: 'partner-government',
        type: 'partner',
        title: 'Government Departments - Youth Justice',
        content: 'State and federal agencies dealing with Indigenous youth justice and employment',
        category: 'Government Partners',
        status: 'draft',
        tags: ['government', 'youth-justice', 'employment', 'policy'],
        created: new Date(2024, 1, 1),
        lastModified: new Date(),
        source: 'partner',
        audience: 'government',
        metadata: { levels: ['state', 'federal'], departments: ['justice', 'employment', 'indigenous-affairs'] }
      },
      
      // Sponsor Prospects  
      {
        id: 'sponsor-foundations',
        type: 'sponsor',
        title: 'Philanthropic Foundations',
        content: 'Foundations focused on Indigenous empowerment and employment innovation',
        category: 'Funding Prospects',
        status: 'draft',
        tags: ['philanthropy', 'foundations', 'funding', 'empowerment'],
        created: new Date(2024, 1, 5),
        lastModified: new Date(),
        source: 'sponsor',
        audience: 'philanthropic',
        metadata: { focus_areas: ['indigenous', 'employment', 'innovation'], grant_sizes: ['100k-500k', '500k-2M'] }
      },
      {
        id: 'sponsor-social-impact',
        type: 'sponsor',
        title: 'Social Impact Investors',
        content: 'Investors seeking measurable social returns with commercial viability',
        category: 'Investment Prospects',
        status: 'draft',
        tags: ['social-impact', 'investment', 'returns', 'commercial'],
        created: new Date(2024, 1, 5),
        lastModified: new Date(),
        source: 'sponsor',
        audience: 'philanthropic',
        metadata: { investment_types: ['debt', 'equity', 'grants'], ticket_sizes: ['500k-5M'] }
      },
      
      // Program PDFs (placeholders for your actual documents)
      {
        id: 'pdf-program-overview',
        type: 'pdf',
        title: 'Potential First Pathways Program Overview',
        content: 'Comprehensive program description, methodology, and outcomes',
        category: 'Program Documentation',
        status: 'ready',
        tags: ['program', 'overview', 'methodology', 'outcomes'],
        created: new Date(2023, 11, 1),
        lastModified: new Date(),
        source: 'program',
        audience: 'internal',
        metadata: { pages: 'TBD', last_version: 'v2.1', format: 'PDF' }
      },
      {
        id: 'pdf-impact-report',
        type: 'pdf',
        title: 'Annual Impact Report 2023',
        content: 'Detailed metrics, stories, and outcomes from the past year',
        category: 'Impact Reports',
        status: 'ready',
        tags: ['impact', 'annual', 'metrics', 'report'],
        created: new Date(2023, 11, 31),
        lastModified: new Date(),
        source: 'program',
        audience: 'public',
        metadata: { pages: 'TBD', format: 'PDF', distribution: 'public' }
      },
      {
        id: 'pdf-partnership-toolkit',
        type: 'pdf',
        title: 'Corporate Partnership Toolkit',
        content: 'Materials for engaging corporate partners and implementing programs',
        category: 'Partnership Materials',
        status: 'draft',
        tags: ['partnership', 'corporate', 'toolkit', 'implementation'],
        created: new Date(2024, 0, 15),
        lastModified: new Date(),
        source: 'internal',
        audience: 'corporate',
        metadata: { pages: 'TBD', format: 'PDF', status: 'in-development' }
      },
      
      // Website Content
      {
        id: 'website-homepage',
        type: 'website',
        title: 'Homepage Hero Message',
        content: 'Main value proposition and call-to-action on the homepage',
        category: 'Website Content',
        status: 'ready',
        tags: ['homepage', 'hero', 'value-prop', 'cta'],
        created: new Date(2024, 0, 20),
        lastModified: new Date(),
        source: 'website',
        audience: 'public',
        metadata: { location: 'homepage hero', current_version: 'live' }
      },
      {
        id: 'website-about',
        type: 'website',
        title: 'About Us Section',
        content: 'Young Guns story, mission, and approach explanation',
        category: 'Website Content',
        status: 'ready',
        tags: ['about', 'mission', 'story', 'approach'],
        created: new Date(2024, 0, 20),
        lastModified: new Date(),
        source: 'website',
        audience: 'public',
        metadata: { location: 'about page', word_count: 'TBD' }
      }
    ];

    setContent(allContent);
  }, []);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSource = filterSource === 'all' || item.source === filterSource;
    return matchesSearch && matchesType && matchesSource;
  });

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    // Handle date sorting
    if (sortField === 'created') {
      aValue = a.created.getTime();
      bValue = b.created.getTime();
    }
    
    // Handle string sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: typeof sortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-3 w-3 text-blue-600" /> : 
      <ArrowDown className="h-3 w-3 text-blue-600" />;
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === sortedContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedContent.map(item => item.id)));
    }
  };

  const downloadItem = (item: ContentItem) => {
    const content = {
      title: item.title,
      content: item.content,
      type: item.type,
      source: item.source,
      audience: item.audience,
      tags: item.tags,
      metadata: item.metadata,
      created: item.created,
      status: item.status
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSelected = () => {
    const selectedContent = sortedContent.filter(item => selectedItems.has(item.id));
    const exportData = {
      exported_at: new Date().toISOString(),
      content_count: selectedContent.length,
      items: selectedContent.map(item => ({
        title: item.title,
        content: item.content,
        type: item.type,
        source: item.source,
        audience: item.audience,
        tags: item.tags,
        metadata: item.metadata,
        created: item.created,
        status: item.status
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content_export_${selectedContent.length}_items.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const analyzeWithAI = async () => {
    setAiLoading(true);
    setAiAnalysisModal(true);
    
    const selectedContent = sortedContent.filter(item => selectedItems.has(item.id));
    
    try {
      // Simulate AI analysis - replace with actual API call
      setTimeout(() => {
        const analysis = generateAIAnalysis(selectedContent);
        const suggestions = generateAISuggestions(selectedContent);
        setAiAnalysis(analysis);
        setAiSuggestions(suggestions);
        setAiLoading(false);
      }, 2000);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiLoading(false);
    }
  };

  const generateAIAnalysis = (items: ContentItem[]) => {
    const types = [...new Set(items.map(item => item.type))];
    const sources = [...new Set(items.map(item => item.source))];
    const audiences = [...new Set(items.map(item => item.audience))];
    const tags = [...new Set(items.flatMap(item => item.tags))];
    
    return `## Content Analysis Report

**Selected Items:** ${items.length}
**Content Types:** ${types.join(', ')}
**Sources:** ${sources.join(', ')}
**Target Audiences:** ${audiences.join(', ')}

### Key Themes
${tags.slice(0, 8).map(tag => `• ${tag}`).join('\n')}

### Content Strengths
• Strong participant storytelling with personal transformation narratives
• Compelling metrics showing measurable impact (85% retention, $1.1M savings)
• Diverse content mix spanning personal stories, business outcomes, and social impact
• Clear audience targeting for government, corporate, and philanthropic stakeholders

### Recommendations
• Leverage transformation stories for emotional connection in funding pitches
• Use retention metrics prominently in government partnership discussions
• Combine personal quotes with business performance data for corporate presentations
• Create themed content packages for different audience segments

### Brand Alignment Score: 92/100
Your content strongly aligns with the custodian economy model, emphasizing empowerment, measurable outcomes, and sustainable transformation.`;
  };

  const generateAISuggestions = (items: ContentItem[]) => {
    return [
      {
        type: 'Campaign Creation',
        title: 'Government Funding Campaign',
        description: 'Combine employment metrics with participant stories for maximum impact',
        items: items.filter(item => item.audience === 'government' || item.type === 'metric').length,
        confidence: 94
      },
      {
        type: 'Content Gap Analysis',
        title: 'Missing: Long-term Impact Stories',
        description: 'Need 5-year+ outcome stories to strengthen retention narrative',
        items: 0,
        confidence: 87
      },
      {
        type: 'Audience Optimization',
        title: 'Corporate Partnership Package',
        description: 'Bundle productivity metrics with supervisor testimonials',
        items: items.filter(item => item.audience === 'corporate').length,
        confidence: 91
      },
      {
        type: 'Content Enhancement',
        title: 'Video Story Integration',
        description: 'Pair written stories with video content for multimedia campaigns',
        items: items.filter(item => item.type === 'video' || item.type === 'story').length,
        confidence: 89
      }
    ];
  };

  const addTag = () => {
    if (newTag.trim() && !newContent.tags?.includes(newTag.trim())) {
      setNewContent(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewContent(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addMetadata = () => {
    if (metadataKey.trim() && metadataValue.trim()) {
      setNewContent(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataKey.trim()]: metadataValue.trim()
        }
      }));
      setMetadataKey('');
      setMetadataValue('');
    }
  };

  const removeMetadata = (keyToRemove: string) => {
    setNewContent(prev => {
      const newMetadata = { ...prev.metadata };
      delete newMetadata[keyToRemove];
      return {
        ...prev,
        metadata: newMetadata
      };
    });
  };

  const saveNewContent = () => {
    if (!newContent.title?.trim() || !newContent.content?.trim()) {
      alert('Title and content are required');
      return;
    }

    const contentItem: ContentItem = {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: newContent.type as ContentItem['type'],
      title: newContent.title.trim(),
      content: newContent.content.trim(),
      category: newContent.category?.trim() || 'Uncategorized',
      status: newContent.status as ContentItem['status'],
      tags: newContent.tags || [],
      created: new Date(),
      lastModified: new Date(),
      source: newContent.source as ContentItem['source'],
      audience: newContent.audience as ContentItem['audience'],
      metadata: newContent.metadata || {},
      files: uploadedFiles.map(file => ({
        original: file,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        name: file.name
      }))
    };

    setContent(prev => [contentItem, ...prev]);
    
    // Reset form
    setNewContent({
      type: 'story',
      title: '',
      content: '',
      category: '',
      status: 'draft',
      tags: [],
      source: 'internal',
      audience: 'public',
      metadata: {}
    });
    setUploadedFiles([]);
    
    setAddContentModal(false);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }
      validFiles.push(file);
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Auto-detect content type and update metadata
    if (validFiles.length > 0) {
      const file = validFiles[0];
      const fileType = file.type;
      
      if (fileType.startsWith('image/')) {
        setNewContent(prev => ({ 
          ...prev, 
          type: 'image',
          metadata: { 
            ...prev.metadata, 
            fileType: file.type,
            fileSize: formatFileSize(file.size)
          }
        }));
      } else if (fileType.startsWith('video/')) {
        setNewContent(prev => ({ 
          ...prev, 
          type: 'video',
          metadata: { 
            ...prev.metadata, 
            fileType: file.type,
            fileSize: formatFileSize(file.size)
          }
        }));
      } else if (fileType === 'application/pdf') {
        setNewContent(prev => ({ 
          ...prev, 
          type: 'pdf',
          metadata: { 
            ...prev.metadata, 
            fileType: file.type,
            fileSize: formatFileSize(file.size)
          }
        }));
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <FileText className="h-4 w-4" />;
      case 'quote': return <Quote className="h-4 w-4" />;
      case 'metric': return <TrendingUp className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'raw': return 'bg-gray-100 text-gray-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'published': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: content.length,
    stories: content.filter(c => c.type === 'story').length,
    quotes: content.filter(c => c.type === 'quote').length,
    metrics: content.filter(c => c.type === 'metric').length,
    videos: content.filter(c => c.type === 'video').length,
    pdfs: content.filter(c => c.type === 'pdf').length,
    partners: content.filter(c => c.type === 'partner').length,
    sponsors: content.filter(c => c.type === 'sponsor').length,
    ready: content.filter(c => c.status === 'ready').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center">
              <Database className="h-8 w-8 mr-3 text-blue-600" />
              Content Library
            </h1>
            <p className="text-gray-600">
              All your stories, quotes, metrics, and media in one place
            </p>
            {selectedItems.size > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {selectedItems.size > 0 && (
              <>
                <button 
                  onClick={downloadSelected}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export ({selectedItems.size})
                </button>
                <button 
                  onClick={analyzeWithAI}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Analysis
                </button>
                <button 
                  onClick={() => setSelectedItems(new Set())}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
                >
                  Clear
                </button>
              </>
            )}
            <button 
              onClick={() => setAddContentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.stories}</div>
          <div className="text-sm text-gray-600">Stories</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.metrics}</div>
          <div className="text-sm text-gray-600">Metrics</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.partners + stats.sponsors}</div>
          <div className="text-sm text-gray-600">Prospects</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.ready}</div>
          <div className="text-sm text-gray-600">Ready</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {selectedItems.size === sortedContent.length && sortedContent.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-600">
              {selectedItems.size === sortedContent.length && sortedContent.length > 0 ? 'Deselect All' : 'Select All'}
            </span>
          </button>
        </div>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search content, tags, or people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="story">Stories</option>
            <option value="quote">Quotes</option>
            <option value="metric">Metrics</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="partner">Partners</option>
            <option value="sponsor">Sponsors</option>
            <option value="business">Business</option>
            <option value="website">Website</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Sources</option>
            <option value="participant">Participants</option>
            <option value="young-guns">Young Guns</option>
            <option value="partner">Partners</option>
            <option value="sponsor">Sponsors</option>
            <option value="program">Program</option>
            <option value="website">Website</option>
            <option value="internal">Internal</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContent.map((item) => (
          <div key={item.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
            selectedItems.has(item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSelectItem(item.id)}
                  className="mr-2"
                >
                  {selectedItems.has(item.id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {getTypeIcon(item.type)}
                <span className="text-sm font-medium text-gray-600 capitalize">{item.type}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" 
                onClick={() => setSelectedItem(item)}>
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.content}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {item.created.toLocaleDateString()}
              </span>
              <div className="flex space-x-1">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  {item.source}
                </span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                  {item.audience}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(item)}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </button>
              <button 
                onClick={() => downloadItem(item)}
                className="bg-green-50 text-green-600 px-3 py-2 rounded text-sm hover:bg-green-100 flex items-center justify-center"
              >
                <Download className="h-3 w-3" />
              </button>
              <button className="bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-100 flex items-center justify-center">
                <Edit className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center"
                    >
                      {selectedItems.size === sortedContent.length && sortedContent.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Source</span>
                      {getSortIcon('source')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('audience')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Audience</span>
                      {getSortIcon('audience')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {getSortIcon('created')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedContent.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 ${
                    selectedItems.has(item.id) ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectItem(item.id)}
                      >
                        {selectedItems.has(item.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <div className="ml-3">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => setSelectedItem(item)}
                          >
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.content}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.audience}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.created.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => downloadItem(item)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {addContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Add New Content</h2>
                    <p className="text-gray-600">Create any type of content for your library</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddContentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    {/* Content Type */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <select
                        value={newContent.type}
                        onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as ContentItem['type'] }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="story">Story</option>
                        <option value="quote">Quote</option>
                        <option value="metric">Metric</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="pdf">PDF Document</option>
                        <option value="website">Website Content</option>
                        <option value="partner">Partner Prospect</option>
                        <option value="sponsor">Sponsor Prospect</option>
                        <option value="business">Business Data</option>
                      </select>
                    </div>
                    
                    {/* Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={newContent.title}
                        onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter a descriptive title..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    {/* Category */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={newContent.category}
                        onChange={(e) => setNewContent(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Personal Stories, Impact Metrics..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                      <textarea
                        value={newContent.content}
                        onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter the main content, description, or details..."
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    {/* File Upload Section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Files & Attachments</label>
                      
                      {/* Drag and Drop Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Browse Files
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Supports: Images, Videos, PDFs, Documents (Max 50MB each)
                        </p>
                      </div>
                      
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.mp3,.wav"
                        className="hidden"
                      />
                      
                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {file.type.startsWith('image/') ? (
                                    <Image className="h-5 w-5 text-green-600" />
                                  ) : file.type.startsWith('video/') ? (
                                    <Video className="h-5 w-5 text-blue-600" />
                                  ) : file.type === 'application/pdf' ? (
                                    <FileText className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <File className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)} • {file.type}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Classification & Metadata */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification</h3>
                    
                    {/* Source */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <select
                        value={newContent.source}
                        onChange={(e) => setNewContent(prev => ({ ...prev, source: e.target.value as ContentItem['source'] }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="participant">Participant</option>
                        <option value="young-guns">Young Guns</option>
                        <option value="partner">Partner</option>
                        <option value="sponsor">Sponsor</option>
                        <option value="program">Program</option>
                        <option value="website">Website</option>
                        <option value="internal">Internal</option>
                      </select>
                    </div>
                    
                    {/* Audience */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <select
                        value={newContent.audience}
                        onChange={(e) => setNewContent(prev => ({ ...prev, audience: e.target.value as ContentItem['audience'] }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="government">Government</option>
                        <option value="corporate">Corporate</option>
                        <option value="philanthropic">Philanthropic</option>
                        <option value="community">Community</option>
                        <option value="internal">Internal</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                    
                    {/* Status */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newContent.status}
                        onChange={(e) => setNewContent(prev => ({ ...prev, status: e.target.value as ContentItem['status'] }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="raw">Raw</option>
                        <option value="draft">Draft</option>
                        <option value="ready">Ready</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button
                        onClick={addTag}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newContent.tags?.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Additional Metadata</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input
                        type="text"
                        value={metadataKey}
                        onChange={(e) => setMetadataKey(e.target.value)}
                        placeholder="Key (e.g., duration)"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={metadataValue}
                        onChange={(e) => setMetadataValue(e.target.value)}
                        placeholder="Value (e.g., 3:45)"
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMetadata())}
                      />
                    </div>
                    <button
                      onClick={addMetadata}
                      className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 mb-3"
                    >
                      Add Metadata
                    </button>
                    <div className="space-y-2">
                      {Object.entries(newContent.metadata || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                          <span><strong>{key}:</strong> {String(value)}</span>
                          <button
                            onClick={() => removeMetadata(key)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button 
                  onClick={() => {
                    setAddContentModal(false);
                    setUploadedFiles([]);
                    setNewContent({
                      type: 'story',
                      title: '',
                      content: '',
                      category: '',
                      status: 'draft',
                      tags: [],
                      source: 'internal',
                      audience: 'public',
                      metadata: {}
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setNewContent(prev => ({ ...prev, status: 'draft' }));
                      saveNewContent();
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Save as Draft
                  </button>
                  <button 
                    onClick={() => {
                      setNewContent(prev => ({ ...prev, status: 'ready' }));
                      saveNewContent();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save & Mark Ready
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedItem.type)}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedItem.title}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{selectedItem.source}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{selectedItem.audience}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Content Summary
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedItem.content}</p>
                    </div>
                  </div>
                  
                  {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Additional Details
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(selectedItem.metadata).map(([key, value]) => (
                            <div key={key} className="">
                              <span className="text-sm font-medium text-gray-600 capitalize">
                                {key.replace(/[_-]/g, ' ')}: 
                              </span>
                              <span className="text-sm text-gray-800 ml-1">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Uploaded Files Display */}
                  {selectedItem.files && selectedItem.files.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attached Files
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-3">
                          {selectedItem.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {file.type.startsWith('image/') ? (
                                    <Image className="h-5 w-5 text-green-600" />
                                  ) : file.type.startsWith('video/') ? (
                                    <Video className="h-5 w-5 text-blue-600" />
                                  ) : file.type === 'application/pdf' ? (
                                    <FileText className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <File className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)} • {file.type}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {file.type.startsWith('image/') && (
                                  <button
                                    onClick={() => window.open(file.url, '_blank')}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Preview
                                  </button>
                                )}
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="text-green-600 hover:text-green-800 text-sm flex items-center"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Insights */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-purple-600" />
                      AI Content Insights
                    </h3>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            Best Use Cases
                          </h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            {selectedItem.audience === 'government' && (
                              <li>• Government funding presentations</li>
                            )}
                            {selectedItem.audience === 'corporate' && (
                              <li>• Corporate partnership pitches</li>
                            )}
                            {selectedItem.type === 'story' && (
                              <li>• Emotional impact storytelling</li>
                            )}
                            {selectedItem.type === 'metric' && (
                              <li>• Data-driven impact reports</li>
                            )}
                            <li>• Social media campaigns</li>
                            <li>• Website hero sections</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Enhancement Ideas
                          </h4>
                          <ul className="text-sm text-purple-800 space-y-1">
                            {selectedItem.type === 'story' && (
                              <>
                                <li>• Add video testimonial</li>
                                <li>• Include photo progression</li>
                              </>
                            )}
                            {selectedItem.type === 'metric' && (
                              <>
                                <li>• Create infographic version</li>
                                <li>• Add comparative benchmarks</li>
                              </>
                            )}
                            <li>• Develop multi-format versions</li>
                            <li>• Create audience-specific variants</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tags & Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Content Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{selectedItem.created.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Modified:</span>
                        <span className="text-gray-900">{selectedItem.lastModified.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Word Count:</span>
                        <span className="text-gray-900">{selectedItem.content.split(' ').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Character Count:</span>
                        <span className="text-gray-900">{selectedItem.content.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedItem.content);
                          // You could add a toast notification here
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm flex items-center"
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copy Content
                      </button>
                      <button 
                        onClick={() => downloadItem(selectedItem)}
                        className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-sm flex items-center"
                      >
                        <Download className="h-3 w-3 mr-2" />
                        Download JSON
                      </button>
                      <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm flex items-center">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Use in Campaign
                      </button>
                      <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded text-sm flex items-center">
                        <Sparkles className="h-3 w-3 mr-2" />
                        Generate Variants
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Content
                </button>
                <button 
                  onClick={() => {
                    setSelectedItems(new Set([selectedItem.id]));
                    analyzeWithAI();
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {aiAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">AI Content Analysis</h2>
                    <p className="text-gray-600">{selectedItems.size} items selected for analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAiAnalysisModal(false);
                    setAiAnalysis('');
                    setAiSuggestions([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                >
                  ×
                </button>
              </div>
              
              {aiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-600">AI is analyzing your content...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Analysis Report */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Content Analysis Report
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="prose prose-sm max-w-none">
                        {aiAnalysis.split('\n').map((line, index) => {
                          if (line.startsWith('##')) {
                            return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.replace('##', '').trim()}</h3>;
                          } else if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={index} className="font-semibold text-gray-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
                          } else if (line.startsWith('•')) {
                            return <li key={index} className="text-gray-700 ml-4">{line.replace('•', '').trim()}</li>;
                          } else if (line.startsWith('###')) {
                            return <h4 key={index} className="text-base font-semibold text-gray-800 mt-3 mb-2">{line.replace('###', '').trim()}</h4>;
                          } else if (line.trim()) {
                            return <p key={index} className="text-gray-700 mb-2">{line}</p>;
                          }
                          return <br key={index} />;
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Suggestions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Strategic Suggestions
                    </h3>
                    <div className="space-y-4">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                suggestion.confidence > 90 ? 'bg-green-500' :
                                suggestion.confidence > 80 ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {suggestion.type}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{suggestion.confidence}% confidence</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-blue-600">
                              {suggestion.items} relevant items
                            </span>
                            <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                              Apply Suggestion
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Recommended Next Steps
                      </h4>
                      <div className="space-y-2">
                        <button className="w-full text-left bg-white border border-purple-200 rounded p-3 hover:bg-purple-50 text-sm">
                          <div className="font-medium text-purple-900">Create Content Campaign</div>
                          <div className="text-purple-700">Bundle selected items into a targeted campaign</div>
                        </button>
                        <button className="w-full text-left bg-white border border-purple-200 rounded p-3 hover:bg-purple-50 text-sm">
                          <div className="font-medium text-purple-900">Generate Audience Variants</div>
                          <div className="text-purple-700">Create versions optimized for different stakeholders</div>
                        </button>
                        <button className="w-full text-left bg-white border border-purple-200 rounded p-3 hover:bg-purple-50 text-sm">
                          <div className="font-medium text-purple-900">Export Strategic Brief</div>
                          <div className="text-purple-700">Download comprehensive analysis and recommendations</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button 
                  onClick={() => {
                    setAiAnalysisModal(false);
                    setAiAnalysis('');
                    setAiSuggestions([]);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={downloadSelected}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Analysis
                  </button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Generate Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {sortedContent.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};