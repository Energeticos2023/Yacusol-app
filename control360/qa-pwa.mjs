// QA de instalación como app (PWA) de Control 360.
import fs from "node:fs";
import assert from "node:assert/strict";
const root = new URL("./", import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), "utf8");
const html = read("index.html"), pwa = read("pwa.js"), sw = read("sw.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

// Manifiesto instalable
assert.equal(manifest.display, "standalone", "La app debe abrirse sin barra del navegador");
assert.equal(manifest.scope, "./", "El alcance debe limitarse a /control360/");
assert.equal(manifest.start_url, "./", "Inicio dentro del alcance");
assert(manifest.name && manifest.short_name, "Faltan nombres de la app");
function pngSize(file) {
  const b = fs.readFileSync(new URL(file, root));
  assert.equal(b.toString("ascii", 1, 4), "PNG", file + " no es PNG");
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}
for (const icon of manifest.icons) {
  const [w, h] = pngSize(icon.src);
  assert.equal(`${w}x${h}`, icon.sizes, "Tamaño real distinto en " + icon.src);
}
assert(manifest.icons.some(i => i.sizes === "192x192"), "Falta ícono 192");
assert(manifest.icons.some(i => i.sizes === "512x512" && i.purpose === "maskable"), "Falta ícono adaptable 512 para Android");
assert.deepEqual(pngSize("./icons/apple-touch-icon.png"), [180, 180], "Ícono de iPhone debe ser 180x180");

// HTML
for (const tag of ['rel="manifest" href="./manifest.webmanifest"', 'rel="apple-touch-icon"', 'name="apple-mobile-web-app-title"', 'src="./pwa.js?v='])
  assert(html.includes(tag), "Falta en index.html: " + tag);
const ids = [...new Set([...pwa.matchAll(/byId\("([a-z0-9-]+)"\)/g)].map(m => m[1]))];
assert(ids.length >= 7, "No se detectaron controles de instalación");
for (const id of ids) assert(html.includes('id="' + id + '"'), "Falta control de instalación " + id);
assert(!pwa.includes("innerHTML") && !sw.includes("innerHTML"), "No usar innerHTML");

// Service worker seguro
assert(sw.includes('const PREFIX = "y360-control360-"'), "Las cachés deben tener prefijo propio");
assert(sw.includes("k.startsWith(PREFIX)"), "Solo debe borrar sus propias cachés (otras apps comparten el dominio)");
assert(sw.includes("url.origin !== self.location.origin"), "No debe interceptar Supabase ni otros dominios");
assert(sw.includes('req.method !== "GET"'), "No debe interceptar envíos de datos");
assert(!/supabase\.co/.test(sw), "El service worker no debe tocar Supabase");
assert(pwa.includes('updateViaCache: "none"'), "El service worker debe actualizarse sin caché HTTP");
console.log("Control360 PWA QA: OK. Íconos=" + manifest.icons.length + "; controles=" + ids.length + ".");
