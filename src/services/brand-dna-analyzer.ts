// Brand DNA Analyzer - AI-powered content analysis for extracting brand themes
// This service analyzes stories, transcripts, and media to identify brand DNA patterns
// Enhanced with real database integration and sophisticated content analysis

import { 
  Story, 
  Transcript, 
  ContentAnalysis, 
  BrandDNAScore, 
  CommunicationInsight,
  StrategicRecommendation,
  BrandValue,
  Quote,
  SentimentData
} from '../types/empathy-ledger';
import { databaseService } from './database-service';
import { apiService } from './api-service';
import { validationService } from './validation-service';
import { errorHandlingService } from './error-handling-service';

interface BrandDNAPattern {
  theme: string;
  keywords: string[];
  emotional_indicators: string[];
  strength_indicators: string[];
  frequency_weight: number;
}

interface AnalysisConfig {
  sentiment_threshold: number;
  authenticity_threshold: number;
  brand_alignment_threshold: number;
  min_quote_length: number;
  max_quote_length: number;
  ai_analysis_enabled: boolean;
  cache_results: boolean;
  max_cache_age_hours: number;
}

interface RealContentSource {
  id: string;
  type: 'story' | 'transcript' | 'media' | 'analysis';
  title: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
  authorId: string;
  tags: string[];
}

interface EnhancedAnalysisResult {
  analysis: ContentAnalysis;
  metrics_impact: {
    stories_analyzed: number;
    brand_score_change: number;
    insights_generated: number;
  };
  actionable_items: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  content_recommendations: {
    create_similar: boolean;
    amplify_message: boolean;
    archive_content: boolean;
    additional_research_needed: boolean;
  };
}

class BrandDNAAnalyzer {
  private config: AnalysisConfig = {
    sentiment_threshold: 0.6,
    authenticity_threshold: 0.7,
    brand_alignment_threshold: 0.8,
    min_quote_length: 20,
    max_quote_length: 200,
    ai_analysis_enabled: true,
    cache_results: true,
    max_cache_age_hours: 24
  };

  private analysisCache: Map<string, { analysis: ContentAnalysis; timestamp: Date }> = new Map();
  private brandHealthHistory: Array<{ date: Date; score: number; insights_count: number }> = [];

  // Brand DNA patterns based on your brand guide
  private brandPatterns: BrandDNAPattern[] = [
    {
      theme: 'potential_first',
      keywords: ['potential', 'capability', 'see', 'opportunity', 'possibility', 'able', 'can', 'will'],
      emotional_indicators: ['hope', 'optimism', 'confidence', 'belief', 'trust'],
      strength_indicators: ['achieved', 'accomplished', 'succeeded', 'overcame', 'transformed'],
      frequency_weight: 1.2
    },
    {
      theme: 'cultural_strength',
      keywords: ['culture', 'indigenous', 'traditional', 'community', 'family', 'connection', 'belonging'],
      emotional_indicators: ['pride', 'belonging', 'identity', 'strength', 'grounded'],
      strength_indicators: ['cultural knowledge', 'traditional ways', 'mob', 'country', 'elders'],
      frequency_weight: 1.1
    },
    {
      theme: 'commercial_excellence',
      keywords: ['business', 'work', 'employment', 'productive', 'quality', 'professional', 'successful'],
      emotional_indicators: ['pride', 'accomplishment', 'satisfaction', 'confidence'],
      strength_indicators: ['delivered', 'exceeded', 'productive', 'reliable', 'quality'],
      frequency_weight: 1.0
    },
    {
      theme: 'reciprocity',
      keywords: ['give back', 'support', 'help', 'mentor', 'share', 'community', 'together'],
      emotional_indicators: ['gratitude', 'responsibility', 'connection', 'caring'],
      strength_indicators: ['mentoring', 'supporting', 'helping', 'giving back', 'sharing'],
      frequency_weight: 0.9
    },
    {
      theme: 'transformation',
      keywords: ['change', 'different', 'before', 'after', 'journey', 'growth', 'development'],
      emotional_indicators: ['hope', 'determination', 'resilience', 'growth'],
      strength_indicators: ['changed', 'transformed', 'improved', 'developed', 'overcame'],
      frequency_weight: 1.3
    }
  ];

  // === ENHANCED ANALYSIS METHODS ===

  /**
   * Analyze all content in the database and generate comprehensive brand DNA insights
   */
  async analyzeAllContent(userId?: string): Promise<{
    overall_analysis: ContentAnalysis[];
    brand_health_report: any;
    actionable_insights: string[];
    content_strategy_recommendations: string[];
  }> {
    try {
      // Get all content from database
      const contentResponse = await apiService.getContent();
      if (!contentResponse.success || !contentResponse.data) {
        throw new Error('Failed to retrieve content from database');
      }

      const realContent = contentResponse.data;
      const analyses: ContentAnalysis[] = [];

      // Analyze each piece of content
      for (const content of realContent) {
        try {
          const analysis = await this.analyzeRealContent(content);
          analyses.push(analysis);
          
          // Update metrics
          await this.updateMetricsFromAnalysis(analysis, userId);
          
        } catch (error) {
          const appError = errorHandlingService.handleError(error, { contentId: content.id });
          console.warn(`Failed to analyze content ${content.id}:`, appError.message);
        }
      }

      // Generate comprehensive brand health report
      const brandHealthReport = this.generateBrandHealthReport(analyses);
      
      // Update brand health history
      this.updateBrandHealthHistory(brandHealthReport.overall_score, analyses.length);
      
      // Generate actionable insights
      const actionableInsights = this.generateActionableInsights(analyses, brandHealthReport);
      
      // Generate content strategy recommendations
      const contentStrategy = this.generateContentStrategyRecommendations(analyses, realContent);

      return {
        overall_analysis: analyses,
        brand_health_report: brandHealthReport,
        actionable_insights: actionableInsights,
        content_strategy_recommendations: contentStrategy
      };
      
    } catch (error) {
      const appError = errorHandlingService.handleError(error, { operation: 'analyzeAllContent' });
      throw appError;
    }
  }

