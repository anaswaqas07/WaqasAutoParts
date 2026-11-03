// The 9 part categories from the brief. No confirmed product/catalogue data
// was supplied with this brief (the attached JSON/PDF are brand & imagery
// rules, not an inventory) -- every category therefore routes to an
// enquiry-only page rather than fabricated listings, per instructions.
//
// `hotspot` is a normalized (0-1) anchor point within the cinematic stage,
// estimated by visual inspection of each category's chapter hold frame
// (see public/sequences/disassembly/manifest.json for which frame). These
// are best-effort visual estimates, not derived from exact part metadata.

export const CATEGORIES = [
  {
    slug: "headlights",
    label: "Headlights",
    chapter: "front",
    hotspot: { x: 0.28, y: 0.55 },
  },
  {
    slug: "bumpers",
    label: "Front Bumpers",
    chapter: "front",
    hotspot: { x: 0.19, y: 0.72 },
  },
  {
    slug: "grilles",
    label: "Grilles",
    chapter: "front",
    hotspot: { x: 0.17, y: 0.6 },
  },
  {
    slug: "engine",
    label: "Engine Parts",
    chapter: "engine",
    hotspot: { x: 0.34, y: 0.42 },
    note: "Illustrative: the source footage shows the bonnet open with the engine bay exposed, not the engine lifted out as a separate component.",
  },
  {
    slug: "wheels",
    label: "Wheels",
    chapter: "wheels",
    hotspot: { x: 0.48, y: 0.72 },
  },
  {
    slug: "brakes",
    label: "Brakes",
    chapter: "wheels",
    hotspot: { x: 0.85, y: 0.7 },
  },
  {
    slug: "taillights",
    label: "Taillights",
    chapter: "rear",
    hotspot: { x: 0.88, y: 0.45 },
  },
  {
    slug: "spoilers",
    label: "Spoilers",
    chapter: "rear",
    hotspot: { x: 0.8, y: 0.3 },
  },
  {
    slug: "body-parts",
    label: "Body Parts",
    chapter: "rear",
    hotspot: { x: 0.9, y: 0.55 },
  },
];

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
