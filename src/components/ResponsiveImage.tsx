import { useIntersection } from '@/hooks/useIntersection';
import { useState, type CSSProperties } from 'react';

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

      {/* Main image — only loads when in viewport */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