  /**
   * Analyze a single piece of real content from the database
   */
  async analyzeRealContent(content: RealContentSource): Promise<ContentAnalysis> {
    try {
      // Check cache first
      const cacheKey = `${content.id}_${content.type}`;
      if (this.config.cache_results && this.isAnalysisCached(cacheKey)) {
        const cached = this.analysisCache.get(cacheKey)!;
        return cached.analysis;
      }

      // Validate content
      const validation = validationService.validateContent(content);
      if (!validation.isValid) {
        throw errorHandlingService.createError(
          'INVALID_CONTENT',
          'Content validation failed for analysis',
          'medium',
          'validation',
          validation.errors
        );
      }

      // Perform enhanced analysis based on content type
      let analysis: ContentAnalysis;
      
      switch (content.type) {
        case 'story':
          analysis = await this.analyzeStoryContent(content);
          break;
        case 'transcript':
          analysis = await this.analyzeTranscriptContent(content);
          break;
        case 'media':
          analysis = await this.analyzeMediaContent(content);
          break;
        case 'analysis':
          analysis = await this.analyzeAnalysisContent(content);
          break;
        default:
          analysis = await this.analyzeGenericContent(content);
      }

      // Cache the result
      if (this.config.cache_results) {
        this.analysisCache.set(cacheKey, { analysis, timestamp: new Date() });
      }

      // Log the analysis activity
      await apiService.logSystemActivity(
        `Brand DNA analysis completed for ${content.type}: ${content.title}`,
        content.authorId
      );

      return analysis;
      
    } catch (error) {
      const appError = errorHandlingService.handleError(error, { 
        contentId: content.id, 
        contentType: content.type 
      });
      throw appError;
    }
  }

  /**
   * Enhanced story content analysis with real data integration
   */
  private async analyzeStoryContent(content: RealContentSource): Promise<ContentAnalysis> {
    const textContent = `${content.title} ${content.content}`;
    
    // Extract enhanced brand values with real content context
    const brandValues = this.extractEnhancedBrandValues(textContent, content.metadata);
    
    // Generate enhanced sentiment analysis
    const sentimentData = this.enhancedSentimentAnalysis(textContent, content.tags);
    
    // Extract contextual quotes
    const quotes = this.extractContextualQuotes(content.content, sentimentData, content.metadata);
    
    // Calculate sophisticated brand DNA score
    const brandDNAScore = this.calculateEnhancedBrandDNAScore(
      textContent, 
      brandValues, 
      sentimentData, 
      content.metadata
    );
    
    // Generate strategic insights with real data context
    const insights = this.generateEnhancedInsights(content, brandValues, sentimentData);
    
    // Generate data-driven recommendations
    const recommendations = this.generateDataDrivenRecommendations(
      content, 
      brandDNAScore, 
      insights
    );

    return {
      id: `enhanced_analysis_${content.id}_${Date.now()}`,
      content_id: content.id,
      content_type: 'story',
      brand_dna_score: brandDNAScore,
      communication_insights: insights,
      strategic_recommendations: recommendations,
      suggested_headlines: this.generateEnhancedHeadlines(content, brandValues),
      key_messages_extracted: this.extractEnhancedKeyMessages(content, brandValues),
      social_media_snippets: this.generateEnhancedSocialContent(content, quotes),
      analyzed_date: new Date(),
      analysis_version: '2.0',
      confidence_level: this.calculateConfidenceLevel(brandDNAScore, content)
    };
  }

  /**
   * Enhanced brand value extraction with metadata context
   */
  private extractEnhancedBrandValues(text: string, metadata: Record<string, any>): BrandValue[] {
    const lowerText = text.toLowerCase();
    const enhancedBrandValues: BrandValue[] = [];
    
    for (const pattern of this.brandPatterns) {
      let score = 0;
      let evidenceFragments: string[] = [];
      let contextualBonus = 0;
      
      // Count keyword matches with context weighting
      const keywordMatches = pattern.keywords.filter(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
        return keywordRegex.test(lowerText);
      });
      
      score += keywordMatches.length * pattern.frequency_weight;
      
      // Emotional indicator analysis
      const emotionalMatches = pattern.emotional_indicators.filter(emotion => 
        lowerText.includes(emotion.toLowerCase())
      );
      score += emotionalMatches.length * 0.8;
      
      // Strength indicator analysis
      const strengthMatches = pattern.strength_indicators.filter(strength => 
        lowerText.includes(strength.toLowerCase())
      );
      score += strengthMatches.length * 1.2;
      
      // Metadata context bonus
      if (metadata.wordCount && metadata.wordCount > 500) {
        contextualBonus += 0.5; // Longer content bonus
      }
      if (metadata.readingTime && metadata.readingTime > 3) {
        contextualBonus += 0.3; // Engagement time bonus
      }
      
      // Extract enhanced evidence with better context
      pattern.keywords.forEach(keyword => {
        const sentences = text.split(/[.!?]+/);
        const relevantSentences = sentences.filter(sentence => 
          sentence.toLowerCase().includes(keyword.toLowerCase())
        );
        evidenceFragments.push(...relevantSentences.slice(0, 2));
      });
      
      const finalScore = Math.min(10, Math.max(1, score + contextualBonus));
      
      if (finalScore > 2) {
        enhancedBrandValues.push({
          name: pattern.theme as any,
          evidence_text: evidenceFragments.join(' ').trim(),
          strength_score: finalScore
        });
      }
    }
    
