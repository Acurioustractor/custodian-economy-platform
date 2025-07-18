// Media optimisation utilities for Custodian Economy platform
import React from 'react';

export const MEDIA_CONFIG = {
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
  formats: {
    avif: { quality: 80, effort: 6 },
    webp: { quality: 85, effort: 6 },
    jpeg: { quality: 90 },
  },
  video: {
    webm: { bitrate: '2M', codec: 'libvpx-vp9' },
    mp4: { bitrate: '2M', codec: 'libx264' },
  },
}

// Image CDN URLs (replace with your actual CDN)
const CDN_BASE = 'https://images.custodianeconomy.com'

export function generateImageUrl(
  path: string,
  options: {
    width?: number
    height?: number
    format?: 'avif' | 'webp' | 'jpeg'
    quality?: number
    crop?: string
  } = {}
): string {
  const params = new URLSearchParams()
  
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.format) params.set('f', options.format)
  if (options.quality) params.set('q', options.quality.toString())
  if (options.crop) params.set('c', options.crop)
  
  return `${CDN_BASE}/${path}?${params.toString()}`
}

export function getResponsiveImageSet(path: string, aspectRatio: number = 16/9) {
  const widths = [375, 768, 1024, 1440]
  
  return {
    avif: widths.map(w => ({
      src: generateImageUrl(path, { width: w, height: Math.round(w / aspectRatio), format: 'avif' }),
      width: w,
    })),
    webp: widths.map(w => ({
      src: generateImageUrl(path, { width: w, height: Math.round(w / aspectRatio), format: 'webp' }),
      width: w,
    })),
    fallback: generateImageUrl(path, { width: 1024, height: Math.round(1024 / aspectRatio), format: 'jpeg' }),
  }
}

// Video optimisation
export function getVideoSources(path: string) {
  return {
    webm: `${CDN_BASE}/${path}.webm`,
    mp4: `${CDN_BASE}/${path}.mp4`,
  }
}

// Placeholder images for development
export const PLACEHOLDERS = {
  hero: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1440&q=80',
  community: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
  pathways: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  business: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  testimonials: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
}

// Lazy loading helper
export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false 
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-300`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

// Responsive picture component
export function ResponsiveImage({
  path,
  alt,
  aspectRatio,
  className = '',
}: {
  path: string
  alt: string
  aspectRatio?: number
  className?: string
}) {
  const sources = getResponsiveImageSet(path, aspectRatio)
  
  return (
    <picture className={className}>
      <source srcSet={sources.avif.map(s => `${s.src} ${s.width}w`).join(', ')} 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              type="image/avif" />
      <source srcSet={sources.webp.map(s => `${s.src} ${s.width}w`).join(', ')}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              type="image/webp" />
      <img
        src={sources.fallback}
        alt={alt}
        className="w-full h-auto"
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

// Video component with poster
export function OptimizedVideo({
  sources,
  poster,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
}: {
  sources: { webm: string; mp4: string }
  poster: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}) {
  return (
    <video
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
    >
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

// Loading states
export const ImageSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`${className} bg-gray-200 animate-pulse rounded-lg`} />
)

// Error states
export const ImageError = ({ className = '' }: { className?: string }) => (
  <div className={`${className} bg-gray-100 flex items-center justify-center rounded-lg`}>
    <span className="text-gray-400 text-sm">Image unavailable</span>
  </div>
)