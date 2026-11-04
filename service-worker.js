// SAVEMORE service worker
//
// 1) Keeps the site installable (as before).
// 2) Lets two public reading pages be opened offline: the homepage and the Financial Education articles.
//
// Safety rules:
//  - Only these two pages are ever stored. Nothing from the portal, admin, chat, games, Firebase or any
//    server is cached, so savings data, scores, announcements and live MORE figures always come from
//    the internet, never from a saved copy.
//  - Online, members always get the newest page. The saved copy is used only when the network is down
//    or very slow.
//  - Change CACHE_NAME whenever you want phones to throw away old saved copies.

var CACHE_NAME = 'savemore-offline-v4';
var SLOW_NETWORK_MS = 4000;   // on a slow connection, show the saved copy after 4 seconds

function scopeUrl() {
    return self.registration.scope;                       // e.g. https://savemore4africa.github.io/savemore-website/
}

var PAGES = {
    home: function () { return scopeUrl(); },                                 // the homepage
    education: function () { return new URL('education.html', scopeUrl()).href; }
};

// which saved page (if any) does this request ask for?
function pageKeyFor(request) {
    if (request.method !== 'GET') return null;
    var url = new URL(request.url);
    if (url.origin !== self.location.origin) return null;
    var scopePath = new URL(scopeUrl()).pathname;
    if (url.pathname === scopePath || url.pathname === scopePath + 'index.html') return PAGES.home();
    if (url.pathname === scopePath + 'education.html') return PAGES.education();
    return null;
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // a failure here must never stop the worker from installing
            return Promise.all(Object.keys(PAGES).map(function (name) {
                var key = PAGES[name]();
                return fetch(key, { cache: 'reload' }).then(function (res) {
                    if (res && res.ok) return cache.put(key, res);
                }).catch(function () {});
            }));
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
        '<p>Connect to the internet once and open this page. After that it can be opened offline.</p></body></html>',
        { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
}

function savedPageResponse(request, key) {
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
    var key = pageKeyFor(event.request);
    if (key) {
        event.respondWith(savedPageResponse(event.request, key));
        return;
    }
    // everything else behaves exactly as before: straight to the network, nothing stored
    event.respondWith(fetch(event.request));
});