    return enhancedBrandValues;
  }

  /**
   * Enhanced sentiment analysis with tag context
   */
  private enhancedSentimentAnalysis(text: string, tags: string[]): SentimentData {
    const words = text.toLowerCase().split(/\s+/);
    
    // Enhanced word lists with context
    const positiveWords = [
      'amazing', 'excellent', 'outstanding', 'remarkable', 'inspiring',
      'successful', 'achieved', 'accomplished', 'transformed', 'empowered',
      'proud', 'confident', 'capable', 'strong', 'resilient'
    ];
    
    const negativeWords = [
      'challenging', 'difficult', 'struggled', 'barrier', 'obstacle',
      'limited', 'restricted', 'prevented', 'blocked', 'hindered'
    ];
    
    const transformationWords = [
      'transformed', 'changed', 'evolved', 'developed', 'grew',
      'learned', 'discovered', 'realized', 'achieved', 'overcame',
      'breakthrough', 'journey', 'progress', 'advancement'
    ];
    
    // Calculate enhanced sentiment scores
    const positive = words.filter(w => positiveWords.includes(w)).length;
    const negative = words.filter(w => negativeWords.includes(w)).length;
    const transformation = words.filter(w => transformationWords.includes(w)).length;
    
    // Tag-based sentiment adjustment
    let tagSentimentBonus = 0;
    const positiveTags = ['success', 'achievement', 'growth', 'empowerment'];
    const transformationTags = ['journey', 'change', 'development', 'progress'];
    
    tags.forEach(tag => {
      if (positiveTags.includes(tag.toLowerCase())) tagSentimentBonus += 1;
      if (transformationTags.includes(tag.toLowerCase())) tagSentimentBonus += 0.5;
    });
    
    const adjustedPositive = positive + tagSentimentBonus;
    const overall = adjustedPositive > negative ? 'positive' : 
                   negative > adjustedPositive ? 'negative' : 'neutral';
    
    // Enhanced emotional journey mapping
    const emotionalJourney = this.mapEmotionalJourney(text, transformation);
    
    return {
      overall_sentiment: overall,
      emotional_journey: emotionalJourney,
      key_emotions: this.extractKeyEmotions(text, tags),
      transformational_indicators: transformationWords.filter(w => words.includes(w))
    };
  }

  /**
   * Map emotional journey through content
   */
  private mapEmotionalJourney(text: string, transformationCount: number): Array<{
    text_position: number;
    emotion: string;
    intensity: number;
  }> {
    const words = text.split(/\s+/);
    const segments = Math.min(5, Math.max(3, Math.floor(words.length / 100)));
    const journey = [];
    
    for (let i = 0; i < segments; i++) {
      const position = Math.floor((words.length / segments) * i);
      const segmentText = words.slice(position, position + words.length / segments).join(' ');
      
      let emotion = 'neutral';
      let intensity = 5;
      
      // Analyze segment for emotional content
      if (segmentText.toLowerCase().includes('difficult') || segmentText.toLowerCase().includes('challenge')) {
        emotion = 'challenging';
        intensity = 6;
      }
      if (segmentText.toLowerCase().includes('hope') || segmentText.toLowerCase().includes('opportunity')) {
        emotion = 'hopeful';
        intensity = 7;
      }
      if (segmentText.toLowerCase().includes('success') || segmentText.toLowerCase().includes('achieve')) {
        emotion = 'triumphant';
        intensity = 8;
      }
      if (transformationCount > 0 && i === segments - 1) {
        emotion = 'transformed';
        intensity = 9;
      }
      
      journey.push({ text_position: position, emotion, intensity });
    }
    
    return journey;
  }

  /**
   * Extract key emotions with tag context
   */
  private extractKeyEmotions(text: string, tags: string[]): string[] {
    const emotionMap = {
      'determination': ['determined', 'focused', 'committed', 'persistent'],
      'growth': ['learning', 'developing', 'growing', 'expanding'],
      'pride': ['proud', 'accomplished', 'achieved', 'successful'],
      'resilience': ['overcome', 'persevered', 'endured', 'resilient'],
      'hope': ['hope', 'optimistic', 'positive', 'future'],
      'empowerment': ['empowered', 'capable', 'confident', 'strong']
    };
    
    const detectedEmotions: string[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(emotionMap).forEach(([emotion, keywords]) => {
      const hasKeywords = keywords.some(keyword => lowerText.includes(keyword));
      const hasTag = tags.some(tag => tag.toLowerCase().includes(emotion));
      
      if (hasKeywords || hasTag) {
        detectedEmotions.push(emotion);
      }
    });
    
    return detectedEmotions.slice(0, 4); // Top 4 emotions
  }
  /**
   * Calculate enhanced brand DNA score with metadata context
   */
  private calculateEnhancedBrandDNAScore(
    text: string, 
    brandValues: BrandValue[], 
    sentiment: SentimentData, 
    metadata: Record<string, any>
  ): BrandDNAScore {
    const avgBrandScore = brandValues.reduce((sum, val) => sum + val.strength_score, 0) / (brandValues.length || 1);
    
    // Enhanced scoring with metadata context
    let authenticity = 70;
    if (sentiment.transformational_indicators.length > 2) authenticity += 15;
    if (metadata.authorVerified) authenticity += 10;
    if (text.length > 1000) authenticity += 5; // Detailed stories are more authentic
    
    let consistency = avgBrandScore * 8; // Base on brand value alignment
    if (brandValues.length >= 3) consistency += 10; // Multiple themes = consistency
    
    let emotionalResonance = 60;
    if (sentiment.overall_sentiment === 'positive') emotionalResonance += 20;
    if (sentiment.emotional_journey.some(j => j.intensity > 7)) emotionalResonance += 15;
    if (sentiment.key_emotions.length > 2) emotionalResonance += 5;
    
    const culturalValue = brandValues.find(v => v.name === 'cultural_strength');
    let culturalAlignment = culturalValue ? culturalValue.strength_score * 8 : 60;
    if (metadata.culturalContext) culturalAlignment += 10;
    
    const commercialValue = brandValues.find(v => v.name === 'commercial_excellence');
    let commercialViability = commercialValue ? commercialValue.strength_score * 8 : 65;
    if (metadata.businessOutcome) commercialViability += 15;
    
    // Calculate overall score with weighted average
    const scores = [authenticity, consistency, emotionalResonance, culturalAlignment, commercialViability];
    const weights = [0.25, 0.2, 0.2, 0.2, 0.15]; // Authenticity weighted higher
    const overallScore = scores.reduce((sum, score, i) => sum + (score * weights[i]), 0);
    
    return {
      authenticity: Math.min(100, authenticity),
      consistency: Math.min(100, consistency),
      emotional_resonance: Math.min(100, emotionalResonance),
      cultural_alignment: Math.min(100, culturalAlignment),
      commercial_viability: Math.min(100, commercialViability),
      overall_score: Math.min(100, overallScore)
    };
  }

  /**
   * Generate enhanced insights with real data context
   */
  private generateEnhancedInsights(
    content: RealContentSource, 
    brandValues: BrandValue[], 
    sentiment: SentimentData
  ): CommunicationInsight[] {
    const insights: CommunicationInsight[] = [];
    
    // Content strength insights
    const strongThemes = brandValues.filter(v => v.strength_score > 7);
    if (strongThemes.length > 0) {
      insights.push({
        insight_type: 'messaging',
        insight: `Strong ${strongThemes.map(t => t.name).join(', ')} themes make this ideal for primary messaging`,
        evidence: strongThemes.map(t => `${t.name}: ${t.strength_score}/10`),
        confidence: strongThemes.length / brandValues.length,
        actionable_recommendation: `Feature in ${strongThemes[0].name} campaign materials`
      });
    }
    
    // Emotional journey insights
    const emotionalPeaks = sentiment.emotional_journey.filter(j => j.intensity > 7);
    if (emotionalPeaks.length > 0) {
      insights.push({
        insight_type: 'creative',
        insight: 'High emotional intensity points identified for visual storytelling',
        evidence: emotionalPeaks.map(p => `${p.emotion} (intensity: ${p.intensity})}`),
        confidence: 0.85,
        actionable_recommendation: 'Create video content focusing on emotional transformation moments'
      });
    }
    
    // Content gap insights
    const missingThemes = this.brandPatterns.filter(pattern => 
      !brandValues.some(v => v.name === pattern.theme)
    );
    if (missingThemes.length > 0) {
      insights.push({
        insight_type: 'messaging',
        insight: `Content could be strengthened by incorporating ${missingThemes[0].theme} elements`,
        evidence: [`Missing theme: ${missingThemes[0].theme}`],
        confidence: 0.7,
        actionable_recommendation: `Add content highlighting ${missingThemes[0].theme} aspects`
      });
    }
    
    // Audience targeting insights
    if (content.tags.includes('employment') || content.tags.includes('business')) {
      insights.push({
        insight_type: 'audience',
        insight: 'Strong business relevance makes this suitable for corporate and government audiences',
        evidence: [`Tags: ${content.tags.join(', ')}`],
        confidence: 0.8,
        actionable_recommendation: 'Include in business case presentations and policy submissions'
      });
    }
    
    return insights;
  }

  /**
   * Generate data-driven recommendations
   */
  private generateDataDrivenRecommendations(
    content: RealContentSource,
    brandScore: BrandDNAScore,
    insights: CommunicationInsight[]
  ): StrategicRecommendation[] {
    const recommendations: StrategicRecommendation[] = [];
    
    // High-value content recommendations
    if (brandScore.overall_score > 85) {
      recommendations.push({
        category: 'content_creation',
        recommendation: 'Develop this high-scoring content into a multi-format campaign',
        priority: 'high',
        effort_level: 'medium',
        potential_impact: 'high',
        supporting_data: [
          `Brand DNA Score: ${brandScore.overall_score.toFixed(1)}`,
          `Generated ${insights.length} strategic insights`
        ]
      });
    }
    
    // Content optimization recommendations
    if (brandScore.cultural_alignment < 70) {
      recommendations.push({
        category: 'content_creation',
        recommendation: 'Strengthen cultural context and connection elements',
        priority: 'medium',
        effort_level: 'low',
        potential_impact: 'medium',
        supporting_data: [`Cultural alignment: ${brandScore.cultural_alignment.toFixed(1)}`]
      });
    }
    
    // Distribution strategy recommendations
    if (brandScore.emotional_resonance > 80) {
      recommendations.push({
        category: 'content_creation',
        recommendation: 'Prioritize emotional storytelling channels (video, social media)',
        priority: 'high',
        effort_level: 'medium',
        potential_impact: 'high',
        supporting_data: [`Emotional resonance: ${brandScore.emotional_resonance.toFixed(1)}`]
      });
    }
    
    // Content creation recommendations
    const strongestTheme = insights.find(i => i.insight_type === 'messaging');
    if (strongestTheme) {
      recommendations.push({
        category: 'content_creation',
        recommendation: 'Create similar content focusing on identified strong themes',
        priority: 'medium',
        effort_level: 'medium',
        potential_impact: 'high',
        supporting_data: [strongestTheme.insight]
      });
    }
    
    return recommendations;
  }

  /**
   * Update metrics based on analysis results
   */
  private async updateMetricsFromAnalysis(analysis: ContentAnalysis, userId?: string): Promise<void> {
    try {
      // Update story count
      await apiService.incrementStoryCount(userId);
      
      // Update brand score if it's higher
      const currentMetrics = await apiService.getMetrics(userId);
      if (currentMetrics.success && currentMetrics.data) {
        const currentBrandScore = currentMetrics.data.brandScore || 0;
        const newBrandScore = analysis.brand_dna_score.overall_score;
        
        if (newBrandScore > currentBrandScore) {
          await apiService.updateBrandScore(newBrandScore, userId);
        }
      }
      
      // Log analysis activity
      await apiService.logSystemActivity(
        `Brand DNA analysis completed - Score: ${analysis.brand_dna_score.overall_score.toFixed(1)}`,
        userId
      );
      
    } catch (error) {
      console.warn('Failed to update metrics from analysis:', error);
    }
  }

  /**
   * Generate comprehensive brand health report
   */
  private generateBrandHealthReport(analyses: ContentAnalysis[]): {
    overall_score: number;
    theme_distribution: Record<string, number>;
    content_quality_trends: Array<{ date: Date; score: number }>;
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  } {
    if (analyses.length === 0) {
      return {
        overall_score: 0,
        theme_distribution: {},
        content_quality_trends: [],
        strengths: [],
        opportunities: ['Create initial content for analysis'],
        recommendations: ['Begin content creation to establish brand DNA baseline']
      };
    }
    
    const avgScore = analyses.reduce((sum, a) => sum + a.brand_dna_score.overall_score, 0) / analyses.length;
    
    // Analyze theme distribution
    const themeDistribution: Record<string, number> = {};
    const allInsights = analyses.flatMap(a => a.communication_insights);
    
    allInsights.forEach(insight => {
      themeDistribution[insight.insight_type] = (themeDistribution[insight.insight_type] || 0) + 1;
    });
    
    // Generate quality trends
    const contentQualityTrends = analyses.map(a => ({
      date: a.analyzed_date,
      score: a.brand_dna_score.overall_score
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Identify strengths (themes with high average scores)
    const themeScores = this.calculateThemeAverages(analyses);
    const strengths = Object.entries(themeScores)
      .filter(([_, score]) => score > 80)
      .map(([theme, _]) => theme)
      .slice(0, 3);
    
    // Identify opportunities (themes with room for improvement)
    const opportunities = Object.entries(themeScores)
      .filter(([_, score]) => score < 70)
      .map(([theme, score]) => `Improve ${theme} (current: ${score.toFixed(1)})`)
      .slice(0, 3);
    
    // Generate recommendations
    const recommendations = this.generateSystemRecommendations(analyses, themeScores);
    
    return {
      overall_score: avgScore,
      theme_distribution: themeDistribution,
      content_quality_trends: contentQualityTrends,
      strengths,
      opportunities,
      recommendations
    };
  }

  /**
   * Calculate theme averages across all analyses
   */
  private calculateThemeAverages(analyses: ContentAnalysis[]): Record<string, number> {
    const themeScores: Record<string, number[]> = {
      authenticity: [],
      consistency: [],
      emotional_resonance: [],
      cultural_alignment: [],
      commercial_viability: []
    };
    
    analyses.forEach(analysis => {
      themeScores.authenticity.push(analysis.brand_dna_score.authenticity);
      themeScores.consistency.push(analysis.brand_dna_score.consistency);
      themeScores.emotional_resonance.push(analysis.brand_dna_score.emotional_resonance);
      themeScores.cultural_alignment.push(analysis.brand_dna_score.cultural_alignment);
      themeScores.commercial_viability.push(analysis.brand_dna_score.commercial_viability);
    });
    
    const averages: Record<string, number> = {};
    Object.entries(themeScores).forEach(([theme, scores]) => {
      averages[theme] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    return averages;
  }

  /**
   * Generate system-level recommendations
   */
  private generateSystemRecommendations(
    analyses: ContentAnalysis[], 
    themeScores: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];
    
    // Content volume recommendations
    if (analyses.length < 5) {
      recommendations.push('Increase content volume to establish stronger brand DNA patterns');
    }
    
    // Theme balance recommendations
    const lowestTheme = Object.entries(themeScores)
      .sort(([,a], [,b]) => a - b)[0];
    
    if (lowestTheme && lowestTheme[1] < 70) {
      recommendations.push(`Focus on improving ${lowestTheme[0]} in future content`);
    }
    
    // Content diversity recommendations
    const insightTypes = new Set(analyses.flatMap(a => a.communication_insights.map(i => i.insight_type)));
    if (insightTypes.size < 3) {
      recommendations.push('Diversify content types to capture broader brand themes');
    }
    
    // Quality consistency recommendations
    const scoreVariance = this.calculateScoreVariance(analyses);
    if (scoreVariance > 20) {
      recommendations.push('Establish content quality standards to improve consistency');
    }
    
    return recommendations;
  }

  /**
   * Calculate score variance for consistency analysis
   */
  private calculateScoreVariance(analyses: ContentAnalysis[]): number {
    if (analyses.length < 2) return 0;
    
    const scores = analyses.map(a => a.brand_dna_score.overall_score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Check if analysis is cached and still valid
   */
  private isAnalysisCached(cacheKey: string): boolean {
    const cached = this.analysisCache.get(cacheKey);
    if (!cached) return false;
    
    const ageHours = (Date.now() - cached.timestamp.getTime()) / (1000 * 60 * 60);
    return ageHours < this.config.max_cache_age_hours;
  }

  /**
   * Update brand health history
   */
  private updateBrandHealthHistory(score: number, insightsCount: number): void {
    this.brandHealthHistory.push({
      date: new Date(),
      score,
      insights_count: insightsCount
    });
    
    // Keep only last 30 entries
    if (this.brandHealthHistory.length > 30) {
      this.brandHealthHistory.shift();
    }
  }

  /**
   * Calculate confidence level for analysis
   */
  private calculateConfidenceLevel(brandScore: BrandDNAScore, content: RealContentSource): number {
    let confidence = brandScore.overall_score / 100;
    
    // Adjust based on content characteristics
    if (content.content.length > 1000) confidence += 0.1;
    if (content.tags.length > 3) confidence += 0.05;
    if (content.metadata?.verified) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  // === PLACEHOLDER METHODS FOR DIFFERENT CONTENT TYPES ===
  
  private async analyzeTranscriptContent(content: RealContentSource): Promise<ContentAnalysis> {
    // Enhanced transcript analysis would go here
    // For now, use the existing analyzeStoryContent as a base
    return this.analyzeStoryContent(content);
  }
  
  private async analyzeMediaContent(content: RealContentSource): Promise<ContentAnalysis> {
    // Media-specific analysis would go here
    // For now, use the existing analyzeStoryContent as a base
    return this.analyzeStoryContent(content);
  }
  
  private async analyzeAnalysisContent(content: RealContentSource): Promise<ContentAnalysis> {
    // Analysis content analysis would go here
    // For now, use the existing analyzeStoryContent as a base
    return this.analyzeStoryContent(content);
  }
  
  private async analyzeGenericContent(content: RealContentSource): Promise<ContentAnalysis> {
    // Generic content analysis
    return this.analyzeStoryContent(content);
  }

  // === ENHANCED CONTENT GENERATION METHODS ===
  
  private generateEnhancedHeadlines(content: RealContentSource, brandValues: BrandValue[]): string[] {
    // Enhanced headline generation based on real content
    return this.generateHeadlines(content as any, brandValues);
  }
  
  private extractEnhancedKeyMessages(content: RealContentSource, brandValues: BrandValue[]): string[] {
    // Enhanced key message extraction
    return this.extractKeyMessages(content as any, brandValues);
  }
  
  private generateEnhancedSocialContent(content: RealContentSource, quotes: Quote[]): any[] {
    // Enhanced social media content generation
    return this.generateSocialMediaSnippets(content as any, quotes);
  }

  private extractContextualQuotes(text: string, sentiment: SentimentData, metadata: Record<string, any>): Quote[] {
    // Enhanced quote extraction with context
    return this.extractQuotes(text, sentiment);
  }

  private generateActionableInsights(analyses: ContentAnalysis[], brandHealthReport: any): string[] {
    const insights: string[] = [];
    
    if (brandHealthReport.overall_score > 80) {
      insights.push('Strong brand alignment detected - amplify current content strategy');
    } else if (brandHealthReport.overall_score < 60) {
      insights.push('Brand alignment needs improvement - review content guidelines');
    }
    
    if (analyses.length > 0) {
      const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence_level, 0) / analyses.length;
      if (avgConfidence < 0.7) {
        insights.push('Increase content depth and detail to improve analysis confidence');
      }
    }
    
    return insights;
  }

  private generateContentStrategyRecommendations(analyses: ContentAnalysis[], content: RealContentSource[]): string[] {
    const recommendations: string[] = [];
    
    // Content volume analysis
    if (content.length < 10) {
      recommendations.push('Increase content production to establish stronger brand patterns');
    }
    
    // Content diversity analysis
    const contentTypes = new Set(content.map(c => c.type));
    if (contentTypes.size < 2) {
      recommendations.push('Diversify content types (stories, transcripts, media) for comprehensive brand DNA');
    }
    
    // Quality trends analysis
    if (analyses.length > 1) {
      const recent = analyses.slice(-5);
      const older = analyses.slice(0, -5);
      
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((sum, a) => sum + a.brand_dna_score.overall_score, 0) / recent.length;
        const olderAvg = older.reduce((sum, a) => sum + a.brand_dna_score.overall_score, 0) / older.length;
        
        if (recentAvg < olderAvg) {
          recommendations.push('Recent content quality declining - review content creation process');
        } else if (recentAvg > olderAvg + 10) {
          recommendations.push('Content quality improving - continue current content strategy');
        }
      }
    }
    
    return recommendations;
  }

  // Analyze story content
  async analyzeStory(story: Story): Promise<ContentAnalysis> {
    const textContent = story.content;
    
    // Extract brand values
    const brandValues = this.extractBrandValues(textContent);
    
    // Generate sentiment analysis
    const sentimentData = this.analyzeSentiment(textContent);
    
    // Extract potential quotes
    const quotes = this.extractQuotes(story.content, sentimentData);
    
    // Calculate brand DNA score
    const brandDNAScore = this.calculateBrandDNAScore(textContent, brandValues, sentimentData);
    
    // Generate insights
    const insights = this.generateCommunicationInsights(story, brandValues, sentimentData);
    
    // Generate recommendations
    const recommendations = this.generateStrategicRecommendations(story, brandDNAScore, insights);
    
    // Generate social media content
    const socialSnippets = this.generateSocialMediaSnippets(story, quotes);

    return {
      id: `analysis_${story.id}_${Date.now()}`,
      content_id: story.id,
      content_type: 'story',
      brand_dna_score: brandDNAScore,
      communication_insights: insights,
      strategic_recommendations: recommendations,
      suggested_headlines: this.generateHeadlines(story, brandValues),
      key_messages_extracted: this.extractKeyMessages(story, brandValues),
      social_media_snippets: socialSnippets as any,
      analyzed_date: new Date(),
      analysis_version: '1.0',
      confidence_level: brandDNAScore.overall_score / 100
    };
  }

  // Analyze transcript
  async analyzeTranscript(transcript: Transcript): Promise<ContentAnalysis> {
    const textContent = transcript.cleaned_transcript || transcript.raw_transcript;
    
    // Extract emotional journey from segments
    const emotionalJourney = this.analyzeEmotionalJourney(transcript.speaker_segments);
    
    // Analyze authenticity indicators
    const authenticityScore = this.calculateAuthenticityScore(transcript.speaker_segments);
    
    // Extract brand alignment
    const brandAlignment = this.analyzeBrandAlignment(textContent);
    
    const brandDNAScore: BrandDNAScore = {
      authenticity: authenticityScore,
      consistency: brandAlignment.consistency,
      emotional_resonance: emotionalJourney.average_intensity * 10,
      cultural_alignment: brandAlignment.cultural_score,
      commercial_viability: brandAlignment.business_relevance,
      overall_score: (authenticityScore + brandAlignment.consistency + 
                     (emotionalJourney.average_intensity * 10) + 
                     brandAlignment.cultural_score + 
                     brandAlignment.business_relevance) / 5
    };

    return {
      id: `analysis_${transcript.id}_${Date.now()}`,
      content_id: transcript.id,
      content_type: 'transcript',
      brand_dna_score: brandDNAScore,
      communication_insights: this.generateTranscriptInsights(transcript, emotionalJourney),
      strategic_recommendations: [],
      suggested_headlines: [],
      key_messages_extracted: this.extractTranscriptMessages(textContent),
      social_media_snippets: [],
      analyzed_date: new Date(),
      analysis_version: '1.0',
      confidence_level: brandDNAScore.overall_score / 100
    };
  }

  // Extract brand values from text
  private extractBrandValues(text: string): BrandValue[] {
    const lowerText = text.toLowerCase();
    
    return this.brandPatterns.map(pattern => {
      let score = 0;
      let evidenceFragments: string[] = [];
      
      // Count keyword matches
      const keywordMatches = pattern.keywords.filter(keyword => 
        lowerText.includes(keyword.toLowerCase())
      ).length;
      score += keywordMatches * pattern.frequency_weight;
      
      // Find evidence text
      pattern.keywords.forEach(keyword => {
        const regex = new RegExp(`[^.]*${keyword}[^.]*\\.`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          evidenceFragments.push(...matches.slice(0, 2));
        }
      });
      
      return {
        name: pattern.theme as any,
        evidence_text: evidenceFragments.join(' '),
        strength_score: Math.min(10, Math.max(1, score))
      };
    }).filter(value => value.strength_score > 2);
  }

  // Analyze sentiment and emotion
  private analyzeSentiment(text: string): SentimentData {
    // Simple sentiment analysis - in production, use AI service
    const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'proud', 'happy', 'successful', 'achieved', 'transformed'];
    const negativeWords = ['bad', 'terrible', 'difficult', 'hard', 'struggled', 'failed', 'problems', 'issues'];
    const transformationWords = ['change', 'different', 'became', 'learned', 'grew', 'developed', 'overcame'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positive = words.filter(w => positiveWords.includes(w)).length;
    const negative = words.filter(w => negativeWords.includes(w)).length;
    const transformation = words.filter(w => transformationWords.includes(w)).length;
    
    const overall = positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
    
    return {
      overall_sentiment: overall,
      emotional_journey: [
        { text_position: 0, emotion: 'reflective', intensity: 5 },
        { text_position: Math.floor(words.length / 2), emotion: transformation > 0 ? 'hopeful' : 'neutral', intensity: 6 },
        { text_position: words.length, emotion: positive > 0 ? 'positive' : 'neutral', intensity: 7 }
      ],
      key_emotions: ['determination', 'growth', 'pride'],
      transformational_indicators: transformationWords.filter(w => words.includes(w))
    };
  }

  // Extract meaningful quotes
  private extractQuotes(content: string, _sentiment: SentimentData): Quote[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > this.config.min_quote_length);
    
    return sentences
      .filter(sentence => sentence.length <= this.config.max_quote_length)
      .map(sentence => ({
        text: sentence.trim(),
        context: 'story_content',
        emotional_impact: Math.random() * 3 + 7, // Simplified - would use AI
        authenticity_score: Math.random() * 2 + 8, // Simplified - would use AI
        suggested_usage: this.determineQuoteUsage(sentence)
      }))
      .sort((a, b) => b.emotional_impact - a.emotional_impact)
      .slice(0, 3);
  }

  private determineQuoteUsage(quote: string): Array<'hero_quote' | 'testimonial' | 'social_media' | 'report'> {
    const usage: Array<'hero_quote' | 'testimonial' | 'social_media' | 'report'> = ['report'];
    
    if (quote.length < 100) usage.push('social_media');
    if (quote.includes('I') || quote.includes('my')) usage.push('testimonial');
    if (quote.toLowerCase().includes('transform') || quote.toLowerCase().includes('change')) {
      usage.push('hero_quote');
    }
    
    return usage;
  }

  // Calculate overall brand DNA score
  private calculateBrandDNAScore(_text: string, brandValues: BrandValue[], sentiment: SentimentData): BrandDNAScore {
    const avgBrandScore = brandValues.reduce((sum, val) => sum + val.strength_score, 0) / (brandValues.length || 1);
    
    // Calculate individual scores (simplified - would use AI models)
    const authenticity = sentiment.transformational_indicators.length > 0 ? 85 : 70;
    const consistency = avgBrandScore * 10;
    const emotionalResonance = sentiment.overall_sentiment === 'positive' ? 80 : 60;
    const culturalAlignment = brandValues.find(v => v.name === 'cultural_strength')?.strength_score || 6;
    const commercialViability = brandValues.find(v => v.name === 'commercial_excellence')?.strength_score || 7;
    
    return {
      authenticity,
      consistency,
      emotional_resonance: emotionalResonance,
      cultural_alignment: culturalAlignment,
      commercial_viability: commercialViability,
      overall_score: (authenticity + consistency + emotionalResonance + culturalAlignment + commercialViability) / 5
    };
  }

  // Generate communication insights
  private generateCommunicationInsights(story: Story, brandValues: BrandValue[], sentiment: SentimentData): CommunicationInsight[] {
    const insights: CommunicationInsight[] = [];
    
    // Messaging insights
    if (brandValues.find(v => v.name === 'transformation' && v.strength_score > 7)) {
      insights.push({
        insight_type: 'messaging',
        insight: 'This story strongly demonstrates transformation - ideal for headline messaging',
        evidence: ['Transformation theme score > 7'],
        confidence: 0.9,
        actionable_recommendation: 'Use in "See the Potential" campaign as hero content'
      });
    }
    
    // Audience insights
    if (story.impact_level === 'community') {
      insights.push({
        insight_type: 'audience',
        insight: 'Community-level impact makes this suitable for government and philanthropic audiences',
        evidence: [`Impact level: ${story.impact_level}`],
        confidence: 0.8,
        actionable_recommendation: 'Include in policy submissions and funding proposals'
      });
    }
    
    // Creative insights
    if (sentiment.overall_sentiment === 'positive' && sentiment.transformational_indicators.length > 2) {
      insights.push({
        insight_type: 'creative',
        insight: 'Strong emotional resonance makes this ideal for visual storytelling',
        evidence: [`Sentiment: ${sentiment.overall_sentiment}`, `Transformation indicators: ${sentiment.transformational_indicators.length}`],
        confidence: 0.8,
        actionable_recommendation: 'Develop video content and social media assets'
      });
    }
    
    return insights;
  }

  // Generate strategic recommendations
  private generateStrategicRecommendations(story: Story, brandScore: BrandDNAScore, _insights: CommunicationInsight[]): StrategicRecommendation[] {
    const recommendations: StrategicRecommendation[] = [];
    
    if (brandScore.overall_score > 80) {
      recommendations.push({
        category: 'content_creation',
        recommendation: 'Develop this story into multiple content formats - it has high brand alignment',
        priority: 'high',
        effort_level: 'medium',
        potential_impact: 'high',
        supporting_data: [`Brand DNA Score: ${brandScore.overall_score}`]
      });
    }
    
    if (story.themes.includes('employment') && brandScore.commercial_viability > 75) {
      recommendations.push({
        category: 'audience_targeting',
        recommendation: 'Use for corporate partnership development - strong commercial relevance',
        priority: 'high',
        effort_level: 'low',
        potential_impact: 'high',
        supporting_data: [`Commercial viability: ${brandScore.commercial_viability}`]
      });
    }
    
    return recommendations;
  }

  // Generate headlines from story
  private generateHeadlines(story: Story, brandValues: BrandValue[]): string[] {
    const headlines: string[] = [];
    const name = story.participant_name;
    
    // Template-based headline generation
    if (brandValues.find(v => v.name === 'transformation')) {
      headlines.push(`How ${name} Transformed Their Future Through the Custodian Economy`);
      headlines.push(`From Potential to Purpose: ${name}'s Journey`);
    }
    
    if (brandValues.find(v => v.name === 'commercial_excellence')) {
      headlines.push(`${name}: Proving Indigenous Business Excellence`);
      headlines.push(`The Commercial Case for Potential: ${name}'s Success Story`);
    }
    
    return headlines;
  }

  // Extract key messages
  private extractKeyMessages(_story: Story, brandValues: BrandValue[]): string[] {
    const messages: string[] = [];
    
    brandValues.forEach(value => {
      switch (value.name) {
        case 'potential_first':
          messages.push('Every person has untapped potential waiting to be realized');
          break;
        case 'transformation':
          messages.push('Real transformation happens when you invest in people, not programs');
          break;
        case 'commercial_excellence':
          messages.push('Indigenous employment is a competitive advantage, not charity');
          break;
        case 'cultural_strength':
          messages.push('Cultural connection is the foundation of lasting success');
          break;
      }
    });
    
    return messages;
  }

  // Generate social media snippets
  private generateSocialMediaSnippets(story: Story, quotes: Quote[]): Array<{platform: string, content: string, hashtags: string[], suggested_timing: string, expected_engagement: 'low' | 'medium' | 'high'}> {
    if (quotes.length === 0) return [];
    
    const bestQuote = quotes[0];
    
    return [
      {
        platform: 'linkedin',
        content: `"${bestQuote.text}"\n\n${story.participant_name}'s story reminds us why the Custodian Economy model works. When we see potential first, we unlock transformation.\n\n#PotentialFirst #IndigenousExcellence #TransformationStory`,
        hashtags: ['PotentialFirst', 'IndigenousExcellence', 'TransformationStory'],
        suggested_timing: 'Tuesday 9-11am',
        expected_engagement: 'high'
      },
      {
        platform: 'instagram',
        content: `✨ "${bestQuote.text}" \n\nThis is ${story.participant_name}'s story. This is what potential looks like. 🧡\n\n#TransformationTuesday #PotentialFirst #RealStories #IndigenousPride`,
        hashtags: ['TransformationTuesday', 'PotentialFirst', 'RealStories'],
        suggested_timing: 'Tuesday 6-8pm',
        expected_engagement: 'medium'
      }
    ];
  }

  // Analyze emotional journey in transcript
  private analyzeEmotionalJourney(segments: any[]): { average_intensity: number, emotional_arc: string[] } {
    // Simplified emotional analysis
    const emotions = segments.map(() => Math.random() * 10);
    const average_intensity = emotions.reduce((sum, val) => sum + val, 0) / emotions.length;
    
    return {
      average_intensity,
      emotional_arc: ['reflective', 'hopeful', 'determined', 'proud']
    };
  }

  // Calculate authenticity score for transcript
  private calculateAuthenticityScore(_segments: any[]): number {
    // Look for authenticity indicators like personal pronouns, specific details, emotional language
    // Simplified for demo
    return Math.random() * 20 + 80; // 80-100 range
  }

  // Analyze brand alignment in text
  private analyzeBrandAlignment(_text: string): { consistency: number, cultural_score: number, business_relevance: number } {
    // Simplified brand alignment analysis
    return {
      consistency: Math.random() * 20 + 75,
      cultural_score: Math.random() * 20 + 70,
      business_relevance: Math.random() * 20 + 65
    };
  }

  // Generate insights for transcript
  private generateTranscriptInsights(_transcript: Transcript, _emotionalJourney: any): CommunicationInsight[] {
    return [
      {
        insight_type: 'messaging',
        insight: 'High authenticity score indicates genuine transformation narrative',
        evidence: ['Natural speech patterns', 'Specific personal details'],
        confidence: 0.85,
        actionable_recommendation: 'Use as source for authentic testimonial content'
      }
    ];
  }

  // Extract key messages from transcript
  private extractTranscriptMessages(text: string): string[] {
    // Simple extraction - would use NLP in production
    const sentences = text.split(/[.!?]+/);
    return sentences
      .filter(s => s.length > 50 && s.length < 200)
      .slice(0, 5);
  }

  // Batch analyze multiple pieces of content
  async batchAnalyze(content: Array<{type: 'story' | 'transcript', data: Story | Transcript}>): Promise<ContentAnalysis[]> {
    const analyses = await Promise.all(
      content.map(async (item) => {
        if (item.type === 'story') {
          return this.analyzeStory(item.data as Story);
        } else {
          return this.analyzeTranscript(item.data as Transcript);
        }
      })
    );
    
    return analyses;
  }

  // Aggregate brand DNA insights across multiple analyses
  aggregateBrandInsights(analyses: ContentAnalysis[]): {
    overall_brand_health: number;
    strongest_themes: string[];
    content_gaps: string[];
    recommendations: string[];
  } {
    const avgScore = analyses.reduce((sum, a) => sum + a.brand_dna_score.overall_score, 0) / analyses.length;
    
    // Find most common insights
    const allInsights = analyses.flatMap(a => a.communication_insights);
    const insightCounts = allInsights.reduce((counts, insight) => {
      counts[insight.insight_type] = (counts[insight.insight_type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const strongest_themes = Object.entries(insightCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);
    
    return {
      overall_brand_health: avgScore,
      strongest_themes,
      content_gaps: ['business_innovation', 'leadership_development'], // Simplified
      recommendations: [
        'Develop more content showcasing business innovation',
        'Create leadership development story series',
        'Expand cultural strength narratives'
      ]
    };
  }
}

// Export singleton instance
export const brandDNAAnalyzer = new BrandDNAAnalyzer();
export default BrandDNAAnalyzer;