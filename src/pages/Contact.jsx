import { CONTACT, BRAND } from "../data/brand";
import EnquiryForm from "../components/EnquiryForm";

export default function Contact() {
  return (
    <section className="section contact-page">
      <h1>Contact {BRAND.name}</h1>
      <p>{CONTACT.location}</p>
      <p>
        <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
          WhatsApp: {CONTACT.whatsappNumber}
        </a>
      </p>
      <h2>WhatsApp for fitment &amp; availability</h2>
      <EnquiryForm />
    </section>
  );
}
