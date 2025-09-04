# 📊 Brand Visualizations Guide
## First Custodial Pathways - Data Visualization System

This guide explains how to use and customize the branded charts, diagrams, and infographics for your First Custodial Pathways presentations and reports.

---

## 🎨 Quick Start

### 1. View the Dashboard
```bash
# Start the development server
npm run dev

# Navigate to the visualization dashboard
http://localhost:5180/brand-dashboard
```

### 2. Add Route to App.tsx
```tsx
import BrandVisualizationDashboard from './pages/BrandVisualizationDashboard';

// Add this route
<Route path="/brand-dashboard" element={<BrandVisualizationDashboard />} />
```

---

## 📈 Available Chart Types

### 1. **Impact Journey Chart** 
Shows transformation over 12 months
```tsx
import { BrandedCharts } from '@/components/Brand/BrandedCharts';

<BrandedCharts.ImpactJourney data={yourJourneyData} />
```

**Data Format:**
```javascript
[
  { month: 'Month 1', employment: 0, wellbeing: 35, retention: 100 },
  { month: 'Month 2', employment: 15, wellbeing: 42, retention: 95 },
  // ... more months
]
```

### 2. **Success Metrics Bar Chart**
Key performance indicators
```tsx
<BrandedCharts.SuccessMetrics data={yourMetricsData} />
```

**Data Format:**
```javascript
[
  { metric: 'Employment Retention', value: 85, target: 70 },
  { metric: 'Absenteeism Rate', value: 3, target: 25 },
  // ... more metrics
]
```

### 3. **Community Impact Pie Chart**
Distribution of impact across categories
```tsx
<BrandedCharts.CommunityImpact data={yourCommunityData} />
```

**Data Format:**
```javascript
[
  { name: 'Direct Employment', value: 1500 },
  { name: 'Family Members Impacted', value: 4500 },
  // ... more categories
]
```

### 4. **Pathways Funnel Chart**
Program progression visualization
```tsx
<BrandedCharts.PathwaysFunnel data={yourFunnelData} />
```

### 5. **Skills Radar Chart**
Before/after skills comparison
```tsx
<BrandedCharts.SkillsRadar data={yourSkillsData} />
```

### 6. **Investment Impact Area Chart**
ROI visualization over time
```tsx
<BrandedCharts.InvestmentImpact data={yourInvestmentData} />
```

### 7. **Comparative Impact Chart**
Traditional vs Custodian Economy
```tsx
<BrandedCharts.ComparativeImpact data={yourComparativeData} />
```

---

## 🎯 Available Diagrams & Infographics

### 1. **Journey Flow Diagram**
Visual pathway through the program
```tsx
import { BrandedDiagrams } from '@/components/Brand/BrandedDiagrams';

<BrandedDiagrams.JourneyFlow />
```

### 2. **Impact Metrics Infographic**
Key metrics in visual format
```tsx
<BrandedDiagrams.ImpactMetrics metrics={customMetrics} />
```

### 3. **Ecosystem Map**
Stakeholder relationship visualization
```tsx
<BrandedDiagrams.EcosystemMap />
```

### 4. **Comparison Infographic**
Side-by-side model comparison
```tsx
<BrandedDiagrams.Comparison />
```

### 5. **Success Timeline**
Individual transformation journey
```tsx
<BrandedDiagrams.SuccessTimeline stories={timelineData} />
```

### 6. **Program Structure**
Phase-by-phase breakdown
```tsx
<BrandedDiagrams.ProgramStructure />
```

---

## 🎨 Brand Colors Reference

Your brand colors are automatically applied to all visualizations:

```javascript
Primary Colors:
- Heritage Brown: #73582c (Cultural grounding)
- Achievement Gold: #d4af37 (Success, potential)
- Journey Blue: #0288d1 (Pathways, progress)

Secondary Colors:
- Growth Green: #2e7d32 (Positive outcomes)
- Safety Orange: #ed6c02 (Care, attention)
- Professional Grey: #757575 (Balance)

Earth Tones:
- Terracotta: #ff6b35
- Sage: #556b2f
- Clay: #cd853f
- Moss: #9caf88
- Burnt: #a0522d
- Sand: #f4f1ec
```

---

## 💡 Adding Your Own Data

### Method 1: Direct Data Input
```tsx
const myData = [
  { month: 'Jan', employment: 45, wellbeing: 60 },
  { month: 'Feb', employment: 52, wellbeing: 65 },
  // ... more data
];

<BrandedCharts.ImpactJourney data={myData} />
```

### Method 2: Use the Data Service
```tsx
import { VisualizationDataService } from '@/services/visualization-data-service';

// Transform your raw data
const chartData = VisualizationDataService.transformForChart(
  rawData, 
  'journey' // chart type
);

<BrandedCharts.ImpactJourney data={chartData} />
```

### Method 3: Custom Data Generator
```tsx
import { SampleDataGenerators } from '@/services/visualization-data-service';

// Generate custom data with your metrics
const customData = SampleDataGenerators.generateCustomData({
  participants: 2000,
  retentionRate: 87,
  productivityMultiplier: 3.8,
  investmentAmount: 2000000
});

// Use the generated data
<BrandedCharts.SuccessMetrics data={customData.overview} />
```

---

## 📊 Real-World Examples

