import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";

export default function PartsIndex() {
  return (
    <section className="section parts-index" id="browse-parts">
      <h1>Browse Parts</h1>
      <p>Pick a category to send an enquiry. The BMW M4 shown on the home page is an illustrative navigation experience, not a specific vehicle or stock claim.</p>
      <ul className="parts-index__grid">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link to={`/parts/${c.slug}`} className="parts-index__card">
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
