#!/usr/bin/env bash
# scripts/convert-frames.sh
#
# Reusable FFmpeg conversion: turns a source MP4 clip into a numbered JPEG
# frame sequence for canvas-based scroll-scrubbed playback.
#
# Usage:
#   scripts/convert-frames.sh <input.mp4> <output-dir> <name-prefix> [frame-step] [width] [quality]
#
#   input.mp4     Source clip
#   output-dir    Directory to write frames into (created if missing)
#   name-prefix   File prefix, frames are written as <prefix>_0001.jpg, ...
#   frame-step    Keep 1 of every N decoded frames (default 1 = keep all)
#   width         Output width in px, height auto-scaled keeping aspect (default 1280)
#   quality       JPEG quality 2 (best) - 31 (worst) for mjpeg encoder (default 4 ~ high quality)
#
# Example (used to build the disassembly sequence at half the source frame
# count, 1280px wide):
#   scripts/convert-frames.sh "Car_disassembly_animation.mp4" public/sequences/disassembly disassembly 2 1280 4

set -euo pipefail

INPUT="${1:?input mp4 required}"
OUTDIR="${2:?output dir required}"
PREFIX="${3:?name prefix required}"
STEP="${4:-1}"
WIDTH="${5:-1280}"
QUALITY="${6:-4}"

mkdir -p "$OUTDIR"

if [ "$STEP" -le 1 ]; then
  SELECT_FILTER="scale=${WIDTH}:-2"
else
  SELECT_FILTER="select='not(mod(n\,${STEP}))',scale=${WIDTH}:-2"
fi

ffmpeg -y -i "$INPUT" \
  -vf "$SELECT_FILTER" \
  -vsync vfr \
  -q:v "$QUALITY" \
  "${OUTDIR}/${PREFIX}_%04d.jpg"

COUNT=$(ls -1 "${OUTDIR}/${PREFIX}"_*.jpg | wc -l)
echo "Wrote ${COUNT} frames to ${OUTDIR} (prefix: ${PREFIX}, step: ${STEP}, width: ${WIDTH}px, quality: ${QUALITY})"
