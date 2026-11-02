// Browser cache for the Hexamind site (no backend).
//  - /products/*  images: cache-first (they never change for a given filename)
//  - /data/*.json catalogue: stale-while-revalidate
//  - Next static assets: cache-first
const VERSION = "hx-v1";
const IMG = `${VERSION}-img`;
const DATA = `${VERSION}-data`;
const STATIC = `${VERSION}-static`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  const net = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => hit);
  return hit || net;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.startsWith("/products/")) e.respondWith(cacheFirst(req, IMG));
  else if (url.pathname.startsWith("/data/")) e.respondWith(staleWhileRevalidate(req, DATA));
  else if (url.pathname.startsWith("/_next/static/")) e.respondWith(cacheFirst(req, STATIC));
});
