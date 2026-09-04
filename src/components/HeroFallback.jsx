import { motion } from "framer-motion";

// Lightweight non-WebGL hero for reduced-motion / low-end devices: a single
// crossfade from an "exploded parts" illustration to the assembled car,
// instead of the scroll-scrubbed 3D scene.
export default function HeroFallback() {
  return (
    <div className="hero-fallback">
      <motion.div
        className="hero-fallback__stage"
        initial={{ opacity: 0.4 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <svg viewBox="0 0 400 200" width="100%" height="100%" role="img" aria-label="Car parts assembling into a complete vehicle">
          <rect width="400" height="200" fill="#0d1117" />
          <g fill="#c94f2f">
            <rect x="90" y="100" width="220" height="30" rx="6" />
            <rect x="130" y="72" width="110" height="32" rx="10" />
          </g>
          <g fill="#111418">
            <circle cx="140" cy="140" r="18" />
            <circle cx="260" cy="140" r="18" />
          </g>
        </svg>
      </motion.div>
      <h1 className="hero-fallback__title">Premium Exterior Parts, Sourced Right</h1>
      <p className="hero-fallback__subtitle">
        We source and distribute quality used exterior parts for shops and car owners.
      </p>
    </div>
  );
}
