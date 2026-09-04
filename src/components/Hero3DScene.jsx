import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CarModel from "./CarModel";
import HeroFallback from "./HeroFallback";
import { useCanRender3D } from "../hooks/useCanRender3D";

gsap.registerPlugin(ScrollTrigger);

// The Canvas `camera` prop only sets position, not orientation — without
// this the camera keeps its default forward direction and the car (near
// the origin) ends up off to one side instead of framed in view.
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(-0.6, 0, 0);
  }, [camera]);
  return null;
}

export default function Hero3DScene() {
  const can3D = useCanRender3D();
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!can3D || !sectionRef.current) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [can3D]);

  if (!can3D) {
    return (
      <section className="hero" aria-label="Waqas Auto Parts introduction">
        <HeroFallback />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="hero hero--3d" aria-label="Waqas Auto Parts introduction">
      <div className="hero__sticky">
        <Canvas shadows camera={{ position: [4, 1.6, 5], fov: 42 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <CameraRig />
            <ambientLight intensity={0.55} />
            <directionalLight position={[5, 6, 4]} intensity={1.4} castShadow />
            <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#7fa6ff" />
            <pointLight position={[0, 2, 4]} intensity={0.4} color="#e2b04a" />
            <CarModel progressRef={progressRef} />
          </Suspense>
        </Canvas>
        <div className="hero__copy">
          <h1>Premium Exterior Parts, Sourced Right</h1>
          <p>Scroll to see it come together — then tell us what you need.</p>
          <span className="hero__scrollcue" aria-hidden="true">
            ↓ scroll
          </span>
        </div>
      </div>
    </section>
  );
}
