// Brand Asset Service
// Manages brand assets including PDFs, stories, images, and strategic documents

export interface BrandAsset {
  id: string;
  name: string;
  type: 'pdf' | 'story' | 'image' | 'video' | 'document' | 'brand-guide' | 'strategy-doc';
  category: 'brand-strategy' | 'messaging' | 'visual-identity' | 'content-library' | 'research' | 'guidelines';
  file?: File;
  content?: string;
  url?: string;
  tags: string[];
  brandAlignment?: number;
  insights?: string[];
  uploadDate: Date;
  lastAnalyzed?: Date;
  metadata: Record<string, any>;
}

export interface BrandFolder {
  id: string;
  name: string;
  description: string;
  assets: string[];
  color: string;
}

export interface BrandCampaign {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  createdDate: Date;
  status: 'draft' | 'active' | 'completed';
  metrics?: {
    reach?: number;
    engagement?: number;
    brandScore?: number;
  };
}

class BrandAssetService {
  private readonly STORAGE_KEY_ASSETS = 'custodian_brand_assets';
  private readonly STORAGE_KEY_CAMPAIGNS = 'custodian_brand_campaigns';

  // Asset Management
  async saveAssets(assets: BrandAsset[]): Promise<boolean> {
    try {
      // Serialize assets for storage (excluding File objects)
      const serializedAssets = assets.map(asset => ({
        ...asset,
        file: undefined, // Don't store File objects
        uploadDate: asset.uploadDate.toISOString(),
        lastAnalyzed: asset.lastAnalyzed?.toISOString()
      }));
      
      localStorage.setItem(this.STORAGE_KEY_ASSETS, JSON.stringify(serializedAssets));
      return true;
    } catch (error) {
      console.error('Failed to save brand assets:', error);
      return false;
    }
  }

  async getAssets(): Promise<BrandAsset[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_ASSETS);
      if (!stored) return [];

      const serializedAssets = JSON.parse(stored);
      
      // Deserialize dates
      return serializedAssets.map((asset: any) => ({
        ...asset,
        uploadDate: new Date(asset.uploadDate),
        lastAnalyzed: asset.lastAnalyzed ? new Date(asset.lastAnalyzed) : undefined
      }));
    } catch (error) {
      console.error('Failed to load brand assets:', error);
      return [];
    }
  }

  async addAsset(asset: BrandAsset): Promise<boolean> {
    try {
      const existingAssets = await this.getAssets();
      existingAssets.push(asset);
      return await this.saveAssets(existingAssets);
    } catch (error) {
      console.error('Failed to add brand asset:', error);
      return false;
    }
  }

  async updateAsset(assetId: string, updates: Partial<BrandAsset>): Promise<boolean> {
    try {
      const existingAssets = await this.getAssets();
      const index = existingAssets.findIndex(a => a.id === assetId);
      
      if (index === -1) return false;
      
      existingAssets[index] = { ...existingAssets[index], ...updates };
      return await this.saveAssets(existingAssets);
    } catch (error) {
      console.error('Failed to update brand asset:', error);
      return false;
    }
  }

  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      const existingAssets = await this.getAssets();
      const filteredAssets = existingAssets.filter(a => a.id !== assetId);
      return await this.saveAssets(filteredAssets);
    } catch (error) {
      console.error('Failed to delete brand asset:', error);
      return false;
    }
  }

  // Campaign Management
  async saveCampaigns(campaigns: BrandCampaign[]): Promise<boolean> {
    try {
      const serializedCampaigns = campaigns.map(campaign => ({
        ...campaign,
        createdDate: campaign.createdDate.toISOString()
      }));
      
      localStorage.setItem(this.STORAGE_KEY_CAMPAIGNS, JSON.stringify(serializedCampaigns));
      return true;
    } catch (error) {
      console.error('Failed to save brand campaigns:', error);
      return false;
    }
  }

  async getCampaigns(): Promise<BrandCampaign[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_CAMPAIGNS);
      if (!stored) return [];

      const serializedCampaigns = JSON.parse(stored);
      
      return serializedCampaigns.map((campaign: any) => ({
        ...campaign,
        createdDate: new Date(campaign.createdDate)
      }));
    } catch (error) {
      console.error('Failed to load brand campaigns:', error);
      return [];
    }
  }

  async createCampaign(campaign: BrandCampaign): Promise<boolean> {
    try {
      const existingCampaigns = await this.getCampaigns();
      existingCampaigns.push(campaign);
      return await this.saveCampaigns(existingCampaigns);
    } catch (error) {
      console.error('Failed to create brand campaign:', error);
      return false;
    }
  }

  // Analysis and Insights
  async analyzeContentGaps(assets: BrandAsset[]): Promise<{
    missingCategories: string[];
    recommendations: string[];
    overallHealth: number;
  }> {
    const categories = ['brand-strategy', 'messaging', 'visual-identity', 'content-library', 'research', 'guidelines'];
    const assetsByCategory = categories.reduce((acc, cat) => {
      acc[cat] = assets.filter(a => a.category === cat).length;
      return acc;
    }, {} as Record<string, number>);

    const missingCategories = categories.filter(cat => assetsByCategory[cat] === 0);
    
    const recommendations = [];
    if (assetsByCategory['content-library'] < 3) {
      recommendations.push('Upload more community stories and testimonials');
    }
    if (assetsByCategory['brand-strategy'] === 0) {
      recommendations.push('Add your brand strategy and positioning documents');
    }
    if (assetsByCategory['visual-identity'] < 2) {
      recommendations.push('Include visual brand elements (logos, colors, typography)');
    }

    const totalAssets = assets.length;
    const analyzedAssets = assets.filter(a => a.brandAlignment).length;
    const highQualityAssets = assets.filter(a => (a.brandAlignment || 0) > 70).length;
    
    const overallHealth = Math.round(
      (totalAssets > 0 ? 30 : 0) + // Has assets
      (analyzedAssets / Math.max(totalAssets, 1) * 40) + // Analysis coverage
      (highQualityAssets / Math.max(totalAssets, 1) * 30) // Quality ratio
    );

    return {
      missingCategories,
      recommendations,
      overallHealth
    };
  }

  async getBrandHealthMetrics(assets: BrandAsset[]): Promise<{
    totalAssets: number;
    analyzedAssets: number;
    averageBrandScore: number;
    readyForCampaigns: number;
    contentByType: Record<string, number>;
    recentActivity: number;
  }> {
    const analyzedAssets = assets.filter(a => a.brandAlignment);
    const averageBrandScore = analyzedAssets.length > 0 
      ? Math.round(analyzedAssets.reduce((sum, a) => sum + (a.brandAlignment || 0), 0) / analyzedAssets.length)
      : 0;
    
    const readyForCampaigns = assets.filter(a => (a.brandAlignment || 0) > 70).length;
    
    const contentByType = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = assets.filter(a => {
      const daysDiff = (new Date().getTime() - a.uploadDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      totalAssets: assets.length,
      analyzedAssets: analyzedAssets.length,
      averageBrandScore,
      readyForCampaigns,
      contentByType,
      recentActivity
    };
  }

  // Search and Filtering
  searchAssets(assets: BrandAsset[], query: string, filters?: {
    category?: string;
    type?: string;
    minBrandScore?: number;
  }): BrandAsset[] {
    let filtered = assets;

    // Text search
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(queryLower) ||
        asset.content?.toLowerCase().includes(queryLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Category filter
    if (filters?.category) {
      filtered = filtered.filter(asset => asset.category === filters.category);
    }

    // Type filter
    if (filters?.type) {
      filtered = filtered.filter(asset => asset.type === filters.type);
    }

    // Brand score filter
    if (filters?.minBrandScore) {
      filtered = filtered.filter(asset => (asset.brandAlignment || 0) >= filters.minBrandScore);
    }

    return filtered;
  }

  // Export functionality
  exportAssets(assets: BrandAsset[], format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(assets, null, 2);
    }
    
    // CSV format
    const headers = ['Name', 'Type', 'Category', 'Brand Score', 'Tags', 'Upload Date'];
    const rows = assets.map(asset => [
      asset.name,
      asset.type,
      asset.category,
      asset.brandAlignment?.toString() || 'Not analyzed',
      asset.tags.join('; '),
      asset.uploadDate.toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

export const brandAssetService = new BrandAssetService();