importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );
  
  const UPDATABLE_URLS = [
      '/app/index.html',
      '/app/modals.js',
      '/app/style.css'
  ];
  
  workbox.routing.registerRoute(
      ({request}) => request.destination === 'image',
      new workbox.strategies.CacheFirst()
  );
  
  workbox.routing.registerRoute(
      ({request}) => UPDATABLE_URLS.includes(request.url),
      new workbox.strategies.NetworkFirst()
  );
  