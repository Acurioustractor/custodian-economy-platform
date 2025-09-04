// Empathy Ledger Integration Types
// Database schema for connecting to your existing ampthy ledger system

export interface Story {
  id: string;
  title: string;
  participant_name: string;
  participant_id: string;
  story_type: 'transformation' | 'success' | 'journey' | 'challenge' | 'leadership';
  content: string;
  summary: string;
  
  // Metadata
  date_recorded: Date;
  location: string;
  interviewer: string;
  duration_minutes?: number;
  
  // Classification
  themes: string[]; // e.g., ['employment', 'family', 'culture', 'leadership']
  impact_level: 'individual' | 'family' | 'community' | 'business';
  stage: 'pre_program' | 'during_program' | 'post_program' | 'long_term';
  
  // Media connections
  media_assets: string[]; // IDs of related photos/videos
  transcript_id?: string;
  
  // Brand DNA extraction
  brand_values_demonstrated: BrandValue[];
  key_messages: string[];
  potential_quotes: Quote[];
  
  // Usage tracking
  featured_in_campaigns: string[];
  permission_level: 'internal' | 'partner' | 'public';
  consent_forms: string[];
}

export interface Transcript {
  id: string;
  story_id: string;
  audio_file_url?: string;
  video_file_url?: string;
  
  // Transcript content
  raw_transcript: string;
  cleaned_transcript: string;
  speaker_segments: TranscriptSegment[];
  
  // AI Analysis
  sentiment_analysis: SentimentData;
  key_topics: TopicAnalysis[];
  brand_alignment_score: number;
  authenticity_indicators: string[];
  
  // Processing metadata
  transcription_method: 'automated' | 'manual' | 'hybrid';
  confidence_score: number;
  processed_date: Date;
  reviewed_by: string;
}

export interface TranscriptSegment {
  speaker: 'participant' | 'interviewer' | 'other';
  start_time?: number; // seconds
  end_time?: number;
  content: string;
  confidence_score?: number;
  emotion_detected?: string;
}

export interface MediaAsset {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  file_url: string;
  thumbnail_url?: string;
  
  // Content details
  title: string;
  description: string;
  alt_text: string; // For accessibility
  
  // Metadata
  date_created: Date;
  location: string;
  photographer_videographer?: string;
  participants: string[]; // participant IDs
  
  // Classification
  category: 'workplace' | 'portrait' | 'event' | 'community' | 'cultural' | 'training';
  mood: 'inspiring' | 'professional' | 'casual' | 'celebratory' | 'reflective';
  suitable_for: ('website' | 'social_media' | 'print' | 'presentations')[];
  
  // Brand usage
  brand_archetype_fit: BrandArchetype[];
  message_support: string[]; // Which key messages this supports
  campaign_potential: CampaignType[];
  
  // Technical specs
  resolution?: string;
  file_size: number;
  format: string;
  color_profile?: string;
  
  // Rights and permissions
  usage_rights: 'full' | 'limited' | 'internal_only';
  expiry_date?: Date;
  consent_documentation: string[];
}

export interface BrandValue {
  name: 'potential_first' | 'cultural_strength' | 'commercial_excellence' | 'reciprocity' | 'transformation';
  evidence_text: string;
  strength_score: number; // 1-10
}

export interface Quote {
  text: string;
  context: string;
  emotional_impact: number; // 1-10
  authenticity_score: number; // 1-10
  suggested_usage: ('hero_quote' | 'testimonial' | 'social_media' | 'report')[];
}

export interface SentimentData {
  overall_sentiment: 'positive' | 'neutral' | 'negative';
  emotional_journey: EmotionalPoint[];
  key_emotions: string[];
  transformational_indicators: string[];
}

export interface EmotionalPoint {
  timestamp?: number; // For video/audio
  text_position?: number; // For text
  emotion: string;
  intensity: number; // 1-10
}

export interface TopicAnalysis {
  topic: string;
  relevance_score: number; // 0-1
  frequency: number;
  related_brand_pillars: string[];
  keywords: string[];
}

export interface BrandArchetype {
  name: 'the_hero' | 'the_mentor' | 'the_transformer' | 'the_builder' | 'the_connector';
  relevance_score: number; // 0-1
  supporting_evidence: string[];
}

export interface CampaignType {
  name: 'see_the_potential' | 'transformation_stories' | 'business_excellence' | 'cultural_strength';
  fit_score: number; // 0-1
  suggested_role: 'hero_content' | 'supporting_content' | 'background_content';
}

