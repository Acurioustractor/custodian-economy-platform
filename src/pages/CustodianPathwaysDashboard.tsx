import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustodianPathwaysCharts, CP_COLORS } from '@/components/Brand/CustodianPathwaysCharts';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Target, PieChart, Calendar, Map, FileText,
  ChevronRight, Download, Share2, Printer
} from 'lucide-react';

const CustodianPathwaysDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');

  // Navigation tabs
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reality', label: 'The Reality', icon: <Target className="w-4 h-4" /> },
    { id: 'costs', label: 'Cost Analysis', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'impact', label: 'Our Impact', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'pathways', label: 'Pathways', icon: <Map className="w-4 h-4" /> },
    { id: 'investment', label: 'Investment', icon: <PieChart className="w-4 h-4" /> },
    { id: 'data', label: 'Data Tables', icon: <FileText className="w-4 h-4" /> },
  ];

  // Data tables for detailed view
  const detailedData = {
    costComparison: [
      { Days: 1, Prison: '$1,901', Community: '$223', Savings: '$1,678' },
      { Days: 10, Prison: '$19,010', Community: '$2,230', Savings: '$16,780' },
      { Days: 30, Prison: '$57,030', Community: '$6,690', Savings: '$50,340' },
      { Days: 100, Prison: '$190,100', Community: '$22,300', Savings: '$167,800' },
      { Days: 365, Prison: '$693,865', Community: '$81,395', Savings: '$612,470' },
    ],
    realityMetrics: [
      { Indicator: 'Youth in justice system', Current: '67%', Target: '< 20%', Gap: '47%' },
      { Indicator: 'Reoffending rate', Current: '85%', Target: '< 30%', Gap: '55%' },
      { Indicator: 'Youth engagement (15-24)', Current: '58%', Target: '80%', Gap: '22%' },
      { Indicator: 'NEET rate (16-24)', Current: '42%', Target: '< 15%', Gap: '27%' },
      { Indicator: 'School readiness', Current: '60%', Target: '> 90%', Gap: '30%' },
    ],
    impactResults: [
      { Metric: 'Young people employed', Value: '350+', Period: 'Since 2022', Growth: '+45% YoY' },
      { Metric: 'Land regenerated', Value: '40,000+ ha', Period: 'Under management', Growth: '+125% YoY' },
      { Metric: 'Herd size', Value: '900 head', Period: '2024 projection', Growth: '46% CAGR' },
      { Metric: 'Partner savings', Value: '$3-4M', Period: 'Annual', Growth: 'Per partner' },
      { Metric: 'Social ROI', Value: '4.5x', Period: 'Verified', Growth: 'SROI certified' },
    ],
    pathwayOutcomes: [
      { Stage: 'Connection', Urban: '95%', Rural: '92%', Duration: '2 weeks' },
      { Stage: 'Safety', Urban: '88%', Rural: '90%', Duration: '4 weeks' },
      { Stage: 'Learning', Urban: '82%', Rural: '85%', Duration: '8 weeks' },
      { Stage: 'Employment', Urban: '78%', Rural: '81%', Duration: 'Ongoing' },
      { Stage: '12-month retention', Urban: '85%', Rural: '87%', Duration: 'Target: 85%' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white py-8 px-6" style={{ backgroundColor: CP_COLORS.charcoal }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Custodian Pathways</h1>
            <p className="text-xl opacity-90 italic">From potential to prosperity.</p>
            <p className="text-lg mt-4 font-semibold">Not welfare. Not charity. Partnership.</p>
          </motion.div>

          {/* Core Pillars */}
          <motion.div 
            className="grid grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-1">Youth</h3>
              <p className="text-sm opacity-90">Young people as leaders, not clients</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-1">Country</h3>
              <p className="text-sm opacity-90">Land & culture regenerated through real work</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-1">Futures</h3>
              <p className="text-sm opacity-90">Intergenerational wealth & justice savings</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                  activeView === tab.id
                    ? 'border-b-2 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{
                  borderColor: activeView === tab.id ? CP_COLORS.eucalyptus : 'transparent',
                  backgroundColor: activeView === tab.id ? CP_COLORS.eucalyptus : 'transparent',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Overview View */}
        {activeView === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Executive Summary
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-lg leading-relaxed" style={{ color: CP_COLORS.charcoal }}>
                  We are Custodian Pathways. We build futures that last. We create pathways where young people 
                  grow into leaders, land is regenerated, and communities prosper. This is not a program—it's 
                  a custodian economy: Youth · Country · Futures. We start with cultural safety and real work, 
                  we stay with people as mentors, and we return value to community. The system is broken—but 
                  we don't see problems. We see potential.
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustodianPathwaysCharts.RealityStats />
              <CustodianPathwaysCharts.ImpactMetrics />
            </div>

            <CustodianPathwaysCharts.AnnualSavings />
          </motion.div>
        )}

        {/* Reality View */}
        {activeView === 'reality' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                The Reality We're Changing
              </h2>
              <CustodianPathwaysCharts.RealityStats />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustodianPathwaysCharts.EngagementGap />
              
              {/* Reality Metrics Table */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                  Performance Gaps
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Indicator</th>
                        <th className="text-center py-2">Current</th>
                        <th className="text-center py-2">Target</th>
                        <th className="text-center py-2">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedData.realityMetrics.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{row.Indicator}</td>
                          <td className="text-center font-bold" style={{ color: CP_COLORS.ironstone }}>
                            {row.Current}
                          </td>
                          <td className="text-center font-bold" style={{ color: CP_COLORS.eucalyptus }}>
                            {row.Target}
                          </td>
                          <td className="text-center">{row.Gap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cost Analysis View */}
        {activeView === 'costs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Cost Analysis: Prison vs Community
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustodianPathwaysCharts.CostPerDay />
                <CustodianPathwaysCharts.CostOverTime />
              </div>
            </section>

            <CustodianPathwaysCharts.AnnualSavings />

            {/* Cost Comparison Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                Detailed Cost Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: CP_COLORS.lightGrey }}>
                      <th className="text-left py-3 px-4">Days</th>
                      <th className="text-right py-3 px-4">Prison Cost</th>
                      <th className="text-right py-3 px-4">Community Cost</th>
                      <th className="text-right py-3 px-4 font-bold">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData.costComparison.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.Days}</td>
                        <td className="text-right py-3 px-4" style={{ color: CP_COLORS.ironstone }}>
                          {row.Prison}
                        </td>
                        <td className="text-right py-3 px-4" style={{ color: CP_COLORS.eucalyptus }}>
                          {row.Community}
                        </td>
                        <td className="text-right py-3 px-4 font-bold" style={{ color: CP_COLORS.warmOchre }}>
                          {row.Savings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Based on QLD 2019-20 supervision costs. Prison: $1,901/day, Community: $223/day
              </p>
            </div>
          </motion.div>
        )}

        {/* Impact View */}
        {activeView === 'impact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Proven Impact & Track Record
              </h2>
              <CustodianPathwaysCharts.ImpactMetrics />
            </section>

            {/* Impact Results Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                Detailed Impact Metrics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: CP_COLORS.lightGrey }}>
                      <th className="text-left py-3 px-4">Metric</th>
                      <th className="text-center py-3 px-4">Value</th>
                      <th className="text-center py-3 px-4">Period</th>
                      <th className="text-center py-3 px-4">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData.impactResults.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.Metric}</td>
                        <td className="text-center py-3 px-4 text-2xl font-bold" 
                            style={{ color: CP_COLORS.eucalyptus }}>
                          {row.Value}
                        </td>
                        <td className="text-center py-3 px-4">{row.Period}</td>
                        <td className="text-center py-3 px-4 font-semibold" 
                            style={{ color: CP_COLORS.warmOchre }}>
                          {row.Growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Success Quote */}
            <div className="rounded-xl shadow-lg p-8 text-center"
                 style={{ backgroundColor: CP_COLORS.eucalyptus }}>
              <blockquote className="text-2xl font-medium text-white italic">
                "For the first time, I felt safe in a workplace. They saw potential when I only saw problems."
              </blockquote>
              <cite className="text-white/80 mt-4 block">— Program Participant</cite>
            </div>
          </motion.div>
        )}

        {/* Pathways View */}
        {activeView === 'pathways' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Urban & Rural Pathways
              </h2>
              
              {/* Urban Pathway Flow */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                  Urban Pathway
                </h3>
                <div className="flex items-center justify-between">
                  {['Connection', 'Safety', 'Learning', 'On-the-job'].map((stage, idx) => (
                    <React.Fragment key={stage}>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold"
                             style={{ backgroundColor: CP_COLORS.eucalyptus }}>
                          {idx + 1}
                        </div>
                        <p className="mt-2 font-medium">{stage}</p>
                      </div>
                      {idx < 3 && <ChevronRight className="text-gray-400" />}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Logistics, warehousing, and cadetship opportunities in urban centers
                </p>
              </div>

              {/* Rural Pathway Flow */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                  Rural/On-Country Pathway
                </h3>
                <div className="flex items-center justify-between">
                  {['Belonging', 'Skills', 'On-Country work', 'Employment'].map((stage, idx) => (
                    <React.Fragment key={stage}>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold"
                             style={{ backgroundColor: CP_COLORS.warmOchre }}>
                          {idx + 1}
                        </div>
                        <p className="mt-2 font-medium">{stage}</p>
                      </div>
                      {idx < 3 && <ChevronRight className="text-gray-400" />}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Fencing, welding, livestock management, and land regeneration
                </p>
              </div>
            </section>

            {/* Pathway Outcomes Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                Pathway Success Rates
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: CP_COLORS.lightGrey }}>
                      <th className="text-left py-3 px-4">Stage</th>
                      <th className="text-center py-3 px-4">Urban Success</th>
                      <th className="text-center py-3 px-4">Rural Success</th>
                      <th className="text-center py-3 px-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData.pathwayOutcomes.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.Stage}</td>
                        <td className="text-center py-3 px-4 font-bold" 
                            style={{ color: CP_COLORS.eucalyptus }}>
                          {row.Urban}
                        </td>
                        <td className="text-center py-3 px-4 font-bold" 
                            style={{ color: CP_COLORS.warmOchre }}>
                          {row.Rural}
                        </td>
                        <td className="text-center py-3 px-4">{row.Duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investment View */}
        {activeView === 'investment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Investment Strategy & Scaling
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustodianPathwaysCharts.InvestmentAllocation />
                <CustodianPathwaysCharts.NationalScaling />
              </div>
            </section>

            {/* Horizons Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Growth Horizons
              </h3>
              <div className="space-y-6">
                {[
                  { 
                    horizon: 'H1 Foundation', 
                    timeline: 'Year 1-2',
                    focus: 'Entity, governance, measurement; QLD focus',
                    color: CP_COLORS.eucalyptus 
                  },
                  { 
                    horizon: 'H2 Expansion', 
                    timeline: 'Year 3-5',
                    focus: 'New customers/industries; deepen rural pathway',
                    color: CP_COLORS.warmOchre 
                  },
                  { 
                    horizon: 'H3 Household', 
                    timeline: 'Year 5+',
                    focus: 'National learning centres; diversified revenue',
                    color: CP_COLORS.ironstone 
                  }
                ].map((horizon, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="w-24 text-center">
                      <div className="text-white font-bold py-2 px-4 rounded"
                           style={{ backgroundColor: horizon.color }}>
                        {horizon.horizon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{horizon.timeline}</p>
                      <p className="text-sm text-gray-600">{horizon.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Ask */}
            <div className="rounded-xl shadow-lg p-8"
                 style={{ backgroundColor: CP_COLORS.charcoal }}>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Join as shareholder, not donor.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-lg p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">Capital</h4>
                  <p className="text-sm">Seed a learning centre or cohort</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">Employment</h4>
                  <p className="text-sm">Cadetships, placements, long-term roles</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6 text-white">
                  <h4 className="font-bold text-lg mb-2">Partnership</h4>
                  <p className="text-sm">Co-design on-Country programs; cultural exchange</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Tables View */}
        {activeView === 'data' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
                Complete Data Tables
              </h2>
              
              {/* All Data Tables */}
              <div className="space-y-6">
                {/* Cost Comparison */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
                    Cost Comparison Data
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-2 px-4">Days</th>
                          <th className="text-right py-2 px-4">Prison Cost</th>
                          <th className="text-right py-2 px-4">Community Cost</th>
                          <th className="text-right py-2 px-4">Savings</th>
                          <th className="text-right py-2 px-4">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 7, 14, 30, 60, 90, 180, 365].map((days) => {
                          const prison = days * 1901;
                          const community = days * 223;
                          const savings = prison - community;
                          const roi = ((savings / community) * 100).toFixed(0);
                          return (
                            <tr key={days} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">{days}</td>
                              <td className="text-right py-2 px-4">${prison.toLocaleString()}</td>
                              <td className="text-right py-2 px-4">${community.toLocaleString()}</td>
                              <td className="text-right py-2 px-4 font-bold">${savings.toLocaleString()}</td>
                              <td className="text-right py-2 px-4">{roi}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CSV Export Section */}
                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Export Data for Canva</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Copy these CSV snippets directly into Canva → Apps → Charts → Import data
                  </p>
                  <div className="bg-white rounded p-4 font-mono text-xs">
                    <pre>{`Category,Cost_per_day_AUD
Prison supervision,1901
Community supervision,223`}</pre>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded text-white flex items-center space-x-2"
                          style={{ backgroundColor: CP_COLORS.eucalyptus }}>
                    <Download className="w-4 h-4" />
                    <span>Download All CSVs</span>
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Export/Share Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
            Export & Share Options
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 text-white rounded-lg flex items-center space-x-2"
                    style={{ backgroundColor: CP_COLORS.eucalyptus }}>
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="px-6 py-2 text-white rounded-lg flex items-center space-x-2"
                    style={{ backgroundColor: CP_COLORS.warmOchre }}>
              <Share2 className="w-4 h-4" />
              <span>Share Dashboard</span>
            </button>
            <button className="px-6 py-2 border-2 rounded-lg flex items-center space-x-2"
                    style={{ borderColor: CP_COLORS.charcoal, color: CP_COLORS.charcoal }}>
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustodianPathwaysDashboard;
