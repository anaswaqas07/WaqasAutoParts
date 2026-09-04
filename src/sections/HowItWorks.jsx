import { motion } from "framer-motion";

const STEPS = [
  { title: "Tell us what you need", body: "Browse or search for a part, and send us your car's brand, model and the part(s) required." },
  { title: "We source it", body: "Our team checks availability and condition across our sourcing network." },
  { title: "You get a quote", body: "We come back with pricing and options — you decide, we arrange delivery/pickup." },
];

export default function HowItWorks() {
  return (
    <section className="section how-it-works">
      <h2>How quoting works</h2>
      <div className="how-it-works__steps">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            className="how-it-works__step"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <span className="how-it-works__number">{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
