# Video Files

Place your reveal video here:

- `reveal.mp4` — Final reveal video (H.264/AAC)
- `reveal.webm` — WebM version for better compression (optional)
- `poster.jpg` — Video poster/thumbnail image

## Encoding Tips
```bash
# H.264 for universal compatibility
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -vf "scale=-2:720" reveal.mp4

# WebM for smaller file size on Chrome/Android
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 96k -vf "scale=-2:720" reveal.webm

# Generate poster image
ffmpeg -i reveal.mp4 -ss 00:00:01 -frames:v 1 -q:v 2 poster.jpg
```

After adding the video, set `hasVideo = true` in `src/features/04-finale/VideoPlayer.tsx`.
