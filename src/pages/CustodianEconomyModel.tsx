import { useState } from 'react';
import { Users, Building2, TrendingUp, Quote, Home, Sparkles, Briefcase, ArrowRight } from 'lucide-react';
import { YouTubeEmbed, EMBEDDED_VIDEOS } from '../components/MediaIntegration';
import { PlaceholderImage, MEDIA_ASSETS } from '../components/MediaAssets';

const CustodianEconomyModel = () => {
  const [activeSection, setActiveSection] = useState('journey');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Small delay to ensure state update, then smooth scroll
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight">
              The Custodian Economy
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
              A proven model that transforms lives by prioritizing stability before employment
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-12 mb-12">
              <div className="flex-1">
                <Quote className="text-gray-300 mb-6" size={40} />
                <blockquote className="text-2xl lg:text-3xl font-light text-gray-900 mb-6 leading-relaxed">
                  "The barometer of protection is there all the time. Who are you? What do you want? How can I trust you?"
                </blockquote>
                <p className="text-gray-500 font-light">— Keiron Lander, Founder</p>
              </div>
              <div className="w-full md:w-96">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <YouTubeEmbed 
                    embedCode={EMBEDDED_VIDEOS.keironTestimonial.embedCode}
                    title={EMBEDDED_VIDEOS.keironTestimonial.title}
                  />
                </div>
              </div>
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
                { id: 'journey', label: 'The Journey', description: 'From crisis to transformation' },
                { id: 'model', label: 'The Model', description: '3-hub system explained' },
                { id: 'impact', label: 'Proven Results', description: 'Real outcomes & ROI' }
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
        
        {/* Journey Section */}
        <section id="section-journey" className="py-20">
          <JourneySection />
        </section>

        {/* Model Section */}
        <section id="section-model" className="py-20 bg-gray-50">
          <ModelSection />
        </section>

        {/* Impact Section */}
        <section id="section-impact" className="py-20">
          <ImpactSection />
        </section>
      </div>
    </div>
  );
};

