import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PARTS } from "../data/parts";
import PartCard from "../components/PartCard";

export default function FeaturedGallery() {
  const featured = PARTS.slice(0, 4);

  return (
    <section className="section featured-gallery">
      <div className="section__header">
        <h2>Featured parts</h2>
        <Link className="link" to="/browse">
          Browse all parts →
        </Link>
      </div>
      <div className="featured-gallery__grid">
        {featured.map((part, i) => (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <PartCard part={part} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
