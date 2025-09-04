import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Network, Activity, 
  Layers, PieChart, LineChart, AreaChart,
  Target, DollarSign, Users, Globe,
  Sparkles, Zap, Eye, LayoutGrid
} from 'lucide-react';

const VisualizationMenu: React.FC = () => {
  const navigate = useNavigate();

  const visualizations = [
    {
      title: 'Professional Dashboard',
      description: 'Executive analytics with advanced metrics, financial analysis, and impact measurements',
      path: '/professional',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
      features: ['Financial ROI Analysis', 'Impact Metrics', 'Resource Flow', 'Performance Tracking']
    },
    {
      title: 'Brand Visualization',
      description: 'Interactive brand metrics and DNA analysis with real-time insights',
      path: '/brand',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      features: ['Brand DNA Analysis', 'Sentiment Tracking', 'Voice Consistency', 'Market Position']
    },
    {
      title: 'Custodian Pathways',
      description: 'Journey visualization and pathway analytics for program participants',
      path: '/custodian',
      icon: <Network className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600',
      features: ['Journey Maps', 'Outcome Tracking', 'Cohort Analysis', 'Success Metrics']
    },
    {
      title: '3D Interactive Model',
      description: 'Explore the Custodian Economy model in an interactive 3D environment',
      path: '/model',
      icon: <Layers className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      features: ['3D Visualization', 'Interactive Nodes', 'System Dynamics', 'Relationship Mapping']
    },
    {
      title: 'Impact Dashboard',
      description: 'Comprehensive impact metrics and social return on investment',
      path: '/impact',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-600',
      features: ['Social ROI', 'Community Impact', 'Economic Benefits', 'Transformation Metrics']
    },
    {
      title: 'Quick Charts',
      description: 'Direct access to all chart components and visualizations',
      path: '/charts',
      icon: <PieChart className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-600',
      features: ['Bar Charts', 'Line Graphs', 'Pie Charts', 'Scatter Plots']
    }
  ];

  const quickLinks = [
    { label: 'Graphs', path: '/graphs', icon: <LineChart className="w-5 h-5" /> },
    { label: 'Visualizations', path: '/visualizations', icon: <AreaChart className="w-5 h-5" /> },
    { label: 'Analytics', path: '/staff/analytics', icon: <Activity className="w-5 h-5" /> },
    { label: 'Resources', path: '/resources', icon: <LayoutGrid className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-5xl font-bold tracking-tight">
                Visualization Center
              </h1>
              <p className="text-xl opacity-90">
                Explore data insights through interactive dashboards and visualizations
              </p>
              
              {/* Quick Links */}
              <div className="flex justify-center gap-4 pt-6">
                {quickLinks.map((link) => (
                  <motion.button
                    key={link.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualizations.map((viz, index) => (
            <motion.div
              key={viz.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                style={{
                  backgroundImage: `linear-gradient(to right, ${viz.color.split(' ')[1].replace('to-', '')}, ${viz.color.split(' ')[2]})`
                }}
              />
              
              <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer h-full"
                onClick={() => navigate(viz.path)}
              >
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${viz.color} text-white`}>
                    {viz.icon}
                  </div>
                  <motion.div
                    animate={{ rotate: 45 }}
                    className="text-white/60 group-hover:text-white transition-colors"
                  >
                    <Eye className="w-6 h-6" />
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {viz.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {viz.description}
                </p>

                {/* Features */}
                <div className="space-y-1">
                  {viz.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-4 w-full py-2 px-4 rounded-lg bg-gradient-to-r ${viz.color} text-white font-medium text-sm hover:shadow-lg transition-all`}
                >
                  Open Dashboard →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Staff Access Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white/70" />
              <h3 className="text-lg font-semibold text-white">Staff Access</h3>
            </div>
            <p className="text-white/60 text-sm max-w-md">
              Access advanced analytics, content management, and administrative tools
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/staff/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Staff Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/staff/dashboard')}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all"
              >
                Staff Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white/50 text-sm">
            <Zap className="w-4 h-4" />
            <span>All visualizations update in real-time with live data</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisualizationMenu;