// Content Analysis Results
export interface ContentAnalysis {
  id: string;
  content_id: string;
  content_type: 'story' | 'transcript' | 'media';
  
  // Analysis results
  brand_dna_score: BrandDNAScore;
  communication_insights: CommunicationInsight[];
  strategic_recommendations: StrategicRecommendation[];
  
  // Generated content
  suggested_headlines: string[];
  key_messages_extracted: string[];
  social_media_snippets: SocialMediaSnippet[];
  
  // Analysis metadata
  analyzed_date: Date;
  analysis_version: string;
  confidence_level: number;
}

export interface BrandDNAScore {
  authenticity: number; // 0-100
  consistency: number; // 0-100
  emotional_resonance: number; // 0-100
  cultural_alignment: number; // 0-100
  commercial_viability: number; // 0-100
  overall_score: number; // 0-100
}

export interface CommunicationInsight {
  insight_type: 'messaging' | 'audience' | 'channel' | 'timing' | 'creative';
  insight: string;
  evidence: string[];
  confidence: number; // 0-1
  actionable_recommendation: string;
}

export interface StrategicRecommendation {
  category: 'content_creation' | 'campaign_development' | 'audience_targeting' | 'brand_positioning';
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  effort_level: 'low' | 'medium' | 'high';
  potential_impact: 'low' | 'medium' | 'high';
  supporting_data: string[];
}

export interface SocialMediaSnippet {
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  content: string;
  hashtags: string[];
  suggested_timing: string;
  expected_engagement: 'low' | 'medium' | 'high';
}

// Blog and Communication System Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  
  // Content sources
  source_stories: string[]; // Story IDs
  source_media: string[]; // Media asset IDs
  source_insights: string[]; // Analysis IDs
  
  // Classification
  category: 'success_stories' | 'business_innovation' | 'cultural_strength' | 'industry_leadership';
  tags: string[];
  target_audience: ('partners' | 'community' | 'government' | 'philanthropic')[];
  
  // Publishing
  status: 'draft' | 'review' | 'published' | 'archived';
  publish_date: Date;
  author: string;
  featured_image: string;
  
  // Performance
  view_count: number;
  engagement_metrics: EngagementMetrics;
  conversion_tracking: ConversionData;
}

export interface EngagementMetrics {
  shares: number;
  comments: number;
  time_on_page: number;
  bounce_rate: number;
  cta_clicks: number;
}

export interface ConversionData {
  inquiries_generated: number;
  partnership_leads: number;
  media_requests: number;
  speaking_opportunities: number;
}

// Prospectus and Strategic Documents
export interface Prospectus {
  id: string;
  title: string;
  version: string;
  target_audience: 'investors' | 'partners' | 'government' | 'comprehensive';
  
  // Content sections
  executive_summary: ProspectusSection;
  impact_data: ProspectusSection;
  success_stories: ProspectusSection;
  business_model: ProspectusSection;
  financial_projections: ProspectusSection;
  call_to_action: ProspectusSection;
  
  // Source content
  generated_from_stories: string[];
  generated_from_data: string[];
  last_updated: Date;
  
  // Distribution
  access_level: 'public' | 'partners' | 'confidential';
  download_count: number;
  feedback_scores: FeedbackScore[];
}

export interface ProspectusSection {
  title: string;
  content: string;
  supporting_media: string[];
  data_sources: string[];
  auto_generated_content: number; // Percentage 0-100
  human_edited_content: number; // Percentage 0-100
}

export interface FeedbackScore {
  reviewer: string;
  section: string;
  score: number; // 1-10
  comments: string;
  date: Date;
}

// API Response Types
export interface EmpathyLedgerResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
  meta?: {
    total_count: number;
    processing_time: number;
    api_version: string;
  };
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Search and Filter Types
export interface ContentSearchParams {
  query?: string;
  content_types?: ('story' | 'transcript' | 'media')[];
  date_range?: {
    start: Date;
    end: Date;
  };
  participants?: string[];
  themes?: string[];
  brand_values?: string[];
  impact_level?: string[];
  permission_level?: string[];
  page?: number;
  per_page?: number;
  sort_by?: 'date' | 'relevance' | 'impact' | 'authenticity';
  sort_order?: 'asc' | 'desc';
}

export interface AnalyticsFilters {
  time_period: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  content_categories?: string[];
  audience_segments?: string[];
  campaign_types?: string[];
  success_metrics?: string[];
}