import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";
const base=new URL("../",import.meta.url),read=p=>fs.readFileSync(new URL(p,base),"utf8");
const root=read("index.html"),contact=read("comercial/red-comercial.js"),
 data=read("asistente/datos.js"),assistant=read("asistente/asistente.js"),
 control=read("control360/app.js");
for(const [name,code] of [["comercial/red-comercial.js",contact],["asistente/datos.js",data],["asistente/asistente.js",assistant],["control360/app.js",control]])
 new vm.Script(code,{filename:name});
assert(root.includes("https://wa.me/51983926721?text=Hola%20Ing."),"Publicidad propia deriva a otro número");
assert(root.includes("Atención YACUSOL: 983 926 721"),"Texto visible promoción desactualizado");
assert(root.includes("Especialista: 942 899 919"),"Falta continuidad de asistencia técnica");
assert(contact.includes("wa.me/51983926721"),"Contactos comerciales no coinciden");
assert(!contact.includes("wa.me/51942899919"),"Derivación comercial antigua");
assert(data.includes('whatsapp: "51983926721"'),"Asistente principal no coincide");
assert(assistant.includes('C.whatsapp || "51983926721"'),"Respaldo del asistente no coincide");
assert(control.includes("Contacto YACUSOL: 983 926 721"),"Cotización formal muestra número antiguo");
assert(control.includes("Técnico: 942 899 919"),"Falta continuidad del número anterior");
console.log("Yacusol-app/Control360: cotizaciones derivadas al nuevo número, continuidad conservada.");
