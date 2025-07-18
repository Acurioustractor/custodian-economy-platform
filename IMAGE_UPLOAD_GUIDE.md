# 📸 Image Upload Guide - Custodian Economy

## 🚀 Quick Start: Add Your Images

### Step 1: Add Your Images to the Folders

Copy your images into these folders with these exact file names:

```bash
# People Photos (Portraits & Action Shots)
src/assets/images/people/
├── keiron-portrait.jpg        # Keiron's professional headshot
├── keiron-speaking.jpg        # Keiron speaking/presenting
├── aden-portrait.jpg          # Aden's current photo
├── aden-before.jpg           # Aden's "before" transformation photo
├── aden-working.jpg          # Aden at work
├── troy-portrait.jpg         # Troy's current photo
└── troy-working.jpg          # Troy at work

# Community Photos
src/assets/images/community/
├── group-photo.jpg           # Main team/community photo (HERO IMAGE)
├── mentoring-session.jpg     # Mentoring in action
└── cultural-event.jpg        # Cultural connection moment

# Program Photos
src/assets/images/program/
├── training-session.jpg      # Main training photo (FEATURED)
├── workshop.jpg              # Workshop/skills development
└── support-meeting.jpg       # Support group meeting
```

### Step 2: Image Requirements

**File Formats:** JPG, PNG, or WebP
**Recommended Sizes:**
- **Portraits:** 400x400px minimum (square)
- **Landscape photos:** 800x600px minimum 
- **Hero image:** 1200x800px minimum

### Step 3: That's It!

Once you add the images with the correct file names, they'll automatically appear throughout the site:

- **Hero section** uses `group-photo.jpg`
- **Featured photo** uses `training-session.jpg`
- **Photo gallery** uses all the portrait and working photos
- **Individual story sections** use specific portraits

## 📍 Where Each Image Appears

| File Name | Used On | Purpose |
|-----------|---------|---------|
| `group-photo.jpg` | **Homepage Hero** | Main impact photo |
| `training-session.jpg` | **Homepage Featured** | Large training showcase |
| `keiron-portrait.jpg` | **Multiple pages** | Leadership photo |
| `aden-portrait.jpg` | **Impact stories** | Success story |
| `troy-portrait.jpg` | **Impact stories** | Success story |
| `mentoring-session.jpg` | **Homepage gallery** | Community connection |
| `aden-working.jpg` | **Homepage gallery** | Employment success |

## 🔧 Troubleshooting

**If images don't appear:**
1. Check file names match exactly (case-sensitive)
2. Make sure files are in the correct folders
3. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
4. Check browser console for errors

**If images look wrong:**
- **Too small/blurry:** Use higher resolution images
- **Wrong aspect ratio:** Crop to recommended sizes
- **Too large/slow loading:** Compress images using online tools

## 📱 Mobile-Friendly Tips

- Use high-quality images (they'll be automatically resized)
- Avoid very wide landscape images for portraits
- Test on mobile after uploading

## ✅ Quick Checklist

- [ ] Created the three folders in `src/assets/images/`
- [ ] Added images with correct file names
- [ ] Images are good quality and proper size
- [ ] Refreshed browser to see changes
- [ ] Tested on mobile device

## 🎯 Priority Images (Start With These)

**Most Important:**
1. `group-photo.jpg` - This is your hero image, make it count!
2. `training-session.jpg` - Main feature photo
3. `keiron-portrait.jpg` - Leadership representation

**Secondary:**
4. `aden-portrait.jpg` & `troy-portrait.jpg` - Success stories
5. `mentoring-session.jpg` - Community connection
6. `aden-working.jpg` - Employment success

Start with these 6 images and you'll have a fully functional, professional-looking site!