import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="section brand-story">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <h2>Sourced with care. Distributed with trust.</h2>
        <p>
          We source quality used exterior parts — bumpers, headlights, grills, mirrors and more — and connect them
          with shops and car owners who need them. No guesswork, no dealership markups: just the right part, verified
          condition, and a straightforward quote.
        </p>
      </motion.div>
    </section>
  );
}
