import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PARTS } from "../data/parts";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  carBrand: "",
  carModel: "",
  partsNeeded: "",
  notes: "",
};

export default function Quote() {
  const [searchParams] = useSearchParams();
  const preselected = PARTS.find((p) => p.id === searchParams.get("part"));

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    carBrand: preselected?.brand || "",
    carModel: preselected?.model || "",
    partsNeeded: preselected ? preselected.name : "",
  }));
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim() && !form.email.trim()) next.contact = "Please provide a phone number or email so we can reach you.";
    if (!form.carBrand.trim()) next.carBrand = "Please tell us the car brand.";
    if (!form.partsNeeded.trim()) next.partsNeeded = "Please describe the part(s) you need.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: wire this up to a real submission target (email service / backend / CRM).
    // For now the request is logged locally so the flow can be demonstrated end-to-end.
    console.info("Quote request submitted:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="section quote quote--success">
        <h1>Thanks, {form.name}!</h1>
        <p>We've received your quote request and will get back to you shortly.</p>
      </section>
    );
  }

  return (
    <section className="section quote">
      <h1>Request a Quote</h1>
      <p>Tell us what you need and we'll arrange it for you.</p>
      <form className="quote-form" onSubmit={handleSubmit} noValidate>
        <label>
          Your name*
          <input type="text" value={form.name} onChange={handleChange("name")} />
          {errors.name && <span className="quote-form__error">{errors.name}</span>}
        </label>

        <div className="quote-form__row">
          <label>
            Phone
            <input type="tel" value={form.phone} onChange={handleChange("phone")} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={handleChange("email")} />
          </label>
        </div>
        {errors.contact && <span className="quote-form__error">{errors.contact}</span>}

        <div className="quote-form__row">
          <label>
            Car brand*
            <input type="text" value={form.carBrand} onChange={handleChange("carBrand")} placeholder="e.g. Toyota" />
            {errors.carBrand && <span className="quote-form__error">{errors.carBrand}</span>}
          </label>
          <label>
            Car model
            <input type="text" value={form.carModel} onChange={handleChange("carModel")} placeholder="e.g. Corolla" />
          </label>
        </div>

        <label>
          Part(s) needed*
          <textarea rows={3} value={form.partsNeeded} onChange={handleChange("partsNeeded")} placeholder="e.g. Front bumper, left headlight" />
          {errors.partsNeeded && <span className="quote-form__error">{errors.partsNeeded}</span>}
        </label>

        <label>
          Additional notes
          <textarea rows={3} value={form.notes} onChange={handleChange("notes")} placeholder="Quantity, condition preference, timeline, etc." />
        </label>

        <button type="submit" className="btn btn--primary">
          Submit Quote Request
        </button>
      </form>
    </section>
  );
}
