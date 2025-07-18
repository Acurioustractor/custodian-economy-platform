// Image placeholder utilities
export const getPlaceholderImage = (width: number, height: number, text?: string): string => {
  return `https://via.placeholder.com/${width}x${height}/ff6b35/ffffff?text=${encodeURIComponent(text || `${width}x${height}`)}`;
};

export const getStoryImage = (name: string): string => {
  return getPlaceholderImage(400, 300, name);
};

export const getGalleryImage = (index: number): string => {
  return getPlaceholderImage(600, 400, `Gallery ${index + 1}`);
};

export const getVideoThumbnail = (index: number): string => {
  return getPlaceholderImage(320, 240, `Video ${index + 1}`);
};

// Replace placeholder URLs with proper image utilities
export const updateImageUrls = () => {
  return {
    stories: [
      {
        name: "Callum",
        photo: getStoryImage("Callum"),
        before: "Expelled from school, family addiction, poverty, headed toward prison like his relatives",
        after: "Forklift certified, employed, learning programming, planning 6-month career goals",
        quote: "I hope the programme keeps going. I think it helps out a lot of young indigenous people and I have family members that have come outta prison and it's hard for them to find work.",
        videos: [getVideoThumbnail(1), getVideoThumbnail(2)],
        location: "Brisbane, Australia"
      },
      {
        name: "Troy",
        photo: getStoryImage("Troy"),
        before: "40 years old, life 'up and down for a few years', disconnected from stable employment",
        after: "Year and a half at Young Guns, describes himself as 'more reliable, more motivated, more positive'",
        quote: "Since I've been at Young Guns, it's been going good. I've become more reliable, more motivated, more positive.",
        videos: [getVideoThumbnail(3)],
        location: "Sydney, Australia"
      },
      {
        name: "Tyson",
        photo: getStoryImage("Tyson"),
        before: "Bouncing from village to village, no stable home, social anxiety, grief from family loss",
        after: "Two years employed, crew leader, training others, found his community and purpose",
        quote: "One of my best now. He's my crew leader as well. — George, Supervisor",
        videos: [getVideoThumbnail(4), getVideoThumbnail(5), getVideoThumbnail(6)],
        location: "Melbourne, Australia"
      }
    ],
    gallery: Array.from({ length: 6 }, (_, i) => getGalleryImage(i))
  };
};