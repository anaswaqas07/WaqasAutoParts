import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse Parts" },
  { to: "/quote", label: "Get a Quote" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="nav__brand">
        Waqas Auto Parts
      </NavLink>
      <nav className="nav__links">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "nav__link is-active" : "nav__link")} end={link.to === "/"}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
