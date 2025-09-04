import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrandedCharts } from '@/components/Brand/BrandedCharts';
import { BrandedDiagrams } from '@/components/Brand/BrandedDiagrams';
import { SampleDataGenerators, BrandMetricsData } from '@/services/visualization-data-service';
import { 
  BarChart3, PieChart, TrendingUp, Users, 
  Target, DollarSign, Award, Activity 
} from 'lucide-react';

const BrandVisualizationDashboard: React.FC = () => {
  // Use sample data from the service
  const [journeyData] = useState(SampleDataGenerators.getJourneyData());
  const [metricsData] = useState(SampleDataGenerators.getMetricsData());
  const [communityData] = useState(SampleDataGenerators.getCommunityData());
  const [funnelData] = useState(SampleDataGenerators.getFunnelData());
  const [skillsData] = useState(SampleDataGenerators.getSkillsData());
  const [investmentData] = useState(SampleDataGenerators.getInvestmentData());
  const [comparativeData] = useState(SampleDataGenerators.getComparativeData());

  // Tab navigation
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact Analysis', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'journey', label: 'Participant Journey', icon: <Users className="w-4 h-4" /> },
    { id: 'comparison', label: 'Comparative Data', icon: <Target className="w-4 h-4" /> },
    { id: 'investment', label: 'ROI Analysis', icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-sand-100">
      {/* Header */}
      <div className="bg-brand-primary text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">First Custodial Pathways</h1>
          <p className="text-xl opacity-90">Brand Visualization Dashboard</p>
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Employment Retention', value: BrandMetricsData.keyMetrics.employmentRetention, icon: <Award /> },
              { label: 'Productivity Gain', value: BrandMetricsData.keyMetrics.productivityGain, icon: <Activity /> },
              { label: 'Lives Transformed', value: BrandMetricsData.keyMetrics.participantCount, icon: <Users /> },
              { label: 'Social ROI', value: BrandMetricsData.keyMetrics.socialReturnRatio, icon: <TrendingUp /> },
            ].map((metric) => (
              <div key={metric.label} className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white/60">{metric.icon}</div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </div>
                <div className="text-sm text-white/80">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-primary/5'
                    : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                }`}
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Journey Flow Diagram */}
            <section>
              <h2 className="text-2xl font-bold text-brand-primary mb-4">Program Journey</h2>
              <BrandedDiagrams.JourneyFlow />
            </section>

            {/* Impact Metrics Grid */}
            <section>
              <h2 className="text-2xl font-bold text-brand-primary mb-4">Impact Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BrandedCharts.SuccessMetrics data={metricsData} />
                <BrandedCharts.CommunityImpact data={communityData} />
              </div>
            </section>

            {/* Program Structure */}
            <section>
              <BrandedDiagrams.ProgramStructure />
            </section>
          </motion.div>
        )}

        {/* Impact Analysis Tab */}
        {activeTab === 'impact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Impact Infographic */}
            <BrandedDiagrams.ImpactMetrics />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BrandedCharts.ImpactJourney data={journeyData} />
              <BrandedCharts.SkillsRadar data={skillsData} />
            </div>

            {/* Ecosystem Map */}
            <BrandedDiagrams.EcosystemMap />
          </motion.div>
        )}

        {/* Participant Journey Tab */}
        {activeTab === 'journey' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Success Timeline */}
            <BrandedDiagrams.SuccessTimeline />

            {/* Funnel Chart */}
            <BrandedCharts.PathwaysFunnel data={funnelData} />

            {/* Journey Chart */}
            <BrandedCharts.ImpactJourney data={journeyData} />
          </motion.div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Comparison Infographic */}
            <BrandedDiagrams.Comparison />

            {/* Comparative Charts */}
            <BrandedCharts.ComparativeImpact data={comparativeData} />

            {/* Partner Outcomes */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-brand-primary mb-6">Partner Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(BrandMetricsData.partnerOutcomes).map(([partner, outcomes]) => (
                  <div key={partner} className="border-2 border-brand-secondary rounded-lg p-6">
                    <h4 className="text-xl font-bold capitalize mb-4">{partner}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(outcomes).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="text-2xl font-bold text-brand-primary">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ROI Analysis Tab */}
        {activeTab === 'investment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Investment Impact Chart */}
            <BrandedCharts.InvestmentImpact data={investmentData} />

            {/* ROI Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-brand-primary mb-6">ROI Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-brand-primary mb-2">$25,000</div>
                  <div className="text-sm text-gray-600">Investment per participant</div>
                </div>
                <div className="text-center p-6 bg-brand-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-brand-primary mb-2">$112,500</div>
                  <div className="text-sm text-gray-600">Social value created</div>
                </div>
                <div className="text-center p-6 bg-brand-secondary/20 rounded-lg">
                  <div className="text-3xl font-bold text-brand-secondary mb-2">4.5x</div>
                  <div className="text-sm text-gray-600">Return on investment</div>
                </div>
              </div>
            </div>

            {/* Cost Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BrandedCharts.ComparativeImpact data={comparativeData} />
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h4 className="text-xl font-bold text-brand-primary mb-4">Annual Cost Comparison</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium">Youth detention</span>
                    <span className="text-2xl font-bold text-red-600">$1.1M/year</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Welfare dependency</span>
                    <span className="text-2xl font-bold text-gray-600">$180K/year</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Custodian Economy</span>
                    <span className="text-2xl font-bold text-green-600">$25K/year</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Export Section */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-brand-primary mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition">
              Download as PDF
            </button>
            <button className="px-6 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition">
              Export Data (CSV)
            </button>
            <button className="px-6 py-2 border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary/5 transition">
              Share Dashboard
            </button>
            <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandVisualizationDashboard;
