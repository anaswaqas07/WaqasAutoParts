// Pure mapping from overall scroll progress (0..1 across the whole pinned
// cinematic stage) to a frame index + active chapter. Kept dependency-free
// from GSAP/React so the mapping itself is easy to reason about and test.

const DISASSEMBLY_SHARE = 0.7; // fraction of total pinned scroll spent exploding the car
const REASSEMBLY_SHARE = 1 - DISASSEMBLY_SHARE; // remaining fraction spent reassembling

// Within one chapter's scroll sub-range: enter (move toward hold frame),
// hold (stay put so hotspots can be read), exit (move toward next chapter).
const ENTER_FRACTION = 0.4;
const HOLD_FRACTION = 0.35;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

// Returns an array of { chapter, pStart, pEnd } giving each disassembly
// chapter an equal share of the disassembly portion of the scroll.
export function buildChapterRanges(chapters) {
  const n = chapters.length;
  return chapters.map((chapter, i) => ({
    chapter,
    pStart: (i / n) * DISASSEMBLY_SHARE,
    pEnd: ((i + 1) / n) * DISASSEMBLY_SHARE,
  }));
}

function frameWithinChapter(chapter, localT) {
  const { frameStart, frameHold, frameEnd } = chapter;
  if (localT <= ENTER_FRACTION) {
    const t = ENTER_FRACTION === 0 ? 1 : localT / ENTER_FRACTION;
    return lerp(frameStart, frameHold, t);
  }
  if (localT <= ENTER_FRACTION + HOLD_FRACTION) {
    return frameHold;
  }
  const exitStart = ENTER_FRACTION + HOLD_FRACTION;
  const t = (localT - exitStart) / (1 - exitStart);
  return lerp(frameHold, frameEnd, t);
}

// Core mapping used every scroll tick.
export function mapProgressToFrame(progress, manifest) {
  const p = clamp01(progress);
  const ranges = buildChapterRanges(manifest.chapters);

  if (p < DISASSEMBLY_SHARE) {
    const range = ranges.find((r) => p >= r.pStart && p < r.pEnd) || ranges[ranges.length - 1];
    const span = range.pEnd - range.pStart;
    const localT = span === 0 ? 0 : (p - range.pStart) / span;
    const frame = frameWithinChapter(range.chapter, localT);
    return {
      phase: "disassembly",
      chapterId: range.chapter.id,
      frame: Math.round(clamp01Frame(frame, 1, manifest.maxFrame)),
    };
  }

  // Reassembly: reverse the same frames back down to 1 (never re-applies the cover).
  const localT = (p - DISASSEMBLY_SHARE) / REASSEMBLY_SHARE;
  const frame = lerp(manifest.maxFrame, 1, clamp01(localT));
  return {
    phase: "reassembly",
    chapterId: null,
    frame: Math.round(clamp01Frame(frame, 1, manifest.maxFrame)),
  };
}

function clamp01Frame(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// The very first sliver of scroll (before the "reveal" chapter's own enter
// fraction completes) is reserved for the cover-image crossfade so it reads
// as scroll-driven rather than a timed autoplay intro.
export function revealCrossfadeOpacity(progress, manifest) {
  const ranges = buildChapterRanges(manifest.chapters);
  const reveal = ranges[0];
  const span = reveal.pEnd - reveal.pStart;
  const crossfadeEnd = reveal.pStart + span * ENTER_FRACTION;
  if (progress >= crossfadeEnd) return { coverOpacity: 0, frameOpacity: 1 };
  const t = clamp01((progress - reveal.pStart) / (crossfadeEnd - reveal.pStart || 1));
  return { coverOpacity: 1 - t, frameOpacity: t };
}
