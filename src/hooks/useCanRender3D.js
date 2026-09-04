import { useMemo } from "react";
import { useReducedMotion } from "./useReducedMotion";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

// Decides whether to render the real R3F scene or fall back to the static
// image-crossfade version (reduced-motion preference, no WebGL, or a
// device signal suggesting it can't comfortably run a 3D scroll scene).
export function useCanRender3D() {
  const reducedMotion = useReducedMotion();

  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (!hasWebGL()) return false;
    const lowCores = typeof navigator !== "undefined" && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    return !lowCores;
  }, []);

  return supported && !reducedMotion;
}
