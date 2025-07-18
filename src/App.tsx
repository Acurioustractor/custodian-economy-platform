import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import CustodianEconomyModel from './pages/CustodianEconomyModel';
import ResourceCenterPage from './pages/ImageGalleryPage';
import CustodianEconomyImpact from './pages/CustodianEconomyImpact';
import PhotoPreviewPage from './pages/PhotoPreviewPage';
import ContactPage from './pages/ContactPage';
import { VideoManager } from './components/VideoManager';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <ScrollToTop />
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/model" element={<CustodianEconomyModel />} />
          <Route path="/resources" element={<ResourceCenterPage />} />
          <Route path="/impact" element={<CustodianEconomyImpact />} />
          <Route path="/photos" element={<PhotoPreviewPage />} />
          <Route path="/videos" element={<VideoManager />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;