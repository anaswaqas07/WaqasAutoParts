import { CONTACT, BRAND } from "../data/brand";
import { withBase } from "../lib/withBase";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <img src={withBase(BRAND.logo.icon)} alt="" className="footer__mark" aria-hidden="true" />
      <p className="footer__brand">{BRAND.name}</p>
      <p>{CONTACT.location}</p>
      <p>
        <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
          WhatsApp: {CONTACT.whatsappNumber}
        </a>
      </p>
      <p className="footer__copy">&copy; {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}.</p>
    </footer>
  );
}
