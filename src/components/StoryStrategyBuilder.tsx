import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Target,
  Users,
  MapPin,
  TrendingUp,
  Quote,
  Video,
  FileText,
  Lightbulb,
  Wand2,
  Eye,
  Edit,
  Save,
  Play,
  MessageSquare,
  BookOpen,
  Mic,
  Camera,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react';

interface StoryElement {
  id: string;
  type: 'pillar' | 'challenge' | 'proof' | 'vision' | 'ask';
  title: string;
  content: string;
  quotes: string[];
  videoIdeas: string[];
  supportingData: string[];
  audience: 'government' | 'corporate' | 'philanthropic' | 'community' | 'all';
  tone: 'urgent' | 'hopeful' | 'data-driven' | 'personal' | 'visionary';
}

interface StoryFramework {
  id: string;
  name: string;
  tagline: string;
  corePillars: {
    youth: string;
    country: string;
    futures: string;
  };
  elements: StoryElement[];
  targetAudience: string;
  keyMessage: string;
  callToAction: string;
}

export const StoryStrategyBuilder: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<StoryFramework | null>(null);
  const [frameworks, setFrameworks] = useState<StoryFramework[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'library' | 'testing' | 'production'>('builder');
  const [selectedElement, setSelectedElement] = useState<StoryElement | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    // Initialize with the core Custodian Pathways framework
    const coreFramework: StoryFramework = {
      id: 'custodian-core',
      name: 'Custodian Pathways - Core Framework',
      tagline: 'From potential to prosperity',
      corePillars: {
        youth: 'Young people as leaders, not clients. Pathways of safety, belonging, skills, and pride.',
        country: 'Land and culture regenerated through real work, enterprise, and custodianship.',
        futures: 'Building intergenerational wealth and opportunity — where communities, not government cycles, hold the capital and the power.'
      },
      elements: [
        {
          id: 'challenge',
          type: 'challenge',
          title: 'The Challenge We Face',
          content: '$700k/year to jail one youth. 80% reoffending rate. 50% of land degraded. 58% of Indigenous youth engaged in work/education.',
          quotes: [
            '"We don\'t see problems, we see potential." – Keiron Lander',
            '"The system is designed to fail our young people, but they\'re not failing - the system is." – Community Elder'
          ],
          videoIdeas: [
            'Keiron speaking to camera about seeing potential vs problems',
            'Time-lapse of degraded land transforming through custodian work',
            'Split screen: young person in detention vs same person thriving in program'
          ],
          supportingData: [
            'Youth justice costs per person per year',
            'Reoffending statistics comparison',
            'Land degradation extent and cost',
            'Employment gap analysis'
          ],
          audience: 'all',
          tone: 'urgent'
        },
        {
          id: 'custodian-model',
          type: 'pillar',
          title: 'The Custodian Model',
          content: 'Not welfare. Not charity. Partnership. Four integrated pathways: Urban workforce entry, Rural land regeneration, Justice diversion, and Custodian Capital investment.',
          quotes: [
            '"This isn\'t about helping people - it\'s about unleashing people." – Scott Young',
            '"When you give someone meaningful work, you give them back their dignity." – Program Participant'
          ],
          videoIdeas: [
            'Four-way split screen showing each pathway in action',
            'Young person explaining their journey through the program',
            'Aerial footage of land restoration work with narration'
          ],
          supportingData: [
            'Program pathway completion rates',
            'Skills development tracking',
            'Employment outcome metrics',
            'Land restoration measurements'
          ],
          audience: 'all',
          tone: 'hopeful'
        },
        {
          id: 'proof-impact',
          type: 'proof',
          title: 'Proven Impact',
          content: '350+ youth in full-time jobs. 40,000+ hectares regenerated. 46% herd growth CAGR. $1.7m/year saved from diversion.',
          quotes: [
            '"This works." – Data speaks for itself',
            '"I went from having nothing to owning my own small business. That\'s the power of this program." – Troy'
          ],
          videoIdeas: [
            'Animated infographic showing numbers growing over time',
            'Success story interviews with concrete before/after',
            'Drone footage of restored land with data overlays'
          ],
          supportingData: [
            'Employment retention rates over 5 years',
            'Hectares restored by region and year',
            'Economic impact calculations',
            'Cost-benefit analysis government savings'
          ],
          audience: 'government',
          tone: 'data-driven'
        },
        {
          id: 'vision-future',
          type: 'vision',
          title: '20-Year Vision',
          content: 'Build 5-10 Custodian Learning Centres. Each anchored by land, cattle, cultural leadership, and youth training. Delivering jobs, restored ecosystems, and intergenerational wealth.',
          quotes: [
            '"Custodianship means leaving things better than we found them." – Scott Young',
            '"We\'re not just building careers, we\'re building communities that will thrive for generations." – Keiron Lander'
          ],
          videoIdeas: [
            'Vision sequence: current reality transitioning to future state',
            'Intergenerational interview: elder and young person discussing the future',
            'Architectural visualization of Custodian Learning Centres'
          ],
          supportingData: [
            'Expansion feasibility studies',
            'Land acquisition requirements',
            'Investment projections by phase',
            'Community impact modeling'
          ],
          audience: 'philanthropic',
          tone: 'visionary'
        },
        {
          id: 'call-to-action',
          type: 'ask',
          title: 'Join as Shareholder, Not Donor',
          content: 'Capital: Invest $1-2M. Employment: Cadetships, placements, jobs. Partnership: Cultural exchange & system change. Custodianship is not a program. It\'s a future.',
          quotes: [
            '"We\'re looking for partners who understand that real change requires real investment." – Keiron Lander',
            '"This isn\'t charity. This is the smartest investment you can make in Australia\'s future." – Corporate Partner'
          ],
          videoIdeas: [
            'Partnership testimonials from existing investors',
            'Behind-the-scenes of partnership meetings and collaborations',
            'Young leaders speaking directly to potential partners'
          ],
          supportingData: [
            'ROI calculations for different investment levels',
            'Partnership success stories and outcomes',
            'Risk mitigation frameworks',
            'Impact measurement methodologies'
          ],
          audience: 'corporate',
          tone: 'personal'
        }
      ],
      targetAudience: 'Multi-stakeholder: Government, Corporate, Philanthropic',
      keyMessage: 'Custodianship transforms potential into prosperity through partnership, not welfare',
      callToAction: 'Invest in custodianship as the future of Indigenous youth empowerment and land regeneration'
    };

    setFrameworks([coreFramework]);
    setActiveFramework(coreFramework);
  }, []);

  const createNewFramework = () => {
    const newFramework: StoryFramework = {
      id: `framework_${Date.now()}`,
      name: 'New Story Framework',
      tagline: 'Enter your tagline',
      corePillars: {
        youth: 'Define how you position youth...',
        country: 'Define how you position country/land...',
        futures: 'Define how you position futures/impact...'
      },
      elements: [],
      targetAudience: 'Select target audience',
      keyMessage: 'What is your core message?',
      callToAction: 'What do you want them to do?'
    };
    
    setFrameworks(prev => [newFramework, ...prev]);
    setActiveFramework(newFramework);
  };

  const addStoryElement = (type: StoryElement['type']) => {
    if (!activeFramework) return;
    
    const newElement: StoryElement = {
      id: `element_${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: 'Enter your content here...',
      quotes: [],
      videoIdeas: [],
      supportingData: [],
      audience: 'all',
      tone: 'hopeful'
    };
    
    const updatedFramework = {
      ...activeFramework,
      elements: [...activeFramework.elements, newElement]
    };
    
    setActiveFramework(updatedFramework);
    setFrameworks(prev => prev.map(f => f.id === activeFramework.id ? updatedFramework : f));
  };

  const updateElement = (elementId: string, updates: Partial<StoryElement>) => {
    if (!activeFramework) return;
    
    const updatedFramework = {
      ...activeFramework,
      elements: activeFramework.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    };
    
    setActiveFramework(updatedFramework);
    setFrameworks(prev => prev.map(f => f.id === activeFramework.id ? updatedFramework : f));
  };

  const generateAIAlternatives = (element: StoryElement) => {
    // Simulate AI-generated alternatives based on tone and audience
    const alternatives = {
      urgent: [
        'Crisis demands action now - delay costs lives and futures',
        'The window for change is closing - we must act decisively',
        'Every day we wait, more potential is lost forever'
      ],
      hopeful: [
        'Together, we can transform challenge into opportunity',
        'The seeds of change are already planted - now we nurture growth',
        'Hope becomes reality when we invest in proven solutions'
      ],
      'data-driven': [
        'The numbers tell a clear story of impact and return on investment',
        'Evidence-based results demonstrate measurable transformation',
        'Quantifiable outcomes prove the model works at scale'
      ],
      personal: [
        'Behind every statistic is a life transformed and a future reclaimed',
        'These are real people with real stories of real change',
        'Individual transformation creates community-wide impact'
      ],
      visionary: [
        'Imagine communities where every young person has a pathway to prosperity',
        'This is how we build the Australia our children deserve',
        'From vision to reality - the future of Indigenous empowerment'
      ]
    };
    
    return alternatives[element.tone] || alternatives.hopeful;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center">
              <PenTool className="h-8 w-8 mr-3 text-indigo-600" />
              Story Strategy Builder
            </h1>
            <p className="text-gray-600">
              Craft, test, and refine your business strategy narratives from first principles
            </p>
          </div>
          <button
            onClick={createNewFramework}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            New Story Framework
          </button>
        </div>
      </div>

      {/* Core Pillars Display */}
      {activeFramework && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            {activeFramework.name}
          </h2>
          <p className="text-center text-gray-600 italic mb-6">"{activeFramework.tagline}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Youth</h3>
              <p className="text-sm text-blue-700">{activeFramework.corePillars.youth}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Country</h3>
              <p className="text-sm text-green-700">{activeFramework.corePillars.country}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Futures</h3>
              <p className="text-sm text-purple-700">{activeFramework.corePillars.futures}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'builder', label: 'Story Builder', icon: PenTool },
            { id: 'library', label: 'Content Library', icon: FileText },
            { id: 'testing', label: 'Message Testing', icon: Target },
            { id: 'production', label: 'Production Planning', icon: Video }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
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
      {activeTab === 'builder' && activeFramework && (
        <div className="space-y-6">
          {/* Add Element Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { type: 'challenge', label: 'Add Challenge', icon: Target, color: 'red' },
              { type: 'pillar', label: 'Add Pillar', icon: Users, color: 'blue' },
              { type: 'proof', label: 'Add Proof', icon: CheckCircle, color: 'green' },
              { type: 'vision', label: 'Add Vision', icon: Eye, color: 'purple' },
              { type: 'ask', label: 'Add Call-to-Action', icon: ArrowRight, color: 'orange' }
            ].map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.type}
                  onClick={() => addStoryElement(button.type as StoryElement['type'])}
                  className={`bg-${button.color}-100 text-${button.color}-700 px-4 py-2 rounded-lg hover:bg-${button.color}-200 flex items-center text-sm`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {button.label}
                </button>
              );
            })}
          </div>

          {/* Story Elements */}
          <div className="space-y-6">
            {activeFramework.elements.map((element) => (
              <div key={element.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={element.title}
                    onChange={(e) => updateElement(element.id, { title: e.target.value })}
                    className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      value={element.tone}
                      onChange={(e) => updateElement(element.id, { tone: e.target.value as StoryElement['tone'] })}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="hopeful">Hopeful</option>
                      <option value="data-driven">Data-Driven</option>
                      <option value="personal">Personal</option>
                      <option value="visionary">Visionary</option>
                    </select>
                    <button
                      onClick={() => setSelectedElement(element)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={element.content}
                  onChange={(e) => updateElement(element.id, { content: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                  placeholder="Enter your story content..."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Quote className="h-3 w-3 mr-1" />
                      Key Quotes ({element.quotes.length})
                    </h4>
                    <button 
                      onClick={() => {
                        setSelectedElement(element);
                        setShowQuoteModal(true);
                      }}
                      className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded p-2"
                    >
                      + Add quotes & transcripts
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Video className="h-3 w-3 mr-1" />
                      Video Ideas ({element.videoIdeas.length})
                    </h4>
                    <button 
                      onClick={() => {
                        setSelectedElement(element);
                        setShowVideoModal(true);
                      }}
                      className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded p-2"
                    >
                      + Plan video content
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      Supporting Data ({element.supportingData.length})
                    </h4>
                    <div className="text-xs text-gray-500">
                      Evidence and proof points
                    </div>
                  </div>
                </div>

                {/* AI Alternatives */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Alternative Phrasings ({element.tone} tone)
                  </h4>
                  <div className="space-y-1">
                    {generateAIAlternatives(element).map((alt, index) => (
                      <button
                        key={index}
                        onClick={() => updateElement(element.id, { content: alt })}
                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded border border-gray-100"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Content Library Integration</h3>
          <p className="text-gray-500 mb-4">Pull quotes, videos, and data from your existing content library</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Browse Content Library
          </button>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Message Testing Lab</h3>
          <p className="text-gray-500 mb-4">A/B test different story versions with target audiences</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Create Message Test
          </button>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Production Planning</h3>
          <p className="text-gray-500 mb-4">Turn your story strategy into production-ready content plans</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Generate Production Brief
          </button>
        </div>
      )}

      {/* Quotes Modal */}
      {showQuoteModal && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Mic className="h-5 w-5 mr-2" />
                  Quotes & Transcripts for "{selectedElement.title}"
                </h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Quote or Transcript
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter quote with attribution, e.g., 'This program changed my life.' - Troy, Program Graduate"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                    Add Quote
                  </button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Quotes</h4>
                  <div className="space-y-2">
                    {selectedElement.quotes.map((quote, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm italic">"{quote}"</p>
                      </div>
                    ))}
                    {selectedElement.quotes.length === 0 && (
                      <p className="text-sm text-gray-500">No quotes added yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowQuoteModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Ideas Modal */}
      {showVideoModal && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Video Concepts for "{selectedElement.title}"
                </h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Video Concept
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the video concept, e.g., 'Interview with Troy showing before/after transformation with workplace footage'"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                    Add Video Idea
                  </button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Video Concepts</h4>
                  <div className="space-y-2">
                    {selectedElement.videoIdeas.map((idea, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm">{idea}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Concept</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Ready to Film</span>
                        </div>
                      </div>
                    ))}
                    {selectedElement.videoIdeas.length === 0 && (
                      <p className="text-sm text-gray-500">No video concepts added yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};