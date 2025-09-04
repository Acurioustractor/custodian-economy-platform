import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Building2, Quote, ChevronRight } from 'lucide-react';
import { YouTubeEmbed, EMBEDDED_VIDEOS } from '../components/MediaIntegration';
import { PlaceholderImage, MEDIA_ASSETS } from '../components/MediaAssets';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-screen">
          <PlaceholderImage 
            src={MEDIA_ASSETS.community.group}
            alt="Young people working together in the Custodian Economy"
            className="w-full h-full object-cover"
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
            
            {/* Hero Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-4xl mx-auto px-6">
                <h1 className="text-5xl lg:text-7xl font-light text-white mb-8 leading-tight drop-shadow-lg">
                  The Custodian 
                  <br />
                  Economy
                </h1>
                <p className="text-xl lg:text-2xl text-white mb-12 leading-relaxed font-light max-w-3xl mx-auto drop-shadow-md">
                  A proven model that transforms lives by prioritizing stability before employment. 
                  Not charity. Not a programme. A sustainable economic system.
                </p>
                
                {/* Key Stats - Enhanced */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-12 text-center">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                    <div className="text-2xl sm:text-3xl font-light text-white drop-shadow-md">85%</div>
                    <div className="text-xs sm:text-sm text-gray-200">retention rate</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white bg-opacity-30"></div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                    <div className="text-2xl sm:text-3xl font-light text-white drop-shadow-md">$1.1M</div>
                    <div className="text-xs sm:text-sm text-gray-200">saved annually</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white bg-opacity-30"></div>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                    <div className="text-2xl sm:text-3xl font-light text-white drop-shadow-md">400+</div>
                    <div className="text-xs sm:text-sm text-gray-200">lives transformed</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/impact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    See the Impact
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  
                  <Link
                    to="/model"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors backdrop-blur-sm"
                  >
                    Learn the Model
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Quote Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="h-8 w-8 text-gray-300 mx-auto mb-6" />
          <blockquote className="text-2xl lg:text-3xl font-light text-gray-900 mb-8 leading-relaxed">
            "The barometer of protection is there all the time. Who are you? 
            What do you want? How can I trust you?"
          </blockquote>
          <div className="text-gray-500">— Keiron Lander, Founder</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Three interconnected hubs that create sustainable pathways from crisis to meaningful employment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-gray-300 text-5xl font-light mb-4">01</div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Community Hub</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Building trust and cultural connection through Indigenous mentors who understand the journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-gray-300 text-5xl font-light mb-4">02</div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Pathways Hub</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                6-week intensive training with real work experience and visible contribution to community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-gray-300 text-5xl font-light mb-4">03</div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Business Hub</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Meaningful employment with ongoing mentorship, creating sustainable career pathways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team at Work - Photo Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">In Action</h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              See the Custodian Economy in action—real people, real work, real transformation happening every day.
            </p>
          </div>
          
          {/* Main Featured Photo */}
          <div className="mb-16">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
              <PlaceholderImage 
                src={MEDIA_ASSETS.program.training}
                alt="Team training and development session"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                <h3 className="text-2xl font-light text-white mb-2">Skills Development in Action</h3>
                <p className="text-gray-200 font-light">6-week intensive training with real work experience and mentorship</p>
              </div>
            </div>
          </div>
          
          {/* Photo Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <PlaceholderImage 
                  src={MEDIA_ASSETS.aden.working}
                  alt="Young person at work"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-1">On the Job</h4>
                <p className="text-gray-600 font-light text-sm">Real employment with ongoing support and mentorship</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <PlaceholderImage 
                  src={MEDIA_ASSETS.community.mentoring}
                  alt="Community mentoring session"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-1">Cultural Connection</h4>
                <p className="text-gray-600 font-light text-sm">Building trust through Indigenous mentors who understand</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <PlaceholderImage 
                  src={MEDIA_ASSETS.troy.portrait}
                  alt="Program graduate"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-1">Success Stories</h4>
                <p className="text-gray-600 font-light text-sm">From crisis to stability—real transformations with lasting impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video & Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Real Stories, Real Change
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
                Meet the young people whose lives have been transformed through the Custodian Economy. 
                These aren't feel-good case studies—these are real transformations with measurable outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-light">Stable employment and housing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-light">Rebuilt family relationships</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-light">Community leadership roles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-light">Breaking generational cycles</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <YouTubeEmbed 
                  embedCode={EMBEDDED_VIDEOS.keironTestimonial.embedCode}
                  title={EMBEDDED_VIDEOS.keironTestimonial.title}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                The Economic Case
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
                This isn't charity—it's smart investment. Every dollar invested in the Custodian Economy 
                returns significant social and economic value through reduced incarceration costs and 
                increased workforce participation.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-light text-gray-900 mb-1">$73</div>
                  <div className="text-sm text-gray-600">social value return</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-light text-gray-900 mb-1">92%</div>
                  <div className="text-sm text-gray-600">completion rate</div>
                </div>
              </div>
              
              <Link
                to="/impact"
                className="inline-flex items-center text-gray-900 font-medium hover:text-gray-600 transition-colors"
              >
                Explore the full impact analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
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
                </div>
              </div>
              
              <div className="bg-gray-900 p-8 rounded-2xl text-white">
                <h3 className="text-lg font-medium mb-3">Custodian Economy Investment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Program cost (per participant)</span>
                    <span className="text-xl font-light">$15K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Annual ROI</span>
                    <span className="text-xl font-light text-green-400">7,300%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Team Photos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Behind the Transformation</h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              The people and moments that make the Custodian Economy a living, breathing system of change.
            </p>
          </div>
          
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left side - Larger photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                <PlaceholderImage 
                  src={MEDIA_ASSETS.keiron.portrait}
                  alt="Keiron Lander, founder and mentor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <h3 className="text-2xl font-light text-white mb-2">Leadership Through Experience</h3>
                <p className="text-gray-200 font-light">Mentors who understand the journey because they've walked it themselves</p>
              </div>
            </div>
            
            {/* Right side - Stacked photos */}
            <div className="space-y-8">
              <div className="relative">
                <div className="aspect-[5/3] rounded-2xl overflow-hidden shadow-lg">
                  <PlaceholderImage 
                    src={MEDIA_ASSETS.aden.portrait}
                    alt="Program participants collaborating"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h4 className="text-lg font-light text-white mb-1">Building Community</h4>
                  <p className="text-gray-200 text-sm font-light">Connection and support that goes beyond the workplace</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[5/3] rounded-2xl overflow-hidden shadow-lg">
                  <PlaceholderImage 
                    src={MEDIA_ASSETS.community.group}
                    alt="Team celebration and achievement"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h4 className="text-lg font-light text-white mb-1">Celebrating Success</h4>
                  <p className="text-gray-200 text-sm font-light">Every milestone matters in the journey to transformation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">
            Ready to Be Part of the Solution?
          </h2>
          <p className="text-xl text-gray-600 font-light mb-12 leading-relaxed">
            The Custodian Economy needs partners who believe transformation is both possible and profitable.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">For Employers</h3>
              <p className="text-gray-600 text-sm mb-4">Access trained, motivated workers while creating social impact</p>
              <Link to="/resources" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                Learn more →
              </Link>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">For Investors</h3>
              <p className="text-gray-600 text-sm mb-4">Fund proven social impact with measurable returns</p>
              <Link to="/impact" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                See the data →
              </Link>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">For Communities</h3>
              <p className="text-gray-600 text-sm mb-4">Implement the model in your local area</p>
              <Link to="/model" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                Get started →
              </Link>
            </div>
          </div>
          
          <Link
            to="/impact"
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Explore the Impact
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};