# 📸 Media Integration Guide - Custodian Economy Platform

## 🎯 Quick Start - Adding Your Media

### 📁 Step 1: Add Your Media Files

Create your media directories and add files:

```bash
# Create directories
mkdir -p src/assets/images/people
mkdir -p src/assets/images/community
mkdir -p src/assets/images/program
mkdir -p src/assets/videos/stories
mkdir -p src/assets/videos/program

# Add your files
# Copy your images to the appropriate directories:
cp your-keiron-photo.jpg src/assets/images/people/
cp your-tyson-photo.jpg src/assets/images/people/
cp your-aden-photo.jpg src/assets/images/people/
cp your-program-video.mp4 src/assets/videos/program/
```

### 📸 Step 2: Update Media Assets

Open `src/components/MediaAssets.tsx` and replace the placeholder URLs with your actual file paths:

```typescript
export const MEDIA_ASSETS = {
  keiron: {
    portrait: '/assets/images/people/keiron-landscape.jpg',
    quote: '/assets/images/people/keiron-speaking.jpg',
  },
  aden: {
    portrait: '/assets/images/people/aden-portrait.jpg',
    homeless: '/assets/images/people/aden-past.jpg',
    working: '/assets/images/people/aden-working.jpg',
  },
  troy: {
    portrait: '/assets/images/people/troy-portrait.jpg',
    working: '/assets/images/people/troy-working.jpg',
  },
  // ... continue for all assets
};

export const VIDEO_ASSETS = {
  keironStory: {
    poster: '/assets/images/people/keiron-story-poster.jpg',
    mp4: '/assets/videos/stories/keiron-story.mp4',
    webm: '/assets/videos/stories/keiron-story.webm',
  },
  // ... continue for all videos
};
```

### 🎥 Step 3: Add New Media (Advanced)

To add completely new media sections, follow this pattern:

1. **Add new asset categories** in `src/components/MediaAssets.tsx`
2. **Add new image/video components** using the existing patterns
3. **Place them in the appropriate sections** using the existing structure

## 📋 Media Placement Map

### Header Section
- **Keiron Lander portrait** (400x400px, portrait orientation)
- Location: Top quote section with Keiron's opening statement

### Journey Section
1. **Crisis visualization** (800x600px, landscape)
   - Location: "The Crisis We Face" section
   - Should show data/statistics or community impact

2. **Homelessness imagery** (800x600px, landscape)
   - Location: "Where They Start: Survival Mode"
   - Should show the harsh reality of youth homelessness

3. **Community mentoring** (800x600px, landscape)
   - Location: "Stabilization Before Employment"
   - Should show Indigenous mentors working with youth

4. **Program video** (16:9 aspect ratio)
   - Location: Stabilization section
   - 2-3 minute overview of the program process

5. **Success imagery** (800x600px, landscape)
   - Location: "New Futures" section
   - Should show transformed participants working

### Impact Section
1. **Tyson portrait** (400x400px, portrait)
   - Location: Tyson's story card

2. **Tyson working** (800x600px, landscape)
   - Location: Below Tyson's story

3. **Aden portrait** (400x400px, portrait)
   - Location: Aden's story card

4. **Aden transformation video** (16:9 aspect ratio)
   - Location: Below Aden's story
   - 1-2 minute personal testimony

5. **Community celebration** (800x600px, landscape)
   - Location: Final impact statement

### Model Section
1. **Keiron vision video** (16:9 aspect ratio)
   - Location: "Creating a Self-Sustaining Future"
   - Keiron explaining the long-term vision

## 📱 Image Specifications

### Portrait Photos (People)
- **Size**: 400x400px minimum
- **Format**: JPG or PNG
- **Focus**: Face should be clearly visible
- **Background**: Clean, non-distracting

### Landscape Photos (Scenes)
- **Size**: 800x600px minimum
- **Format**: JPG or PNG
- **Quality**: High resolution, well-lit
- **Content**: Show real program activities, not stock photos

### Videos
- **Format**: MP4 (H.264 codec) + WebM (VP9 codec) for compatibility
- **Resolution**: 1920x1080 (1080p) minimum
- **Duration**: 1-3 minutes per video
- **Audio**: Clear, professional-quality audio
- **Captions**: Include captions/subtitles for accessibility

## 🎨 Styling Guidelines

### Image Styling
All images automatically get:
- Rounded corners (`rounded-lg`)
- Consistent sizing based on context
- Responsive scaling for mobile devices
- Hover effects for interactive elements

### Video Styling
All videos include:
- Poster images for loading states
- Custom controls
- Responsive sizing
- Mobile-friendly touch controls

## 🔄 Quick Replacement Process

1. **Replace placeholder images** in the `src/assets/` directories
2. **Update file paths** in `src/components/MediaAssets.tsx`
3. **Test responsive behavior** on mobile devices
4. **Check loading performance** - aim for < 100ms image load times

## 🎯 Best Practices

### Photography
- **Authenticity**: Use real photos from your program, not stock images
- **Diversity**: Show different ages, backgrounds, and program stages
- **Consent**: Ensure all participants have given consent for their images
- **Quality**: High-resolution, well-composed shots

### Video Production
- **Storytelling**: Each video should tell a clear story
- **Length**: Keep testimonial videos under 2 minutes
- **Accessibility**: Always include captions
- **Branding**: Consistent visual style across all videos

### Performance Optimization
- **Compression**: Use tools like TinyPNG for images
- **Formats**: Provide WebP with JPG fallback
- **Lazy loading**: Images load only when needed
- **CDN**: Consider using a CDN for faster global delivery

## 🔧 Technical Notes

### Image Optimization Tools
```bash
# Install ImageMagick for batch processing
brew install imagemagick

# Batch resize images
magick mogrify -resize 800x600! *.jpg

# Convert to WebP
magick input.jpg output.webp

# Generate thumbnails
magick input.jpg -resize 400x400^ -gravity center -extent 400x400 thumbnail.jpg
```

### Video Processing Tools
```bash
# Install FFmpeg
brew install ffmpeg

# Convert to WebM with VP9
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 2M output.webm

# Generate poster image
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 poster.jpg
```

## ✅ Final Checklist

Before launching:
- [ ] All images replaced with real photos
- [ ] All videos uploaded and tested
- [ ] Image alt text updated for accessibility
- [ ] Mobile responsive behavior verified
- [ ] Loading performance tested
- [ ] All participants have given consent
- [ ] Videos have captions/subtitles
- [ ] File sizes optimized for web

## 🎯 Three-Step Process Summary

**For Immediate Implementation:**

1. **Replace placeholders in `src/components/MediaAssets.tsx`**
2. **Replace YouTube IDs in `src/components/MediaIntegration.tsx`**
3. **Test on mobile and desktop**

## 📞 Need Help?

If you need assistance with:
- **Photo selection**: Choose images that tell the story authentically
- **Video editing**: Keep testimonials concise and powerful
- **Technical issues**: Check console for loading errors
- **Performance**: Use browser dev tools to monitor image sizes

Your media is now ready to transform the Custodian Economy story! 🎉