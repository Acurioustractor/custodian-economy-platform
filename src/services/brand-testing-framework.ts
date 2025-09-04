// Brand Testing Framework - Iterative testing system for brand changes
// Leverages empathy ledger data to validate brand messaging variations

import { 
  Story, 
  BrandDNAScore, 
  CommunicationInsight,
  ContentAnalysis 
} from '../types/empathy-ledger';
import { brandDNAAnalyzer } from './brand-dna-analyzer';
import { empathyLedgerAPI } from './empathy-ledger-api';

export interface BrandTestVariant {
  id: string;
  name: string;
  description: string;
  messaging_changes: {
    headlines?: string[];
    taglines?: string[];
    key_messages?: string[];
    value_propositions?: string[];
    tone_adjustments?: string[];
  };
  visual_changes?: {
    color_scheme?: string[];
    typography?: string;
    imagery_style?: string;
  };
  target_audiences: string[];
  test_start_date: Date;
  test_end_date?: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface BrandTestResult {
  variant_id: string;
  test_period: { start: Date; end: Date };
  metrics: {
    brand_dna_alignment: number;
    authentic_resonance: number;
    cultural_alignment: number;
    commercial_viability: number;
    emotional_impact: number;
    message_clarity: number;
  };
  audience_feedback: {
    audience: string;
    engagement_score: number;
    sentiment_score: number;
    key_responses: string[];
  }[];
  content_performance: {
    stories_analyzed: number;
    average_brand_score: number;
    top_performing_messages: string[];
    improvement_areas: string[];
  };
  recommendations: string[];
  confidence_level: number;
}

export interface BrandTestConfig {
  test_duration_days: number;
  min_sample_size: number;
  significance_threshold: number;
  baseline_comparison: boolean;
  automated_optimization: boolean;
}

class BrandTestingFramework {
  private activeTests: Map<string, BrandTestVariant> = new Map();
  private testResults: Map<string, BrandTestResult[]> = new Map();
  
  private defaultConfig: BrandTestConfig = {
    test_duration_days: 30,
    min_sample_size: 10,
    significance_threshold: 0.05,
    baseline_comparison: true,
    automated_optimization: true
  };

  // Create a new brand test variant
  async createTestVariant(
    name: string,
    description: string,
    messagingChanges: BrandTestVariant['messaging_changes'],
    targetAudiences: string[],
    config?: Partial<BrandTestConfig>
  ): Promise<BrandTestVariant> {
    const testConfig = { ...this.defaultConfig, ...config };
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + testConfig.test_duration_days);

    const variant: BrandTestVariant = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      messaging_changes: messagingChanges,
      target_audiences: targetAudiences,
      test_start_date: startDate,
      test_end_date: endDate,
      status: 'draft'
    };

