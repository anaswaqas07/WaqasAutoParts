// Procedural "exploded view" car built from primitives (no external 3D
// asset dependency/licensing to manage). Swap this out for a real branded
// glTF model later — see README follow-ups.
//
// Each part has an assembled transform (its correct position in the car)
// and an exploded transform (where it floats apart at scroll progress 0).
// Hero3DScene lerps every part between these based on scroll progress.

const BODY_COLOR = "#c94f2f";
const GLASS_COLOR = "#1c2733";
const METAL_COLOR = "#d8dbe0";
const DARK_COLOR = "#111418";

export const CAR_PARTS = [
  {
    id: "chassis",
    geometry: "box",
    args: [2.1, 0.5, 1.5],
    color: BODY_COLOR,
    assembled: { position: [0, -0.2, 0], rotation: [0, 0, 0] },
    exploded: { position: [0, -1.8, 0], rotation: [0, 0, 0] },
    delay: 0.75,
  },
  {
    id: "cabin",
    geometry: "box",
    args: [1.5, 0.5, 1.3],
    color: GLASS_COLOR,
    assembled: { position: [-0.1, 0.28, 0], rotation: [0, 0, 0] },
    exploded: { position: [-0.1, 2.6, 0], rotation: [0.1, 0, 0.05] },
    delay: 0.55,
  },
  {
    id: "hood",
    geometry: "box",
    args: [1.3, 0.14, 1.42],
    color: BODY_COLOR,
    assembled: { position: [1.65, 0.05, 0], rotation: [0, 0, 0] },
    exploded: { position: [3.6, 1.4, 0], rotation: [0, 0, 0.4] },
    delay: 0.35,
  },
  {
    id: "trunk",
    geometry: "box",
    args: [1.1, 0.14, 1.42],
    color: BODY_COLOR,
    assembled: { position: [-1.55, 0.05, 0], rotation: [0, 0, 0] },
    exploded: { position: [-3.6, 1.4, 0], rotation: [0, 0, -0.4] },
    delay: 0.35,
  },
  {
    id: "bumper_front",
    geometry: "box",
    args: [0.22, 0.4, 1.55],
    color: DARK_COLOR,
    assembled: { position: [2.32, -0.25, 0], rotation: [0, 0, 0] },
    exploded: { position: [4.6, -1.4, 0], rotation: [0, 0.5, 0] },
    delay: 0,
  },
  {
    id: "bumper_rear",
    geometry: "box",
    args: [0.22, 0.4, 1.55],
    color: DARK_COLOR,
    assembled: { position: [-2.22, -0.25, 0], rotation: [0, 0, 0] },
    exploded: { position: [-4.6, -1.4, 0], rotation: [0, -0.5, 0] },
    delay: 0,
  },
  {
    id: "grill",
    geometry: "box",
    args: [0.06, 0.28, 1.1],
    color: DARK_COLOR,
    assembled: { position: [2.34, 0, 0], rotation: [0, 0, 0] },
    exploded: { position: [5.4, 0.5, 0], rotation: [0, 0.8, 0] },
    delay: 0.1,
  },
  {
    id: "headlight_l",
    geometry: "box",
    args: [0.12, 0.16, 0.32],
    color: METAL_COLOR,
    assembled: { position: [2.28, 0.08, 0.6] },
    exploded: { position: [4.2, 0.9, 2.6] },
    delay: 0.2,
  },
  {
    id: "headlight_r",
    geometry: "box",
    args: [0.12, 0.16, 0.32],
    color: METAL_COLOR,
    assembled: { position: [2.28, 0.08, -0.6] },
    exploded: { position: [4.2, 0.9, -2.6] },
    delay: 0.2,
  },
  {
    id: "mirror_l",
    geometry: "box",
    args: [0.2, 0.14, 0.1],
    color: BODY_COLOR,
    assembled: { position: [0.35, 0.55, 0.78] },
    exploded: { position: [0.6, 3.2, 3.2] },
    delay: 0.65,
  },
  {
    id: "mirror_r",
    geometry: "box",
    args: [0.2, 0.14, 0.1],
    color: BODY_COLOR,
    assembled: { position: [0.35, 0.55, -0.78] },
    exploded: { position: [0.6, 3.2, -3.2] },
    delay: 0.65,
  },
  {
    id: "wheel_fl",
    geometry: "cylinder",
    args: [0.42, 0.42, 0.32, 20],
    color: DARK_COLOR,
    rotationBase: [0, 0, Math.PI / 2],
    assembled: { position: [0.95, -0.6, 0.83] },
    exploded: { position: [2.5, -2.6, 3.4] },
    delay: 0,
  },
  {
    id: "wheel_fr",
    geometry: "cylinder",
    args: [0.42, 0.42, 0.32, 20],
    color: DARK_COLOR,
    rotationBase: [0, 0, Math.PI / 2],
    assembled: { position: [0.95, -0.6, -0.83] },
    exploded: { position: [2.5, -2.6, -3.4] },
    delay: 0,
  },
  {
    id: "wheel_rl",
    geometry: "cylinder",
    args: [0.42, 0.42, 0.32, 20],
    color: DARK_COLOR,
    rotationBase: [0, 0, Math.PI / 2],
    assembled: { position: [-0.95, -0.6, 0.83] },
    exploded: { position: [-2.5, -2.6, 3.4] },
    delay: 0,
  },
  {
    id: "wheel_rr",
    geometry: "cylinder",
    args: [0.42, 0.42, 0.32, 20],
    color: DARK_COLOR,
    rotationBase: [0, 0, Math.PI / 2],
    assembled: { position: [-0.95, -0.6, -0.83] },
    exploded: { position: [-2.5, -2.6, -3.4] },
    delay: 0,
  },
];
