#!/usr/bin/env bash
# Turns every animated cover GIF into a looping H.264 MP4, a WebP poster
# (first frame) and a 1200×630 JPEG for Open Graph (first frame centred on a
# blurred copy of itself). GIFs are 2–5 MB each and next/image can't optimize
# them; the MP4s are a fraction of that and decode in hardware on phones, and
# link previews refuse images that large. The GIFs stay in place as sources.
# Needs ffmpeg (with libx264) and cwebp.
# Usage: scripts/convert-covers.sh [dir]   (default: public/images/covers)
set -euo pipefail
dir="${1:-public/images/covers}"

for gif in "$dir"/*.gif; do
  base="${gif%.gif}"
  ffmpeg -loglevel error -y -i "$gif" \
    -movflags +faststart -pix_fmt yuv420p -c:v libx264 -preset slow -crf 23 \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -an "$base.mp4"
  ffmpeg -loglevel error -y -i "$gif" -frames:v 1 "$base-poster.png"
  cwebp -quiet -q 80 "$base-poster.png" -o "$base-poster.webp"
  rm "$base-poster.png"
  ffmpeg -loglevel error -y -i "$gif" -frames:v 1 \
    -vf "split[bg][fg];[bg]scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630,gblur=sigma=40[b];[fg]scale=-2:630[f];[b][f]overlay=(W-w)/2:(H-h)/2" \
    -q:v 4 "$base-og.jpg"
  printf '%s  %s → %s + %s + %s\n' "$(basename "$gif")" "$(du -h "$gif" | cut -f1)" \
    "$(du -h "$base.mp4" | cut -f1)" "$(du -h "$base-poster.webp" | cut -f1)" "$(du -h "$base-og.jpg" | cut -f1)"
done
