# 💕 A Map of Us

A romantic, mobile-first Valentine's Day web experience that maps your love story through interactive memories, secret gates, and hidden surprises.

## ✨ Features

### 🔐 Secret Entrance
- Password-protected entry gate with an elegant envelope unfold animation
- SHA-256 hashed password verification (default: `072023`)
- 3D CSS perspective paper unfold on correct entry

### 🗺️ Dream Map
- Scroll-driven parallax starfield with 3 depth layers
- Animated SVG path connecting memory pins
- Canvas particle overlay with adaptive counts per device tier
- Interactive pins that reveal memories in a swipeable bottom sheet

### 🔀 Choose-Your-Path
- 3 romantic two-choice prompts that personalize the experience
- Choices persist in `localStorage` so revisiting remembers your answers
- Animated reveal of personalized response messages

### 🧩 Memory Restoration Puzzle
- Drag-and-drop (or tap-to-place) puzzle ordering your memories chronologically
- Visual progress bar and color-coded correctness feedback
- Celebratory animation on completion

### 🥚 Easter Eggs (3 total)
1. **Heart Tap** — Tap the celebration heart 7 times for a secret love message
2. **Long-Press** — Hold the map title for 1.5 seconds for a hidden note
3. **Swipe Sequence** — Swipe ↑↑↓↓ on the entrance screen for a sparkle burst

### 💌 Cinematic Finale
- Animated love letter with line-by-line reveal on lined paper
- Optional video player (see **Customization**)
- Confetti celebration with a "days together" counter
- Replay button to revisit the journey

### 🎨 Design & UX
- Aurora glow ambient background with drift animation
- Floating hearts, sparkles, and twinkling star particles
- Glass morphism cards throughout
- Handwriting (Caveat) + serif (Playfair Display) typography
- Lenis smooth scrolling
- Full `prefers-reduced-motion` support

### 📱 Mobile-First & PWA
- Touch targets ≥ 44px on all interactive elements
- `safe-area-inset` padding for notched devices
- PWA manifest + Workbox service worker with audio/video/image caching
- Gesture support via `@use-gesture/react` (swipe-to-dismiss bottom sheet)
- Haptic feedback via Vibration API

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎛️ Customization

### Changing the Password
Edit `src/lib/crypto.ts`. The default hash is for `"072023"`. To change:

1. Open browser console and run:
   ```js
   async function hash(s) {
     const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
     return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
   }
   hash('your-new-password').then(console.log);
   ```
2. Replace the hash in `crypto.ts` with the output.

### Adding Real Photos
1. Place images in `public/images/` (e.g., `first-date.jpg`)
2. Optionally add `.webp` and `.avif` variants for modern format support
3. Update `src/data/memories.json` with the image paths
4. For LQIP blurs, generate a tiny base64 thumbnail and add to the `lqip` field

### Adding Voice Clips
1. Place audio files in `public/audio/`
2. Update the `voiceClip` field for each memory in `memories.json`

### Adding a Video
1. Place your video in `public/video/`
2. In `src/features/04-finale/VideoPlayer.tsx`, set `hasVideo = true` and update the source path

### Editing the Love Letter
Edit the `letterLines` array in `src/features/04-finale/LetterReveal.tsx`.

### Changing the "Days Together" Start Date
Edit the date in `getDaysTogether()` in `src/features/04-finale/Finale.tsx`.

### Choose-Your-Path Prompts
Edit `pathChoices` in `src/features/02-map/ChooseYourPath.tsx` to customize questions and responses.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool |
| TypeScript ~5.7 | Type safety |
| Tailwind CSS 4 | Styling with design tokens |
| Framer Motion 12 | Animations and transitions |
| Zustand 5 | State management with `persist` middleware |
| Howler.js | Audio playback with iOS unlock |
| canvas-confetti | Celebration effects |
| @use-gesture/react | Touch gesture recognition |
| Lenis | Smooth scrolling |
| VitePWA + Workbox | Progressive Web App support |
| Lottie Web | Animation file support |

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AudioToggle     # Music on/off button
│   ├── Button          # Motion button with haptics
│   ├── FloatingHearts  # Ambient floating particles
│   ├── ProgressIndicator
│   ├── ResponsiveImage # Picture element with AVIF/WebP
│   └── SectionTransition
├── features/
│   ├── 01-entrance/    # Password gate + paper unfold
│   ├── 02-map/         # Dream map + choose-your-path
│   ├── 03-memories/    # Memory cards + puzzle
│   ├── 04-finale/      # Letter, video, celebration
│   └── easter-eggs/    # Hidden interactions
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── lib/                # Utility functions
├── data/               # memories.json
└── styles/             # Global CSS + design tokens
```

---

## 💜 Made with love.