### Example 1: Quarterly Report Dashboard
```tsx
const QuarterlyReport = () => {
  const q3Data = {
    journey: [
      { month: 'Jul', employment: 72, wellbeing: 71, retention: 86 },
      { month: 'Aug', employment: 78, wellbeing: 75, retention: 85 },
      { month: 'Sep', employment: 82, wellbeing: 78, retention: 85 }
    ],
    metrics: [
      { metric: 'New Participants', value: 125, target: 100 },
      { metric: 'Job Placements', value: 98, target: 80 },
      { metric: 'Partner Satisfaction', value: 94, target: 85 }
    ]
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <BrandedCharts.ImpactJourney data={q3Data.journey} />
      <BrandedCharts.SuccessMetrics data={q3Data.metrics} />
    </div>
  );
};
```

### Example 2: Partner Presentation
```tsx
const PartnerPresentation = ({ partnerName }) => {
  const partnerMetrics = {
    productivity: '+380%',
    absenteeism: '-85%',
    retention: '82%',
    savings: '$2.8M/year'
  };

  return (
    <>
      <BrandedDiagrams.ImpactMetrics 
        metrics={[
          { value: partnerMetrics.productivity, label: 'Productivity Gain' },
          { value: partnerMetrics.retention, label: 'Retention Rate' },
          { value: partnerMetrics.savings, label: 'Annual Savings' }
        ]}
      />
      <BrandedDiagrams.Comparison />
    </>
  );
};
```

### Example 3: Individual Success Story
```tsx
const SuccessStoryVisual = ({ participant }) => {
  const storyTimeline = [
    { date: 'Day 1', event: 'First Meeting', description: 'Met with Keiron' },
    { date: 'Week 4', event: 'Training Started', description: 'Warehouse skills' },
    { date: 'Month 3', event: 'First Job', description: 'Started at Kmart' },
    { date: 'Year 1', event: 'Team Leader', description: 'Promoted to supervisor' }
  ];

  const skillsGrowth = [
    { skill: 'Technical Skills', before: 2, after: 9 },
    { skill: 'Communication', before: 3, after: 8 },
    { skill: 'Leadership', before: 1, after: 7 }
  ];

  return (
    <>
      <BrandedDiagrams.SuccessTimeline stories={storyTimeline} />
      <BrandedCharts.SkillsRadar data={skillsGrowth} />
    </>
  );
};
```

---

## 🛠️ Customization Options

### Customize Colors
```tsx
// In BrandedCharts.tsx, modify BRAND_COLORS
export const BRAND_COLORS = {
  primary: {
    brown: '#YOUR_COLOR',  // Change to your brand color
    gold: '#YOUR_COLOR',   
    blue: '#YOUR_COLOR',
  }
  // ... more colors
};
```

### Customize Chart Animations
```tsx
// Modify animation props
<motion.div
  initial={{ opacity: 0, y: 50 }}  // Starting state
  animate={{ opacity: 1, y: 0 }}   // End state
  transition={{ duration: 0.8 }}    // Animation duration
>
  <BrandedCharts.ImpactJourney data={data} />
</motion.div>
```

### Add New Chart Types
```tsx
// In BrandedCharts.tsx, add new chart component
export const CustomChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Your custom chart implementation */}
    </ResponsiveContainer>
  );
};
```

---

## 📤 Export Options

### Export as Image
```javascript
// Use browser print function or screenshot tools
window.print(); // Will use print styles
```

### Export Data as CSV
```javascript
const exportToCSV = (data) => {
  const csv = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'custodian-economy-data.csv';
  a.click();
};
```

### Generate PDF Report
```javascript
// Install jsPDF
npm install jspdf html2canvas

// Generate PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = async () => {
  const element = document.getElementById('dashboard');
  const canvas = await html2canvas(element);
  const pdf = new jsPDF();
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
  pdf.save('report.pdf');
};
```

---

## 🚀 Performance Tips

1. **Lazy Load Charts**: Only render charts when visible
```tsx
const LazyChart = lazy(() => import('@/components/Brand/BrandedCharts'));
```

2. **Memoize Data**: Prevent unnecessary recalculations
```tsx
const memoizedData = useMemo(() => 
  VisualizationDataService.transformForChart(rawData, 'journey'),
  [rawData]
);
```

3. **Optimize Large Datasets**: Sample or aggregate data
```tsx
const optimizedData = data.filter((item, index) => index % 10 === 0);
```

---

## 📝 Common Use Cases

### Board Presentations
- Use `ImpactMetricsInfographic` for executive summary
- Use `InvestmentImpactChart` for ROI discussion
- Use `ComparativeImpact` for competitive advantage

### Grant Applications
- Use `SuccessMetrics` for proven outcomes
- Use `CommunityImpact` for social value
- Use `PathwaysFunnel` for program effectiveness

### Partner Meetings
- Use `JourneyFlow` for program explanation
- Use `Comparison` for value proposition
- Use `EcosystemMap` for partnership context

### Media & Marketing
- Use `SuccessTimeline` for human stories
- Use `SkillsRadar` for transformation visualization
- Use `ImpactMetrics` for key statistics

---

## 🆘 Troubleshooting

### Charts not rendering?
```bash
# Ensure recharts is installed
npm install recharts
```

### Colors not applying?
- Check Tailwind config includes brand colors
- Verify color values are valid hex codes

### Data not updating?
- Ensure data prop is changing reference
- Use key prop to force re-render

---

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to create impactful visualizations!** 📊✨

For specific customization requests or additional chart types, modify the components in:
- `/src/components/Brand/BrandedCharts.tsx`
- `/src/components/Brand/BrandedDiagrams.tsx`
- `/src/services/visualization-data-service.ts`
