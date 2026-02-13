# Audio Files

Place your audio files here:

## Background Music
- `ambient.mp3` — Soft background music (lo-fi, piano, or acoustic)
  - Recommended: 128kbps, stereo, 2-3 minutes looping

## Voice Clips
- `first-meeting.m4a` — Voice note for "The Day We Met"
- `first-date.m4a` — Voice note for "Our First Date"
- etc.
  - Recommended: AAC 96kbps, mono, 10-30 seconds each

## Encoding Tips
Use FFmpeg to convert:
```bash
# Convert voice clip to AAC
ffmpeg -i input.wav -c:a aac -b:a 96k -ac 1 output.m4a

# Convert background music
ffmpeg -i input.wav -c:a libmp3lame -b:a 128k output.mp3
```

Update `src/data/memories.json` with the filenames (e.g., `"/audio/first-meeting.m4a"`).
