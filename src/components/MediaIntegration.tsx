// Simple media integration system for Custodian Economy
export const HERO_IMAGES = {
  // YouTube thumbnail URLs (replace with your actual video IDs)
  keironHero: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg',
  adenHero: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg',
  troyHero: 'https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg',
  
  // Direct image URLs (replace with your actual images)
  crisis: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=600&fit=crop',
  community: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1920&h=600&fit=crop',
  transformation: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=600&fit=crop',
  
  // Placeholder for your actual images
  yourImages: {
    keironSpeaking: 'ADD_YOUR_IMAGE_URL_HERE',
    adenBefore: 'ADD_YOUR_IMAGE_URL_HERE',
    adenAfter: 'ADD_YOUR_IMAGE_URL_HERE',
    troyWorking: 'ADD_YOUR_IMAGE_URL_HERE',
    communityGathering: 'ADD_YOUR_IMAGE_URL_HERE'
  }
};

// Video library with embed codes, thumbnails, and placement info
export const EMBEDDED_VIDEOS = {
  keironTestimonial: {
    id: 'keiron-testimonial',
    embedCode: '<iframe src="https://share.descript.com/embed/tauPrghguvy" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>',
    title: 'Keiron Lander - Custodian Economy Vision',
    description: 'Founder explains the vision and approach behind the Custodian Economy',
    thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=Keiron+Vision',
    duration: '3:45',
    location: 'Homepage hero, Model page header',
    category: 'leadership'
  },
  adenStory: {
    id: 'aden-story',
    embedCode: '<iframe src="https://share.descript.com/embed/5RoHeKYkENu" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>',
    title: "Aden's Journey - From Crisis to Stability",
    description: 'Personal transformation story showing the programme in action',
    thumbnail: 'https://via.placeholder.com/320x180/059669/ffffff?text=Aden+Story',
    duration: '4:12',
    location: 'Model page transformation section, Impact page stories',
    category: 'story'
  },
  troyStory: {
    id: 'troy-story',
    embedCode: '<iframe src="https://share.descript.com/embed/uPU4aKCpRwS" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>',
    title: "Troy's Transformation - Two Years Later",
    description: 'Long-term impact and ongoing success story',
    thumbnail: 'https://via.placeholder.com/320x180/dc2626/ffffff?text=Troy+Success',
    duration: '2:58',
    location: 'Impact page transformation showcase',
    category: 'story'
  },
  programOverview: {
    id: 'program-overview',
    embedCode: '<iframe src="https://share.descript.com/embed/tauPrghguvy" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>',
    title: "Custodian Economy Programme - How It Works",
    description: 'Comprehensive overview of the three-hub system and methodology',
    thumbnail: 'https://via.placeholder.com/320x180/7c3aed/ffffff?text=Programme+Overview',
    duration: '5:30',
    location: 'Model page detailed explanation section',
    category: 'educational'
  }
};

// Helper function to get video by ID
export const getVideo = (id: string) => {
  return Object.values(EMBEDDED_VIDEOS).find(video => video.id === id);
};

// Get videos by category
export const getVideosByCategory = (category: string) => {
  return Object.values(EMBEDDED_VIDEOS).filter(video => video.category === category);
};

// Simple hero image component
export const HeroImage = ({ src, alt, title, subtitle }: {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}) => (
  <div className="relative w-full h-96 overflow-hidden rounded-lg mb-8">
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
    />
    {(title || subtitle) && (
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
        {title && <h2 className="text-white text-3xl font-bold mb-2">{title}</h2>}
        {subtitle && <p className="text-white text-lg opacity-90">{subtitle}</p>}
      </div>
    )}
  </div>
);

// Enhanced video embed with flexible aspect ratios and fullscreen support
export const YouTubeEmbed = ({ embedCode, title }: { embedCode: string; title: string }) => {
  // Handle undefined/null embedCode
  if (!embedCode) {
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Video placeholder - add embed code in MediaIntegration.tsx</span>
      </div>
    );
  }

  // If it's a full embed code, use it directly with minimal wrapper
  if (embedCode.includes && embedCode.includes('<iframe')) {
    const isDescriptVideo = embedCode.includes('share.descript.com');
    
    return (
      <div className="relative w-full h-full">
        {/* Fullscreen button overlay */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => {
              const iframe = document.querySelector(`iframe[src*="${isDescriptVideo ? 'descript.com' : 'youtube.com'}"]`) as HTMLIFrameElement;
              if (iframe && iframe.requestFullscreen) {
                iframe.requestFullscreen();
              }
            }}
            className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-lg transition-all"
            title="Open fullscreen"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm11 0a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L12.586 5H11a1 1 0 010-2h4zm-6 10a1 1 0 011 1v4a1 1 0 01-2 0v-1.586l-2.293 2.293a1 1 0 11-1.414-1.414L7.586 15H6a1 1 0 010-2h4zm6 0a1 1 0 011 1v1.586l2.293-2.293a1 1 0 111.414 1.414L15.414 17H17a1 1 0 010 2h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Use original embed code with proper absolute positioning */}
        <div 
          dangerouslySetInnerHTML={{ 
            __html: embedCode.replace(
              'frameborder="0"',
              'style="border:0;"'
            )
          }}
        />
      </div>
    );
  }
  
  // If it's just a video ID, build the embed
  const videoId = embedCode;
  return (
    <div className="relative w-full mb-6">
      <div 
        className="relative w-full rounded-lg overflow-hidden shadow-lg"
        style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
};

// Simple Vimeo embed component
export const VimeoEmbed = ({ videoId, title }: { videoId: string; title: string }) => (
  <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6">
    <iframe
      src={`https://player.vimeo.com/video/${videoId}`}
      title={title}
      style={{ border: 0 }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="absolute top-0 left-0 w-full h-full"
    />
  </div>
);