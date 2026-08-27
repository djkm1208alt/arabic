/* Minimal cache-first service worker — PWA groundwork only.
   Caches the core app shell (index.html) and the two Google Fonts
   hosts (stylesheet + font files for Amiri, Cairo, Inter, Fraunces).
   Everything else passes through to the network untouched. */
const CACHE_NAME = "learn-arabic-v1";
const CORE_ASSETS = ["./", "./index.html"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    const isCoreAsset = event.request.mode === "navigate" || url.pathname.endsWith("/index.html");
    const isFont = FONT_HOSTS.includes(url.hostname);
    if (!isCoreAsset && !isFont) return; // let everything else (unhandled) hit the network normally

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return response;
            });
        })
    );
});
