// Só é usado quando a aplicação está alojada num site (https): guarda-a no telemóvel
// para abrir também sem rede. Aberta como ficheiro local, não é necessário.
const CACHE = "inspecao-dla1-v1";
const FICHEIROS = ["Inspecao_DLA1.html", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHEIROS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // rede primeiro (para receber atualizações), cópia guardada quando não há rede
  e.respondWith(fetch(e.request).then((r) => {
    const copia = r.clone();
    caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
