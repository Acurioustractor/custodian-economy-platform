// Search Service - Comprehensive search and filtering across all content types
// Provides advanced search capabilities with filters, sorting, and faceted search

import { apiService } from './api-service';
import { validationService } from './validation-service';
import { errorHandlingService } from './error-handling-service';

export interface SearchFilters {
  contentTypes?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  authors?: string[];
  tags?: string[];
  status?: string[];
  brandScoreRange?: {
    min: number;
    max: number;
  };
  locations?: string[];
  themes?: string[];
  impactLevels?: string[];
  testTypes?: string[];
  activityTypes?: string[];
}

export interface SearchOptions {
  query?: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'title' | 'score' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeHighlights?: boolean;
  facets?: string[];
}

export interface SearchResult {
  id: string;
  type: 'story' | 'media' | 'analysis' | 'test' | 'user' | 'activity';
  title: string;
  content?: string;
  summary?: string;
  score: number;
  highlights?: {
    title?: string[];
    content?: string[];
    tags?: string[];
  };
  metadata: {
    author?: string;
    date?: Date;
    tags?: string[];
    location?: string;
    brandScore?: number;
    status?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets?: {
    [key: string]: Array<{
      value: string;
      count: number;
    }>;
  };
  suggestions?: string[];
  searchTime: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  userId: string;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
}

class SearchService {
  private searchHistory: string[] = [];
  private savedSearches: SavedSearch[] = [];
  private recentSearches: string[] = [];

  constructor() {
    this.loadSearchHistory();
  }

  /**
   * Main search function - performs comprehensive search across all content types
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    try {
      const startTime = Date.now();

      // Validate search options
      const validation = this.validateSearchOptions(options);
      if (!validation.isValid) {
        throw new Error(`Search validation failed: ${validation.errors.join(', ')}`);
      }

      // Sanitize search query
      const sanitizedQuery = validationService.sanitizeString(options.query || '');

      // Add to search history
      if (sanitizedQuery) {
        this.addToSearchHistory(sanitizedQuery);
      }

      // Perform the search
      const results = await this.performSearch(sanitizedQuery, options);

      // Calculate search time
      const searchTime = Date.now() - startTime;

      // Log search activity
      await apiService.logSystemActivity(
        `Search performed: "${sanitizedQuery}" - ${results.length} results`
      );

      return {
        results,
        total: results.length,
        facets: options.facets ? await this.calculateFacets(results, options.facets) : undefined,
        suggestions: await this.generateSuggestions(sanitizedQuery),
        searchTime
      };

    } catch (error) {
      throw errorHandlingService.handleError(error as Error, { operation: 'search', options });
    }
  }

  /**
   * Quick search for autocomplete/suggestions
   */
  async quickSearch(query: string, limit: number = 5): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
      const options: SearchOptions = {
        query,
        limit,
        sortBy: 'relevance'
      };

