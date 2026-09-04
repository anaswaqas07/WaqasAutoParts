export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Waqas Auto Parts. Sourcing &amp; distributing quality exterior parts.</p>
      <p className="footer__contact">
        Reach us: <a href="tel:+00000000000">+00 000 0000000</a> · <a href="mailto:info@waqasautoparts.com">info@waqasautoparts.com</a>
      </p>
    </footer>
  );
}
