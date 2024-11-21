importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );
  
  let root = localStorage.getItem("root");
  let root_prefix = "";
  
  if (root != undefined) {
    root_prefix += root;
  }
  
  const UPDATABLE_URLS = [
    root_prefix + '/app/index.html',
    root_prefix + '/app/modals.js',
    root_prefix + '/app/style.css'
  ];
  
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
  );
  
  workbox.routing.registerRoute(
    ({ request }) => UPDATABLE_URLS.includes(request.url),
    new workbox.strategies.NetworkFirst()
  );
  
  // Cache files in the /assets/ directory
  workbox.routing.registerRoute(
    new RegExp(root_prefix + '/assets/.*'), // Matches all files within /assets/
    new workbox.strategies.CacheFirst({
      cacheName: 'assets-cache', // Custom cache name for assets
    })
  );