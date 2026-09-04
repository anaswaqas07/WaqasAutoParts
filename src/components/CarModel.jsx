import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAR_PARTS } from "../data/carParts";

const tmpVec = new THREE.Vector3();

// Eases a part's own local 0..1 window out of the overall scroll progress,
// using each part's `delay` so parts settle into place in a staggered
// sequence (wheels/bumpers first, cabin/mirrors last) rather than all at once.
function partProgress(progress, delay) {
  const span = 0.55; // how much of the scroll each part takes to travel
  const t = (progress - delay) / span;
  return Math.min(1, Math.max(0, t));
}

function CarPart({ part, progressRef }) {
  const ref = useRef();
  const { assembled, exploded } = part;
  const assembledRot = assembled.rotation || [0, 0, 0];
  const explodedRot = exploded.rotation || assembledRot;
  const base = part.rotationBase || [0, 0, 0];

  useFrame((state) => {
    if (!ref.current) return;
    const p = partProgress(progressRef.current, part.delay);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic

    tmpVec.set(
      THREE.MathUtils.lerp(exploded.position[0], assembled.position[0], eased),
      THREE.MathUtils.lerp(exploded.position[1], assembled.position[1], eased),
      THREE.MathUtils.lerp(exploded.position[2], assembled.position[2], eased)
    );
    ref.current.position.copy(tmpVec);

    ref.current.rotation.set(
      base[0] + THREE.MathUtils.lerp(explodedRot[0], assembledRot[0], eased),
      base[1] + THREE.MathUtils.lerp(explodedRot[1], assembledRot[1], eased),
      base[2] + THREE.MathUtils.lerp(explodedRot[2], assembledRot[2], eased)
    );

    // once assembled, a gentle idle rotation on the whole car reads through
    // the parent group (see CarRig), so nothing extra needed here.
    void state;
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      {part.geometry === "cylinder" ? (
        <cylinderGeometry args={part.args} />
      ) : (
        <boxGeometry args={part.args} />
      )}
      <meshStandardMaterial color={part.color} roughness={0.45} metalness={0.35} />
    </mesh>
  );
}

export default function CarModel({ progressRef }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // mouse-parallax tilt on the whole assembly
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.25, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * -0.08, 0.05);
  });

  return (
    <group ref={groupRef}>
      {CAR_PARTS.map((part) => (
        <CarPart key={part.id} part={part} progressRef={progressRef} />
      ))}
    </group>
  );
}
