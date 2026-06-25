/* Daily — service worker: precache the shell, network-first with cache fallback */
const CACHE='daily-v2';
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./icons/icon.svg',
  './css/styles.css',
  './js/config.js','./js/data.js','./js/state.js','./js/calc.js','./js/cloud.js',
  './js/ai.js','./js/ui.js','./js/auth.js','./js/onboarding.js','./js/screens.js',
  './js/sheets.js','./js/app.js'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // only handle same-origin GETs; let Supabase/Anthropic/font calls pass straight through
  if(e.request.method!=='GET'||url.origin!==location.origin){return;}
  e.respondWith(
    fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
