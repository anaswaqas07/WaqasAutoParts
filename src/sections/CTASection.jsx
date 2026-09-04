import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="section cta">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }}>
        <h2>Know what you need?</h2>
        <p>Send us the details and we'll get back with a quote.</p>
        <Link className="btn btn--primary" to="/quote">
          Request a Quote
        </Link>
      </motion.div>
    </section>
  );
}
