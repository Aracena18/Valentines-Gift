import photos from '@/data/photos.json';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PixelArtPortraitProps {
  imageSrc: string;
  cols?: number;
}

// ASCII density ramp — dark to light
const ASCII_RAMP = ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

function brightnessToChar(r: number, g: number, b: number): string {
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const index = Math.floor(brightness * (ASCII_RAMP.length - 1));
  return ASCII_RAMP[index];
}

type PixelRow = { r: number; g: number; b: number; ch: string }[];

export function PixelArtPortrait({
  imageSrc,
  cols = 70,
}: PixelArtPortraitProps) {
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [grid, setGrid] = useState<PixelRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Sample image pixels ── */
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // chars are roughly 2× taller than wide, so halve the rows
      const aspect = img.height / img.width;
      const rows = Math.round(cols * aspect * 0.5);

      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(img, 0, 0, cols, rows);

      const imageData = ctx.getImageData(0, 0, cols, rows);
      const result: PixelRow[] = [];

      for (let y = 0; y < rows; y++) {
        const row: PixelRow[number][] = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          row.push({ r, g, b, ch: brightnessToChar(r, g, b) });
        }
        result.push(row);
      }

      setGrid(result);
      setLoaded(true);
    };

    img.src = currentSrc;
  }, [currentSrc, cols]);

  /* ── Handle choosing a gallery photo ── */
  const handlePickPhoto = useCallback((src: string) => {
    setLoaded(false);
    setGrid([]);
    setCurrentSrc(src);
    setShowPicker(false);
  }, []);

  /* ── Handle uploading from device ── */
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLoaded(false);
    setGrid([]);
    setCurrentSrc(url);
    setShowPicker(false);
  }, []);

  /* ── Download as PNG ── */
  const handleDownload = useCallback(() => {
    const charW = 8;
    const charH = 14;
    const canvas = document.createElement('canvas');
    canvas.width = cols * charW + 24;
    canvas.height = grid.length * charH + 24;
    const ctx = canvas.getContext('2d')!;

    // dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${charH}px monospace`;
    ctx.textBaseline = 'top';

    grid.forEach((row, y) => {
      row.forEach((px, x) => {
        ctx.fillStyle = `rgb(${px.r},${px.g},${px.b})`;
        ctx.fillText(px.ch, x * charW + 12, y * charH + 12);
      });
    });

    const link = document.createElement('a');
    link.download = 'ascii-art-love.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [grid, cols]);

  /* ── Loading state ── */
  if (!loaded) {
    return (
      <div className="text-center py-6">
        <motion.span
          className="inline-block text-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ♥
        </motion.span>
        <p className="text-(--color-lavender)/60 text-xs mt-2">
          Creating your portrait...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-4"
    >
      {/* Label */}
      <p className="text-(--color-lavender) text-xs text-center uppercase tracking-widest">
        Our love, in every pixel
      </p>

      {/* ASCII art container */}
      <div
        ref={artRef}
        className="overflow-x-auto rounded-2xl mx-auto select-none"
        style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '12px',
          fontSize: '4.5px',
          lineHeight: '5px',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          letterSpacing: '0px',
          maxWidth: '100%',
          border: '1px solid rgba(230,57,70,0.15)',
          boxShadow: '0 0 40px rgba(230,57,70,0.1)',
        }}
      >
        {grid.map((row, y) => (
          <div key={y} style={{ height: '5px' }}>
            {row.map((px, x) => (
              <span
                key={x}
                style={{ color: `rgb(${px.r},${px.g},${px.b})` }}
              >
                {px.ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* Choose Photo button */}
        <motion.button
          onClick={() => setShowPicker(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-serif
                     text-(--color-cream) cursor-pointer transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(184,169,201,0.25), rgba(212,165,116,0.15))',
            border: '1px solid rgba(184,169,201,0.3)',
            boxShadow: '0 0 20px rgba(184,169,201,0.1)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          Choose Photo
        </motion.button>

        {/* Download button */}
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-serif
                     text-(--color-cream) cursor-pointer transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.25), rgba(212,165,116,0.2))',
            border: '1px solid rgba(230,57,70,0.3)',
            boxShadow: '0 0 20px rgba(230,57,70,0.1)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Save ASCII Art
        </motion.button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Photo picker modal */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowPicker(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm max-h-[70vh] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(26,26,46,0.98), rgba(15,15,26,0.98))',
                border: '1px solid rgba(230,57,70,0.2)',
                boxShadow: '0 0 60px rgba(230,57,70,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-serif text-lg text-(--color-cream)">Choose a Photo</h3>
                <button
                  onClick={() => setShowPicker(false)}
                  className="text-(--color-lavender)/60 hover:text-(--color-cream) transition-colors cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Upload from device */}
              <div className="px-5 pt-4 pb-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm
                             font-serif text-(--color-cream) cursor-pointer transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(230,57,70,0.2), rgba(212,165,116,0.15))',
                    border: '1px dashed rgba(230,57,70,0.4)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload from device
                </motion.button>
              </div>

              <p className="text-(--color-lavender)/40 text-xs text-center py-1">or pick from our memories</p>

              {/* Photo grid */}
              <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 160px)' }}>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo) => {
                    const name = photo.split('/').pop()?.replace('.webp', '') ?? '';
                    return (
                      <motion.button
                        key={photo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePickPhoto(photo)}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        style={{
                          border: currentSrc === photo
                            ? '2px solid var(--color-rose)'
                            : '2px solid transparent',
                        }}
                      >
                        <img
                          src={photo}
                          alt={name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300
                                     group-hover:scale-110"
                        />
                        {currentSrc === photo && (
                          <div className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(230,57,70,0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
