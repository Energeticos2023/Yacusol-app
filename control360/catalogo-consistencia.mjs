import fs from "node:fs";
import assert from "node:assert/strict";
const source=new URL("../official-catalog/catalogo/catalogo-verificado.json",import.meta.url);
assert(fs.existsSync(source),"No se comprobó catálogo fuente YACUSOL de GitHub (checkout faltante)");
const catalog=JSON.parse(fs.readFileSync(source,"utf8"));
const code=fs.readFileSync(new URL("app.js",import.meta.url),"utf8");
const values=code.match(/const YACUSOL_PRICES=Object\.freeze\(\{([^}]+)\}\);/);
assert(values,"No hay tabla local de precios en Control 360");
const prices=Object.fromEntries([...values[1].matchAll(/(\d+):(\d+)/g)].map(x=>[x[1],Number(x[2])]));
assert.deepEqual(prices,catalog.brands.YACUSOL.unit_prices_liters,"Los precios de Control 360 difieren de la fuente YACUSOL");
for(const [key,price] of Object.entries(catalog.extras_yacusol)){
 const alias=key==="instalacion_basica_huaraz"?"instalacion":key;
 const match=code.match(new RegExp(alias+':\\{nombre:"[^"]+",precio:(\\d+)\\}'));
 assert(match,"Falta adicional en Control 360: "+alias);
 assert.equal(Number(match[1]),price,"Precio distinto para "+alias);
}
assert(code.includes('precio_verificado_en'),"Las cotizaciones no conservan respaldo de tarifa");
console.log("Control 360: catálogo fuente YACUSOL coincide con siete capacidades y siete adicionales.");
