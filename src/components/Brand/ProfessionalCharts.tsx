import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Sankey, Treemap, ScatterChart, Scatter,
  FunnelChart, Funnel, LabelList, ReferenceLine, Brush, Dot
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { CP_COLORS } from './CustodianPathwaysCharts';

// Enhanced tooltip with glassmorphism effect
const ProfessionalTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-lg bg-white/90 p-4 rounded-xl shadow-2xl border border-white/20"
      >
        <p className="font-bold text-sm mb-2" style={{ color: CP_COLORS.charcoal }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm">{entry.name}:</span>
            </div>
            <span className="font-bold text-sm">
              {typeof entry.value === 'number' ? 
                entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

// 1. WATERFALL CHART - Budget Impact Analysis
export const WaterfallChart: React.FC = () => {
  const data = [
    { name: 'Initial Budget', value: 1000000, isTotal: true },
    { name: 'Prison Costs', value: -693865, fill: CP_COLORS.ironstone },
    { name: 'Community Alternative', value: 81395, fill: CP_COLORS.eucalyptus },
    { name: 'Savings', value: 612470, fill: CP_COLORS.warmOchre },
    { name: 'Social ROI', value: 450000, fill: CP_COLORS.eucalyptus },
    { name: 'Final Impact', value: 1450000, isTotal: true }
  ];

  // Calculate cumulative values for waterfall effect
  let cumulative = 0;
  const waterfallData = data.map((item, index) => {
    const start = cumulative;
    cumulative += item.value;
    return {
      ...item,
      start: index === 0 ? 0 : start,
      end: cumulative,
      value: Math.abs(item.value)
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-96 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Budget Impact Waterfall Analysis
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={waterfallData}>
          <defs>
            <linearGradient id="waterfallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CP_COLORS.eucalyptus} stopOpacity={0.9}/>
              <stop offset="95%" stopColor={CP_COLORS.eucalyptus} stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<ProfessionalTooltip />} />
          <Bar dataKey="value" fill="url(#waterfallGradient)" radius={[8, 8, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 2. SANKEY DIAGRAM - Resource Flow Visualization
export const SankeyDiagram: React.FC = () => {
  const data = {
    nodes: [
      { name: 'Government Funding' },
      { name: 'Private Investment' },
      { name: 'Philanthropic' },
      { name: 'Pathways Program' },
      { name: 'Urban Pathway' },
      { name: 'Rural Pathway' },
      { name: 'Justice Diversion' },
      { name: 'Employment' },
      { name: 'Education' },
      { name: 'Community Impact' }
    ],
    links: [
      { source: 0, target: 3, value: 500 },
      { source: 1, target: 3, value: 300 },
      { source: 2, target: 3, value: 200 },
      { source: 3, target: 4, value: 400 },
      { source: 3, target: 5, value: 350 },
      { source: 3, target: 6, value: 250 },
      { source: 4, target: 7, value: 300 },
      { source: 5, target: 7, value: 250 },
      { source: 6, target: 8, value: 200 },
      { source: 7, target: 9, value: 450 },
      { source: 8, target: 9, value: 150 }
    ]
  };

  const nodeColors = [
    CP_COLORS.charcoal, CP_COLORS.warmOchre, CP_COLORS.eucalyptus,
    CP_COLORS.ironstone, CP_COLORS.eucalyptus, CP_COLORS.warmOchre,
    CP_COLORS.charcoal, CP_COLORS.eucalyptus, CP_COLORS.warmOchre, CP_COLORS.ironstone
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Resource Flow & Impact Pathways
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={{ fill: CP_COLORS.eucalyptus }}
          link={{ stroke: CP_COLORS.eucalyptus, strokeOpacity: 0.3 }}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        />
      </ResponsiveContainer>
    </motion.div>
  );
};

// 3. ADVANCED AREA CHART with Gradient & Annotations
export const AdvancedImpactChart: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    employment: 20 + (i * 7) + Math.random() * 10,
    wellbeing: 35 + (i * 4.5) + Math.random() * 5,
    retention: 100 - (i * 1.2),
    socialReturn: 50 + (i * 15) + Math.random() * 20
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold" style={{ color: CP_COLORS.charcoal }}>
          12-Month Impact Journey
        </h3>
        <div className="flex space-x-2">
          {['all', 'employment', 'wellbeing', 'retention'].map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                selectedMetric === metric 
                  ? 'text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedMetric === metric ? CP_COLORS.eucalyptus : undefined
              }}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="employmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CP_COLORS.eucalyptus} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CP_COLORS.eucalyptus} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="wellbeingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CP_COLORS.warmOchre} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CP_COLORS.warmOchre} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CP_COLORS.ironstone} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CP_COLORS.ironstone} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.3} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<ProfessionalTooltip />} />
          <Legend />
          
          {/* Reference lines for targets */}
          <ReferenceLine y={85} stroke={CP_COLORS.eucalyptus} strokeDasharray="5 5" />
          <ReferenceLine y={80} stroke={CP_COLORS.warmOchre} strokeDasharray="5 5" />
          
          {/* Brush for zooming */}
          <Brush dataKey="month" height={30} stroke={CP_COLORS.eucalyptus} />
          
          {(selectedMetric === 'all' || selectedMetric === 'employment') && (
            <Area
              type="monotone"
              dataKey="employment"
              stroke={CP_COLORS.eucalyptus}
              fill="url(#employmentGradient)"
              strokeWidth={2}
              dot={{ fill: CP_COLORS.eucalyptus, r: 4 }}
              animationDuration={1000}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'wellbeing') && (
            <Area
              type="monotone"
              dataKey="wellbeing"
              stroke={CP_COLORS.warmOchre}
              fill="url(#wellbeingGradient)"
              strokeWidth={2}
              animationDuration={1200}
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'retention') && (
            <Area
              type="monotone"
              dataKey="retention"
              stroke={CP_COLORS.ironstone}
              fill="url(#retentionGradient)"
              strokeWidth={2}
              animationDuration={1400}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// 4. TREEMAP - Program Distribution
export const ProgramTreemap: React.FC = () => {
  const data = [
    {
      name: 'Urban Pathway',
      children: [
        { name: 'Logistics', size: 120, color: CP_COLORS.eucalyptus },
        { name: 'Warehousing', size: 98, color: CP_COLORS.eucalyptus },
        { name: 'Cadetships', size: 73, color: CP_COLORS.eucalyptus },
        { name: 'Admin', size: 45, color: CP_COLORS.eucalyptus }
      ]
    },
    {
      name: 'Rural Pathway',
      children: [
        { name: 'Cattle', size: 156, color: CP_COLORS.warmOchre },
        { name: 'Fencing', size: 87, color: CP_COLORS.warmOchre },
        { name: 'Land Mgmt', size: 92, color: CP_COLORS.warmOchre },
        { name: 'Equipment', size: 48, color: CP_COLORS.warmOchre }
      ]
    },
    {
      name: 'Justice Diversion',
      children: [
        { name: 'Pre-release', size: 89, color: CP_COLORS.ironstone },
        { name: 'Community', size: 124, color: CP_COLORS.ironstone },
        { name: 'Support', size: 67, color: CP_COLORS.ironstone }
      ]
    }
  ];

  const CustomContent: React.FC<any> = (props) => {
    const { x, y, width, height, name, size } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.color || CP_COLORS.eucalyptus,
            stroke: '#fff',
            strokeWidth: 2
          }}
        />
        {width > 50 && height > 30 && (
          <>
            <text 
              x={x + width / 2} 
              y={y + height / 2 - 10} 
              textAnchor="middle" 
              fill="#fff" 
              fontSize={12}
              fontWeight="bold"
            >
              {name}
            </text>
            <text 
              x={x + width / 2} 
              y={y + height / 2 + 10} 
              textAnchor="middle" 
              fill="#fff" 
              fontSize={14}
              fontWeight="bold"
            >
              {size}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Program Participant Distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          ratio={4/3}
          stroke="#fff"
          fill={CP_COLORS.eucalyptus}
          content={<CustomContent />}
        />
      </ResponsiveContainer>
    </motion.div>
  );
};

// 5. BULLET CHART - KPI Performance
export const BulletChart: React.FC = () => {
  const kpis = [
    { 
      name: 'Employment Rate',
      value: 85,
      target: 70,
      ranges: [50, 70, 100],
      color: CP_COLORS.eucalyptus
    },
    {
      name: 'Retention (12mo)',
      value: 87,
      target: 85,
      ranges: [60, 85, 100],
      color: CP_COLORS.warmOchre
    },
    {
      name: 'Cost Savings',
      value: 78,
      target: 60,
      ranges: [40, 60, 100],
      color: CP_COLORS.ironstone
    },
    {
      name: 'Social ROI',
      value: 92,
      target: 75,
      ranges: [50, 75, 100],
      color: CP_COLORS.eucalyptus
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold mb-6" style={{ color: CP_COLORS.charcoal }}>
        KPI Performance vs Targets
      </h3>
      <div className="space-y-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{kpi.name}</span>
              <span className="text-sm text-gray-600">{kpi.value}% / Target: {kpi.target}%</span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
              {/* Background ranges */}
              <div className="absolute inset-0 flex">
                <div className="bg-red-100" style={{ width: `${kpi.ranges[0]}%` }} />
                <div className="bg-yellow-100" style={{ width: `${kpi.ranges[1] - kpi.ranges[0]}%` }} />
                <div className="bg-green-100" style={{ width: `${kpi.ranges[2] - kpi.ranges[1]}%` }} />
              </div>
              
              {/* Actual value bar */}
              <motion.div
                className="absolute top-1 bottom-1 left-0 rounded-md shadow-lg"
                style={{ 
                  backgroundColor: kpi.color,
                  width: `${kpi.value}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${kpi.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
              
              {/* Target line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-black"
                style={{ left: `${kpi.target}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// 6. SCATTER PLOT - Cost vs Impact Analysis
export const CostImpactScatter: React.FC = () => {
  const data = [
    { x: 25000, y: 85, z: 150, name: 'Custodian Pathways', category: 'community' },
    { x: 110000, y: 25, z: 50, name: 'Traditional Prison', category: 'prison' },
    { x: 45000, y: 45, z: 80, name: 'Standard Programs', category: 'standard' },
    { x: 35000, y: 65, z: 120, name: 'Enhanced Support', category: 'enhanced' },
    { x: 180000, y: 15, z: 30, name: 'Youth Detention', category: 'prison' },
    { x: 28000, y: 78, z: 140, name: 'Rural Pathway', category: 'community' },
    { x: 22000, y: 82, z: 160, name: 'Urban Pathway', category: 'community' },
  ];

  const categoryColors: any = {
    community: CP_COLORS.eucalyptus,
    prison: CP_COLORS.ironstone,
    standard: CP_COLORS.warmOchre,
    enhanced: CP_COLORS.charcoal
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-96 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: CP_COLORS.charcoal }}>
        Cost-Effectiveness Analysis
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <defs>
            <linearGradient id="scatterGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="5%" stopColor={CP_COLORS.eucalyptus} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CP_COLORS.warmOchre} stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Annual Cost"
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
            label={{ value: 'Annual Cost per Person', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Success Rate"
            tick={{ fontSize: 11 }}
            label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<ProfessionalTooltip />} />
          <Scatter
            name="Programs"
            data={data}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={payload.z / 10}
                  fill={categoryColors[payload.category]}
                  fillOpacity={0.7}
                  stroke={categoryColors[payload.category]}
                  strokeWidth={2}
                  initial={{ r: 0 }}
                  animate={{ r: payload.z / 10 }}
                  whileHover={{ r: payload.z / 8 }}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4">
        {Object.entries(categoryColors).map(([key, color]) => (
          <div key={key} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color as string }} />
            <span className="text-xs capitalize">{key}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// 7. ANIMATED PROGRESS RINGS - Key Metrics
export const AnimatedProgressRings: React.FC = () => {
  const metrics = [
    { label: 'Employment', value: 85, color: CP_COLORS.eucalyptus },
    { label: 'Retention', value: 87, color: CP_COLORS.warmOchre },
    { label: 'ROI', value: 92, color: CP_COLORS.ironstone },
    { label: 'Impact', value: 78, color: CP_COLORS.charcoal }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="relative w-32 h-32 mx-auto">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke={metric.color}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 56 * (1 - metric.value / 100)
                }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}%
              </span>
              <span className="text-xs text-gray-600">{metric.label}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Export all professional charts
export const ProfessionalCharts = {
  Waterfall: WaterfallChart,
  Sankey: SankeyDiagram,
  AdvancedImpact: AdvancedImpactChart,
  Treemap: ProgramTreemap,
  Bullet: BulletChart,
  CostImpactScatter: CostImpactScatter,
  ProgressRings: AnimatedProgressRings,
};

export default ProfessionalCharts;
