// HVAC Study Hub — Service Worker v1
const CACHE_NAME = 'hvac-study-v2';
const ASSETS = [
  './',
  './index.html',
  './Hydronics_Final_Study_Tool.html',
  './Steam_Exam_Study_Tool.html',
  './HVACR_Practice_Exam_Full.html',
  './1st_Year_Final_Study_Tool.html',
  './Adv_Refrigeration_Final_Study_Tool.html',
  './Practice_Test_Study_Tool.html',
  './Master_HVAC_Exam.html',
  './EPA_608_Certification_Prep.html',
  './Wiring_Diagrams_Study_Tool.html',
  './HVAC_Math_Formulas.html',
  './Tube_Bending_Calculator.html',
  './EMT_Conduit_Bending.html',
  './Threaded_Pipe_Reference.html',
  './Refrigerant_PT_Charts.html',
  './Refrigerant_Charging.html',
  './Gas_Pipe_Sizing.html',
  './Troubleshooting_Flowcharts.html',
  './Nitrogen_Pressure_Test.html',
  './Electrical_Symbols.html',
  './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first, network fallback, then update cache in background
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests and cross-origin
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      // Return cache hit immediately
      if (cached) {
        // Update cache in background (stale-while-revalidate)
        event.waitUntil(
          fetch(event.request).then(function(response) {
            if (response && response.ok) {
              var clone = response.clone();
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, clone);
              });
            }
          }).catch(function() {})
        );
        return cached;
      }
      // No cache: try network
      return fetch(event.request).then(function(response) {
        if (response && response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline and not cached — return offline page for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
