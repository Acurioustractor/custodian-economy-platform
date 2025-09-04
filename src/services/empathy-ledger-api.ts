// Empathy Ledger API Service
// Service layer for connecting to your existing ampthy ledger database

import { 
  Story, 
  Transcript, 
  MediaAsset, 
  ContentAnalysis, 
  BlogPost, 
  Prospectus,
  EmpathyLedgerResponse,
  ContentSearchParams,
  AnalyticsFilters
} from '../types/empathy-ledger';

class EmpathyLedgerAPI {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_EMPATHY_LEDGER_API_URL || 'https://api.empathy-ledger.com/v1';
    this.apiKey = import.meta.env.VITE_EMPATHY_LEDGER_API_KEY || '';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<EmpathyLedgerResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body)}`;

    // Check cache for GET requests
    if ((!options.method || options.method === 'GET') && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '1.0',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: EmpathyLedgerResponse<T> = await response.json();

      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('Empathy Ledger API Error:', error);
      throw error;
    }
  }

  // Stories API
  async getStories(params?: ContentSearchParams): Promise<EmpathyLedgerResponse<Story[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    return this.request<Story[]>(`/stories?${queryParams.toString()}`);
  }

  async getStory(id: string): Promise<EmpathyLedgerResponse<Story>> {
    return this.request<Story>(`/stories/${id}`);
  }

  async getStoriesByParticipant(participantId: string): Promise<EmpathyLedgerResponse<Story[]>> {
    return this.request<Story[]>(`/participants/${participantId}/stories`);
  }

  async getStoriesByTheme(theme: string): Promise<EmpathyLedgerResponse<Story[]>> {
    return this.request<Story[]>(`/stories?themes=${theme}`);
  }

  async getFeaturedStories(limit: number = 5): Promise<EmpathyLedgerResponse<Story[]>> {
    return this.request<Story[]>(`/stories/featured?limit=${limit}`);
  }

  // Transcripts API
  async getTranscripts(storyId?: string): Promise<EmpathyLedgerResponse<Transcript[]>> {
    const endpoint = storyId ? `/stories/${storyId}/transcripts` : '/transcripts';
    return this.request<Transcript[]>(endpoint);
  }

  async getTranscript(id: string): Promise<EmpathyLedgerResponse<Transcript>> {
    return this.request<Transcript>(`/transcripts/${id}`);
  }

  async analyzeTranscript(id: string): Promise<EmpathyLedgerResponse<ContentAnalysis>> {
    return this.request<ContentAnalysis>(`/transcripts/${id}/analyze`, {
      method: 'POST'
    });
  }

  // Media Assets API
  async getMediaAssets(params?: ContentSearchParams): Promise<EmpathyLedgerResponse<MediaAsset[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    return this.request<MediaAsset[]>(`/media?${queryParams.toString()}`);
  }

  async getMediaAsset(id: string): Promise<EmpathyLedgerResponse<MediaAsset>> {
    return this.request<MediaAsset>(`/media/${id}`);
  }

  async getMediaByCategory(category: string): Promise<EmpathyLedgerResponse<MediaAsset[]>> {
    return this.request<MediaAsset[]>(`/media?category=${category}`);
  }

  async getMediaForStory(storyId: string): Promise<EmpathyLedgerResponse<MediaAsset[]>> {
    return this.request<MediaAsset[]>(`/stories/${storyId}/media`);
  }

  async getMediaForCampaign(campaignType: string): Promise<EmpathyLedgerResponse<MediaAsset[]>> {
    return this.request<MediaAsset[]>(`/media?campaign_potential=${campaignType}`);
  }

  // Content Analysis API
  async analyzeContent(contentId: string, contentType: 'story' | 'transcript' | 'media'): Promise<EmpathyLedgerResponse<ContentAnalysis>> {
    return this.request<ContentAnalysis>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content_id: contentId,
        content_type: contentType
      })
    });
  }

  async getBrandDNAInsights(): Promise<EmpathyLedgerResponse<ContentAnalysis[]>> {
    return this.request<ContentAnalysis[]>('/insights/brand-dna');
  }

  async getCommunicationInsights(timeframe?: string): Promise<EmpathyLedgerResponse<ContentAnalysis[]>> {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    return this.request<ContentAnalysis[]>(`/insights/communication${params}`);
  }

  async getStrategicRecommendations(): Promise<EmpathyLedgerResponse<ContentAnalysis[]>> {
    return this.request<ContentAnalysis[]>('/insights/strategic-recommendations');
  }

  // Blog Content API
  async generateBlogPost(sourceStoryIds: string[], category: string): Promise<EmpathyLedgerResponse<BlogPost>> {
    return this.request<BlogPost>('/blog/generate', {
      method: 'POST',
      body: JSON.stringify({
        source_stories: sourceStoryIds,
        category
      })
    });
  }

  async getBlogPosts(category?: string): Promise<EmpathyLedgerResponse<BlogPost[]>> {
    const params = category ? `?category=${category}` : '';
    return this.request<BlogPost[]>(`/blog${params}`);
  }

  async publishBlogPost(id: string): Promise<EmpathyLedgerResponse<BlogPost>> {
    return this.request<BlogPost>(`/blog/${id}/publish`, {
      method: 'POST'
    });
  }

  // Prospectus Generation API
  async generateProspectus(
    targetAudience: string, 
    includedStoryIds: string[]
  ): Promise<EmpathyLedgerResponse<Prospectus>> {
    return this.request<Prospectus>('/prospectus/generate', {
      method: 'POST',
      body: JSON.stringify({
        target_audience: targetAudience,
        included_stories: includedStoryIds
      })
    });
  }

  async getProspectuses(): Promise<EmpathyLedgerResponse<Prospectus[]>> {
    return this.request<Prospectus[]>('/prospectus');
  }

  async updateProspectus(id: string, updates: Partial<Prospectus>): Promise<EmpathyLedgerResponse<Prospectus>> {
    return this.request<Prospectus>(`/prospectus/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Search and Discovery
  async searchContent(query: string, filters?: ContentSearchParams): Promise<EmpathyLedgerResponse<any[]>> {
    return this.request<any[]>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filters
      })
    });
  }

  async getRelatedContent(contentId: string, contentType: string): Promise<EmpathyLedgerResponse<any[]>> {
    return this.request<any[]>(`/content/${contentId}/related?type=${contentType}`);
  }

  async getContentSuggestions(purpose: string): Promise<EmpathyLedgerResponse<any[]>> {
    return this.request<any[]>(`/suggestions?purpose=${purpose}`);
  }

  // Analytics and Insights
  async getAnalytics(filters?: AnalyticsFilters): Promise<EmpathyLedgerResponse<any>> {
    return this.request<any>('/analytics', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
  }

  async getEngagementMetrics(contentId: string): Promise<EmpathyLedgerResponse<any>> {
    return this.request<any>(`/content/${contentId}/metrics`);
  }

  async getContentPerformance(timeframe: string): Promise<EmpathyLedgerResponse<any>> {
    return this.request<any>(`/analytics/performance?timeframe=${timeframe}`);
  }

  // Utility Methods
  clearCache(): void {
    this.cache.clear();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request<any>('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Batch Operations
  async batchAnalyzeContent(contentItems: Array<{id: string, type: string}>): Promise<EmpathyLedgerResponse<ContentAnalysis[]>> {
    return this.request<ContentAnalysis[]>('/analyze/batch', {
      method: 'POST',
      body: JSON.stringify({ content_items: contentItems })
    });
  }

  async batchGetMedia(mediaIds: string[]): Promise<EmpathyLedgerResponse<MediaAsset[]>> {
    return this.request<MediaAsset[]>('/media/batch', {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds })
    });
  }

  // Real-time Updates (if your system supports websockets)
  subscribeToUpdates(callback: (update: any) => void): WebSocket | null {
    if (typeof WebSocket === 'undefined') return null;

    const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      callback(update);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

// Export singleton instance
export const empathyLedgerAPI = new EmpathyLedgerAPI();

// React Hook for easy integration
export function useEmpathyLedger() {
  return {
    api: empathyLedgerAPI,
    // Add more hook utilities as needed
  };
}

// Helper functions for common operations
export class ContentHelper {
  static extractQuotes(stories: Story[]): string[] {
    return stories.flatMap(story => 
      story.potential_quotes?.map(quote => quote.text) || []
    );
  }

  static getStoriesByBrandValue(stories: Story[], brandValue: string): Story[] {
    return stories.filter(story => 
      story.brand_values_demonstrated?.some(value => value.name === brandValue)
    );
  }

  static getHighImpactContent(stories: Story[], threshold: number = 8): Story[] {
    return stories.filter(story => 
      story.brand_values_demonstrated?.some(value => value.strength_score >= threshold)
    );
  }

  static groupByTheme(stories: Story[]): Record<string, Story[]> {
    return stories.reduce((groups, story) => {
      story.themes.forEach(theme => {
        if (!groups[theme]) groups[theme] = [];
        groups[theme].push(story);
      });
      return groups;
    }, {} as Record<string, Story[]>);
  }

  static getContentForCampaign(
    stories: Story[], 
    media: MediaAsset[], 
    campaignType: string
  ): { stories: Story[], media: MediaAsset[] } {
    const relevantStories = stories.filter(story => 
      story.featured_in_campaigns.includes(campaignType)
    );
    
    const relevantMedia = media.filter(asset => 
      asset.campaign_potential?.some(campaign => campaign.name === campaignType)
    );

    return { stories: relevantStories, media: relevantMedia };
  }

  static generateSocialMediaContent(story: Story): Array<{platform: string, content: string}> {
    if (!story.potential_quotes || story.potential_quotes.length === 0) return [];

    const bestQuote = story.potential_quotes
      .sort((a, b) => b.emotional_impact - a.emotional_impact)[0];

    return [
      {
        platform: 'linkedin',
        content: `"${bestQuote.text}"\n\n${story.summary}\n\n#PotentialFirst #TransformationStory #IndigenousExcellence`
      },
      {
        platform: 'instagram',
        content: `${bestQuote.text} ✨\n\n${story.title}\n\n#TransformationTuesday #PotentialFirst #RealStories`
      },
      {
        platform: 'twitter',
        content: `"${bestQuote.text.substring(0, 180)}..." - ${story.participant_name}\n\n#PotentialFirst`
      }
    ];
  }
}

export default empathyLedgerAPI;