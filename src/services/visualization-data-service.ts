// Data Service for Branded Visualizations
// Based on First Custodial Pathways brand guide metrics

export interface ChartDataPoint {
  [key: string]: any;
}

export class VisualizationDataService {
  
  // Transform raw metrics into chart-ready data
  static transformForChart(data: any[], chartType: string): ChartDataPoint[] {
    switch (chartType) {
      case 'journey':
        return this.transformJourneyData(data);
      case 'metrics':
        return this.transformMetricsData(data);
      case 'community':
        return this.transformCommunityData(data);
      case 'funnel':
        return this.transformFunnelData(data);
      case 'skills':
        return this.transformSkillsData(data);
      case 'investment':
        return this.transformInvestmentData(data);
      case 'comparative':
        return this.transformComparativeData(data);
      default:
        return data;
    }
  }

  private static transformJourneyData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      month: item.month || item.period,
      employment: item.employmentRate || item.employment,
      wellbeing: item.wellbeingScore || item.wellbeing,
      retention: item.retentionRate || item.retention,
    }));
  }

  private static transformMetricsData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      metric: item.name || item.metric,
      value: item.value || item.score,
      target: item.target || 100,
      baseline: item.baseline || 0,
    }));
  }

  private static transformCommunityData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      name: item.category || item.name,
      value: item.count || item.value,
      percentage: item.percentage || (item.value / 100),
    }));
  }

  private static transformFunnelData(data: any[]): ChartDataPoint[] {
    return data.map((item, index) => ({
      name: item.stage || item.name,
      value: item.participants || item.value,
      fill: this.getFunnelColor(index),
    }));
  }

  private static transformSkillsData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      skill: item.skillName || item.skill,
      before: item.beforeScore || item.before || 2,
      after: item.afterScore || item.after || 8,
      potential: item.potentialScore || 10,
    }));
  }

  private static transformInvestmentData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      year: item.year || item.period,
      investment: item.investmentAmount || item.investment,
      socialReturn: item.socialReturnAmount || item.socialReturn,
      ratio: item.returnRatio || (item.socialReturn / item.investment),
    }));
  }

  private static transformComparativeData(data: any[]): ChartDataPoint[] {
    return data.map(item => ({
      category: item.metric || item.category,
      traditional: item.traditionalValue || item.traditional,
      custodian: item.custodianValue || item.custodian,
      difference: item.difference || (item.custodian - item.traditional),
    }));
  }

  private static getFunnelColor(index: number): string {
    const colors = ['#73582c', '#d4af37', '#0288d1', '#2e7d32', '#ed6c02'];
    return colors[index % colors.length];
  }
}

