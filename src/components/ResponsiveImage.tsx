import { useIntersection } from '@/hooks/useIntersection';
import { useMemo, useState, type CSSProperties } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lqip?: string; // Low-quality inline placeholder (base64 or tiny URL)
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  style?: CSSProperties;
}

/**
 * Generates srcset and source elements for WebP/AVIF if available.
 * Falls back to original src. Works with image naming convention:
 *   /images/photo.jpg → /images/photo.webp, /images/photo.avif
 */
function getImageVariants(src: string) {
  const base = src.replace(/\.[^.]+$/, '');
  return {
    avif: `${base}.avif`,
    webp: `${base}.webp`,
    original: src,
  };
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  lqip,
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  style,
}: ResponsiveImageProps) {
  const [ref, isVisible] = useIntersection<HTMLDivElement>({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const [loaded, setLoaded] = useState(false);
  const variants = useMemo(() => getImageVariants(src), [src]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* LQIP blur background */}
      {lqip && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          style={{
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.5s ease-out',
          }}
        />
      )}

      {/* Main image with picture element for modern format support */}
      {isVisible && (
        <picture>
          <source srcSet={variants.avif} type="image/avif" />
          <source srcSet={variants.webp} type="image/webp" />
          <img
            src={variants.original}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={loading}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </picture>
      )}
    </div>
  );
}
