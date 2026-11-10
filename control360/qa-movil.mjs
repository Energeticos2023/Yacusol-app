// QA de la presentación para celulares de Control 360.
import fs from "node:fs";
import assert from "node:assert/strict";
const root = new URL("./", import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), "utf8");
const html = read("index.html"), css = read("styles.css"), movil = read("movil.js");

assert(/name="viewport" content="width=device-width,initial-scale=1/.test(html), "Falta viewport para celulares");
const tabs = [...html.matchAll(/<button data-tab="([a-z]+)"([^>]*)>/g)];
assert(tabs.length >= 9, "No se encontraron los módulos de navegación");
for (const [, tab, attrs] of tabs) assert(/data-short="[^"]{2,10}"/.test(attrs), "Falta nombre corto (máx. 10 letras) para " + tab);
assert(html.includes('id="logout-mobile"'), "Falta botón Salir en la cabecera móvil");
assert(html.includes('src="./movil.js?v='), "No se carga movil.js");
assert(movil.includes('getElementById("logout")'), "Salir móvil debe usar el cierre de sesión seguro existente");

const start = css.indexOf("@media(max-width:860px){");
assert(start > 0, "Falta el bloque de diseño para celulares");
const block = css.slice(start);
for (const rule of [".app-shell{display:block", ".sidebar{position:fixed", "env(safe-area-inset-bottom)", "font-size:16px!important", ".records,.client-directory{max-height:none!important", ".nav button:after{content:attr(data-short)"])
  assert(block.includes(rule), "Regla móvil ausente: " + rule);
assert(css.slice(0, start).includes(".mobile-only{display:none!important}"), "Los controles móviles deben ocultarse en computadora");
console.log("Control360 móvil QA: OK. Módulos=" + tabs.length + ".");
