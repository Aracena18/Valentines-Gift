/// <reference types="vite/client" />

declare module '*.m4a' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}
