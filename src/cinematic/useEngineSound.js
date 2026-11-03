import { useEffect, useRef, useState } from "react";
import { withBase } from "../lib/withBase";

// Engine-start sound: muted by default, plays once (forward, start-to-finish)
// the first time the reveal checkpoint is crossed after the user explicitly
// enables sound. Never scrubbed with scroll, never replayed on every
// boundary crossing, stops immediately when disabled.
export function useEngineSound() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.src = withBase("/audio/engine-start.mp3");
    audio.onerror = () => setUnavailable(true);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    if (unavailable) return;
    setEnabled((prev) => {
      const next = !prev;
      if (!next && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (next) hasPlayedRef.current = false; // allow it to play again on the next checkpoint cross
      return next;
    });
  }

  // Call on every scroll tick with whether we've reached/passed the reveal
  // checkpoint this render. Plays at most once per "enabled" session.
  function notifyRevealCheckpoint(reached) {
    if (!enabled || unavailable || !reached || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => setUnavailable(true));
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return { enabled, unavailable, toggle, notifyRevealCheckpoint, stop };
}
