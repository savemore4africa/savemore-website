// SAVEMORE Member Portal — minimal service worker
// This exists primarily so browsers consider the portal "installable."
// It does not cache pages, so members always see live, up-to-date data.

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    // Pass-through only — no offline caching, since savings data must always be current.
    event.respondWith(fetch(event.request));
});
