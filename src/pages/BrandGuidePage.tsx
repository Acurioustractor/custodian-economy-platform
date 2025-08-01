import React, { useState } from 'react';
import { ArrowRight, Users, Target, Building2, Palette, MessageSquare, Calendar, Play, Eye, Download } from 'lucide-react';

const BrandGuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('architecture');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const BrandArchitecture = () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-6">Brand Architecture</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
          How Young Guns and Potential First Pathways work together to demonstrate the Custodian Economy
        </p>
      </div>

      {/* Visual Brand Hierarchy */}
      <div className="relative">
        {/* Young Guns - Master Brand */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">YOUNG GUNS</h3>
              <p className="text-lg text-gray-700 font-light">"Proving Indigenous Business Excellence"</p>
            </div>
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Master Brand
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Container Crews */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Building2 className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Container Crews</h4>
                  <p className="text-sm text-gray-600">Service Division</p>
                </div>
              </div>
              <p className="text-gray-700 font-light mb-4">"Australia's Most Productive Teams"</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Productivity</span>
                  <span className="font-medium text-green-600">+300% vs industry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absenteeism</span>
                  <span className="font-medium text-green-600">3% vs 25% industry</span>
                </div>
              </div>
            </div>

            {/* Potential First Pathways */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Potential First Pathways</h4>
                  <p className="text-sm text-blue-600">Social Impact Initiative</p>
                </div>
              </div>
              <p className="text-gray-700 font-light mb-4">"From Potential to Purpose"</p>
              
              {/* Three Hubs */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Community Hub - Connection & Culture</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Pathways Hub - Skills & Mentorship</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Business Hub - Employment & Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { title: 'Potential First', desc: 'See capability, not deficit', color: 'bg-blue-100 text-blue-800' },
            { title: 'Cultural Strength', desc: 'Indigenous knowledge as advantage', color: 'bg-green-100 text-green-800' },
            { title: 'Commercial Excellence', desc: 'Business success enables impact', color: 'bg-yellow-100 text-yellow-800' },
            { title: 'Reciprocity', desc: 'What benefits one, benefits all', color: 'bg-purple-100 text-purple-800' },
            { title: 'Transformation', desc: 'Creating generational change', color: 'bg-orange-100 text-orange-800' }
          ].map((value, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${value.color}`}>
                {value.title}
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const VisualIdentity = () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-6">Visual Identity</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
          Colours, typography, and visual elements that bring the brand to life
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Colour Palette */}
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-8">Colour Palette</h3>
          
          <div className="space-y-6">
            {/* Primary Colours */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Primary Colours</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-full h-20 rounded-lg shadow-sm mb-3" style={{ backgroundColor: '#73582c' }}></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Heritage Brown</div>
                    <div className="text-gray-600">#73582c</div>
                    <div className="text-xs text-gray-500 mt-1">Cultural grounding</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 rounded-lg shadow-sm mb-3" style={{ backgroundColor: '#d4af37' }}></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Achievement Gold</div>
                    <div className="text-gray-600">#d4af37</div>
                    <div className="text-xs text-gray-500 mt-1">Success, potential</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 rounded-lg shadow-sm mb-3" style={{ backgroundColor: '#0288d1' }}></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Journey Blue</div>
                    <div className="text-gray-600">#0288d1</div>
                    <div className="text-xs text-gray-500 mt-1">Pathways, progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Colours */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Secondary Colours</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-full h-16 rounded-lg shadow-sm mb-2" style={{ backgroundColor: '#2e7d32' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">Growth Green</div>
                    <div className="text-gray-600">#2e7d32</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-lg shadow-sm mb-2" style={{ backgroundColor: '#ed6c02' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">Safety Orange</div>
                    <div className="text-gray-600">#ed6c02</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 rounded-lg shadow-sm mb-2" style={{ backgroundColor: '#757575' }}></div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">Professional Grey</div>
                    <div className="text-gray-600">#757575</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-8">Typography</h3>
          
          <div className="space-y-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">Headlines</div>
              <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Montserrat Bold
              </div>
              <div className="text-sm text-gray-600">Strong, confident, modern</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">Body Copy</div>
              <div className="text-lg text-gray-900 mb-2">
                Open Sans Regular
              </div>
              <div className="text-sm text-gray-600">Clear, accessible, professional</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-2">Quotes & Callouts</div>
              <div className="text-lg text-gray-900 mb-2 font-light italic">
                "Raleway Light - for testimonials and emphasis"
              </div>
              <div className="text-sm text-gray-600">Adds personality and warmth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CampaignConcepts = () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-6">Campaign Concepts</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
          Strategic campaigns that shift the narrative from problems to potential
        </p>
      </div>

      {/* Launch Campaign */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-light text-gray-900 mb-4">Launch Campaign: "See the Potential"</h3>
            <p className="text-lg text-gray-600 font-light">Shift perception from seeing problems to seeing potential</p>
          </div>

          {/* Campaign Visual Mockup */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="grid md:grid-cols-2">
              <div className="bg-gray-800 p-8 text-white">
                <h4 className="text-lg font-medium mb-4">How Society Sees Them</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>• 67% of detained youth are Indigenous</div>
                  <div>• Unemployment statistics</div>
                  <div>• Justice system cycling</div>
                  <div>• Barriers and challenges</div>
                </div>
              </div>
              <div className="bg-blue-600 p-8 text-white">
                <h4 className="text-lg font-medium mb-4">Who They Really Are</h4>
                <div className="space-y-3 text-sm text-blue-100">
                  <div>• Team leaders and mentors</div>
                  <div>• 3% absenteeism rate</div>
                  <div>• Award-winning productivity</div>
                  <div>• Community contributors</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-400 p-4 text-center">
              <div className="text-xl font-medium text-gray-900">"We see what others miss. Potential First."</div>
            </div>
          </div>

          {/* Campaign Elements */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Play className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Hero Film</h4>
              <p className="text-gray-600 font-light text-sm">3-minute journey from dawn at Young Guns to community impact</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Users className="w-8 h-8 text-green-600 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Story Series</h4>
              <p className="text-gray-600 font-light text-sm">6 x 60-second individual transformation stories</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Eye className="w-8 h-8 text-purple-600 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Photo Exhibition</h4>
              <p className="text-gray-600 font-light text-sm">Participant-captured workplace moments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Campaigns */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-light text-gray-900 mb-4">"I'm a Potential First"</h3>
          <p className="text-gray-600 font-light mb-6">Participant-led storytelling movement</p>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Merchandise programme
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Social media movement
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              Community activation
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-light text-gray-900 mb-4">"The Custodian Economy"</h3>
          <p className="text-gray-600 font-light mb-6">Business leader and policy maker engagement</p>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              Executive briefings
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              Economic impact focus
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              Policy influence
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ImplementationTimeline = () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-gray-900 mb-6">Implementation Timeline</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
          12-month roadmap from brand foundation to national influence
        </p>
      </div>

      <div className="space-y-8">
        {[
          {
            phase: 'Phase 1: Foundation',
            timeframe: 'Months 1-2',
            color: 'bg-blue-500',
            tasks: [
              'Finalise brand assets with Indigenous artist',
              'Develop core content library',
              'Train internal team',
              'Soft launch with key partners'
            ]
          },
          {
            phase: 'Phase 2: Launch',
            timeframe: 'Months 3-4',
            color: 'bg-green-500',
            tasks: [
              'Public campaign launch',
              'Media blitz and partnership announcements',
              'Community roadshow',
              'Digital platform activation'
            ]
          },
          {
            phase: 'Phase 3: Amplification',
            timeframe: 'Months 5-6',
            color: 'bg-yellow-500',
            tasks: [
              'Scale success stories',
              'Expand partnership network',
              'Policy engagement',
              'National presence building'
            ]
          },
          {
            phase: 'Phase 4: Evolution',
            timeframe: 'Months 7-12',
            color: 'bg-purple-500',
            tasks: [
              'Refine based on learnings',
              'Develop new initiatives',
              'Explore international opportunities',
              'Drive systemic influence'
            ]
          }
        ].map((phase, index) => (
          <div key={index} className="relative">
            <div className="flex items-start">
              <div className={`w-4 h-4 ${phase.color} rounded-full mt-2 mr-6 flex-shrink-0`}></div>
              <div className="flex-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-900">{phase.phase}</h3>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {phase.timeframe}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {index < 3 && (
              <div className="w-px h-8 bg-gray-200 ml-2 mt-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Investment Framework */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">Investment Framework</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { category: 'Brand Development', amount: '$25K-30K', color: 'bg-blue-100 text-blue-800' },
            { category: 'Video Production', amount: '$40K-50K', color: 'bg-green-100 text-green-800' },
            { category: 'Digital Platform', amount: '$30K-40K', color: 'bg-yellow-100 text-yellow-800' },
            { category: 'Launch Campaign', amount: '$50K-60K', color: 'bg-purple-100 text-purple-800' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${item.color}`}>
                {item.category}
              </div>
              <div className="text-2xl font-light text-gray-900">{item.amount}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <div className="text-lg text-gray-600">Total Investment: <span className="font-medium text-gray-900">$145K-180K</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight">
              Brand & Communications
              <br />
              <span className="text-yellow-600">Strategy Guide</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light mb-12">
              Young Guns & Potential First Pathways
              <br />
              <em>Transforming Indigenous Employment Through Business Excellence</em>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => scrollToSection('architecture')}
                className="inline-flex items-center justify-center px-8 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Explore the Strategy
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="mr-2 h-4 w-4" />
                Download Guide
              </button>
            </div>

            {/* Key Metrics Preview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
                <div className="text-3xl font-light text-gray-900 mb-2">1,500+</div>
                <div className="text-sm text-gray-600">Indigenous employees</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
                <div className="text-3xl font-light text-gray-900 mb-2">300%</div>
                <div className="text-sm text-gray-600">productivity increase</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
                <div className="text-3xl font-light text-gray-900 mb-2">85%</div>
                <div className="text-sm text-gray-600">retention rate</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
                <div className="text-3xl font-light text-gray-900 mb-2">$4M</div>
                <div className="text-sm text-gray-600">annual partner savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-center">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {[
                { id: 'architecture', label: 'Brand Architecture', icon: Building2 },
                { id: 'visual', label: 'Visual Identity', icon: Palette },
                { id: 'campaigns', label: 'Campaign Concepts', icon: MessageSquare },
                { id: 'timeline', label: 'Implementation', icon: Calendar }
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                      activeSection === section.id 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div>
        <section id="section-architecture">
          <BrandArchitecture />
        </section>

        <section id="section-visual" className="bg-gray-50">
          <VisualIdentity />
        </section>

        <section id="section-campaigns">
          <CampaignConcepts />
        </section>

        <section id="section-timeline" className="bg-gray-50">
          <ImplementationTimeline />
        </section>
      </div>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-6">Ready to Transform the Narrative?</h2>
          <p className="text-xl font-light mb-12 opacity-90">
            From potential to purpose, from purpose to prosperity - the Custodian Economy is here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Implementation
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors">
              Schedule Workshop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandGuidePage;