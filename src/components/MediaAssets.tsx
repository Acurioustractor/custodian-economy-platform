// Local images - matched to your actual uploaded files
export const MEDIA_ASSETS = {
  keiron: {
    portrait: '/src/assets/images/community/keiron-portrait.jpg',
    quote: '/src/assets/images/community/keiron-portrait.jpg', // Using same for now
  },
  aden: {
    portrait: '/src/assets/images/community/aden-portrait.jpg',
    homeless: '/src/assets/images/community/aden-portrait.jpg', // Using same for now
    working: '/src/assets/images/community/aden-working.jpg',
  },
  troy: {
    portrait: '/src/assets/images/community/troy-portrait.jpg',
    working: '/src/assets/images/community/troy-portrait.jpg', // Using same for now
  },
  community: {
    group: '/src/assets/images/people/group-photo.jpg',
    mentoring: '/src/assets/images/people/mentoring-session.jpg',
    cultural: '/src/assets/images/people/mentoring-session.jpg', // Using same for now
  },
  program: {
    training: '/src/assets/images/program/training-session.jpg',
    workshop: '/src/assets/images/program/workshop.jpg',
    support: '/src/assets/images/program/workshop.jpg', // Using same for now
  }
};

// Video placeholders
export const VIDEO_ASSETS = {
  keironStory: {
    poster: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=675&fit=crop',
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    webm: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  adenJourney: {
    poster: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=675&fit=crop',
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    webm: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  programOverview: {
    poster: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop',
    mp4: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    webm: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  }
};

// Simple image component for development
export const PlaceholderImage = ({ src, alt, className = "", aspect = "aspect-video" }: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
}) => (
  <img 
    src={src} 
    alt={alt} 
    className={`${className} ${aspect} object-cover rounded-lg`}
  />
);

// Simple video component for development
export const PlaceholderVideo = ({ poster, src, className = "" }: {
  poster: string;
  src: string;
  className?: string;
}) => (
  <video 
    poster={poster}
    controls
    className={`${className} aspect-video w-full rounded-lg`}
  >
    <source src={src} type="video/mp4" />
  </video>
);