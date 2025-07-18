# Simple Content Guide

## Quick Start (2 minutes)

### 1. Add Your Images
Open `src/components/MediaAssets.tsx` and replace placeholder URLs:

```typescript
// Replace these URLs with your actual images
export const MEDIA_ASSETS = {
  keiron: {
    portrait: 'YOUR_KEIRON_PHOTO_URL_HERE',
    quote: 'YOUR_KEIRON_QUOTE_PHOTO_URL_HERE',
  },
  aden: {
    portrait: 'YOUR_ADEN_PHOTO_URL_HERE',
    working: 'YOUR_ADEN_WORKING_PHOTO_URL_HERE',
    homeless: 'YOUR_HOMELESS_STORY_PHOTO_URL_HERE',
  },
  troy: {
    portrait: 'YOUR_TROY_PHOTO_URL_HERE',
    working: 'YOUR_TROY_WORKING_PHOTO_URL_HERE',
  }
}
```

### 2. Add Your Videos
Open `src/components/MediaIntegration.tsx` and replace:

```typescript
// You can use either:
// - Full embed code: '<iframe src="https://www.youtube.com/embed/ABC123" ...></iframe>'
// - Just the video ID: 'ABC123'

export const EMBEDDED_VIDEOS = {
  keironTestimonial: {
    embedCode: 'PASTE_YOUR_VIDEO_ID_OR_FULL_EMBED_CODE_HERE',
    title: 'Your video title'
  },
  adenStory: {
    embedCode: 'PASTE_YOUR_VIDEO_ID_OR_FULL_EMBED_CODE_HERE',
    title: 'Your video title'
  }
}
```

## Where Each Photo/Video Appears

| Content Type | File Location | Page Section | Purpose |
|--------------|---------------|--------------|---------|
| **Keiron's portrait** | `MEDIA_ASSETS.keiron.portrait` | Hero section | Main speaker photo |
| **Aden's before/after** | `MEDIA_ASSETS.aden.portrait` | Impact stories | Transformation story |
| **Troy's working photo** | `MEDIA_ASSETS.troy.working` | Impact section | Success story |
| **Keiron's video** | `EMBEDDED_VIDEOS.keironTestimonial` | Hero section | Main testimonial |
| **Aden's story video** | `EMBEDDED_VIDEOS.adenStory` | Journey section | Personal transformation |

## Getting URLs

### Images
1. Upload to: imgur.com, Google Drive (public), or your website
2. Copy the direct image URL (ends in .jpg, .png, etc.)
3. Paste into `MediaAssets.tsx`

### Videos
1. **YouTube**: Click Share → Embed → Copy the code or just the video ID
2. **Vimeo**: Click Share → Copy embed code
3. Paste into `MediaIntegration.tsx`

## Examples

### Good Image URL:
`https://i.imgur.com/ABC123.jpg`

### Good Video Embed:
- Simple: `dQw4w9WgXcQ`
- Full embed: `<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`

## Quick Checklist

- [ ] Replace 3 hero images in `HERO_IMAGES`
- [ ] Replace 6 portrait photos in `MEDIA_ASSETS`
- [ ] Replace 4 video embeds in `EMBEDDED_VIDEOS`
- [ ] Save files
- [ ] Refresh browser

**Done! Changes appear instantly.**