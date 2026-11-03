import { NavLink } from "react-router-dom";
import { BRAND } from "../data/brand";
import { withBase } from "../lib/withBase";

export default function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="nav__brand" aria-label={`${BRAND.name} home`}>
        <picture>
          <source media="(max-width: 640px)" srcSet={withBase(BRAND.logo.icon)} />
          <img src={withBase(BRAND.logo.full)} alt={`${BRAND.name} -- ${BRAND.tagline}`} className="nav__logo" />
        </picture>
      </NavLink>
      <nav className="nav__links" aria-label="Primary">
        <NavLink to="/parts" className={({ isActive }) => (isActive ? "nav__link is-active" : "nav__link")}>
          Browse Parts
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav__link is-active" : "nav__link")}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
