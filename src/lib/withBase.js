// Prefixes a root-relative public asset path with Vite's configured base
// (e.g. "/WaqasAutoParts/" in production, "/" in dev) so runtime fetch()/
// Image/Audio src assignments resolve correctly under a sub-path deploy.
// Vite only rewrites asset references it can see at build time (in HTML/CSS/
// import statements) -- not strings assembled at runtime -- so this has to
// be applied manually everywhere a public/ path is used in JS.
export function withBase(path) {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
