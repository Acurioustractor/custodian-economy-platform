import React, { useState } from 'react';
import { Users, Building2, TrendingUp } from 'lucide-react';
import { YouTubeEmbed, EMBEDDED_VIDEOS } from '../components/MediaIntegration';

const CustodianEconomyImpact: React.FC = () => {
  const [activeSection, setActiveSection] = useState('impact');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const ImpactMetricsSection = () => (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Proven Results</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">
          The Custodian Economy delivers measurable outcomes that transform lives and communities
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-8">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-4xl font-light text-gray-900 mb-2">92%</div>
          <div className="text-lg font-light text-gray-700 mb-2">Completion Rate</div>
          <p className="text-sm text-gray-500">6-week programme completion</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-4xl font-light text-gray-900 mb-2">85%</div>
          <div className="text-lg font-light text-gray-700 mb-2">Still Employed</div>
          <p className="text-sm text-gray-500">After 12 months</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-4xl font-light text-gray-900 mb-2">$1.1M</div>
          <div className="text-lg font-light text-gray-700 mb-2">Annual Savings</div>
          <p className="text-sm text-gray-500">vs. incarceration costs</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-4xl font-light text-gray-900 mb-2">400+</div>
          <div className="text-lg font-light text-gray-700 mb-2">Lives Changed</div>
          <p className="text-sm text-gray-500">And counting</p>
        </div>
      </div>
    </div>
  );

  const StoriesSection = () => (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Real Stories, Real Change</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">
          These aren't feel-good case studies. These are real transformations with measurable outcomes.
        </p>
      </div>

      {/* Video Story */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-3xl font-light text-gray-900 mb-6">From Crisis to Contribution</h3>
          <div className="space-y-6 text-gray-700 font-light text-lg">
            <p>
              Young people arrive facing multiple complex challenges: justice system involvement, 
              unstable housing, limited access to services, and disconnection from culture and community.
            </p>
            <p>
              Through the three-hub system, they find stability, develop skills, and build meaningful 
              careers that transform not just their own lives, but their families and communities.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-light text-gray-900 mb-1">6 weeks</div>
              <div className="text-sm text-gray-600">to life transformation</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-light text-gray-900 mb-1">Long-term</div>
              <div className="text-sm text-gray-600">sustainable support</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <YouTubeEmbed 
              embedCode={EMBEDDED_VIDEOS.adenStory.embedCode}
              title={EMBEDDED_VIDEOS.adenStory.title}
            />
          </div>
        </div>
      </div>

      {/* Additional Story - Troy */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 p-8 rounded-2xl">
          <h3 className="text-2xl font-light text-gray-900 mb-6 text-center">Troy's Transformation</h3>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <YouTubeEmbed 
                  embedCode={EMBEDDED_VIDEOS.troyStory.embedCode}
                  title={EMBEDDED_VIDEOS.troyStory.title}
                />
              </div>
            </div>
            <div>
              <blockquote className="text-lg text-gray-700 font-light leading-relaxed italic mb-4">
                "Two years later, I'm not just employed - I'm a mentor for the next generation coming through the programme."
              </blockquote>
              <p className="text-gray-600 font-light">
                Troy's journey shows the long-term impact of the Custodian Economy. From initial stabilisation to becoming 
                a community leader, his story demonstrates how sustainable support creates lasting transformation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EconomicImpactSection = () => (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Economic Impact</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">
          This isn't charity—it's smart investment. Every dollar invested returns significant social and economic value.
        </p>
      </div>

      {/* Cost Comparison */}
      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Cost of Doing Nothing</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Youth detention (annual)</span>
                <span className="text-xl font-light text-gray-900">$1.1M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Welfare dependency (lifetime)</span>
                <span className="text-xl font-light text-gray-900">$2.3M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Intergenerational impact</span>
                <span className="text-xl font-light text-gray-900">Immeasurable</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-2xl text-white">
            <h3 className="text-lg font-medium mb-3">Custodian Economy Investment</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Program cost (per participant)</span>
                <span className="text-xl font-light">$15K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Social value return</span>
                <span className="text-xl font-light text-green-400">$73</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Annual ROI</span>
                <span className="text-xl font-light text-green-400">7,300%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transformation Outcomes */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-light text-gray-900 mb-12 text-center">Before & After</h3>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-xl font-light text-red-600 mb-6 text-center">Without Support</h4>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">67% of detained youth are Indigenous</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Cycling through justice system</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Homelessness and instability</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Generational trauma continues</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xl font-light text-green-600 mb-6 text-center">With Custodian Economy</h4>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Stable employment and housing</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Strong family relationships</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Community leadership roles</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                <span className="font-light">Breaking cycles for next generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PartnershipSection = () => (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Partnership Opportunities</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">
          The Custodian Economy needs partners who believe transformation is both possible and profitable.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">Employers</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">
            Access trained, motivated workers while creating meaningful social impact in your community.
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Dedicated, trained workforce
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Ongoing support programmes
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Community impact reporting
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">Investors</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">
            Fund proven social impact with measurable returns and sustainable outcomes.
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
              7,300% annual ROI
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
              Measurable social returns
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
              Scalable impact model
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-4">Communities</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">
            Implement the three-hub model in your local area with our guidance and support.
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
              Proven implementation model
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
              Training and support
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></span>
              Local transformation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight">
              Measuring Real Impact
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
              Data-driven results that prove transformation is not only possible, but profitable and sustainable.
            </p>
          </div>
          
          {/* Key Stats Preview */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-gray-900 mb-2">92%</div>
              <div className="text-sm text-gray-600">completion rate</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-gray-900 mb-2">85%</div>
              <div className="text-sm text-gray-600">still employed</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-gray-900 mb-2">$1.1M</div>
              <div className="text-sm text-gray-600">annual savings</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-light text-gray-900 mb-2">400+</div>
              <div className="text-sm text-gray-600">lives transformed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-20 bg-white border-b border-gray-100 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-center">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
              {[
                { id: 'impact', label: 'Impact Metrics', description: 'Key performance data' },
                { id: 'stories', label: 'Real Stories', description: 'Transformation in action' },
                { id: 'economics', label: 'Economic Case', description: 'ROI and social value' },
                { id: 'partnership', label: 'Get Involved', description: 'How to partner' }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-8 py-4 rounded-lg transition-all text-center ${
                    activeSection === section.id 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <div className="font-medium">{section.label}</div>
                  <div className="text-xs opacity-75 mt-1">{section.description}</div>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="pb-20">
        
        {/* Impact Section */}
        <section id="section-impact" className="py-20">
          <ImpactMetricsSection />
        </section>

        {/* Stories Section */}
        <section id="section-stories" className="py-20 bg-gray-50">
          <StoriesSection />
        </section>

        {/* Economics Section */}
        <section id="section-economics" className="py-20">
          <EconomicImpactSection />
        </section>

        {/* Partnership Section */}
        <section id="section-partnership" className="py-20 bg-gray-50">
          <PartnershipSection />
        </section>
      </div>
    </div>
  );
};

export default CustodianEconomyImpact;