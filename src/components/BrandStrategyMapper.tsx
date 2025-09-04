import React, { useState, useEffect } from 'react';
import {
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  Brain,
  Map,
  Layers,
  ArrowRight,
  CheckCircle,
  Plus,
  Eye,
  Wand2,
  Lightbulb,
  Flag,
  BarChart3,
  Compass,
  Rocket
} from 'lucide-react';

interface BrandPillar {
  id: string;
  title: string;
  description: string;
  contentIds: string[];
  strength: number;
  audienceResonance: {
    government: number;
    corporate: number;
    philanthropic: number;
  };
  keyMessages: string[];
}

interface MessagingFramework {
  id: string;
  name: string;
  audience: string;
  coreMessage: string;
  supportingPoints: string[];
  callToAction: string;
  channels: string[];
  metrics: {
    brandAlignment: number;
    emotionalImpact: number;
    credibility: number;
  };
}

export const BrandStrategyMapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pillars' | 'messaging' | 'campaigns'>('overview');
  const [brandPillars, setBrandPillars] = useState<BrandPillar[]>([]);
  const [messagingFrameworks, setMessagingFrameworks] = useState<MessagingFramework[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');

  useEffect(() => {
    // Initialize with AI-analyzed brand pillars
    const initialPillars: BrandPillar[] = [
      {
        id: 'pillar-transformation',
        title: 'Personal Transformation',
        description: 'Individual stories of growth and positive change through the custodian economy',
        contentIds: ['story-0', 'story-1', 'quote-troy', 'video-aden'],
        strength: 92,
        audienceResonance: { government: 85, corporate: 78, philanthropic: 95 },
        keyMessages: [
          'Real people, real transformation',
          'Sustainable change through meaningful work',
          'Breaking cycles of disadvantage'
        ]
      },
      {
        id: 'pillar-economic-impact',
        title: 'Economic Impact & ROI',
        description: 'Measurable financial returns through the custodian economy approach',
        contentIds: ['metric-retention', 'metric-savings', 'business-productivity'],
        strength: 89,
        audienceResonance: { government: 95, corporate: 92, philanthropic: 75 },
        keyMessages: [
          '$1.1M annual savings per youth vs incarceration',
          '3-4x productivity improvement',
          'Proven economic model with measurable returns'
        ]
      },
      {
        id: 'pillar-community-empowerment',
        title: 'Community Empowerment',
        description: 'Building stronger communities through indigenous leadership',
        contentIds: ['quote-callum', 'quote-supervisor', 'partner-corporate'],
        strength: 87,
        audienceResonance: { government: 88, corporate: 82, philanthropic: 94 },
        keyMessages: [
          'Indigenous-led solutions for systemic change',
          'Community ownership and pride',
          'Sustainable employment pathways'
        ]
      },
      {
        id: 'pillar-innovation',
        title: 'Innovation & Scalability',
        description: 'Pioneering approach that can be replicated and scaled',
        contentIds: ['video-keiron', 'business-absenteeism', 'pdf-program-overview'],
        strength: 83,
        audienceResonance: { government: 80, corporate: 89, philanthropic: 78 },
        keyMessages: [
          'Innovative model disrupting traditional approaches',
          'Scalable solution for national implementation',
          'Technology-enabled social impact'
        ]
      }
    ];

    const initialFrameworks: MessagingFramework[] = [
      {
        id: 'framework-government',
        name: 'Government Partnership Framework',
        audience: 'Government',
        coreMessage: 'The custodian economy delivers measurable outcomes that align with policy objectives while reducing costs.',
        supportingPoints: [
          '$1.1M annual savings per participant vs incarceration',
          '85% employment retention demonstrates sustainable outcomes',
          'Addresses youth justice, employment, and reconciliation priorities',
          'Evidence-based approach with comprehensive data tracking'
        ],
        callToAction: 'Partner with us to scale this proven model and achieve your policy outcomes',
        channels: ['Policy briefs', 'Ministerial meetings', 'Parliamentary submissions'],
        metrics: { brandAlignment: 94, emotionalImpact: 78, credibility: 96 }
      },
      {
        id: 'framework-corporate',
        name: 'Corporate Partnership Framework',
        audience: 'Corporate',
        coreMessage: 'Partnering with the custodian economy enhances business performance while delivering authentic social impact.',
        supportingPoints: [
          '3-4x productivity improvement vs industry average',
          '3% absenteeism rate vs 25% industry average',
          'Authentic RAP commitment with measurable outcomes',
          'Enhanced reputation and stakeholder value'
        ],
        callToAction: 'Transform your business and community impact through strategic partnership',
        channels: ['Executive presentations', 'Board papers', 'Industry conferences'],
        metrics: { brandAlignment: 91, emotionalImpact: 85, credibility: 93 }
      },
      {
        id: 'framework-philanthropic',
        name: 'Philanthropic Investment Framework',
        audience: 'Philanthropic',
        coreMessage: 'Invest in a transformative model that creates lasting change in lives and systems.',
        supportingPoints: [
          '400+ lives transformed with ongoing impact',
          'Individual stories of profound personal transformation',
          'Systemic change through innovative employment model',
          'Measurable outcomes with transparent reporting'
        ],
        callToAction: 'Fund the next phase of growth and help us reach more communities',
        channels: ['Foundation meetings', 'Impact reports', 'Donor events'],
        metrics: { brandAlignment: 96, emotionalImpact: 94, credibility: 89 }
      }
    ];

    setBrandPillars(initialPillars);
    setMessagingFrameworks(initialFrameworks);
  }, []);

  const generateAIInsights = () => {
    setShowAiModal(true);
    setTimeout(() => {
      setAiInsights(`## Strategic Brand Analysis

### Current Brand Strength: 88/100

**🎯 Key Findings:**
- Personal Transformation pillar shows strongest philanthropic resonance (95%)
- Economic Impact resonates most with government stakeholders (95%) 
- Innovation pillar has highest corporate appeal (89%)

**📈 Strategic Recommendations:**
1. **Messaging Hierarchy**: Lead with transformation stories for philanthropic audiences, open with economic data for government
2. **Content Gaps**: Need 5-year longitudinal impact stories and technology platform demos
3. **Channel Strategy**: Focus on policy briefs for government, case studies for corporate, multimedia storytelling for philanthropic

**🚀 Next Phase Actions:**
1. Develop government partnership prospectus using economic impact data
2. Create corporate ROI calculator tool with productivity metrics  
3. Design philanthropic impact storytelling campaign with transformation stories
4. Build innovation showcase content series for scalability messaging`);
    }, 2000);
  };

  const getBrandHealthScore = () => {
    const avgStrength = brandPillars.reduce((acc, pillar) => acc + pillar.strength, 0) / brandPillars.length;
    return Math.round(avgStrength);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center">
              <Compass className="h-8 w-8 mr-3 text-purple-600" />
              Brand Strategy Mapper
            </h1>
            <p className="text-gray-600">
              Transform your content library into strategic brand positioning and messaging frameworks
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getBrandHealthScore()}%</div>
              <div className="text-sm text-gray-600">Brand Health</div>
            </div>
            <button
              onClick={generateAIInsights}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Strategy Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Strategic Overview', icon: Map },
            { id: 'pillars', label: 'Brand Pillars', icon: Layers },
            { id: 'messaging', label: 'Messaging Frameworks', icon: MessageSquare },
            { id: 'campaigns', label: 'Campaign Development', icon: Rocket }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Brand Health Dashboard */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              Brand Health Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {brandPillars.map((pillar) => (
                <div key={pillar.id} className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    pillar.strength >= 90 ? 'text-green-600' :
                    pillar.strength >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pillar.strength}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{pillar.title}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        pillar.strength >= 90 ? 'bg-green-500' :
                        pillar.strength >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pillar.strength}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Resonance Matrix */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Audience Resonance Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Brand Pillar</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">Government</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">Corporate</th>
                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-600">Philanthropic</th>
                  </tr>
                </thead>
                <tbody>
                  {brandPillars.map((pillar) => (
                    <tr key={pillar.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{pillar.title}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm leading-8 ${
                          pillar.audienceResonance.government >= 90 ? 'bg-green-500' :
                          pillar.audienceResonance.government >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {pillar.audienceResonance.government}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm leading-8 ${
                          pillar.audienceResonance.corporate >= 90 ? 'bg-green-500' :
                          pillar.audienceResonance.corporate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {pillar.audienceResonance.corporate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-8 h-8 rounded-full text-white text-sm leading-8 ${
                          pillar.audienceResonance.philanthropic >= 90 ? 'bg-green-500' :
                          pillar.audienceResonance.philanthropic >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {pillar.audienceResonance.philanthropic}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left hover:bg-blue-100 transition-colors">
              <Flag className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Build Government Campaign</h4>
              <p className="text-sm text-gray-600">Create policy-focused messaging with economic impact data</p>
            </button>
            <button className="bg-green-50 border border-green-200 rounded-lg p-6 text-left hover:bg-green-100 transition-colors">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Corporate Partnership Deck</h4>
              <p className="text-sm text-gray-600">Develop ROI-focused presentations for business leaders</p>
            </button>
            <button className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-left hover:bg-purple-100 transition-colors">
              <Lightbulb className="h-8 w-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Impact Storytelling</h4>
              <p className="text-sm text-gray-600">Craft compelling narratives for philanthropic funders</p>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {brandPillars.map((pillar) => (
            <div key={pillar.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${
                    pillar.strength >= 90 ? 'text-green-600' :
                    pillar.strength >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pillar.strength}%
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{pillar.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Messages</h4>
                  <ul className="space-y-1">
                    {pillar.keyMessages.map((message, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Content Assets</h4>
                  <div className="text-sm text-gray-600">
                    {pillar.contentIds.length} pieces of supporting content
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'messaging' && (
        <div className="space-y-6">
          {messagingFrameworks.map((framework) => (
            <div key={framework.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                    {framework.audience}
                  </span>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center text-sm">
                  <Rocket className="h-3 w-3 mr-2" />
                  Create Campaign
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Core Message</h4>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{framework.coreMessage}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Supporting Points</h4>
                    <ul className="space-y-1">
                      {framework.supportingPoints.map((point, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Call to Action</h4>
                    <p className="text-sm text-purple-700 bg-purple-50 p-2 rounded italic">"{framework.callToAction}"</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Effectiveness Metrics</h4>
                  <div className="space-y-3">
                    {Object.entries(framework.metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Channels</h4>
                    <div className="flex flex-wrap gap-1">
                      {framework.channels.map((channel, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Rocket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Development Coming Soon</h3>
          <p className="text-gray-500 mb-4">Create campaigns from messaging frameworks</p>
          <button 
            onClick={() => setActiveTab('messaging')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Browse Messaging Frameworks
          </button>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Brain className="h-6 w-6 mr-3 text-purple-600" />
                  AI Brand Strategy Analysis
                </h2>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                {aiInsights.split('\n').map((line, index) => {
                  if (line.startsWith('##')) {
                    return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.replace('##', '').trim()}</h3>;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} className="font-semibold text-gray-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
                  } else if (line.trim().startsWith('-') || line.trim().startsWith('1.')) {
                    return <li key={index} className="text-gray-700 ml-4">{line.replace(/^[\d\.\-\s]+/, '').trim()}</li>;
                  } else if (line.trim()) {
                    return <p key={index} className="text-gray-700 mb-2">{line}</p>;
                  }
                  return <br key={index} />;
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};