const CACHE_NAME = 'room-organizer-cache-v1';
const CACHE_URLS = [
    '/assets/logo.png'
    // Hier kannst du weitere URLs von Ressourcen hinzufügen, die du im Cache speichern möchtest
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/assets/logo.png')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});
