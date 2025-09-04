# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**First Custodial Pathways** - A React/TypeScript platform showcasing the Custodian Economy transformation model. Built with Vite, React 18, and Tailwind CSS, featuring 3D visualizations, media management, and comprehensive content management systems for Indigenous employment pathways.

## Common Development Commands

### Build & Run
```bash
# Install dependencies
npm install

# Start development server (port 5180)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Testing & Development
```bash
# Test Supabase connection
node test-supabase.js

# Run TypeScript type checking
tsc --noEmit

# Format code with prettier (if configured)
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"
```

## Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom earthy color palette
- **3D Visualization**: React Three Fiber + Drei for interactive models
- **Animation**: Framer Motion for smooth transitions
- **Routing**: React Router v6
- **Database**: Supabase for media storage and authentication
- **Icons**: Lucide React

### Directory Structure
```
src/
├── components/         # Reusable UI components
│   ├── Admin/         # Staff administration components
│   ├── Brand/         # Brand management tools
│   ├── Content/       # CMS and content tools
│   └── Media/         # Media management components
├── pages/             # Route-level page components
├── services/          # Business logic and API services
│   ├── auth-service.ts
│   ├── database-service.ts
│   └── empathy-ledger-api.ts
├── contexts/          # React context providers
│   ├── AuthContext.tsx
│   └── MetricsContext.tsx
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
│   ├── constants.ts
│   ├── images.ts
│   └── media.tsx
└── assets/            # Static assets (images, videos)
```

### Key Routes
- **Public Routes**: `/`, `/model`, `/resources`, `/impact`, `/brand-strategy`
- **Staff Routes**: `/staff/*` - Protected admin areas with authentication
- **Media Routes**: `/photos`, `/videos` - Gallery and media management

### Authentication Flow
The app uses a protected route system with staff authentication:
1. Staff login at `/staff/login`
2. AuthContext manages session state
3. ProtectedRoute component guards staff-only areas
4. Supabase handles authentication backend

## Code Patterns & Standards

### Component Structure
Components follow a consistent pattern:
- TypeScript interfaces for props
- Functional components with hooks
- Tailwind classes for styling
- Framer Motion for animations

### Path Aliases
The project uses `@/` alias for src imports:
```typescript
import { Component } from '@/components/Component'
import { service } from '@/services/service'
```

### State Management
- React Context for global state (Auth, Metrics)
- Local component state with hooks
- Service layer for API interactions

### Styling Conventions
- Tailwind utility classes preferred
- Custom color palette (terracotta, sage, clay, moss, burnt, sand)
- Responsive design with mobile-first approach

## Important Configuration

### Environment Variables
Required `.env` variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMPATHY_LEDGER_API_URL=https://api.ampthy-ledger.com/v1
VITE_EMPATHY_LEDGER_API_KEY=your_api_key
```

### Build Configuration
- **Port**: Development server runs on 5180
- **Code Splitting**: Configured for vendor, animation, three.js, and icons
- **Source Maps**: Enabled in production builds
- **Path Resolution**: @ alias points to ./src

## Media & Content Management

### Image Storage Strategy
Per user preference rules: Images are stored in Supabase due to Airtable URL expiration issues.

### Media Organization
```
src/assets/
├── images/
│   ├── people/        # Portrait and action shots
│   ├── community/     # Group and event photos  
│   └── program/       # Training and workshop images
└── videos/            # Video content
```

### Content Systems
1. **Empathy Ledger Integration** - Connects to external story database
2. **Brand DNA Analyzer** - AI-powered content analysis
3. **Content Management System** - Full CMS for managing all content
4. **Media Library** - Centralized media asset management

## Brand & Communication

### Brand Values (from brandguide.md)
- **Potential First**: See capability, not deficit
- **Cultural Strength**: Indigenous knowledge as competitive advantage
- **Commercial Excellence**: Business success enables social impact
- **Reciprocity**: What benefits one, benefits all
- **Transformation**: Creating generational change

### Color Palette
- Heritage Brown: #73582c
- Achievement Gold: #d4af37
- Journey Blue: #0288d1
- Growth Green: #2e7d32
- Safety Orange: #ed6c02

## Development Tips

### Performance Optimization
- Images use responsive sizing and lazy loading
- 3D models use instanced geometry and frustum culling
- Code splitting reduces initial bundle size
- React.memo for expensive component renders

### Common Tasks

**Add new page**:
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation if needed

**Add new service**:
1. Create service in `src/services/`
2. Add TypeScript types in `src/types/`
3. Import and use in components

**Update media assets**:
1. Add files to `src/assets/`
2. Update `MediaAssets.tsx` or `MediaIntegration.tsx`
3. Use responsive image components from `utils/media.tsx`

### Debugging
- Check browser console for errors
- Use React Developer Tools for component inspection
- Network tab for API calls to Supabase
- TypeScript errors show in terminal during dev

## Key Features

### 3D Interactive Model
- Located in `components/Interactive3DModel.tsx`
- Uses React Three Fiber for WebGL rendering
- Customizable hub positions and colors
- Orbital controls for user interaction

### Staff Dashboard
- Complete admin panel at `/staff/dashboard`
- Content management, media library, analytics
- Brand testing and version control
- Protected by authentication

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Touch-optimized interactions
- Progressive image loading

## Production Deployment

### Build Process
```bash
npm run build        # Creates dist/ folder
npm run preview      # Test production build locally
```

### Deployment Platforms
- **Vercel**: Auto-deploys from Git
- **Netlify**: Static site hosting
- **Docker**: Container support available

### Performance Targets
- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: Optimized with code splitting
