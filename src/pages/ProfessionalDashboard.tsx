import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfessionalCharts } from '@/components/Brand/ProfessionalCharts';
import { CustodianPathwaysCharts, CP_COLORS } from '@/components/Brand/CustodianPathwaysCharts';
import { 
  BarChart3, TrendingUp, DollarSign, Network,
  Target, Activity, Layers, LayoutGrid, Info
} from 'lucide-react';

const ProfessionalDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Executive Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial Analysis', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact Metrics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'flow', label: 'Resource Flow', icon: <Network className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A6B57] via-[#4A6B57] to-[#C46A2E] opacity-90" />
        <div className="relative z-10 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold tracking-tight">
                Custodian Pathways
              </h1>
              <p className="text-2xl font-light italic opacity-90">
                Professional Analytics Dashboard
              </p>
              
              {/* Key Metrics Bar */}
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ProfessionalCharts.ProgressRings />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-20 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all border-b-2 ${
                  activeSection === section.id
                    ? 'border-[#4A6B57] text-[#4A6B57] bg-[#4A6B57]/5'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Executive Overview */}
        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Hero Statement */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-[#4A6B57]">
              <h2 className="text-3xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                Executive Summary
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                Custodian Pathways delivers <span className="font-bold text-[#4A6B57]">4.5x social ROI</span> while 
                reducing incarceration costs by <span className="font-bold text-[#C46A2E]">77%</span>. 
                Our evidence-based model has transformed <span className="font-bold text-[#8B2F2F]">350+ lives</span> with 
                an <span className="font-bold text-[#4A6B57]">85% employment retention rate</span> at 12 months.
              </p>
            </div>

            {/* Advanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfessionalCharts.Treemap />
              <ProfessionalCharts.Bullet />
            </div>

            {/* Interactive Impact Journey */}
            <ProfessionalCharts.AdvancedImpact />
          </motion.div>
        )}

        {/* Financial Analysis */}
        {activeSection === 'financial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Financial Impact Analysis
              </h2>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-[#4A6B57]/10 to-[#4A6B57]/5 rounded-lg">
                  <div className="text-3xl font-bold text-[#4A6B57]">$612K</div>
                  <div className="text-sm text-gray-600">Annual Savings per 6 Youth</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#C46A2E]/10 to-[#C46A2E]/5 rounded-lg">
                  <div className="text-3xl font-bold text-[#C46A2E]">77%</div>
                  <div className="text-sm text-gray-600">Cost Reduction vs Prison</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#8B2F2F]/10 to-[#8B2F2F]/5 rounded-lg">
                  <div className="text-3xl font-bold text-[#8B2F2F]">4.5x</div>
                  <div className="text-sm text-gray-600">Return on Investment</div>
                </div>
              </div>
            </div>

            <ProfessionalCharts.Waterfall />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustodianPathwaysCharts.CostPerDay />
              <CustodianPathwaysCharts.InvestmentAllocation />
            </div>
          </motion.div>
        )}

        {/* Impact Metrics */}
        {activeSection === 'impact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <ProfessionalCharts.CostImpactScatter />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                  Comparative Advantage
                </h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Cost per participant', us: '$25,000', them: '$110,000', advantage: '77%' },
                    { metric: 'Success rate', us: '85%', them: '25%', advantage: '240%' },
                    { metric: 'Family impact', us: '78%', them: '20%', advantage: '290%' },
                    { metric: 'ROI multiplier', us: '4.5x', them: '0.5x', advantage: '900%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.metric}</div>
                      </div>
                      <div className="flex space-x-4 text-sm">
                        <div className="text-right">
                          <div className="font-bold text-[#4A6B57]">{item.us}</div>
                          <div className="text-xs text-gray-500">Custodian</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-400">{item.them}</div>
                          <div className="text-xs text-gray-500">Traditional</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#C46A2E]">+{item.advantage}</div>
                          <div className="text-xs text-gray-500">Better</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <CustodianPathwaysCharts.ImpactMetrics />
            </div>

            <ProfessionalCharts.AdvancedImpact />
          </motion.div>
        )}

        {/* Resource Flow */}
        {activeSection === 'flow' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <ProfessionalCharts.Sankey />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProfessionalCharts.Treemap />
              
              {/* Pathway Flow Diagram */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                  Pathway Architecture
                </h3>
                <div className="space-y-6">
                  {['Connection', 'Safety', 'Learning', 'Contributing'].map((stage, idx) => (
                    <div key={stage} className="relative">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                          style={{ backgroundColor: idx % 2 === 0 ? CP_COLORS.eucalyptus : CP_COLORS.warmOchre }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{stage}</h4>
                          <div className="h-2 bg-gray-200 rounded-full mt-2">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ backgroundColor: idx % 2 === 0 ? CP_COLORS.eucalyptus : CP_COLORS.warmOchre }}
                              initial={{ width: 0 }}
                              animate={{ width: `${100 - (idx * 5)}%` }}
                              transition={{ duration: 1, delay: idx * 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-bold" style={{ color: CP_COLORS.charcoal }}>
                          {100 - (idx * 5)}%
                        </div>
                      </div>
                      {idx < 3 && (
                        <div className="ml-6 border-l-2 border-gray-300 h-6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance */}
        {activeSection === 'performance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <ProfessionalCharts.Bullet />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustodianPathwaysCharts.NationalScaling />
              <ProfessionalCharts.CostImpactScatter />
            </div>

            {/* Performance Matrix */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Performance Matrix
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Attendance', value: 97, benchmark: 75 },
                  { label: 'Productivity', value: 340, benchmark: 100 },
                  { label: 'Safety Record', value: 95, benchmark: 80 },
                  { label: 'Satisfaction', value: 92, benchmark: 70 },
                  { label: 'Skill Growth', value: 85, benchmark: 60 },
                  { label: 'Team Cohesion', value: 88, benchmark: 65 },
                  { label: 'Cultural Connection', value: 94, benchmark: 50 },
                  { label: 'Family Stability', value: 78, benchmark: 40 },
                ].map((metric, idx) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold" style={{ 
                        color: metric.value >= metric.benchmark ? CP_COLORS.eucalyptus : CP_COLORS.ironstone 
                      }}>
                        {metric.value}{metric.label.includes('Productivity') ? '%' : '%'}
                      </div>
                      <div className="text-xs text-gray-500">
                        vs {metric.benchmark}%
                      </div>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full mt-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: metric.value >= metric.benchmark ? CP_COLORS.eucalyptus : CP_COLORS.warmOchre,
                          width: `${Math.min(100, (metric.value / metric.benchmark) * 100)}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (metric.value / metric.benchmark) * 100)}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer with Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-[#4A6B57] to-[#C46A2E] rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-start space-x-4">
            <Info className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Key Insight</h3>
              <p className="opacity-90">
                Custodian Pathways demonstrates that investing in potential rather than punishment delivers 
                superior outcomes across every metric. With 85% employment retention and 4.5x ROI, 
                we're not just changing lives—we're transforming the economics of social intervention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