      const response = await this.search(options);
      return response.results;

    } catch (error) {
      console.warn('Quick search failed:', error);
      return [];
    }
  }

  /**
   * Advanced search with complex filters
   */
  async advancedSearch(
    query: string,
    filters: SearchFilters,
    sortBy: SearchOptions['sortBy'] = 'relevance',
    limit: number = 50
  ): Promise<SearchResponse> {
    return await this.search({
      query,
      filters,
      sortBy,
      limit,
      includeHighlights: true,
      facets: ['contentTypes', 'authors', 'tags', 'status', 'locations']
    });
  }

  /**
   * Search within specific content type
   */
  async searchContentType(
    contentType: string,
    query: string,
    additionalFilters?: Partial<SearchFilters>
  ): Promise<SearchResponse> {
    const filters: SearchFilters = {
      contentTypes: [contentType],
      ...additionalFilters
    };

    return await this.search({
      query,
      filters,
      includeHighlights: true
    });
  }

  /**
   * Search similar content based on tags and themes
   */
  async findSimilarContent(contentId: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Get the original content to find similar items
      const content = await this.getContentById(contentId);
      if (!content) return [];

      // Use tags and themes for similarity search
      const similarityQuery = content.metadata.tags?.join(' ') || '';
      
      const response = await this.search({
        query: similarityQuery,
        filters: {
          contentTypes: [content.type]
        },
        limit: limit + 1, // +1 because we'll exclude the original
        sortBy: 'relevance'
      });

      // Filter out the original content
      return response.results.filter(result => result.id !== contentId);

    } catch (error) {
      console.warn('Similar content search failed:', error);
      return [];
    }
  }

  /**
   * Save a search for later use
   */
  async saveSearch(name: string, query: string, filters: SearchFilters): Promise<SavedSearch> {
    const savedSearch: SavedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      query,
      filters,
      userId: 'current_user', // Would get from auth service
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 0
    };

    this.savedSearches.push(savedSearch);
    this.saveSavedSearches();

    return savedSearch;
  }

  /**
   * Get saved searches for current user
   */
  getSavedSearches(): SavedSearch[] {
    return this.savedSearches.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  /**
   * Execute a saved search
   */
  async executeSavedSearch(searchId: string): Promise<SearchResponse> {
    const savedSearch = this.savedSearches.find(s => s.id === searchId);
    if (!savedSearch) {
      throw new Error('Saved search not found');
    }

    // Update usage statistics
    savedSearch.lastUsed = new Date();
    savedSearch.useCount++;
    this.saveSavedSearches();

    return await this.search({
      query: savedSearch.query,
      filters: savedSearch.filters,
      includeHighlights: true
    });
  }

  /**
   * Get search suggestions based on history and popular searches
   */
  getSearchSuggestions(query: string): string[] {
    if (!query) return this.recentSearches.slice(0, 5);

    const suggestions = this.searchHistory
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Get recent searches
   */
  getRecentSearches(): string[] {
    return this.recentSearches;
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
    this.recentSearches = [];
    localStorage.removeItem('custodian_search_history');
  }

  // Private methods

  /**
   * Perform the actual search across different content types
   */
  private async performSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
    const allResults: SearchResult[] = [];

    // Search stories
    if (!options.filters?.contentTypes || options.filters.contentTypes.includes('story')) {
      const stories = await this.searchStories(query, options);
      allResults.push(...stories);
    }

    // Search media
    if (!options.filters?.contentTypes || options.filters.contentTypes.includes('media')) {
      const media = await this.searchMedia(query, options);
      allResults.push(...media);
    }

    // Search analyses
    if (!options.filters?.contentTypes || options.filters.contentTypes.includes('analysis')) {
      const analyses = await this.searchAnalyses(query, options);
      allResults.push(...analyses);
    }

    // Search brand tests
    if (!options.filters?.contentTypes || options.filters.contentTypes.includes('test')) {
      const tests = await this.searchTests(query, options);
      allResults.push(...tests);
    }

    // Search activities (if specified)
    if (options.filters?.contentTypes?.includes('activity')) {
      const activities = await this.searchActivities(query, options);
      allResults.push(...activities);
    }

    // Filter results
    let filteredResults = this.applyFilters(allResults, options.filters);

    // Sort results
    filteredResults = this.sortResults(filteredResults, options.sortBy, options.sortOrder);

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    filteredResults = filteredResults.slice(offset, offset + limit);

    // Add highlights if requested
    if (options.includeHighlights && query) {
      filteredResults = this.addHighlights(filteredResults, query);
    }

    return filteredResults;
  }

  /**
   * Search stories
   */
  private async searchStories(query: string, _options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await apiService.getContent({ type: 'story' });
      if (!response.success || !response.data) return [];

      const stories = response.data;
      const results: SearchResult[] = [];

      for (const story of stories) {
        const score = this.calculateRelevanceScore(story, query);
        if (score > 0) {
          results.push({
            id: story.id,
            type: 'story',
            title: story.title,
            content: story.content,
            summary: story.content?.substring(0, 200) + '...',
            score,
            metadata: {
              author: story.authorId,
              date: new Date(story.createdAt),
              tags: story.tags || [],
              status: story.status
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.warn('Story search failed:', error);
      return [];
    }
  }

  /**
   * Search media items
   */
  private async searchMedia(query: string, _options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await apiService.getMedia();
      if (!response.success || !response.data) return [];

      const media = response.data;
      const results: SearchResult[] = [];

      for (const item of media) {
        const score = this.calculateRelevanceScore(item, query);
        if (score > 0) {
          results.push({
            id: item.id,
            type: 'media',
            title: item.name || item.filename || 'Untitled',
            summary: item.alt_text || item.description || '',
            score,
            metadata: {
              author: item.uploadedBy,
              date: new Date(item.uploadedAt),
              tags: item.tags || []
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.warn('Media search failed:', error);
      return [];
    }
  }

  /**
   * Search brand analyses
   */
  private async searchAnalyses(_query: string, _options: SearchOptions): Promise<SearchResult[]> {
    // Mock implementation - in production, would fetch from brand analysis service
    return [];
  }

  /**
   * Search brand tests
   */
  private async searchTests(query: string, _options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await apiService.getBrandTests();
      if (!response.success || !response.data) return [];

      const tests = response.data;
      const results: SearchResult[] = [];

      for (const test of tests) {
        const score = this.calculateRelevanceScore(test, query);
        if (score > 0) {
          results.push({
            id: test.id,
            type: 'test',
            title: test.name,
            summary: test.description,
            score,
            metadata: {
              author: test.authorId,
              date: new Date(test.createdAt),
              status: test.status
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.warn('Test search failed:', error);
      return [];
    }
  }

  /**
   * Search activities
   */
  private async searchActivities(query: string, _options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await apiService.getActivities();
      if (!response.success || !response.data) return [];

      const activities = response.data;
      const results: SearchResult[] = [];

      for (const activity of activities) {
        const score = this.calculateRelevanceScore(activity, query);
        if (score > 0) {
          results.push({
            id: activity.id,
            type: 'activity',
            title: `${activity.type} Activity`,
            summary: activity.message,
            score,
            metadata: {
              date: new Date(activity.timestamp)
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.warn('Activity search failed:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(item: any, query: string): number {
    if (!query) return 1;

    const queryTerms = query.toLowerCase().split(/\s+/);
    let score = 0;

    // Title matching (highest weight)
    if (item.title) {
      const titleLower = item.title.toLowerCase();
      for (const term of queryTerms) {
        if (titleLower.includes(term)) {
          score += titleLower === term ? 10 : titleLower.startsWith(term) ? 5 : 2;
        }
      }
    }

    // Content matching
    if (item.content) {
      const contentLower = item.content.toLowerCase();
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          score += 1;
        }
      }
    }

    // Tag matching
    if (item.tags) {
      for (const tag of item.tags) {
        const tagLower = tag.toLowerCase();
        for (const term of queryTerms) {
          if (tagLower.includes(term)) {
            score += 3;
          }
        }
      }
    }

    // Description matching
    if (item.description) {
      const descLower = item.description.toLowerCase();
      for (const term of queryTerms) {
        if (descLower.includes(term)) {
          score += 1.5;
        }
      }
    }

    return score;
  }

  /**
   * Apply filters to search results
   */
  private applyFilters(results: SearchResult[], filters?: SearchFilters): SearchResult[] {
    if (!filters) return results;

    return results.filter(result => {
      // Date range filter
      if (filters.dateRange) {
        const itemDate = result.metadata.date;
        if (itemDate) {
          if (filters.dateRange.start && itemDate < filters.dateRange.start) return false;
          if (filters.dateRange.end && itemDate > filters.dateRange.end) return false;
        }
      }

      // Author filter
      if (filters.authors && filters.authors.length > 0) {
        if (!result.metadata.author || !filters.authors.includes(result.metadata.author)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!result.metadata.status || !filters.status.includes(result.metadata.status)) {
          return false;
        }
      }

      // Tag filter
      if (filters.tags && filters.tags.length > 0) {
        const itemTags = result.metadata.tags || [];
        const hasMatchingTag = filters.tags.some(tag => 
          itemTags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Brand score range filter
      if (filters.brandScoreRange && result.metadata.brandScore !== undefined) {
        if (result.metadata.brandScore < filters.brandScoreRange.min ||
            result.metadata.brandScore > filters.brandScoreRange.max) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Sort search results
   */
  private sortResults(
    results: SearchResult[],
    sortBy?: SearchOptions['sortBy'],
    sortOrder: SearchOptions['sortOrder'] = 'desc'
  ): SearchResult[] {
    const sorted = [...results];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          const dateA = a.metadata.date?.getTime() || 0;
          const dateB = b.metadata.date?.getTime() || 0;
          comparison = dateA - dateB;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'score':
          comparison = (a.metadata.brandScore || 0) - (b.metadata.brandScore || 0);
          break;
        case 'relevance':
        default:
          comparison = a.score - b.score;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Add search highlights to results
   */
  private addHighlights(results: SearchResult[], query: string): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/);

    return results.map(result => {
      const highlights: SearchResult['highlights'] = {};

      // Highlight title
      if (result.title) {
        highlights.title = this.highlightText(result.title, queryTerms);
      }

      // Highlight content
      if (result.content) {
        highlights.content = this.highlightText(result.content, queryTerms, 150);
      }

      // Highlight tags
      if (result.metadata.tags) {
        highlights.tags = result.metadata.tags.filter(tag =>
          queryTerms.some(term => tag.toLowerCase().includes(term))
        );
      }

      return { ...result, highlights };
    });
  }

  /**
   * Highlight search terms in text
   */
  private highlightText(text: string, terms: string[], maxLength?: number): string[] {
    let highlightedText = text;
    
    for (const term of terms) {
      if (term.length > 2) { // Only highlight terms longer than 2 characters
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
      }
    }

    if (maxLength && highlightedText.length > maxLength) {
      // Find a good breaking point near the highlighted terms
      const truncated = highlightedText.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(' ');
      highlightedText = truncated.substring(0, lastSpace) + '...';
    }

    return [highlightedText];
  }

  /**
   * Calculate facets for search results
   */
  private async calculateFacets(results: SearchResult[], facetFields: string[]): Promise<{ [key: string]: Array<{ value: string; count: number }> }> {
    const facets: { [key: string]: Array<{ value: string; count: number }> } = {};

    for (const field of facetFields) {
      const counts: { [key: string]: number } = {};

      results.forEach(result => {
        let values: string[] = [];

        switch (field) {
          case 'contentTypes':
            values = [result.type];
            break;
          case 'authors':
            if (result.metadata.author) values = [result.metadata.author];
            break;
          case 'tags':
            values = result.metadata.tags || [];
            break;
          case 'status':
            if (result.metadata.status) values = [result.metadata.status];
            break;
        }

        values.forEach(value => {
          counts[value] = (counts[value] || 0) + 1;
        });
      });

      facets[field] = Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    }

    return facets;
  }

  /**
   * Generate search suggestions
   */
  private async generateSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 3) return [];

    // Simple suggestion generation based on common search patterns
    const suggestions = [
      `${query} stories`,
      `${query} analysis`,
      `${query} brand test`,
      `recent ${query}`,
      `${query} by author`
    ];

    return suggestions.slice(0, 5);
  }

  /**
   * Validate search options
   */
  private validateSearchOptions(options: SearchOptions): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (options.limit && (options.limit < 1 || options.limit > 1000)) {
      errors.push('Limit must be between 1 and 1000');
    }

    if (options.offset && options.offset < 0) {
      errors.push('Offset must be non-negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Get content by ID for similarity search
   */
  private async getContentById(id: string): Promise<SearchResult | null> {
    try {
      // This would typically make an API call to get specific content
      const response = await apiService.getContent();
      if (response.success && response.data) {
        const content = response.data.find((item: any) => item.id === id);
        if (content) {
          return {
            id: content.id,
            type: 'story',
            title: content.title,
            content: content.content,
            score: 1,
            metadata: {
              tags: content.tags || [],
              author: content.authorId,
              date: new Date(content.createdAt)
            }
          };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Add query to search history
   */
  private addToSearchHistory(query: string): void {
    // Remove duplicates and add to beginning
    this.searchHistory = [query, ...this.searchHistory.filter(q => q !== query)];
    
    // Keep only last 100 searches
    this.searchHistory = this.searchHistory.slice(0, 100);
    
    // Update recent searches (last 10)
    this.recentSearches = [query, ...this.recentSearches.filter(q => q !== query)];
    this.recentSearches = this.recentSearches.slice(0, 10);
    
    // Save to localStorage
    this.saveSearchHistory();
  }

  /**
   * Load search history from localStorage
   */
  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem('custodian_search_history');
      if (stored) {
        const data = JSON.parse(stored);
        this.searchHistory = data.history || [];
        this.recentSearches = data.recent || [];
        this.savedSearches = data.saved || [];
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }

  /**
   * Save search history to localStorage
   */
  private saveSearchHistory(): void {
    try {
      const data = {
        history: this.searchHistory,
        recent: this.recentSearches,
        saved: this.savedSearches
      };
      localStorage.setItem('custodian_search_history', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  /**
   * Save saved searches to localStorage
   */
  private saveSavedSearches(): void {
    this.saveSearchHistory();
  }
}

export const searchService = new SearchService();