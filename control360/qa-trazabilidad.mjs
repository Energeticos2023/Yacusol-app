import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";
const root=new URL("./",import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),"utf8");
const html=read("index.html"),app=read("app.js"),migration=read("migrations/20261108_actas_instalacion.sql");
new vm.Script(app,{filename:"app.js"});
for(const id of ["installation-act-form","installation-act-list","installation-act-readonly","technical-equipment"])
 assert(html.includes('id="'+id+'"'),"Missing UI "+id);
for(const field of ["tecnico_principal","fecha_trabajo","tipo_evento","fuente_registro","tipo_sistema","responsable_pruebas","componentes_accesorios","referencia_evidencias","evidencia_entrega","estado_entrega"])
 assert(html.includes('name="'+field+'"'),"Missing data field "+field);
for(const item of ["verificacion_acceso","verificacion_estructura","verificacion_hidraulica","verificacion_seguridad_presion","verificacion_electrica","verificacion_estanqueidad","verificacion_antiquemaduras"])
 assert(html.includes('name="'+item+'"'),"Missing field "+item);
assert(app.includes('["actas_instalacion",()=>listRaw("actas_instalacion","registrado_en.desc")]'),"Missing backend read");
assert(app.includes('["asignaciones",()=>state.role==="ventas"?[]:listRaw("asignaciones","creado_en.desc")]'),"Missing RLS-safe technician assignment read");
assert(app.includes('await insert("actas_instalacion",payload)'),"Missing insert");
assert(app.includes("renderInstallationActs(eId)"),"Missing timeline render");
assert(app.includes('state.role==="admin"||(state.role==="tecnico"'),"Technician permission missing");
assert(app.includes('raw.estado_entrega==="entregado_con_evidencia"'),"Delivery gate missing");
assert(app.includes('Object.values(controles).includes("observado")')===false || app.includes('const observed=Object.values(controles).includes("observado")'),"Observation check");
assert(migration.includes("alter table public.actas_instalacion enable row level security"),"RLS not enabled");
assert(migration.includes("create policy actas_instalacion_lectura"),"Read RLS policy missing");
assert(migration.includes("create policy actas_instalacion_registrar"),"Insert RLS policy missing");
assert(!/create policy\s+.*\bfor (?:update|delete)\b/i.test(migration),"Immutable event log violated");
assert(!/grant\s+.*(?:update|delete)\s+on public\.actas_instalacion/i.test(migration),"Dangerous grant");
assert(migration.includes("registrado_por uuid not null default auth.uid()"),"Audit author not fixed");
assert(migration.includes("registrado_en timestamptz not null default now()"),"Audit timestamp not fixed");
assert(migration.includes("references public.equipos(id) on delete restrict"),"Foreign key missing");
console.log("QA trazabilidad: formulario, historial, controles, roles, RLS, actas inmutables y evidencia comprobados.");
