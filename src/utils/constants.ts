export const colors = {
  primary: '#2c1810',
  secondary: '#ff6b35',
  accent: '#8b4513',
  success: '#2d5016',
  warning: '#b8860b',
  danger: '#8b2500',
  info: '#cd853f',
  white: '#f5f5dc',
  lightGray: '#f4f1ec',
  gray: '#d2b48c',
  darkGray: '#8b7355',
  sage: '#9caf88',
  terracotta: '#cc5500',
  earth: '#8b7355',
  clay: '#cd853f',
  sand: '#f4f1ec',
  moss: '#556b2f',
  burnt: '#a0522d'
} as const;

import { getStoryImage, getVideoThumbnail, getGalleryImage } from './images';

export const stories = [
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
];

export const photoGallery = Array.from({ length: 6 }, (_, i) => getGalleryImage(i));

export const navigationSections = [
  { id: 'reality', label: 'The Reality', icon: 'Eye' },
  { id: 'stories', label: 'Real Stories', icon: 'MessageCircle' },
  { id: 'model', label: 'The Model', icon: 'GitCommit' },
  { id: 'economics', label: 'The Economics', icon: 'TrendingUp' },
  { id: 'partnership', label: 'Your Role', icon: 'Handshake' }
];