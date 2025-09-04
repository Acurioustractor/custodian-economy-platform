import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PublicNavigation } from './components/PublicNavigation';
import { StaffNavigation } from './components/StaffNavigation';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { MetricsProvider } from './contexts/MetricsContext';
import { StaffOnly } from './components/ProtectedRoute';
import { StaffLogin } from './components/StaffLogin';
import { StaffDashboard } from './components/StaffDashboard';
import { HomePage } from './pages/HomePage';
import CustodianEconomyModel from './pages/CustodianEconomyModel';
import ResourceCenterPage from './pages/ImageGalleryPage';
import CustodianEconomyImpact from './pages/CustodianEconomyImpact';
import PhotoPreviewPage from './pages/PhotoPreviewPage';
import ContactPage from './pages/ContactPage';
import BrandGuidePage from './pages/BrandGuidePage';
import CustodianPathwaysDashboard from './pages/CustodianPathwaysDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import BrandVisualizationDashboard from './pages/BrandVisualizationDashboard';
import VisualizationMenu from './pages/VisualizationMenu';
import { VideoManager } from './components/VideoManager';
import { ContentManagementSystem } from './components/ContentManagementSystem';
import { StrategicCommunicationDashboard } from './components/StrategicCommunicationDashboard';
import { DynamicBlogSystem } from './components/DynamicBlogSystem';
import { ProspectusGenerator } from './components/ProspectusGenerator';
import { MediaLibrary } from './components/MediaLibrary';
import { BrandTestingInterface } from './components/BrandTestingInterface';
import { BrandContentHub } from './components/BrandContentHub';
import { BrandUpdateManager } from './components/BrandUpdateManager';
import { BrandVersionControl } from './components/BrandVersionControl';
import { AdminPanel } from './components/AdminPanel';
import { GlobalSearch } from './components/GlobalSearch';
import { ContentLibrary } from './components/ContentLibrary';
import { BrandStrategyMapper } from './components/BrandStrategyMapper';
import { StoryStrategyBuilder } from './components/StoryStrategyBuilder';
import { BrandUpdateProvider } from './services/brand-update-system';
import './App.css';

// Navigation wrapper that chooses the right navigation based on route
const NavigationWrapper: React.FC = () => {
  const location = useLocation();
  
  // Don't show navigation on staff login page
  if (location.pathname === '/staff/login') {
    return null;
  }
  
  // Show staff navigation for staff routes
  if (location.pathname.startsWith('/staff')) {
    return <StaffNavigation />;
  }
  
  // Show public navigation for all other routes
  return <PublicNavigation />;
};

function App() {
  return (
    <BrandUpdateProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <MetricsProvider>
            <div className="App">
              <ScrollToTop />
              <NavigationWrapper />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<VisualizationMenu />} />
          <Route path="/viz" element={<VisualizationMenu />} />
          <Route path="/visualizations-menu" element={<VisualizationMenu />} />
          <Route path="/model" element={<CustodianEconomyModel />} />
          <Route path="/resources" element={<ResourceCenterPage />} />
          <Route path="/impact" element={<CustodianEconomyImpact />} />
          <Route path="/photos" element={<PhotoPreviewPage />} />
          <Route path="/videos" element={<VideoManager />} />
          <Route path="/brand-strategy" element={<BrandGuidePage />} />
          <Route path="/custodian-dashboard" element={<CustodianPathwaysDashboard />} />
          <Route path="/custodian" element={<CustodianPathwaysDashboard />} />
          <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />
          <Route path="/professional" element={<ProfessionalDashboard />} />
          <Route path="/brand-visualization" element={<BrandVisualizationDashboard />} />
          <Route path="/brand" element={<BrandVisualizationDashboard />} />
          <Route path="/visualizations" element={<ProfessionalDashboard />} />
          <Route path="/graphs" element={<ProfessionalDashboard />} />
          <Route path="/charts" element={<ProfessionalDashboard />} />
          <Route path="/contact" element={<ContactPage />} />
                      
          {/* Staff Login */}
          <Route path="/staff/login" element={<StaffLogin />} />
                      
          {/* Protected Staff Routes */}
          <Route path="/staff/dashboard" element={
            <StaffOnly>
              <StaffDashboard />
            </StaffOnly>
          } />
          <Route path="/staff/content" element={
            <StaffOnly>
              <ContentManagementSystem />
            </StaffOnly>
          } />
          <Route path="/staff/analytics" element={
            <StaffOnly>
              <StrategicCommunicationDashboard />
            </StaffOnly>
          } />
          <Route path="/staff/blog" element={
            <StaffOnly>
              <DynamicBlogSystem />
            </StaffOnly>
          } />
          <Route path="/staff/prospectus" element={
            <StaffOnly>
              <ProspectusGenerator />
            </StaffOnly>
          } />
          <Route path="/staff/media-library" element={
            <StaffOnly>
              <MediaLibrary />
            </StaffOnly>
          } />
          <Route path="/staff/brand-testing" element={
            <StaffOnly>
              <BrandTestingInterface />
            </StaffOnly>
          } />
          <Route path="/staff/brand-hub" element={
            <StaffOnly>
              <BrandContentHub />
            </StaffOnly>
          } />
          <Route path="/staff/brand-manager" element={
            <StaffOnly>
              <BrandUpdateManager />
            </StaffOnly>
          } />
          <Route path="/staff/version-control" element={
            <StaffOnly>
              <BrandVersionControl />
            </StaffOnly>
          } />
          <Route path="/staff/admin" element={
            <StaffOnly>
              <AdminPanel />
            </StaffOnly>
          } />
          <Route path="/staff/search" element={
            <StaffOnly>
              <GlobalSearch />
            </StaffOnly>
          } />
          <Route path="/staff/content-library" element={
            <StaffOnly>
              <ContentLibrary />
            </StaffOnly>
          } />
          <Route path="/staff/brand-strategy" element={
            <StaffOnly>
              <BrandStrategyMapper />
            </StaffOnly>
          } />
          <Route path="/staff/story-builder" element={
            <StaffOnly>
              <StoryStrategyBuilder />
            </StaffOnly>
          } />
            </Routes>
            </div>
          </MetricsProvider>
        </AuthProvider>
      </Router>
    </BrandUpdateProvider>
  );
}

export default App;