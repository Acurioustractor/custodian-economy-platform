import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Target, TrendingUp, Award, Heart, Shield, 
  Building, Briefcase, GraduationCap, MapPin, ChevronRight,
  ArrowRight, CircleDot, Zap, Globe, HandshakeIcon
} from 'lucide-react';
import { BRAND_COLORS } from './BrandedCharts';

// 1. Journey Flow Diagram - Shows the transformation pathway
export const JourneyFlowDiagram: React.FC = () => {
  const stages = [
    { 
      icon: <Users className="w-6 h-6" />, 
      title: 'Connection', 
      description: 'Building trust & relationships',
      color: BRAND_COLORS.primary.brown 
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Safety', 
      description: 'Creating stable environment',
      color: BRAND_COLORS.secondary.orange 
    },
    { 
      icon: <GraduationCap className="w-6 h-6" />, 
      title: 'Learning', 
      description: 'Developing skills & knowledge',
      color: BRAND_COLORS.primary.blue 
    },
    { 
      icon: <Briefcase className="w-6 h-6" />, 
      title: 'Contributing', 
      description: 'Employment & giving back',
      color: BRAND_COLORS.primary.gold 
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-brand-primary mb-8">Potential First Pathways Journey</h3>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center relative"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-lg"
              style={{ backgroundColor: stage.color }}
            >
              {stage.icon}
            </div>
            <h4 className="font-bold text-lg mb-1">{stage.title}</h4>
            <p className="text-sm text-gray-600 text-center max-w-[150px]">{stage.description}</p>
            {index < stages.length - 1 && (
              <ChevronRight className="absolute right-[-30px] top-8 text-gray-400 hidden md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 2. Impact Metrics Infographic
export const ImpactMetricsInfographic: React.FC<{ metrics?: any }> = ({ metrics }) => {
  const defaultMetrics = [
    { value: '85%', label: 'Employment Retention', icon: <Target className="w-8 h-8" /> },
    { value: '3-4x', label: 'Productivity Gain', icon: <TrendingUp className="w-8 h-8" /> },
    { value: '1,500+', label: 'Lives Transformed', icon: <Heart className="w-8 h-8" /> },
    { value: '$3-4M', label: 'Annual Savings', icon: <Award className="w-8 h-8" /> },
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl shadow-lg p-8 text-white">
      <h3 className="text-2xl font-bold mb-8">Impact at a Glance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayMetrics.map((metric: any, index: number) => (
          <motion.div
            key={metric.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            className="text-center"
          >
            <div className="flex justify-center mb-3 opacity-80">
              {metric.icon}
            </div>
            <div className="text-3xl font-bold mb-2">{metric.value}</div>
            <div className="text-sm opacity-90">{metric.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 3. Ecosystem Map Diagram
export const EcosystemMapDiagram: React.FC = () => {
  const ecosystem = {
    center: { name: 'Custodian Economy', icon: <Globe className="w-8 h-8" /> },
    nodes: [
      { name: 'Indigenous Youth', icon: <Users />, position: 'top-left' },
      { name: 'Partner Businesses', icon: <Building />, position: 'top-right' },
      { name: 'Communities', icon: <MapPin />, position: 'bottom-left' },
      { name: 'Government', icon: <Shield />, position: 'bottom-right' },
      { name: 'Mentors & Elders', icon: <Heart />, position: 'top' },
      { name: 'Training Providers', icon: <GraduationCap />, position: 'bottom' },
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-brand-primary mb-8 text-center">Custodian Economy Ecosystem</h3>
      <div className="relative h-[400px] flex items-center justify-center">
        {/* Center Hub */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute z-10 bg-brand-primary text-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-xl"
        >
          {ecosystem.center.icon}
          <span className="text-xs font-bold mt-2 text-center">{ecosystem.center.name}</span>
        </motion.div>
        
        {/* Surrounding Nodes */}
        {ecosystem.nodes.map((node, index) => {
          const positions: any = {
            'top-left': { top: '20px', left: '20px' },
            'top-right': { top: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'top': { top: '0px', left: '50%', transform: 'translateX(-50%)' },
            'bottom': { bottom: '0px', left: '50%', transform: 'translateX(-50%)' },
          };
          
          return (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              className="absolute bg-white border-2 border-brand-secondary rounded-lg p-4 shadow-lg"
              style={positions[node.position]}
            >
              <div className="flex items-center space-x-2">
                <div className="text-brand-secondary">{node.icon}</div>
                <span className="text-sm font-semibold">{node.name}</span>
              </div>
            </motion.div>
          );
        })}
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {ecosystem.nodes.map((_, index) => (
            <motion.line
              key={index}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              x1="50%"
              y1="50%"
              x2={`${20 + (index * 15)}%`}
              y2={`${20 + (index * 15)}%`}
              stroke={BRAND_COLORS.earth.sand}
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

// 4. Comparison Infographic
export const ComparisonInfographic: React.FC = () => {
  const comparisons = [
    { metric: 'Cost per year', traditional: '$110,000', custodian: '$25,000', better: 'custodian' },
    { metric: 'Success rate', traditional: '25%', custodian: '85%', better: 'custodian' },
    { metric: 'Absenteeism', traditional: '25%', custodian: '3%', better: 'custodian' },
    { metric: 'ROI', traditional: '0.5x', custodian: '4.5x', better: 'custodian' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-brand-primary mb-8">Traditional vs Custodian Economy Model</h3>
      <div className="space-y-6">
        {comparisons.map((item, index) => (
          <motion.div
            key={item.metric}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="grid grid-cols-4 gap-4 items-center"
          >
            <div className="font-semibold text-gray-700">{item.metric}</div>
            <div className={`text-center p-3 rounded-lg ${
              item.better === 'traditional' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.traditional}
              <div className="text-xs mt-1">Traditional</div>
            </div>
            <div className="text-center">
              <ArrowRight className="w-6 h-6 mx-auto text-brand-secondary" />
            </div>
            <div className={`text-center p-3 rounded-lg ${
              item.better === 'custodian' ? 'bg-green-100 text-green-800 font-bold' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.custodian}
              <div className="text-xs mt-1">Custodian</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 5. Success Story Timeline
export const SuccessStoryTimeline: React.FC<{ stories?: any[] }> = ({ stories }) => {
  const defaultStories = [
    { date: 'Day 1', event: 'First contact', description: 'Meeting with program coordinator' },
    { date: 'Week 2', event: 'Assessment', description: 'Skills and support needs identified' },
    { date: 'Month 1', event: 'Pre-employment', description: 'Training and preparation begins' },
    { date: 'Month 3', event: 'First job', description: 'Started with partner employer' },
    { date: 'Month 6', event: 'Stable', description: 'Consistent attendance and performance' },
    { date: 'Year 1', event: 'Leader', description: 'Mentoring new participants' },
  ];

  const displayStories = stories || defaultStories;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-brand-primary mb-8">Transformation Timeline</h3>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary to-brand-secondary"></div>
        
        {/* Timeline Events */}
        <div className="space-y-8">
          {displayStories.map((story, index) => (
            <motion.div
              key={story.date}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start space-x-4"
            >
              <div className="relative">
                <div className="w-4 h-4 bg-brand-secondary rounded-full border-4 border-white shadow"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-sm font-bold text-brand-secondary">{story.date}</span>
                  <span className="font-bold text-gray-800">{story.event}</span>
                </div>
                <p className="text-gray-600">{story.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Program Structure Diagram
export const ProgramStructureDiagram: React.FC = () => {
  const structure = {
    phases: [
      {
        name: 'Pre-Employment',
        duration: '8-12 weeks',
        activities: ['Assessment', 'Training', 'Work Readiness', 'Cultural Connection'],
        color: BRAND_COLORS.primary.blue,
      },
      {
        name: 'Transition',
        duration: '4 weeks',
        activities: ['Job Placement', 'Onboarding', 'Buddy System', 'First Day Support'],
        color: BRAND_COLORS.secondary.orange,
      },
      {
        name: 'Employment',
        duration: 'Ongoing',
        activities: ['Regular Work', 'Mentoring', 'Skills Development', 'Career Growth'],
        color: BRAND_COLORS.primary.gold,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-brand-primary mb-8">Program Structure</h3>
      <div className="space-y-6">
        {structure.phases.map((phase, index) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <div 
              className="p-6 rounded-lg border-2"
              style={{ borderColor: phase.color, backgroundColor: `${phase.color}10` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold" style={{ color: phase.color }}>
                  {phase.name}
                </h4>
                <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full">
                  {phase.duration}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {phase.activities.map((activity) => (
                  <div 
                    key={activity}
                    className="bg-white rounded-lg px-3 py-2 text-sm text-center shadow-sm"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
            {index < structure.phases.length - 1 && (
              <div className="flex justify-center my-2">
                <ChevronRight className="text-gray-400 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Export all diagram types
export const BrandedDiagrams = {
  JourneyFlow: JourneyFlowDiagram,
  ImpactMetrics: ImpactMetricsInfographic,
  EcosystemMap: EcosystemMapDiagram,
  Comparison: ComparisonInfographic,
  SuccessTimeline: SuccessStoryTimeline,
  ProgramStructure: ProgramStructureDiagram,
};

export default BrandedDiagrams;
