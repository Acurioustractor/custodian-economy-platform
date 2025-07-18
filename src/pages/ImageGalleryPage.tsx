import React, { useState } from 'react';
import { FileText, Download, ExternalLink, BookOpen, Users, Building, Target, TrendingUp, Award, Calendar, Clock } from 'lucide-react';

const ResourceCenterPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const resourceCategories = {
    reports: [
      {
        title: 'Annual Impact Report 2024',
        description: 'Comprehensive overview of programme outcomes and financial impact',
        type: 'PDF Report',
        size: '2.4 MB',
        downloadUrl: '#',
        category: 'reports'
      },
      {
        title: 'Indigenous Youth Employment Study',
        description: 'Research findings on employment barriers and solutions',
        type: 'Research Paper',
        size: '1.8 MB',
        downloadUrl: '#',
        category: 'reports'
      },
      {
        title: 'Custodian Economy Model Whitepaper',
        description: 'Detailed explanation of the three-hub economic model',
        type: 'Technical Document',
        size: '3.1 MB',
        downloadUrl: '#',
        category: 'reports'
      }
    ],
    guides: [
      {
        title: 'Employer Partnership Guide',
        description: 'How businesses can engage with the Custodian Economy',
        type: 'Implementation Guide',
        size: '1.2 MB',
        downloadUrl: '#',
        category: 'guides'
      },
      {
        title: 'Community Engagement Toolkit',
        description: 'Resources for community organisations to get involved',
        type: 'Toolkit',
        size: '2.8 MB',
        downloadUrl: '#',
        category: 'guides'
      },
      {
        title: 'Mentorship Program Manual',
        description: 'Best practices for cultural mentorship and support',
        type: 'Training Manual',
        size: '1.9 MB',
        downloadUrl: '#',
        category: 'guides'
      }
    ],
    research: [
      {
        title: 'Social Return on Investment Analysis',
        description: 'Economic analysis of programme benefits vs costs',
        type: 'Financial Analysis',
        size: '876 KB',
        downloadUrl: '#',
        category: 'research'
      },
      {
        title: 'Longitudinal Outcomes Study',
        description: '5-year tracking of participant employment and housing stability',
        type: 'Academic Research',
        size: '2.1 MB',
        downloadUrl: '#',
        category: 'research'
      },
      {
        title: 'Cultural Healing and Employment',
        description: 'Research on the connection between cultural identity and job success',
        type: 'Cultural Study',
        size: '1.5 MB',
        downloadUrl: '#',
        category: 'research'
      }
    ]
  };

  const getAllResources = () => {
    return [...resourceCategories.reports, ...resourceCategories.guides, ...resourceCategories.research];
  };

  const getFilteredResources = () => {
    if (activeCategory === 'all') return getAllResources();
    if (activeCategory === 'reports') return resourceCategories.reports;
    if (activeCategory === 'guides') return resourceCategories.guides;
    if (activeCategory === 'research') return resourceCategories.research;
    return getAllResources();
  };

  const upcomingEvents = [
    {
      date: 'March 15, 2024',
      title: 'Employer Information Session',
      time: '2:00 PM - 4:00 PM',
      location: 'Brisbane Community Center',
      type: 'Workshop'
    },
    {
      date: 'March 22, 2024',
      title: 'Cultural Mentorship Training',
      time: '9:00 AM - 5:00 PM',
      location: 'Young Guns Training Facility',
      type: 'Training'
    },
    {
      date: 'April 5, 2024',
      title: 'Community Advisory Meeting',
      time: '6:00 PM - 8:00 PM',
      location: 'Online via Zoom',
      type: 'Meeting'
    }
  ];

  const keyMetrics = [
    { label: 'Active Employer Partners', value: '45+', icon: <Building className="w-6 h-6" /> },
    { label: 'Community Mentors', value: '120+', icon: <Users className="w-6 h-6" /> },
    { label: 'Training Programs', value: '8', icon: <Target className="w-6 h-6" /> },
    { label: 'Success Rate', value: '85%', icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Resource Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access research, guides, and resources to understand and implement the Custodian Economy model
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  {metric.icon}
                </div>
                <div className="text-2xl font-light text-gray-900">{metric.value}</div>
              </div>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Resource Categories */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Resources', icon: <FileText size={18} /> },
                  { id: 'reports', label: 'Reports', icon: <BookOpen size={18} /> },
                  { id: 'guides', label: 'Guides', icon: <Target size={18} /> },
                  { id: 'research', label: 'Research', icon: <TrendingUp size={18} /> }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {getFilteredResources().map((resource, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{resource.size}</span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <ExternalLink size={14} />
                      View
                    </button>
                    <button className="flex items-center gap-1 text-sm bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-gray-400" />
              Upcoming Events
            </h2>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">
              Get Involved
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Employers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Partner with us to access trained, motivated workers while creating positive social impact.
                </p>
                <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors">
                  Partnership Inquiry
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Researchers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Access our data and collaborate on studies of Indigenous employment and social outcomes.
                </p>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors">
                  Research Collaboration
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Communities</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn how to implement the Custodian Economy model in your community.
                </p>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors">
                  Community Guide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-12 text-center text-white">
          <h3 className="text-2xl font-light mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to receive the latest research, resources, and updates from the Custodian Economy initiative.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-900"
            />
            <button className="bg-white text-gray-900 px-6 py-2 rounded hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceCenterPage;