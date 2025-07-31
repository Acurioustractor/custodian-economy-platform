# Custodian Economy Platform

A world-class interactive platform showcasing the Custodian Economy transformation model - a proven system for connecting young Indigenous people with meaningful employment pathways.

## 🎯 Overview

The Custodian Economy Platform demonstrates a revolutionary approach to employment and community transformation that goes beyond traditional CSR. With **85% employment retention after 1 year** and **$1.1M annual savings per youth vs. incarceration**, this model creates measurable social and economic impact.

## 🚀 Features

### Interactive Model Visualization
- **3-Hub System**: Community → Pathways → Business
- **Real-time Animation**: Flow visualization of transformation journey
- **Clickable Elements**: Detailed information on each component
- **Responsive Design**: Works perfectly on all devices

### Rich Storytelling
- **Photo Galleries**: Real transformation stories with images
- **Video Integration**: Embedded testimonials and success stories
- **Interactive Stories**: Click through transformation journeys
- **Location-based Content**: Contextual information for each story

### Professional Styling
- **Earthy Colour Palette**: Terracotta, sage, clay, and moss tones
- **Typography**: Inter font family for modern readability
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG 2.1 compliant design

## 📦 Tech Stack

### Core Technologies
- **React 18** - Modern UI framework
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first styling with custom earthy palette
- **Framer Motion** - Advanced animations and interactions
- **React Router** - Client-side routing

### Visualization & Animation
- **D3.js** - Data visualization and interactive charts
- **React Spring** - Physics-based animations
- **Lucide React** - Beautiful, consistent icons
- **Custom SVG** - Scalable vector graphics for diagrams

### Development Tools
- **Vite** - Fast build tool and development server
- **Storybook** - Component documentation and testing
- **ESLint** - Code linting and quality assurance
- **Vitest** - Unit testing framework

## 🎨 Colour System

The platform uses a carefully curated earthy colour system:

- **Terracotta** (`#ff6b35`) - Primary accent, energy and transformation
- **Sage** (`#556b2f`) - Growth, stability, and community
- **Clay** (`#cd853f`) - Warmth, earth, and connection
- **Moss** (`#9caf88`) - Fresh starts, renewal, and progress
- **Burnt** (`#a0522d`) - Depth, heritage, and grounding
- **Sand** (`#f4f1ec`) - Neutrals, backgrounds, and text

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd custodian-economy-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook development
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## ♿ Accessibility

- **WCAG 2.1 AA compliant**
- **Keyboard navigation support**
- **Screen reader optimization**
- **High contrast mode support**
- **Reduced motion preferences honored**

## 🔧 Development

### Adding New Components

Components should be added to `src/components/` with:
- TypeScript interfaces for props
- Storybook stories for documentation
- Unit tests for functionality
- Responsive design considerations

### Colour Usage

Always use the predefined Tailwind colour classes:

```tsx
// Good
<div className="bg-terracotta-500 text-white">
  Content here
</div>

// Avoid
<div style={{ backgroundColor: '#ff6b35' }} className="text-white">
  Content here
</div>
```

## 📊 Performance

- **Bundle size**: Optimized with code splitting
- **Images**: Lazy loading and WebP format
- **Animations**: Hardware-accelerated transforms
- **Fonts**: Variable fonts for smaller sizes
- **Caching**: Service worker for offline support

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t custodian-economy .
docker run -p 3000:3000 custodian-economy
```

## 📈 Analytics

The platform includes:
- **Google Analytics** integration
- **User interaction tracking**
- **Performance monitoring**
- **Story engagement metrics**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Young Guns** - For the inspiring work and real-world impact
- **Custodian Economy Team** - For developing this transformative model
- **Community Partners** - For their ongoing support and collaboration

## 📞 Contact

For questions or support, please contact:
- Email: [contact@custodian-economy.org](mailto:contact@custodian-economy.org)
- Website: [https://custodian-economy.org](https://custodian-economy.org)

---

**Transforming lives, one pathway at a time.**