import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BRANDS, PART_TYPES, PARTS } from "../data/parts";
import PartCard from "../components/PartCard";

export default function BrowseParts() {
  const [searchParams] = useSearchParams();
  const [brand, setBrand] = useState("");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return PARTS.filter((part) => {
      if (brand && part.brand !== brand) return false;
      if (type && part.type !== type) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${part.name} ${part.brand} ${part.model} ${part.type}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [brand, type, query]);

  return (
    <section className="section browse-parts">
      <h1>Browse Parts</h1>
      <div className="browse-parts__filters">
        <input
          type="search"
          placeholder="Search parts, brand or model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All part types</option>
          {PART_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="browse-parts__empty">No parts match those filters yet — try widening your search, or send us a quote request directly.</p>
      ) : (
        <div className="browse-parts__grid">
          {filtered.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      )}
    </section>
  );
}
