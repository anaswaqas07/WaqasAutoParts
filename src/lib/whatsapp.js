import { CONTACT } from "../data/brand";

// Builds a wa.me deep link with the enquiry pre-filled as the message text.
// Opens the user's WhatsApp with the draft ready -- never sends automatically.
export function buildWhatsAppLink({ make, model, year, part, vinOrPartNumber, categoryLabel }) {
  const lines = ["Hi WA AUTO PARTS, I'd like to ask about a part."];
  if (categoryLabel) lines.push(`Category: ${categoryLabel}`);
  if (make) lines.push(`Make: ${make}`);
  if (model) lines.push(`Model: ${model}`);
  if (year) lines.push(`Year: ${year}`);
  if (part) lines.push(`Part needed: ${part}`);
  if (vinOrPartNumber) lines.push(`VIN / part number: ${vinOrPartNumber}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `${CONTACT.whatsappLink}?text=${text}`;
}