const JourneySection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      
      {/* The Crisis */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8 text-center">The Challenge We Face</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-light text-gray-900 mb-2">67%</div>
            <p className="text-gray-600 font-light">of detained youth in Queensland are Indigenous</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-light text-gray-900 mb-2">43%</div>
            <p className="text-gray-600 font-light">of children in out-of-home care are Indigenous</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-light text-gray-900 mb-2">$1.1M</div>
            <p className="text-gray-600 font-light">annual cost per youth in detention</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-2xl">
          <Quote className="text-gray-300 mb-4" size={32} />
          <blockquote className="text-xl text-gray-700 mb-6 font-light leading-relaxed">
            "Young people are cycling through systems that aren't designed for them. We need to break this pattern by addressing the root causes, not just the symptoms."
          </blockquote>
          <p className="text-gray-500 font-light">— Community Response to Crisis</p>
        </div>
      </div>

      {/* The Journey */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-16 text-center">From Crisis to Transformation</h2>
        
        <div className="space-y-20">
          
          {/* Starting Point */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-gray-300 text-6xl font-light mb-6">01</div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">Crisis Point</h3>
              
              <div className="space-y-6 text-gray-700 font-light text-lg">
                <p>Young people arrive at our doors facing multiple complex challenges:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                    <span>Justice system involvement and cycling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                    <span>Unstable housing situations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                    <span>Limited access to essential services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                    <span>Disconnection from culture and community</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-200">
                <p className="text-blue-800 font-light italic">
                  "When someone is choosing between food and transport, employment training isn't the priority. Survival is."
                </p>
              </div>
            </div>
            
            <div>
              <PlaceholderImage 
                src={MEDIA_ASSETS.community.group}
                alt="Young people in crisis"
                className="w-full h-96 rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Stabilization */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <PlaceholderImage 
                src={MEDIA_ASSETS.community.mentoring}
                alt="Community mentoring and support"
                className="w-full h-96 rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="text-gray-300 text-6xl font-light mb-6">02</div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">Stabilization First</h3>
              
              <div className="space-y-8">
                <div className="border-l-4 border-gray-200 pl-6">
                  <h4 className="text-xl font-medium text-gray-900 mb-3">Cultural Connection</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Building trust through Indigenous mentors who understand the journey and can provide culturally appropriate support.
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-200 pl-6">
                  <h4 className="text-xl font-medium text-gray-900 mb-3">Basic Needs First</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    Ensuring access to safe accommodation, food security, transport, ID documentation, and banking services.
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-200 pl-6">
                  <h4 className="text-xl font-medium text-gray-900 mb-3">Skills Development</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    6-week intensive programme combining practical skills training with real work experience and mentorship.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-200">
                <p className="text-green-800 font-light italic">
                  "We don't want to create good workers. We want to create good men and women who can contribute to their community."
                </p>
                <p className="text-green-600 text-sm mt-2">— Program Supervisor</p>
              </div>
            </div>
          </div>

          {/* Transformation */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-gray-300 text-6xl font-light mb-6">03</div>
              <h3 className="text-3xl font-light text-gray-900 mb-6">Sustainable Future</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-6">What Success Looks Like</h4>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Briefcase className="mr-4 w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Stable Employment</h5>
                      <p className="text-gray-600 font-light text-sm">Career pathways with real growth potential and ongoing support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Home className="mr-4 w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Secure Housing</h5>
                      <p className="text-gray-600 font-light text-sm">Stability and strong community connections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="mr-4 w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Strong Families</h5>
                      <p className="text-gray-600 font-light text-sm">Relationships restored and rebuilt through stability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Sparkles className="mr-4 w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Community Leaders</h5>
                      <p className="text-gray-600 font-light text-sm">Giving back and mentoring the next generation</p>
                    </div>
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
            
            <div className="p-8 bg-gray-50 rounded-2xl text-center">
              <Quote className="text-gray-300 mb-4 mx-auto" size={32} />
              <blockquote className="text-xl text-gray-700 mb-4 font-light leading-relaxed">
                "Since I've been here, it's been going good. I've become more reliable, more motivated, more positive."
              </blockquote>
              <p className="text-gray-500 font-light">— Program Participant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModelSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">The Three-Hub System</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">
          A new economic model where Indigenous businesses and organisations come together 
          to resource our greatest challenges and opportunities.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-300 text-4xl font-light mb-6">01</div>
          <h3 className="text-2xl font-light text-gray-900 mb-4">Community Hub</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">Building trust and cultural identity through Indigenous mentors who understand</p>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-900 font-semibold block mb-1">Who:</span> 
              <span className="text-gray-700">Young people, families, community services</span>
            </div>
            <div>
              <span className="text-gray-900 font-semibold block mb-1">Focus:</span> 
              <span className="text-gray-700">Cultural healing, mentorship, support networks</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-2xl font-light text-gray-900">400+</span>
              <span className="text-gray-600 text-sm ml-2">lives transformed</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-300 text-4xl font-light mb-6">02</div>
          <h3 className="text-2xl font-light text-gray-900 mb-4">Pathways Hub</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">Training and certification programmes with real work experience</p>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-900 font-semibold block mb-1">What:</span> 
              <span className="text-gray-700">6-week intensive programme</span>
            </div>
            <div>
              <span className="text-gray-900 font-semibold block mb-1">How:</span> 
              <span className="text-gray-700">Learn by doing, wraparound support</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-2xl font-light text-gray-900">92%</span>
              <span className="text-gray-600 text-sm ml-2">completion rate</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-300 text-4xl font-light mb-6">03</div>
          <h3 className="text-2xl font-light text-gray-900 mb-4">Business Hub</h3>
          <p className="text-gray-600 font-light mb-6 leading-relaxed">Employment and economic opportunity with ongoing mentorship</p>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-900 font-semibold block mb-1">Partners:</span> 
              <span className="text-gray-700">Young Guns, Kmart, others</span>
            </div>
            <div>
              <span className="text-gray-900 font-semibold block mb-1">Jobs:</span> 
              <span className="text-gray-700">Low barrier, real contribution</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-2xl font-light text-gray-900">85%</span>
              <span className="text-gray-600 text-sm ml-2">retention rate</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-3xl font-light text-gray-900 mb-8 text-center">The Journey</h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-light text-gray-400 mb-2">01</div>
              <p className="text-gray-600 font-light">Youth in crisis</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-8"></div>
            <div className="text-center">
              <div className="text-2xl font-light text-gray-400 mb-2">02</div>
              <p className="text-gray-600 font-light">Stabilization</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-8"></div>
            <div className="text-center">
              <div className="text-2xl font-light text-gray-400 mb-2">03</div>
              <p className="text-gray-600 font-light">Employment & Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Programme Overview Video */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-4">See the Model in Action</h2>
          <p className="text-lg text-gray-600 font-light">
            Watch how the three-hub system creates pathways from crisis to meaningful employment
          </p>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-16">
          <YouTubeEmbed 
            embedCode={EMBEDDED_VIDEOS.programOverview.embedCode}
            title={EMBEDDED_VIDEOS.programOverview.title}
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">Creating a Self-Sustaining Future</h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-lg text-gray-700 font-light mb-6 leading-relaxed">
              Drawing inspiration from the transformation of Indigenous healthcare, we're building 
              an economic model where Indigenous businesses and organisations come together to 
              resource our greatest challenges and opportunities.
            </p>
            
            <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-200">
              <p className="text-blue-800 font-light italic leading-relaxed">
                "We gotta create a new system... The health sector in Australia has been the greatest 
                change in primary healthcare to our people in 200 years. And it's only 50 years old 
                because our people came together collaboratively to make the change."
              </p>
              <p className="text-blue-600 text-sm mt-2">— Keiron Lander</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-gray-200 pl-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">National Expansion</h4>
              <p className="text-gray-600 font-light">400-500 young people over 3 years, with potential to double</p>
            </div>
            
            <div className="border-l-4 border-gray-200 pl-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Economic Independence</h4>
              <p className="text-gray-600 font-light">Creating businesses that reinvest in community transformation</p>
            </div>
            
            <div className="border-l-4 border-gray-200 pl-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Generational Change</h4>
              <p className="text-gray-600 font-light">Breaking cycles through employment, housing, and family stability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImpactSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-20">
      
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">Proven Results</h2>
        <p className="text-xl text-gray-600 font-light leading-relaxed">The Custodian Economy delivers measurable outcomes that transform lives and communities</p>
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
      
      {/* Before & After Comparison */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-light text-gray-900 mb-12 text-center">The Transformation</h3>
        
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
      
      {/* Call to Action */}
      <div className="bg-gray-900 rounded-2xl p-12 text-white text-center">
        <h3 className="text-3xl font-light mb-6">Be Part of the Solution</h3>
        <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
          The Custodian Economy needs partners who believe transformation is possible and profitable.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <Building2 className="mx-auto mb-4 w-8 h-8 text-gray-300" />
            <h4 className="text-lg font-light mb-2">Employers</h4>
            <p className="text-gray-300 text-sm">Hire dedicated, trained workers</p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="mx-auto mb-4 w-8 h-8 text-gray-300" />
            <h4 className="text-lg font-light mb-2">Investors</h4>
            <p className="text-gray-300 text-sm">Fund proven social impact</p>
          </div>
          
          <div className="text-center">
            <Users className="mx-auto mb-4 w-8 h-8 text-gray-300" />
            <h4 className="text-lg font-light mb-2">Communities</h4>
            <p className="text-gray-300 text-sm">Support local transformation</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
            Learn How to Partner
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustodianEconomyModel;