"use client";

import { useState } from "react";
import { saveInquiry } from "@/lib/catalogCache";

// Inquiries are emailed to this address through FormSubmit (the site has no server of its own).
// The first message ever sent makes FormSubmit email a one-time activation link to this inbox.
export const INQUIRY_EMAIL = "info@hexamindlifesciences.com";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (f._honey) return; // hidden field: only bots fill it in
    setStatus("sending");
    saveInquiry(f); // copy kept in this browser as a backup
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${INQUIRY_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Website inquiry — ${f.first} ${f.last}${f.interest ? " (" + f.interest + ")" : ""}`,
          _template: "table",
          _captcha: "false",
          name: `${f.first} ${f.last}`.trim(),
          company: f.company || "-",
          email: f.email, // FormSubmit uses this as the reply-to address
          phone: f.phone || "-",
          product_interest: f.interest || "-",
          message: f.message || "-",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form-w reveal vis d1" onSubmit={submit}>
      <h3>Submit An Inquiry</h3>
      {status === "sent" && (
        <div className="form-ok" role="status">Thank you — your inquiry has been sent to our team. We will get back to you shortly.</div>
      )}
      {status === "error" && (
        <div className="form-ok form-err" role="alert">
          Sorry, your inquiry could not be sent. Please try again, or email us at {INQUIRY_EMAIL} or call +92 61 6775815.
        </div>
      )}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} />
      <div className="fg-row">
        <div className="fg"><label>First Name</label><input name="first" type="text" placeholder="Muhammad" required /></div>
        <div className="fg"><label>Last Name</label><input name="last" type="text" placeholder="Ali" required /></div>
      </div>
      <div className="fg"><label>Company Name</label><input name="company" type="text" placeholder="Your Company" /></div>
      <div className="fg"><label>Email Address</label><input name="email" type="email" placeholder="you@company.com" required /></div>
      <div className="fg"><label>Phone Number</label><input name="phone" type="tel" placeholder="+92 300 0000000" /></div>
      <div className="fg">
        <label>Product Interest</label>
        <select name="interest" defaultValue="">
          <option value="" disabled>Select a category</option>
          <option>Poultry Products</option>
          <option>Large Animals</option>
          <option>Pet Products</option>
          <option>Human Health</option>
          <option>Cosmetics</option>
          <option>Distribution Partnership</option>
          <option>General Enquiry</option>
        </select>
      </div>
      <div className="fg"><label>Brief Message</label><textarea name="message" placeholder="Tell us about your requirements..." /></div>
      <button className="btn-accent" type="submit" disabled={status === "sending"} style={{ width: "100%", justifyContent: "center", padding: 16, opacity: status === "sending" ? 0.7 : 1 }}>
        {status === "sending" ? "Sending…" : "Submit Inquiry →"}
      </button>
    </form>
  );
}
