export interface Story {
  name: string;
  photo: string;
  before: string;
  after: string;
  quote: string;
  videos: string[];
  location: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  white: string;
  lightGray: string;
  gray: string;
  darkGray: string;
  sage: string;
  terracotta: string;
  earth: string;
  clay: string;
  sand: string;
  moss: string;
  burnt: string;
}

export interface SectionProps {
  colors: ColorPalette;
}

export interface StoriesSectionProps extends SectionProps {
  stories: Story[];
  currentStory: number;
  setCurrentStory: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  currentVideo: number;
  setCurrentVideo: (index: number) => void;
}

export interface RealitySectionProps extends SectionProps {
  photoGallery: string[];
}