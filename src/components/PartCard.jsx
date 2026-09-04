import { Link } from "react-router-dom";
import { useTiltCard } from "../hooks/useTiltCard";

export default function PartCard({ part }) {
  const tilt = useTiltCard(8);

  return (
    <div className="part-card" ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
      <div className="part-card__image-wrap">
        <img src={part.images[0]} alt={part.name} loading="lazy" />
      </div>
      <div className="part-card__body">
        <span className="part-card__type">{part.type}</span>
        <h3>{part.name}</h3>
        <p className="part-card__fit">
          Fits {part.brand} {part.model}
        </p>
        <p className="part-card__condition">{part.condition}</p>
        <Link className="btn btn--small" to={`/quote?part=${part.id}`}>
          Request Quote
        </Link>
      </div>
    </div>
  );
}