    this.activeTests.set(variant.id, variant);
    return variant;
  }

  // Start a brand test
  async startTest(variantId: string): Promise<boolean> {
    const variant = this.activeTests.get(variantId);
    if (!variant) {
      throw new Error(`Test variant ${variantId} not found`);
    }

    // Validate baseline data exists
    const baselineData = await this.collectBaselineData(variant.target_audiences);
    if (!baselineData || baselineData.length === 0) {
      throw new Error('Insufficient baseline data to start test');
    }

    // Activate the test
    variant.status = 'active';
    variant.test_start_date = new Date();
    
    console.log(`Started brand test: ${variant.name} (${variantId})`);
    return true;
  }

  // Analyze test performance using empathy ledger data
  async analyzeTestPerformance(variantId: string): Promise<BrandTestResult> {
    const variant = this.activeTests.get(variantId);
    if (!variant) {
      throw new Error(`Test variant ${variantId} not found`);
    }

    // Collect test period data
    const testData = await this.collectTestPeriodData(
      variant.test_start_date,
      new Date(),
      variant.target_audiences
    );

    // Analyze brand DNA alignment with new messaging
    const brandAlignment = await this.analyzeBrandAlignment(testData, variant);
    
    // Analyze audience engagement
    const audienceAnalysis = await this.analyzeAudienceEngagement(testData, variant);
    
    // Analyze content performance
    const contentPerformance = await this.analyzeContentPerformance(testData, variant);
    
    // Generate recommendations
    const recommendations = await this.generateTestRecommendations(
      brandAlignment,
      audienceAnalysis,
      contentPerformance
    );

    const result: BrandTestResult = {
      variant_id: variantId,
      test_period: {
        start: variant.test_start_date,
        end: new Date()
      },
      metrics: {
        brand_dna_alignment: brandAlignment.overall_alignment,
        authentic_resonance: brandAlignment.authenticity_score,
        cultural_alignment: brandAlignment.cultural_score,
        commercial_viability: brandAlignment.commercial_score,
        emotional_impact: audienceAnalysis.emotional_impact,
        message_clarity: contentPerformance.clarity_score
      },
      audience_feedback: audienceAnalysis.audience_responses,
      content_performance: {
        stories_analyzed: testData.length,
        average_brand_score: brandAlignment.average_score,
        top_performing_messages: contentPerformance.top_messages,
        improvement_areas: contentPerformance.improvement_areas
      },
      recommendations,
      confidence_level: this.calculateConfidenceLevel(testData.length, brandAlignment.consistency)
    };

    // Store result
    const existingResults = this.testResults.get(variantId) || [];
    existingResults.push(result);
    this.testResults.set(variantId, existingResults);

    return result;
  }

  // Compare multiple test variants
  async compareVariants(variantIds: string[]): Promise<{
    winner: string;
    comparison_matrix: { [key: string]: { [metric: string]: number } };
    statistical_significance: boolean;
    recommendations: string[];
  }> {
    const results = await Promise.all(
      variantIds.map(id => this.analyzeTestPerformance(id))
    );

    // Create comparison matrix
    const comparisonMatrix: { [key: string]: { [metric: string]: number } } = {};
    const metrics = Object.keys(results[0].metrics);

    results.forEach(result => {
      comparisonMatrix[result.variant_id] = result.metrics;
    });

    // Calculate overall scores and determine winner
    const overallScores = results.map(result => ({
      variant_id: result.variant_id,
      overall_score: this.calculateOverallScore(result.metrics),
      confidence: result.confidence_level
    }));

    const winner = overallScores.reduce((prev, current) => 
      (current.overall_score > prev.overall_score) ? current : prev
    );

    // Check statistical significance
    const significance = this.checkStatisticalSignificance(results);

    // Generate comparison recommendations
    const recommendations = this.generateComparisonRecommendations(results, winner);

    return {
      winner: winner.variant_id,
      comparison_matrix: comparisonMatrix,
      statistical_significance: significance,
      recommendations
    };
  }

  // A/B test specific messaging elements
  async abTestMessaging(
    originalMessage: string,
    variantMessages: string[],
    testContext: 'headline' | 'tagline' | 'value_prop' | 'cta',
    targetAudience: string
  ): Promise<{
    winning_message: string;
    performance_scores: { message: string; score: number }[];
    insights: string[];
  }> {
    const testStories = await this.generateTestStories(
      originalMessage,
      variantMessages,
      testContext
    );

    const analyses = await Promise.all(
      testStories.map(story => brandDNAAnalyzer.analyzeStory(story))
    );

    // Score each message variant
    const performanceScores = analyses.map((analysis, index) => ({
      message: index === 0 ? originalMessage : variantMessages[index - 1],
      score: this.calculateMessageScore(analysis, targetAudience)
    }));

    const winner = performanceScores.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    const insights = this.generateMessageInsights(analyses, performanceScores);

    return {
      winning_message: winner.message,
      performance_scores: performanceScores,
      insights
    };
  }

  // Monitor ongoing tests
  async getActiveTests(): Promise<BrandTestVariant[]> {
    return Array.from(this.activeTests.values()).filter(test => test.status === 'active');
  }

  // Get test history and results
  async getTestHistory(variantId?: string): Promise<BrandTestResult[]> {
    if (variantId) {
      return this.testResults.get(variantId) || [];
    }
    
    const allResults: BrandTestResult[] = [];
    this.testResults.forEach(results => allResults.push(...results));
    return allResults.sort((a, b) => 
      b.test_period.start.getTime() - a.test_period.start.getTime()
    );
  }

  // Helper Methods
  private async collectBaselineData(_audiences: string[]): Promise<Story[]> {
    try {
      const response = await empathyLedgerAPI.getStories({
        date_range: {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
          end: new Date()
        }
      });
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to collect baseline data:', error);
      return [];
    }
  }

  private async collectTestPeriodData(
    startDate: Date, 
    endDate: Date, 
    audiences: string[]
  ): Promise<Story[]> {
    try {
      const response = await empathyLedgerAPI.getStories({
        date_range: { start: startDate, end: endDate }
      });
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to collect test period data:', error);
      return [];
    }
  }

  private async analyzeBrandAlignment(data: Story[], variant: BrandTestVariant) {
    const analyses = await Promise.all(
      data.map(story => brandDNAAnalyzer.analyzeStory(story))
    );

    const scores = analyses.map(analysis => analysis.brand_dna_score);
    
    return {
      overall_alignment: this.average(scores.map(s => s.overall_score)),
      authenticity_score: this.average(scores.map(s => s.authenticity)),
      cultural_score: this.average(scores.map(s => s.cultural_alignment)),
      commercial_score: this.average(scores.map(s => s.commercial_viability)),
      average_score: this.average(scores.map(s => s.overall_score)),
      consistency: this.calculateConsistency(scores.map(s => s.overall_score))
    };
  }

  private async analyzeAudienceEngagement(data: Story[], variant: BrandTestVariant) {
    // Simulate audience engagement analysis
    const audienceResponses = variant.target_audiences.map(audience => ({
      audience,
      engagement_score: Math.random() * 100, // Replace with real engagement data
      sentiment_score: Math.random() * 100,
      key_responses: [
        `Positive response to ${variant.name} messaging`,
        `Strong cultural resonance with ${audience} audience`
      ]
    }));

    return {
      emotional_impact: Math.random() * 100, // Replace with real emotional analysis
      audience_responses: audienceResponses
    };
  }

  private async analyzeContentPerformance(data: Story[], variant: BrandTestVariant) {
    const analyses = await Promise.all(
      data.map(story => brandDNAAnalyzer.analyzeStory(story))
    );

    const topMessages = analyses
      .flatMap(analysis => analysis.key_messages_extracted)
      .slice(0, 5);

    return {
      clarity_score: Math.random() * 100, // Replace with real clarity analysis
      top_messages: topMessages,
      improvement_areas: [
        'Strengthen cultural authenticity',
        'Improve commercial messaging clarity',
        'Enhance emotional connection'
      ]
    };
  }

  private async generateTestRecommendations(
    brandAlignment: any,
    audienceAnalysis: any,
    contentPerformance: any
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (brandAlignment.overall_alignment < 70) {
      recommendations.push('Consider adjusting messaging to better align with brand DNA themes');
    }

    if (audienceAnalysis.emotional_impact < 60) {
      recommendations.push('Strengthen emotional storytelling elements');
    }

    if (contentPerformance.clarity_score < 65) {
      recommendations.push('Simplify and clarify key messages for better understanding');
    }

    return recommendations;
  }

  // Utility methods
  private average(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private calculateConsistency(scores: number[]): number {
    const avg = this.average(scores);
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  private calculateOverallScore(metrics: BrandTestResult['metrics']): number {
    const weights = {
      brand_dna_alignment: 0.25,
      authentic_resonance: 0.20,
      cultural_alignment: 0.20,
      commercial_viability: 0.15,
      emotional_impact: 0.15,
      message_clarity: 0.05
    };

    return Object.entries(metrics).reduce((score, [key, value]) => 
      score + (value * (weights[key as keyof typeof weights] || 0)), 0
    );
  }

  private calculateConfidenceLevel(sampleSize: number, consistency: number): number {
    const sampleConfidence = Math.min(100, (sampleSize / this.defaultConfig.min_sample_size) * 50);
    const consistencyConfidence = consistency * 0.5;
    return Math.min(100, sampleConfidence + consistencyConfidence);
  }

  private checkStatisticalSignificance(results: BrandTestResult[]): boolean {
    // Simplified significance check - in production, use proper statistical tests
    return results.every(result => result.confidence_level > 70);
  }

  private generateComparisonRecommendations(
    results: BrandTestResult[], 
    winner: { variant_id: string; overall_score: number }
  ): string[] {
    const recommendations: string[] = [];
    
    const winnerResult = results.find(r => r.variant_id === winner.variant_id);
    if (winnerResult) {
      recommendations.push(`Implement ${winner.variant_id} as primary brand messaging`);
      recommendations.push(...winnerResult.recommendations);
    }

    return recommendations;
  }

  private async generateTestStories(
    original: string,
    variants: string[],
    context: string
  ): Promise<Story[]> {
    // Generate test stories with different messaging
    const allMessages = [original, ...variants];
    return allMessages.map((message, index) => ({
      id: `test_story_${index}_${Date.now()}`,
      participant_name: `Test Participant ${index + 1}`,
      participant_id: `test_${index}`,
      title: context === 'headline' ? message : `Test Story ${index + 1}`,
      content: `Test content incorporating ${context}: ${message}`,
      summary: `Testing ${context} variation`,
      author: 'Brand Testing Framework',
      creation_date: new Date(),
      date_recorded: new Date(),
      interviewer: 'Brand Testing System',
      story_type: 'test' as any,
      tags: [`test_${context}`, 'brand_testing'],
      empathy_ledger_entry_id: '',
      location: '',
      region: '',
      community: '',
      duration_minutes: 5,
      participant_demographics: {},
      emotional_journey: [],
      themes_identified: [],
      cultural_significance: '',
      language_used: 'en',
      dialect_notes: '',
      translation_notes: '',
      verification_status: 'unverified' as any,
      verified: false,
      publication_status: 'draft' as any
    }));
  }

  private calculateMessageScore(analysis: ContentAnalysis, _audience: string): number {
    // Calculate score based on brand DNA alignment and audience relevance
    const baseScore = analysis.brand_dna_score.overall_score;
    const audienceBonus = analysis.communication_insights
      .filter(insight => insight.content_type === 'story')
      .reduce((sum, _insight) => sum + 5, 0); // Simplified scoring
    
    return baseScore + audienceBonus;
  }

  private generateMessageInsights(
    analyses: ContentAnalysis[], 
    scores: { message: string; score: number }[]
  ): string[] {
    const insights: string[] = [];
    
    const bestAnalysis = analyses[scores.findIndex(s => s.score === Math.max(...scores.map(s => s.score)))];
    
    if (bestAnalysis) {
      insights.push(`Highest scoring message demonstrates strong ${bestAnalysis.brand_dna_score.authenticity > 80 ? 'authenticity' : 'brand alignment'}`);
      insights.push(...bestAnalysis.strategic_recommendations.map(rec => rec.recommendation_text || 'Optimize messaging alignment'));
    }

    return insights;
  }
}

export const brandTestingFramework = new BrandTestingFramework();