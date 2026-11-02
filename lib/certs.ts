// Certificate details transcribed from the ACS Registrars Pakistan certificates supplied by the client.
export interface Cert {
  id: string;
  short: string; // badge text
  standard: string;
  title: string;
  number: string;
  pnac: string;
}

export const CERTS: Cert[] = [
  { id: "iso-9001", short: "9001", standard: "ISO 9001:2015", title: "Quality Management System", number: "192743", pnac: "CB 006 QMS" },
  { id: "iso-14001", short: "14001", standard: "ISO 14001:2015", title: "Environmental Management System", number: "EMS 192744", pnac: "CB 006 EMS" },
  { id: "iso-45001", short: "45001", standard: "ISO 45001:2018", title: "Occupational Health & Safety Management", number: "OH&S 192745", pnac: "CB 006 OHSMS" },
];

export const CERT_COMMON = {
  holder: "Hexamind Life Sciences (Pvt.) Ltd.",
  address: "Plot No. 88, 89 Small Industrial Estate, Vehari, Pakistan",
  registrar: "ACS Registrars Pakistan (Pvt.) Ltd.",
  accreditation: "Pakistan National Accreditation Council (PNAC)",
  assessed: "August 9, 2023",
  registered: "September 11, 2023",
  expiry: "September 11, 2027",
  reissued: "September 9, 2026",
  scopeTitle: "Manufacturing of Veterinary and Human Nutraceutical Products",
  scope: [
    "Oral Powder Section (Veterinary Nutraceutical)",
    "Oral Liquid Section (Veterinary Nutraceutical)",
    "Tablet Section (Human Nutraceutical)",
    "Capsule Section (Human Nutraceutical)",
    "Oral Powder / Sachet Section (Human Nutraceutical)",
    "Oral Liquid Section (Human Nutraceutical)",
    "Cream / Ointment Section (Human Nutraceutical)",
    "Oral Liquid Section (Veterinary Herbal / Unani)",
    "Oral Powder Section (Veterinary Herbal / Unani)",
    "Oral Powder Section (Veterinary Homeopathic)",
    "Oral Liquid Section (Veterinary Homeopathic)",
    "Oral Powder Probiotic Section (Veterinary Nutraceutical)",
    "Herbal Extraction Area",
  ],
};
