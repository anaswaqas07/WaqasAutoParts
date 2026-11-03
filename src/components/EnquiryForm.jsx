import { useState } from "react";
import { buildWhatsAppLink } from "../lib/whatsapp";
import { CONTACT } from "../data/brand";

export default function EnquiryForm({ categoryLabel, partDefault = "" }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [part, setPart] = useState(partDefault);
  const [vinOrPartNumber, setVinOrPartNumber] = useState("");
  const [touched, setTouched] = useState(false);

  const canSend = make.trim() && model.trim() && year.trim() && part.trim();

  const link = buildWhatsAppLink({ make, model, year, part, vinOrPartNumber, categoryLabel });

  return (
    <form
      className="enquiry-form"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (canSend) window.open(link, "_blank", "noopener");
      }}
    >
      <div className="enquiry-form__row">
        <label>
          Make*
          <input value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. BMW" />
        </label>
        <label>
          Model*
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. M4" />
        </label>
      </div>
      <div className="enquiry-form__row">
        <label>
          Year*
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2024" />
        </label>
        <label>
          VIN / part number (optional)
          <input value={vinOrPartNumber} onChange={(e) => setVinOrPartNumber(e.target.value)} />
        </label>
      </div>
      <label>
        Part requested*
        <input value={part} onChange={(e) => setPart(e.target.value)} placeholder="e.g. Front bumper" />
      </label>

      {touched && !canSend && <p className="enquiry-form__error">Please fill make, model, year and the part requested.</p>}

      <button type="submit" className="btn btn--primary" disabled={!canSend}>
        WhatsApp for fitment &amp; availability
      </button>
      <p className="enquiry-form__hint">Send your VIN or part number. Opens WhatsApp ({CONTACT.whatsappNumber}) with your details pre-filled -- nothing is sent automatically.</p>
    </form>
  );
}
