import { Suspense, lazy } from "react";
import BrandStory from "../sections/BrandStory";
import PartCategories from "../sections/PartCategories";
import FeaturedGallery from "../sections/FeaturedGallery";
import HowItWorks from "../sections/HowItWorks";
import CTASection from "../sections/CTASection";

// Three.js/R3F only ships to users who actually land on the home page.
const Hero3DScene = lazy(() => import("../components/Hero3DScene"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div style={{ height: "100vh" }} />}>
        <Hero3DScene />
      </Suspense>
      <BrandStory />
      <PartCategories />
      <FeaturedGallery />
      <HowItWorks />
      <CTASection />
    </>
  );
}
