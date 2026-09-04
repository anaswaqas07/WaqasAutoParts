import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PART_TYPES } from "../data/parts";

export default function PartCategories() {
  return (
    <section className="section part-categories">
      <h2>What we source</h2>
      <div className="part-categories__grid">
        {PART_TYPES.map((type, i) => (
          <motion.div
            key={type}
            className="part-categories__chip"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link to={`/browse?type=${encodeURIComponent(type)}`}>{type}</Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
