"use client";

import { useEffect } from "react";

// Registers the service worker that keeps product images and data in the browser cache.
export default function ClientBoot() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
