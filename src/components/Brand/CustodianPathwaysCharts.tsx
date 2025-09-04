import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, FunnelChart, Funnel, LabelList
} from 'recharts';
import { motion } from 'framer-motion';

// Custodian Pathways Brand Colors (from visual guide)
export const CP_COLORS = {
  eucalyptus: '#4A6B57',    // Primary green
  warmOchre: '#C46A2E',     // Warm orange
  ironstone: '#8B2F2F',     // Deep red
  charcoal: '#2D2D2D',      // Almost black
  white: '#FFFFFF',
  // Additional supporting colors
  lightEucalyptus: '#7A9B87',
  lightOchre: '#E4A26E',
  lightGrey: '#F5F5F5',
  mediumGrey: '#888888'
};

// Custom tooltip matching Custodian Pathways brand
const CPTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold" style={{ color: CP_COLORS.charcoal }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? 
              entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// R1. Cost per day: Prison vs Community
export const CostPerDayChart: React.FC = () => {
  const data = [
    { Category: 'Prison supervision', Cost_per_day_AUD: 1901 },
    { Category: 'Community supervision', Cost_per_day_AUD: 223 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Daily Cost: Prison vs Community (QLD 2019-20)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CP_COLORS.lightGrey} />
          <XAxis dataKey="Category" stroke={CP_COLORS.charcoal} />
          <YAxis stroke={CP_COLORS.charcoal} />
          <Tooltip content={<CPTooltip />} />
          <Bar dataKey="Cost_per_day_AUD" fill={CP_COLORS.ironstone}>
            <Cell fill={CP_COLORS.ironstone} />
            <Cell fill={CP_COLORS.eucalyptus} />
            <LabelList dataKey="Cost_per_day_AUD" position="top" 
              formatter={(value: number) => `$${value}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2">
        Daily cost per person under supervision (QLD 2019–20)
      </p>
    </motion.div>
  );
};

// R2. Cost over time - Prison vs Community
export const CostOverTimeChart: React.FC = () => {
  const data = [
    { Days: 1, Prison_AUD: 1901, Community_AUD: 223 },
    { Days: 10, Prison_AUD: 19010, Community_AUD: 2230 },
    { Days: 50, Prison_AUD: 95050, Community_AUD: 11150 },
    { Days: 100, Prison_AUD: 190100, Community_AUD: 22300 },
    { Days: 150, Prison_AUD: 285150, Community_AUD: 33450 },
    { Days: 365, Prison_AUD: 693865, Community_AUD: 81395 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Cumulative Cost Comparison
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CP_COLORS.lightGrey} />
          <XAxis dataKey="Days" stroke={CP_COLORS.charcoal} />
          <YAxis stroke={CP_COLORS.charcoal} 
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
          <Tooltip content={<CPTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Prison_AUD" 
            stroke={CP_COLORS.ironstone}
            strokeWidth={3}
            name="Prison Cost"
            dot={{ fill: CP_COLORS.ironstone }}
          />
          <Line 
            type="monotone" 
            dataKey="Community_AUD" 
            stroke={CP_COLORS.eucalyptus}
            strokeWidth={3}
            name="Community Cost"
            dot={{ fill: CP_COLORS.eucalyptus }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2">
        Prison supervision cost compounds rapidly vs community supervision
      </p>
    </motion.div>
  );
};

// R4. Engagement Gap Chart
export const EngagementGapChart: React.FC = () => {
  const data = [
    { Group: 'Indigenous 15-24', Engaged: 58 },
    { Group: 'Non-Indigenous 15-24', Engaged: 80 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Youth Engagement Gap
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CP_COLORS.lightGrey} />
          <XAxis dataKey="Group" stroke={CP_COLORS.charcoal} />
          <YAxis stroke={CP_COLORS.charcoal} domain={[0, 100]} />
          <Tooltip content={<CPTooltip />} />
          <Bar dataKey="Engaged" fill={CP_COLORS.warmOchre}>
            <Cell fill={CP_COLORS.warmOchre} />
            <Cell fill={CP_COLORS.eucalyptus} />
            <LabelList dataKey="Engaged" position="top" 
              formatter={(value: number) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2">
        Only 58% of Indigenous youth fully engaged vs 80% non-Indigenous (education/training/employment)
      </p>
    </motion.div>
  );
};

// R5. Reality Poster - Key Stats Display
export const RealityStatsDisplay: React.FC = () => {
  const stats = [
    { metric: 'Youth in justice', value: '2/3', description: 'are Aboriginal/Torres Strait Islander' },
    { metric: 'Reoffending', value: '>85%', description: 'within 12 months' },
    { metric: 'Annual cost', value: '$1M', description: 'per young person' },
    { metric: 'In care', value: '43%', description: 'Aboriginal/Torres Strait Islander' },
    { metric: 'Not ready', value: '40%', description: 'starting school underdeveloped' },
    { metric: 'Not engaged', value: '42%', description: '16-24 year olds NEET' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-8 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: CP_COLORS.charcoal }}>
        The Reality
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.metric}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div 
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: index % 2 === 0 ? CP_COLORS.warmOchre : CP_COLORS.eucalyptus }}
            >
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h4 className="font-bold text-sm" style={{ color: CP_COLORS.charcoal }}>
              {stat.metric}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// R6. Impact Metrics Display
export const ImpactMetricsDisplay: React.FC = () => {
  const metrics = [
    { indicator: 'Young people into jobs', value: '350+', detail: 'full-time transitions since 2022' },
    { indicator: 'Hectares regenerative', value: '40,000+', detail: 'land managed' },
    { indicator: 'Herd growth', value: '46%', detail: 'CAGR over 6 years' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-8 rounded-xl shadow-lg"
      style={{ backgroundColor: CP_COLORS.eucalyptus }}
    >
      <h3 className="text-2xl font-bold mb-6 text-white text-center">
        Proven Impact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.indicator}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-white rounded-lg p-6 text-center"
          >
            <div className="text-3xl font-bold mb-2" style={{ color: CP_COLORS.warmOchre }}>
              {metric.value}
            </div>
            <h4 className="font-bold text-sm mb-1" style={{ color: CP_COLORS.charcoal }}>
              {metric.indicator}
            </h4>
            <p className="text-xs text-gray-600">{metric.detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// R7. Investment Allocation Pie Chart
export const InvestmentAllocationChart: React.FC = () => {
  const data = [
    { Category: 'Real asset purchase', Percent: 85 },
    { Category: 'Upscale development', Percent: 10 },
    { Category: 'New opportunity', Percent: 5 }
  ];

  const colors = [CP_COLORS.eucalyptus, CP_COLORS.warmOchre, CP_COLORS.ironstone];

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Investment Allocation Strategy
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ Category, Percent }) => `${Category}: ${Percent}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="Percent"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip content={<CPTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Indicative allocation across asset purchase, development, new opportunity
      </p>
    </motion.div>
  );
};

// R8. National Scaling Budget
export const NationalScalingChart: React.FC = () => {
  const data = [
    { Year: 'Year 1', Budget: 1.201 },
    { Year: 'Year 2', Budget: 1.252 },
    { Year: 'Year 3', Budget: 1.315 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        3-Year National Scaling Budget
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={CP_COLORS.lightGrey} />
          <XAxis dataKey="Year" stroke={CP_COLORS.charcoal} />
          <YAxis stroke={CP_COLORS.charcoal} 
            tickFormatter={(value) => `$${value.toFixed(1)}M`} />
          <Tooltip content={<CPTooltip />} />
          <Bar dataKey="Budget" fill={CP_COLORS.eucalyptus}>
            <LabelList dataKey="Budget" position="top" 
              formatter={(value: number) => `$${value.toFixed(2)}M`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Three-year funding ask to scale nationally (total ≈ $3.7m)
      </p>
    </motion.div>
  );
};

// Annual Savings Display (R3)
export const AnnualSavingsDisplay: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full p-8 text-center rounded-xl shadow-lg"
      style={{ 
        background: `linear-gradient(135deg, ${CP_COLORS.eucalyptus}, ${CP_COLORS.warmOchre})` 
      }}
    >
      <h3 className="text-2xl font-bold text-white mb-4">
        Annual Budget Impact
      </h3>
      <div className="bg-white rounded-lg p-6 inline-block">
        <p className="text-sm mb-2" style={{ color: CP_COLORS.charcoal }}>
          Diverting just 6 young people saves
        </p>
        <div className="text-5xl font-bold" style={{ color: CP_COLORS.eucalyptus }}>
          $1.7M
        </div>
        <p className="text-sm mt-2" style={{ color: CP_COLORS.charcoal }}>
          per year
        </p>
      </div>
      <p className="text-sm text-white mt-4">
        Community supervision vs prison incarceration
      </p>
    </motion.div>
  );
};

// Export all Custodian Pathways charts
export const CustodianPathwaysCharts = {
  CostPerDay: CostPerDayChart,
  CostOverTime: CostOverTimeChart,
  EngagementGap: EngagementGapChart,
  RealityStats: RealityStatsDisplay,
  ImpactMetrics: ImpactMetricsDisplay,
  InvestmentAllocation: InvestmentAllocationChart,
  NationalScaling: NationalScalingChart,
  AnnualSavings: AnnualSavingsDisplay,
};

export default CustodianPathwaysCharts;
