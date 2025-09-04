import React, { useState, useEffect } from 'react';
import {
  FileText,
  Users,
  Target,
  Download,
  Eye,
  Edit,
  Wand2,
  CheckCircle,
  Circle,
  ArrowRight,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Briefcase,
  Heart,
  Building
} from 'lucide-react';

interface ProspectusSection {
  id: string;
  title: string;
  content: string;
  tone: 'authentic' | 'data-driven' | 'visionary' | 'urgent';
  completed: boolean;
  wordCount: number;
}

interface Prospectus {
  id: string;
  name: string;
  audience: 'government' | 'corporate' | 'philanthropic';
  meetingType: string;
  stakeholders: string[];
  keyAsk: string;
  sections: ProspectusSection[];
  coverData: {
    title: string;
    subtitle: string;
    meetingDate: string;
    presentedBy: string;
    tagline: string;
  };
}

export const ProspectusGenerator: React.FC = () => {
  const [prospectuses, setProspectuses] = useState<Prospectus[]>([]);
  const [activeProspectus, setActiveProspectus] = useState<Prospectus | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'library'>('builder');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with template prospectuses
    const templates: Prospectus[] = [
      {
        id: 'government-partnership',
        name: 'Government Partnership Prospectus',
        audience: 'government',
        meetingType: 'Ministerial Meeting',
        stakeholders: ['Minister', 'Department Secretary', 'Policy Advisors'],
        keyAsk: 'Strategic partnership and co-investment to scale custodian economy model nationally',
        coverData: {
          title: 'Custodian Pathways',
          subtitle: 'A Partnership Proposal for Scaling Indigenous Youth Employment',
          meetingDate: new Date().toLocaleDateString(),
          presentedBy: 'Keiron Lander, Founder & CEO',
          tagline: 'From potential to prosperity through partnership'
        },
        sections: [
          {
            id: 'opening',
            title: 'The Challenge & Opportunity',
            content: '$700,000 per year - that\'s what it costs to incarcerate one young person. 80% reoffend within two years. Meanwhile, 50% of our traditional lands are degraded and need custodian care.\n\nBut here\'s what we see: 400+ young Indigenous people transformed into employed custodians. 40,000+ hectares restored. $1.7M saved annually through justice diversion.\n\nThis isn\'t about managing a problem. This is about unleashing potential.',
            tone: 'urgent',
            completed: true,
            wordCount: 89
          },
          {
            id: 'model',
            title: 'The Custodian Economy Model',
            content: 'Not welfare. Not charity. Partnership.\n\nFour integrated pathways:\n• Urban Pathways: Workforce entry in cities\n• Rural Pathways: Land restoration and cattle management\n• Justice Pathways: Diversion and wraparound support\n• Custodian Capital: Natural capital investment\n\nEach pathway creates real work, builds real skills, generates real outcomes.',
            tone: 'authentic',
            completed: true,
            wordCount: 67
          },
          {
            id: 'evidence',
            title: 'Proven Results',
            content: '• 350+ youth in full-time employment\n• 85% retention rate after 12 months (vs 40% industry average)\n• 46% annual herd growth (CAGR)\n• 3% absenteeism (vs 25% industry average)\n• $1.1M annual savings per participant vs incarceration\n\nThese aren\'t projections. These are results.',
            tone: 'data-driven',
            completed: true,
            wordCount: 52
          },
          {
            id: 'vision',
            title: '20-Year National Vision',
            content: '5-10 Custodian Learning Centres across Australia. Each anchored by:\n• Traditional country and cultural connection\n• Regenerative agriculture and land management\n• Youth training and leadership development\n• Community-owned enterprises\n\nImagine: Every at-risk Indigenous young person has a pathway to prosperity. Every degraded landscape has custodian care. Every community builds intergenerational wealth.',
            tone: 'visionary',
            completed: true,
            wordCount: 78
          },
          {
            id: 'partnership',
            title: 'The Partnership Opportunity',
            content: 'We\'re not asking for funding. We\'re offering partnership.\n\nGovernment Investment: Policy alignment, co-investment, systemic support\nGovernment Returns: Reduced justice costs, employment outcomes, land restoration\n\nThis is how we build the Australia our children deserve. Together.',
            tone: 'authentic',
            completed: true,
            wordCount: 46
          }
        ]
      }
    ];

    setProspectuses(templates);
    setActiveProspectus(templates[0]);
  }, []);

  const createNewProspectus = (audienceType: 'government' | 'corporate' | 'philanthropic') => {
    const audienceTemplates = {
      government: {
        meetingType: 'Ministerial Meeting',
        stakeholders: ['Minister', 'Department Officials', 'Policy Team'],
        keyAsk: 'Strategic partnership and policy alignment'
      },
      corporate: {
        meetingType: 'Board Presentation',
        stakeholders: ['CEO', 'Board Members', 'Sustainability Team'],
        keyAsk: 'Corporate partnership and investment'
      },
      philanthropic: {
        meetingType: 'Foundation Meeting',
        stakeholders: ['Foundation Directors', 'Program Officers'],
        keyAsk: 'Philanthropic investment and support'
      }
    };

    const template = audienceTemplates[audienceType];
    
    const newProspectus: Prospectus = {
      id: `prospectus_${Date.now()}`,
      name: `${audienceType.charAt(0).toUpperCase() + audienceType.slice(1)} Prospectus`,
      audience: audienceType,
      meetingType: template.meetingType,
      stakeholders: template.stakeholders,
      keyAsk: template.keyAsk,
      coverData: {
        title: 'Custodian Pathways',
        subtitle: 'Partnership Proposal',
        meetingDate: new Date().toLocaleDateString(),
        presentedBy: 'Keiron Lander',
        tagline: 'From potential to prosperity'
      },
      sections: []
    };

    setProspectuses(prev => [newProspectus, ...prev]);
    setActiveProspectus(newProspectus);
  };

  const generateSectionContent = (sectionType: string, audience: string) => {
    const contentMap = {
      government: {
        opening: 'Every year we spend $700,000 to incarcerate one young Indigenous person. 80% reoffend. Meanwhile, our traditional lands need custodian care. We have a better way.',
        model: 'The custodian economy creates real jobs doing real work that matters. Four pathways: urban workforce, rural regeneration, justice diversion, and capital investment.',
        evidence: '350+ youth employed. 85% retention. $1.7M saved annually. 40,000 hectares restored. These are results, not promises.',
        vision: 'A national network of Custodian Learning Centres. Every at-risk young person has a pathway. Every community builds wealth.',
        ask: 'Partner with us. Co-invest in scaling this proven model. Build the employment future Australia needs.'
      },
      corporate: {
        opening: 'Indigenous youth unemployment costs Australia billions. Land degradation reduces productivity. We turn both challenges into competitive advantage.',
        model: 'Partnership delivers: 3-4x productivity gains, 3% absenteeism vs 25% average, authentic RAP outcomes, enhanced reputation.',
        evidence: 'Corporate partners report significant ROI: reduced recruitment costs, improved performance, genuine social impact.',
        vision: 'Scale across regions. Your business powered by the most motivated, skilled workforce while restoring landscapes.',
        ask: 'Invest in partnership. Access exceptional talent. Drive authentic impact. Build competitive advantage.'
      },
      philanthropic: {
        opening: 'Behind every statistic is a life waiting to flourish. 400+ young people have already transformed. Thousands more are ready.',
        model: 'We don\'t just change lives - we change systems. Individual transformation creates community transformation.',
        evidence: 'Troy went from crisis to crew leader. Callum found hope and purpose. These aren\'t rare exceptions - they\'re the pattern.',
        vision: 'Imagine: every Indigenous young person has a pathway to prosperity. Every community builds intergenerational wealth.',
        ask: 'Fund the future. Invest in transformation. Scale hope into a national movement.'
      }
    };

    return contentMap[audience as keyof typeof contentMap]?.[sectionType as keyof typeof contentMap.government] || 'Add your content here...';
  };

  const addSection = (type: string) => {
    if (!activeProspectus) return;

    const newSection: ProspectusSection = {
      id: `section_${Date.now()}`,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: generateSectionContent(type, activeProspectus.audience),
      tone: 'authentic',
      completed: false,
      wordCount: 0
    };

    const updatedProspectus = {
      ...activeProspectus,
      sections: [...activeProspectus.sections, newSection]
    };

    setActiveProspectus(updatedProspectus);
    setProspectuses(prev => prev.map(p => p.id === activeProspectus.id ? updatedProspectus : p));
  };

  const updateSection = (sectionId: string, updates: Partial<ProspectusSection>) => {
    if (!activeProspectus) return;

    const updatedProspectus = {
      ...activeProspectus,
      sections: activeProspectus.sections.map(section =>
        section.id === sectionId ? { 
          ...section, 
          ...updates, 
          wordCount: updates.content ? updates.content.split(' ').length : section.wordCount 
        } : section
      )
    };

    setActiveProspectus(updatedProspectus);
    setProspectuses(prev => prev.map(p => p.id === activeProspectus.id ? updatedProspectus : p));
  };

  const exportProspectus = () => {
    if (!activeProspectus) return;

    const content = `
# ${activeProspectus.coverData.title}
## ${activeProspectus.coverData.subtitle}

**Meeting:** ${activeProspectus.meetingType}
**Date:** ${activeProspectus.coverData.meetingDate}
**Presented by:** ${activeProspectus.coverData.presentedBy}

---

${activeProspectus.sections.map(section => `
## ${section.title}

${section.content}
`).join('\n')}

---

**Key Ask:** ${activeProspectus.keyAsk}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProspectus.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center">
              <Briefcase className="h-8 w-8 mr-3 text-green-600" />
              Prospectus Generator
            </h1>
            <p className="text-gray-600">
              Transform your brand strategy into authentic, meeting-ready documents
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => createNewProspectus('government')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Building className="h-4 w-4 mr-2" />
              Government
            </button>
            <button
              onClick={() => createNewProspectus('corporate')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Corporate
            </button>
            <button
              onClick={() => createNewProspectus('philanthropic')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Heart className="h-4 w-4 mr-2" />
              Philanthropic
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'builder', label: 'Document Builder', icon: Edit },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'library', label: 'Document Library', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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

      {/* Builder Tab */}
      {activeTab === 'builder' && activeProspectus && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                <input
                  type="text"
                  value={activeProspectus.meetingType}
                  onChange={(e) => setActiveProspectus(prev => prev ? {...prev, meetingType: e.target.value} : null)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Ask</label>
                <textarea
                  value={activeProspectus.keyAsk}
                  onChange={(e) => setActiveProspectus(prev => prev ? {...prev, keyAsk: e.target.value} : null)}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presenter</label>
                <input
                  type="text"
                  value={activeProspectus.coverData.presentedBy}
                  onChange={(e) => setActiveProspectus(prev => prev ? {
                    ...prev, 
                    coverData: {...prev.coverData, presentedBy: e.target.value}
                  } : null)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Section</h4>
              <div className="space-y-2">
                {['opening', 'model', 'evidence', 'vision', 'ask'].map(type => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded text-sm"
                  >
                    + {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-2 space-y-6">
            {activeProspectus.sections.map((section, index) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={section.tone}
                      onChange={(e) => updateSection(section.id, { tone: e.target.value as ProspectusSection['tone'] })}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="authentic">Authentic</option>
                      <option value="data-driven">Data-Driven</option>
                      <option value="visionary">Visionary</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <button
                      onClick={() => updateSection(section.id, { completed: !section.completed })}
                    >
                      {section.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
                  placeholder="Enter your content..."
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{section.wordCount} words</span>
                  <span className={`font-medium ${section.tone === 'authentic' ? 'text-blue-600' : 
                    section.tone === 'data-driven' ? 'text-green-600' :
                    section.tone === 'visionary' ? 'text-purple-600' : 'text-red-600'}`}>
                    {section.tone} tone
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && activeProspectus && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {/* Cover */}
            <div className="text-center mb-12 pb-8 border-b border-gray-200">
              <h1 className="text-4xl font-light text-gray-900 mb-2">{activeProspectus.coverData.title}</h1>
              <h2 className="text-xl text-gray-600 mb-6">{activeProspectus.coverData.subtitle}</h2>
              <div className="space-y-2 text-sm text-gray-500">
                <p><strong>Meeting:</strong> {activeProspectus.meetingType}</p>
                <p><strong>Date:</strong> {activeProspectus.coverData.meetingDate}</p>
                <p><strong>Presented by:</strong> {activeProspectus.coverData.presentedBy}</p>
              </div>
              <p className="mt-6 text-lg italic text-gray-700">"{activeProspectus.coverData.tagline}"</p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {activeProspectus.sections.map((section, index) => (
                <div key={section.id}>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                  <div className="prose prose-lg max-w-none">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Ask */}
            <div className="mt-12 pt-8 border-t border-gray-200 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Partnership Opportunity</h3>
              <p className="text-green-800 text-lg">{activeProspectus.keyAsk}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={exportProspectus}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Document
            </button>
          </div>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prospectuses.map((prospectus) => (
            <div key={prospectus.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{prospectus.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  prospectus.audience === 'government' ? 'bg-blue-100 text-blue-700' :
                  prospectus.audience === 'corporate' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {prospectus.audience}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{prospectus.meetingType}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{prospectus.sections.length} sections</span>
                <span>{prospectus.sections.filter(s => s.completed).length} completed</span>
              </div>
              
              <button
                onClick={() => setActiveProspectus(prospectus)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Open Document
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};