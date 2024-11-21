const CACHE_NAME = 'room-organizer-cache';
const CACHE_VERSION = 'v1.00.1'; // Ändern Sie die Versionsnummer bei einem Update

const CACHE_FILES = [
  '/', // Ändern Sie dies entsprechend den Dateipfaden Ihrer App
  '/index.html',
  '/service-worker.js',
  '/style.css',
  '/app/index.html',
  '/app/changelog.js',
  '/app/app.js',
  '/app/modals.js',
  '/app/nav.js',
  '/app/style.css',
  '/manifest.json',
  '/assets/logo.png',
  '/assets/favico.ico',
  '/assets/lighthouse.gif',
  '/assets/logo.png',
  '/assets/icons/fontawesome-free-6.4.0-web/css/all.css'
  // Weitere Dateipfade hier hinzufügen
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`${CACHE_NAME}-${CACHE_VERSION}`).then((cache) => {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== `${CACHE_NAME}-${CACHE_VERSION}`) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Aktualisieren Sie den Cache mit der neuen Ressource
        caches.open(`${CACHE_NAME}-${CACHE_VERSION}`).then((cache) => {
          cache.put(event.request, response.clone());
        });
        return response;
      })
      .catch(() => {
        // Wenn die Netzwerkverbindung fehlschlägt, versuchen Sie, die Ressource aus dem Cache zu laden
        return caches.match(event.request);
      })
  );
});
