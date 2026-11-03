import { Link } from "react-router-dom";
import { saveScrollPosition } from "./scrollRestore";

// Accessible hotspot buttons positioned over the canvas for the categories
// active in the current chapter. On narrow screens these are replaced by a
// plain list beneath the stage instead (overlapping labels would be
// unreadable at that size).
export function CategoryHotspots({ categories, isNarrow }) {
  if (categories.length === 0) return null;

  if (isNarrow) {
    return (
      <nav className="hotspot-list" aria-label="Parts visible in this view">
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/parts/${c.slug}`} onClick={saveScrollPosition}>
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className="hotspot-overlay" aria-label="Parts visible in this view">
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={`/parts/${c.slug}`}
          onClick={saveScrollPosition}
          className="hotspot"
          style={{ left: `${c.hotspot.x * 100}%`, top: `${c.hotspot.y * 100}%` }}
        >
          <span className="hotspot__dot" aria-hidden="true" />
          <span className="hotspot__label">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
