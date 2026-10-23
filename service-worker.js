// SAVEMORE service worker
//
// 1) Keeps the site installable (as before).
// 2) NEW: lets the Financial Education articles (education.html) be read offline.
//
// Safety rules:
//  - Only education.html is ever stored. Nothing from the portal, admin, chat, games, Firebase or
//    any server is cached, so savings data and scores always come live from the internet.
//  - Online, members always get the newest article. The saved copy is used only when the
//    network is down or very slow.
//  - Change CACHE_NAME whenever you want phones to throw away old saved copies.

var CACHE_NAME = 'savemore-education-v1';
var SLOW_NETWORK_MS = 4000;   // on a slow connection, show the saved copy after 4 seconds

function educationUrl() {
    return new URL('education.html', self.registration.scope).href;
}

function isEducationRequest(request) {
    if (request.method !== 'GET') return false;
    var url = new URL(request.url);
    return url.origin === self.location.origin && /\/education\.html$/.test(url.pathname);
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // a failure here must never stop the worker from installing
            return fetch(educationUrl(), { cache: 'reload' }).then(function (res) {
                if (res && res.ok) return cache.put(educationUrl(), res);
            }).catch(function () {});
        }).then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; })
                .map(function (n) { return caches.delete(n); }));
        }).then(function () { return self.clients.claim(); })
    );
});

function offlineMessage() {
    return new Response(
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Offline | SAVEMORE</title></head>' +
        '<body style="font-family:Arial,sans-serif;text-align:center;padding:40px 20px;color:#222">' +
        '<h1 style="color:#075e3b">You are offline</h1>' +
        '<p>Connect to the internet once and open the Financial Education page. After that it can be read offline.</p>' +
        '<p><a href="index.html" style="color:#075e3b">Back to SAVEMORE</a></p></body></html>',
        { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
}

function educationResponse(request) {
    var key = educationUrl();
    var network = fetch(request).then(function (res) {
        if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(key, copy); });
        }
        return res;
    });

    return caches.match(key).then(function (saved) {
        if (!saved) return network.catch(offlineMessage);
        var slow = new Promise(function (resolve) {
            setTimeout(function () { resolve(saved); }, SLOW_NETWORK_MS);
        });
        // whichever comes first: the live page, or (when offline or slow) the saved page
        return Promise.race([network.catch(function () { return saved; }), slow]);
    });
}

self.addEventListener('fetch', function (event) {
    if (isEducationRequest(event.request)) {
        event.respondWith(educationResponse(event.request));
        return;
    }
    // everything else behaves exactly as before: straight to the network, nothing stored
    event.respondWith(fetch(event.request));
});
