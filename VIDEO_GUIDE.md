# Video Management Guide

## 🎥 Current Video System

Your video system is now working perfectly! Here's how to manage and add videos:

## 📍 Video Locations

### 1. **Keiron Testimonial** (Leadership)
- **Where:** Homepage hero, Model page header
- **Purpose:** Founder vision and credibility
- **Size:** Medium (fits in `w-full md:w-96` container)

### 2. **Aden's Story** (Personal Story)
- **Where:** Model page transformation section, Impact page stories
- **Purpose:** Shows programme in action, personal transformation
- **Size:** Various (responsive in `aspect-video` containers)

### 3. **Troy's Story** (Success Story)
- **Where:** Impact page transformation showcase
- **Purpose:** Long-term impact demonstration
- **Size:** Grid layout (half-width on desktop)

### 4. **Programme Overview** (Educational)
- **Where:** Model page detailed explanation
- **Purpose:** Comprehensive system explanation
- **Size:** Large (full-width hero)

## 🔧 How to Manage Videos

### Access Video Manager
Visit: `http://localhost:5173/videos`

This gives you:
- **Visual thumbnails** of all videos
- **Location tracking** - see where each video appears
- **Category filtering** - leadership, story, educational
- **Duration info** - help plan placement
- **Copy embed codes** - for easy management

### Adding New Videos

1. **Get Descript embed code:**
   - Use format: `https://share.descript.com/embed/VIDEO_ID`
   - NOT the view format: `https://share.descript.com/view/VIDEO_ID`

2. **Add to MediaIntegration.tsx:**
   ```typescript
   newVideoName: {
     id: 'unique-video-id',
     embedCode: '<iframe src="https://share.descript.com/embed/VIDEO_ID" frameborder="0" allowfullscreen class="absolute top-0 left-0 w-full h-full"></iframe>',
     title: 'Video Title',
     description: 'What this video shows/accomplishes',
     thumbnail: 'https://via.placeholder.com/320x180/color/ffffff?text=Video+Name',
     duration: 'X:XX',
     location: 'Where it appears on the site',
     category: 'leadership' | 'story' | 'educational'
   }
   ```

3. **Use in pages:**
   ```tsx
   <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
     <YouTubeEmbed 
       embedCode={EMBEDDED_VIDEOS.newVideoName.embedCode}
       title={EMBEDDED_VIDEOS.newVideoName.title}
     />
   </div>
   ```

## 📐 Video Sizing Guidelines

### Small Videos (Testimonials, Quotes)
```tsx
<div className="w-full md:w-96">
  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
    <YouTubeEmbed embedCode={video.embedCode} title={video.title} />
  </div>
</div>
```

### Medium Videos (Story Features)
```tsx
<div className="grid lg:grid-cols-2 gap-8">
  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
    <YouTubeEmbed embedCode={video.embedCode} title={video.title} />
  </div>
</div>
```

### Large Videos (Programme Overviews)
```tsx
<div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-16">
  <YouTubeEmbed embedCode={video.embedCode} title={video.title} />
</div>
```

## 🎯 Best Practices

### Video Placement Strategy
- **Homepage:** One hero video (credibility/vision)
- **Model page:** 2-3 videos (explanation + story)
- **Impact page:** 2-3 videos (transformation stories)
- **Avoid:** More than 3 videos per page

### Categories
- **Leadership:** Founder/team credibility content
- **Story:** Personal transformation narratives  
- **Educational:** How-to and explanation content

### Thumbnails
- Use placeholder service or real thumbnails
- Format: `320x180` (16:9 aspect ratio)
- Include clear text overlay indicating content

## 🔄 Current Video Status

✅ **Video display:** Working perfectly - no cropping issues
✅ **Fullscreen:** Available on all videos
✅ **Responsive:** Adapts to container sizes
✅ **Page navigation:** Now scrolls to top
✅ **Management system:** VideoManager available at `/videos`

## 🚀 Next Steps

1. Replace placeholder thumbnails with real video thumbnails
2. Update video descriptions based on actual content
3. Consider adding more story videos as programme grows
4. Use VideoManager to track and organize future additions

---

**Quick Access:**
- Video Manager: `/videos`
- Photo Manager: `/photos`  
- Video Code: `src/components/MediaIntegration.tsx`