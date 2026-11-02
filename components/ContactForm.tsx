"use client";

import { useState } from "react";
import { saveInquiry } from "@/lib/catalogCache";
import { WA } from "@/lib/site";

export default function ContactForm() {
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    saveInquiry(f); // saved in this browser — the site has no backend
    const text = encodeURIComponent(
      `New inquiry from ${f.first} ${f.last} (${f.company || "-"})\nEmail: ${f.email}\nPhone: ${f.phone}\nInterest: ${f.interest}\n\n${f.message}`,
    );
    window.open(`https://wa.me/${WA}?text=${text}`, "_blank");
    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <form className="form-w reveal vis d1" onSubmit={submit}>
      <h3>Submit An Inquiry</h3>
      {done && <div className="form-ok">Thank you — your inquiry has been saved and opened in WhatsApp for our team.</div>}
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
      <button className="btn-accent" type="submit" style={{ width: "100%", justifyContent: "center", padding: 16 }}>Submit Inquiry →</button>
    </form>
  );
}
