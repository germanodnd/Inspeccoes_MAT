// Só é usado quando a aplicação está alojada num site (https): guarda-a no telemóvel
// para abrir também sem rede. Aberta como ficheiro local, não é necessário.
const CACHE = "gda-postes-v6";
const FICHEIROS = ["index.html", "Inspecao_DLA.html", "Visor_3D_DLA.html", "manifest.webmanifest", "icone-180.png", "icone-192.png", "icone-512.png"];

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
