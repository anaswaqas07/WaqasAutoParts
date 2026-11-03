import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useCinematicManifest, pickVariant, frameUrl } from "./useCinematicManifest";
import { FrameCache, prefetchWindow } from "./frameCache";
import { mapProgressToFrame, revealCrossfadeOpacity } from "./scrollMapping";
import { useEngineSound } from "./useEngineSound";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { CategoryHotspots } from "./CategoryHotspots";
import { consumeScrollPosition, saveScrollPosition } from "./scrollRestore";
import { CATEGORIES } from "../data/categories";
import { withBase } from "../lib/withBase";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SCROLL_VH = 500; // how many viewport-heights of scroll the whole pinned sequence spans
const PRELOAD_RADIUS = 10; // frames to keep decoded around the current position
const EAGER_PRELOAD_COUNT = 14; // frames loaded immediately on mount (reveal + start of engine chapter)

function useIsNarrow(breakpoint = 760) {
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return narrow;
}

export default function CinematicStage() {
  const reducedMotion = useReducedMotion();
  const { manifest } = useCinematicManifest();
  const isNarrow = useIsNarrow();

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cacheRef = useRef(null);
  const variantRef = useRef(null);
  const coverImgRef = useRef(null);

  // Tracks the (frameIndex, coverOpacity, size) combo that was *actually
  // painted* -- not merely requested -- so a late-arriving frame load can
  // still trigger a real redraw instead of being short-circuited by a
  // "nothing changed" check against a request that never painted anything.
  const paintedRef = useRef({ frame: null, cover: null, w: 0, h: 0 });
  const lastGoodBitmapRef = useRef(null); // most recent bitmap actually drawn, for graceful fallback
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const sound = useEngineSound();

  const lastRequestedRef = useRef({ frame: 1, cover: 1 });

  const draw = useCallback((frameIndex, coverOpacity) => {
    lastRequestedRef.current = { frame: frameIndex, cover: coverOpacity };
    const canvas = canvasRef.current;
    const cache = cacheRef.current;
    if (!canvas || !cache) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;

    const sizeChanged = paintedRef.current.w !== w || paintedRef.current.h !== h;
    if (sizeChanged) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    const bitmap = cache.get(frameIndex);
    const usingFallback = !bitmap && !!lastGoodBitmapRef.current;
    const paintKey = bitmap ? frameIndex : usingFallback ? `fallback-${lastGoodBitmapRef.current.frame}` : null;

    const alreadyPainted =
      !sizeChanged && paintedRef.current.frame === paintKey && paintedRef.current.cover === coverOpacity;
    if (alreadyPainted) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const drawCover = (img, alpha) => {
      if (!img || !img.complete || alpha <= 0) return;
      ctx.globalAlpha = alpha;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const drawBitmap = (bmp, alpha) => {
      if (!bmp || alpha <= 0) return;
      ctx.globalAlpha = alpha;
      const scale = Math.max(w / bmp.width, h / bmp.height);
      const dw = bmp.width * scale;
      const dh = bmp.height * scale;
      ctx.drawImage(bmp, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    if (coverOpacity > 0) drawCover(coverImgRef.current, coverOpacity);

    if (bitmap) {
      drawBitmap(bitmap, 1 - coverOpacity);
      lastGoodBitmapRef.current = { bitmap, frame: frameIndex };
      paintedRef.current = { frame: paintKey, cover: coverOpacity, w, h };
    } else if (usingFallback) {
      // Frame not decoded yet -- show the last real frame instead of a gap
      // while the real one loads, rather than leaving the canvas blank.
      drawBitmap(lastGoodBitmapRef.current.bitmap, 1 - coverOpacity);
      paintedRef.current = { frame: paintKey, cover: coverOpacity, w, h };
    } else {
      paintedRef.current = { frame: null, cover: coverOpacity, w, h };
    }

    if (!bitmap && !cache.hasFailed(frameIndex)) {
      const variant = variantRef.current;
      if (variant) cache.load(frameIndex, frameUrl(variant, frameIndex)).then(() => draw(frameIndex, coverOpacity));
    } else if (!bitmap && cache.hasFailed(frameIndex)) {
      setLoadError(true);
    }
  }, []);

  // Set up cache + eager preload once the manifest is ready.
  useEffect(() => {
    if (!manifest || reducedMotion) return undefined;
    const variant = pickVariant(manifest);
    variantRef.current = variant;
    const cache = new FrameCache({ maxSize: isNarrow ? 24 : 40 });
    cacheRef.current = cache;

    // Redraw whatever is *currently* requested (lastRequestedRef), not a
    // hardcoded frame 1 -- if the user has already scrolled by the time
    // these async preloads resolve, forcing frame 1 here would clobber a
    // newer, correct paint with a stale one.
    const redrawCurrent = () => draw(lastRequestedRef.current.frame, lastRequestedRef.current.cover);

    const cover = new Image();
    cover.src = withBase(manifest.chapters[0].coverImage);
    coverImgRef.current = cover;
    cover.onload = redrawCurrent;

    prefetchWindow(cache, {
      centerIndex: 1,
      radius: EAGER_PRELOAD_COUNT,
      buildUrl: (i) => frameUrl(variant, i),
      maxFrame: manifest.maxFrame,
      concurrency: 4,
    }).then(redrawCurrent);

    return () => {
      cache.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, reducedMotion, isNarrow]);

  // Scroll-driven playback. Uses useLayoutEffect + gsap.context so the
  // ScrollTrigger (and the pin-spacer DOM node it inserts) is torn down
  // synchronously before React detaches this component's DOM on unmount --
  // doing this in a normal useEffect lets React remove the subtree first
  // (passive-effect cleanup runs after commit), and GSAP then errors trying
  // to unwrap a pin-spacer whose parent is already gone.
  useLayoutEffect(() => {
    if (!manifest || reducedMotion || !containerRef.current) return undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${TOTAL_SCROLL_VH}%`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate(self) {
          const { chapterId, frame } = mapProgressToFrame(self.progress, manifest);
          const { coverOpacity, frameOpacity } = revealCrossfadeOpacity(self.progress, manifest);

          draw(frame, coverOpacity);

          const cache = cacheRef.current;
          const variant = variantRef.current;
          if (cache && variant) {
            prefetchWindow(cache, {
              centerIndex: frame,
              radius: PRELOAD_RADIUS,
              buildUrl: (i) => frameUrl(variant, i),
              maxFrame: manifest.maxFrame,
              concurrency: 3,
            });
          }

          setActiveChapterId((prev) => (prev === chapterId ? prev : chapterId));
          sound.notifyRevealCheckpoint(frameOpacity >= 1 && coverOpacity === 0);
        },
      });
    }, containerRef);

    // Now that the pin has established the page's full scrollable height,
    // restore any saved position from a category-page visit.
    ScrollTrigger.refresh();
    const savedY = consumeScrollPosition();
    if (savedY != null) {
      requestAnimationFrame(() => window.scrollTo(0, savedY));
    }

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, reducedMotion, draw]);

  // Redraw on resize without waiting for the next scroll tick.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const onResize = () => {
      paintedRef.current.w = 0; // force a redraw at the new size
      draw(lastRequestedRef.current.frame, lastRequestedRef.current.cover);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw, reducedMotion]);

  if (reducedMotion) {
    return <ReducedMotionHero />;
  }

  const activeCategories = CATEGORIES.filter((c) => c.chapter === activeChapterId);

  return (
    <section className="cinematic" ref={containerRef} aria-label="WA AUTO PARTS vehicle showcase">
      <div className="cinematic__stage">
        <canvas ref={canvasRef} className="cinematic__canvas" aria-hidden="true" />
        <CategoryHotspots categories={activeCategories} isNarrow={isNarrow} />
        <div className="cinematic__chrome">
          <SoundButton sound={sound} />
          <Link className="cinematic__bypass" to="/parts" onClick={saveScrollPosition}>
            Browse Parts
          </Link>
        </div>
        {loadError && (
          <p className="cinematic__error" role="status">
            Some imagery could not load -- the showcase may look incomplete, but Browse Parts and WhatsApp enquiries
            still work.
          </p>
        )}
      </div>
    </section>
  );
}

function SoundButton({ sound }) {
  return (
    <button
      type="button"
      className="cinematic__sound"
      onClick={sound.toggle}
      disabled={sound.unavailable}
      aria-pressed={sound.enabled}
    >
      {sound.unavailable ? "Sound unavailable" : sound.enabled ? "Sound: On" : "Sound: Off"}
    </button>
  );
}

function ReducedMotionHero() {
  return (
    <section className="cinematic cinematic--static" aria-label="WA AUTO PARTS vehicle showcase">
      <img src={withBase("/stills/bmw-assembled-hero.jpg")} alt="WA AUTO PARTS showcase BMW M4" className="cinematic__static-image" />
      <nav className="cinematic__static-nav" aria-label="Browse part categories">
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/parts/${c.slug}`}>{c.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
