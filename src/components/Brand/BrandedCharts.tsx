import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Sankey, Treemap, FunnelChart, Funnel, LabelList
} from 'recharts';
import { motion } from 'framer-motion';

// Brand colors from your brandguide
export const BRAND_COLORS = {
  primary: {
    brown: '#73582c',      // Heritage Brown - Cultural grounding
    gold: '#d4af37',       // Achievement Gold - Success, potential
    blue: '#0288d1',       // Journey Blue - Pathways, progress
  },
  secondary: {
    green: '#2e7d32',      // Growth Green - Positive outcomes
    orange: '#ed6c02',     // Safety Orange - Care, attention
    grey: '#757575',       // Professional Grey - Balance
  },
  earth: {
    terracotta: '#ff6b35',
    sage: '#556b2f',
    clay: '#cd853f',
    moss: '#9caf88',
    burnt: '#a0522d',
    sand: '#f4f1ec',
  },
  gradient: {
    warmth: ['#73582c', '#d4af37', '#ff6b35'],
    growth: ['#556b2f', '#9caf88', '#2e7d32'],
    journey: ['#0288d1', '#03a9f4', '#4fc3f7'],
    impact: ['#d4af37', '#ff6b35', '#ed6c02'],
  }
};

// Custom tooltip with brand styling
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-brand-primary">
        <p className="text-brand-primary font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Impact Journey Line Chart - Shows transformation over time
export const ImpactJourneyChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Transformation Journey</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="journeyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_COLORS.primary.blue} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={BRAND_COLORS.primary.blue} stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.earth.sand} />
          <XAxis dataKey="month" stroke={BRAND_COLORS.primary.brown} />
          <YAxis stroke={BRAND_COLORS.primary.brown} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="employment" 
            stroke={BRAND_COLORS.primary.gold}
            strokeWidth={3}
            dot={{ fill: BRAND_COLORS.primary.gold, r: 6 }}
            activeDot={{ r: 8 }}
            name="Employment Rate %"
          />
          <Line 
            type="monotone" 
            dataKey="wellbeing" 
            stroke={BRAND_COLORS.primary.blue}
            strokeWidth={3}
            dot={{ fill: BRAND_COLORS.primary.blue, r: 6 }}
            name="Wellbeing Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 2. Success Metrics Bar Chart - Shows key achievements
export const SuccessMetricsChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Key Success Metrics</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_COLORS.primary.gold} stopOpacity={1}/>
              <stop offset="95%" stopColor={BRAND_COLORS.primary.gold} stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.earth.sand} />
          <XAxis dataKey="metric" stroke={BRAND_COLORS.primary.brown} angle={-45} textAnchor="end" />
          <YAxis stroke={BRAND_COLORS.primary.brown} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="value" position="top" fill={BRAND_COLORS.primary.brown} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 3. Community Impact Pie Chart - Shows distribution of impact
export const CommunityImpactChart: React.FC<{ data: any[] }> = ({ data }) => {
  const colors = [
    BRAND_COLORS.primary.gold,
    BRAND_COLORS.primary.blue,
    BRAND_COLORS.secondary.green,
    BRAND_COLORS.earth.terracotta,
    BRAND_COLORS.earth.sage,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Community Impact Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 4. Pathways Funnel Chart - Shows progression through the program
export const PathwaysFunnelChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Pathways Progression</h3>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList position="center" fill="#fff" stroke="none" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 5. Skills Development Radar Chart
export const SkillsRadarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Skills Development</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke={BRAND_COLORS.earth.sand} />
          <PolarAngleAxis dataKey="skill" stroke={BRAND_COLORS.primary.brown} />
          <PolarRadiusAxis stroke={BRAND_COLORS.primary.brown} />
          <Radar
            name="Before"
            dataKey="before"
            stroke={BRAND_COLORS.secondary.grey}
            fill={BRAND_COLORS.secondary.grey}
            fillOpacity={0.3}
          />
          <Radar
            name="After"
            dataKey="after"
            stroke={BRAND_COLORS.primary.gold}
            fill={BRAND_COLORS.primary.gold}
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 6. Investment Impact Area Chart
export const InvestmentImpactChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Investment vs Impact</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_COLORS.primary.brown} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={BRAND_COLORS.primary.brown} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_COLORS.primary.gold} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={BRAND_COLORS.primary.gold} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.earth.sand} />
          <XAxis dataKey="year" stroke={BRAND_COLORS.primary.brown} />
          <YAxis stroke={BRAND_COLORS.primary.brown} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="investment"
            stroke={BRAND_COLORS.primary.brown}
            fill="url(#investmentGradient)"
            strokeWidth={2}
            name="Investment ($k)"
          />
          <Area
            type="monotone"
            dataKey="socialReturn"
            stroke={BRAND_COLORS.primary.gold}
            fill="url(#impactGradient)"
            strokeWidth={2}
            name="Social Return ($k)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 7. Comparative Impact Chart - Stacked Bar
export const ComparativeImpactChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-96 p-4 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-bold text-brand-primary mb-4">Comparative Impact Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.earth.sand} />
          <XAxis dataKey="category" stroke={BRAND_COLORS.primary.brown} />
          <YAxis stroke={BRAND_COLORS.primary.brown} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="traditional" stackId="a" fill={BRAND_COLORS.secondary.grey} name="Traditional Approach" />
          <Bar dataKey="custodian" stackId="a" fill={BRAND_COLORS.primary.gold} name="Custodian Economy" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Export all chart types for easy import
export const BrandedCharts = {
  ImpactJourney: ImpactJourneyChart,
  SuccessMetrics: SuccessMetricsChart,
  CommunityImpact: CommunityImpactChart,
  PathwaysFunnel: PathwaysFunnelChart,
  SkillsRadar: SkillsRadarChart,
  InvestmentImpact: InvestmentImpactChart,
  ComparativeImpact: ComparativeImpactChart,
};

export default BrandedCharts;
