import { useEffect, useState } from "react";
import { withBase } from "../lib/withBase";

// Loads the frame-sequence manifest and resolves which resolution variant
// (default vs. small) to use based on viewport width / save-data hints.
export function useCinematicManifest() {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(withBase("/sequences/disassembly/manifest.json"))
      .then((res) => {
        if (!res.ok) throw new Error(`manifest HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setManifest(data);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[cinematic] failed to load manifest", err);
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { manifest, error };
}

export function pickVariant(manifest) {
  if (!manifest) return null;
  const saveData = typeof navigator !== "undefined" && navigator.connection && navigator.connection.saveData;
  const narrow = typeof window !== "undefined" && window.innerWidth < 760;
  const key = saveData || narrow ? "small" : "default";
  return manifest.variants[key] || manifest.variants.default;
}

export function frameUrl(variant, frameIndex) {
  const padded = String(frameIndex).padStart(4, "0");
  return withBase(`${variant.dir}/disassembly_${padded}.jpg`);
}
