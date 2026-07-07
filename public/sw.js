// Service Worker for offline support
const CACHE_NAME = 'sof-cache-v3'; // Bump version to force update
const urlsToCache = [
  '/',
  '/courses',
  '/learn',
  '/manifest.json',
  '/documents/influence-psychology.pdf',
  '/documents/persuasion-techniques.pdf',
  '/documents/communication-mastery.pdf',
  '/documents/habit-building-guide.pdf'
];

// Install event - cache assets and skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip caching for chrome extensions, dev tools, or supabase requests if any
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('_next/webpack-hmr')) {
    return;
  }

  // Skip caching for API routes and dynamic routes
  if (event.request.url.includes('/api/') || event.request.url.includes('/women-hub') || event.request.url.includes('/community') || event.request.url.includes('/teacher') || event.request.url.includes('/recommendations') || event.request.url.includes('/settings/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if valid response to cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a basic fallback response if nothing in cache
          return new Response('Offline - No cached version available', { status: 503 });
        });
      })
  );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
