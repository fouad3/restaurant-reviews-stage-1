let cacheName = 'restaurant-reviews-v1';

self.addEventListener('install',(event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
           return cache.addAll([
               'css/styles.css',
               'css/responsive.css',
               'js/dbhelper.js',
               'js/main.js',
               'js/restaurant_info.js',
               'data/restaurants.json',
               'https://cdn.polyfill.io/v2/polyfill.min.js?features=Element.prototype.classList',
               'node_modules/focus-visible/dist/focus-visible.min.js',
           ]);
        })

    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
       caches.keys().then((cacheNames)=> {
           cacheNames.filter((cacheNames)=> {
               return cacheNames.startsWith('restaurant-reviews-') && cacheNames != cacheName ;
           }).map((cacheNames)=> {
               return caches.delete(cacheNames);
           })
       })
    );
});

self.addEventListener('fetch', (event) => {
   const reqUrl = event.request.url;
   event.respondWith(
       caches.match(event.request).then((res) => {
           if(res) return res;
           return fetch(event.request).then((res) => {
               if(!(reqUrl.match('mapbox') || reqUrl.match('leaflet'))){
                   let clone = res.clone();
                   caches.open(cacheName).then((cache) => {
                       cache.put(reqUrl, clone);
                   });
               }
               return res;
           });
       })
   );
});