// Sample data generators based on your brand metrics
export const SampleDataGenerators = {
  
  // Impact Journey Data - 12 month transformation
  getJourneyData: (): ChartDataPoint[] => [
    { month: 'Month 1', employment: 0, wellbeing: 35, retention: 100 },
    { month: 'Month 2', employment: 15, wellbeing: 42, retention: 95 },
    { month: 'Month 3', employment: 35, wellbeing: 48, retention: 92 },
    { month: 'Month 4', employment: 45, wellbeing: 56, retention: 90 },
    { month: 'Month 5', employment: 58, wellbeing: 62, retention: 88 },
    { month: 'Month 6', employment: 65, wellbeing: 68, retention: 87 },
    { month: 'Month 7', employment: 72, wellbeing: 71, retention: 86 },
    { month: 'Month 8', employment: 78, wellbeing: 75, retention: 85 },
    { month: 'Month 9', employment: 82, wellbeing: 78, retention: 85 },
    { month: 'Month 10', employment: 85, wellbeing: 82, retention: 85 },
    { month: 'Month 11', employment: 87, wellbeing: 85, retention: 85 },
    { month: 'Month 12', employment: 85, wellbeing: 88, retention: 85 },
  ],

  // Success Metrics - Key performance indicators
  getMetricsData: (): ChartDataPoint[] => [
    { metric: 'Employment Retention', value: 85, target: 70 },
    { metric: 'Absenteeism Rate', value: 3, target: 25 }, // Lower is better
    { metric: 'Productivity Index', value: 340, target: 100 }, // 3.4x industry average
    { metric: 'Cost Savings', value: 3500, target: 1000 }, // In thousands
    { metric: 'Family Stability', value: 78, target: 60 },
    { metric: 'Community Trust', value: 92, target: 75 },
  ],

  // Community Impact Distribution
  getCommunityData: (): ChartDataPoint[] => [
    { name: 'Direct Employment', value: 1500 },
    { name: 'Family Members Impacted', value: 4500 },
    { name: 'Mentorship Recipients', value: 350 },
    { name: 'Community Programs', value: 28 },
    { name: 'Partner Businesses', value: 45 },
  ],

  // Pathways Funnel - Program progression
  getFunnelData: (): ChartDataPoint[] => [
    { name: 'Initial Contact', value: 1000, fill: '#73582c' },
    { name: 'Assessment', value: 750, fill: '#d4af37' },
    { name: 'Pre-Employment', value: 500, fill: '#0288d1' },
    { name: 'Employment', value: 380, fill: '#2e7d32' },
    { name: '12 Month Retention', value: 323, fill: '#ff6b35' },
  ],

  // Skills Development Radar
  getSkillsData: (): ChartDataPoint[] => [
    { skill: 'Technical Skills', before: 2, after: 8 },
    { skill: 'Communication', before: 3, after: 7 },
    { skill: 'Teamwork', before: 4, after: 9 },
    { skill: 'Problem Solving', before: 2, after: 7 },
    { skill: 'Leadership', before: 1, after: 6 },
    { skill: 'Cultural Connection', before: 5, after: 9 },
    { skill: 'Work Ethic', before: 3, after: 9 },
    { skill: 'Safety Awareness', before: 2, after: 8 },
  ],

  // Investment vs Social Return
  getInvestmentData: (): ChartDataPoint[] => [
    { year: '2019', investment: 500, socialReturn: 800 },
    { year: '2020', investment: 750, socialReturn: 1500 },
    { year: '2021', investment: 1000, socialReturn: 2800 },
    { year: '2022', investment: 1250, socialReturn: 4500 },
    { year: '2023', investment: 1500, socialReturn: 6750 },
    { year: '2024', investment: 1750, socialReturn: 8750 },
    { year: '2025 (Projected)', investment: 2000, socialReturn: 11000 },
  ],

  // Comparative Impact Analysis
  getComparativeData: (): ChartDataPoint[] => [
    { category: 'Cost per Participant', traditional: 110000, custodian: 25000 }, // Annual cost
    { category: 'Success Rate (%)', traditional: 25, custodian: 85 },
    { category: 'Family Impact Score', traditional: 20, custodian: 78 },
    { category: 'ROI Multiplier', traditional: 0.5, custodian: 4.5 },
    { category: 'Community Trust (%)', traditional: 35, custodian: 92 },
  ],

  // Generate custom data with your specific metrics
  generateCustomData: (config: {
    participants?: number;
    retentionRate?: number;
    productivityMultiplier?: number;
    investmentAmount?: number;
  }): any => {
    const {
      participants = 1500,
      retentionRate = 85,
      productivityMultiplier = 3.4,
      investmentAmount = 1500000,
    } = config;

    return {
      overview: {
        totalParticipants: participants,
        activeEmployees: Math.floor(participants * (retentionRate / 100)),
        annualSavings: productivityMultiplier * investmentAmount,
        familiesImpacted: participants * 3,
        communityPrograms: Math.floor(participants / 50),
      },
      monthlyProgress: Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        employed: Math.floor((participants * (retentionRate / 100)) * ((i + 1) / 12)),
        retained: Math.floor((participants * (retentionRate / 100)) * (1 - (i * 0.01))),
        wellbeing: 35 + (i * 4.5),
      })),
      costComparison: {
        traditional: {
          perPerson: 110000,
          total: 110000 * participants,
          successRate: 0.25,
          socialReturn: 0.5,
        },
        custodian: {
          perPerson: 25000,
          total: 25000 * participants,
          successRate: retentionRate / 100,
          socialReturn: 4.5,
        },
      },
    };
  },
};

// Export formatted data for specific use cases
export const BrandMetricsData = {
  
  // Key metrics from your brand guide
  keyMetrics: {
    employmentRetention: '85% after 12 months',
    absenteeismRate: '3% vs 25% industry average',
    productivityGain: '3-4x industry standard',
    costSavings: '$3-4M annually per partner',
    youthDiversionCost: '$1.1M/year vs incarceration',
    socialReturnRatio: '4.5:1 ROI',
    participantCount: '1,500+ Indigenous employees',
    statesOperating: 3,
    businessPartnerships: 45,
    familiesImpacted: 4500,
  },

  // Success stories data points
  successStories: {
    keiron: {
      role: 'Program Leader',
      journey: 'From participant to leader',
      impact: 'Mentored 50+ young people',
      quote: 'They saw potential when I only saw problems',
    },
    aden: {
      role: 'Team Leader',
      journey: 'From homelessness to stability',
      impact: '2 years stable employment',
      quote: 'This program gave me a future',
    },
    troy: {
      role: 'Skilled Worker',
      journey: 'From justice system to workforce',
      impact: 'Supporting family of 4',
      quote: 'I found my purpose here',
    },
  },

  // Partner outcomes
  partnerOutcomes: {
    kmart: {
      productivity: '+340%',
      absenteeism: '-88%',
      retention: '85%',
      savings: '$3.2M/year',
    },
    woolworths: {
      productivity: '+380%',
      absenteeism: '-85%',
      retention: '82%',
      savings: '$2.8M/year',
    },
  },

  // Program phases
  programPhases: [
    { phase: 'Connection', duration: '2 weeks', focus: 'Building trust and relationships' },
    { phase: 'Safety', duration: '4 weeks', focus: 'Creating stable environment' },
    { phase: 'Learning', duration: '8 weeks', focus: 'Skills development' },
    { phase: 'Contributing', duration: 'Ongoing', focus: 'Employment and growth' },
  ],
};

export default VisualizationDataService;
