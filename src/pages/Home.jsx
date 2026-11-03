import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../data/brand";

const CinematicStage = lazy(() => import("../cinematic/CinematicStage"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="cinematic-fallback-spacer" />}>
        <CinematicStage />
      </Suspense>

      <section className="section home-intro">
        <h2>{BRAND.name}</h2>
        <p className="home-intro__tagline">{BRAND.tagline}</p>
        <p>
          Scroll to explore the BMW M4 shown above -- an illustrative navigation experience, not a vehicle for sale.
          When you see a part you need, select its category and send us a WhatsApp enquiry with your vehicle details.
        </p>
        <Link className="btn btn--primary" to="/parts">
          Browse Parts
        </Link>
      </section>
    </>
  );
}
