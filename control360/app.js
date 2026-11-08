/* YACUSOL Control 360 / MVP seguro. Se conecta a proyecto existente. */
"use strict";
const API = "https://kdlthtyxsmcehxwgjkrn.supabase.co";
const API_KEY = "sb_publishable_76SxjVx0QhDPpb99S630Wg_7LHHrJFM";
const ROLES = ["admin","ventas","tecnico"];
const state = { token:null, role:null, user:null, tab:"inicio", records:{}, errors:{} };
const $ = (id) => document.getElementById(id);
const elems = { login:$("login"),app:$("app"),message:$("global-message") };

function say(message,kind="info") {
  elems.message.hidden = false;
  elems.message.textContent = message;
  elems.message.setAttribute("data-kind",kind);
}
function clearNotice(){elems.message.hidden=true;elems.message.textContent="";}
function showErr(err,area) {
  const m = (err&&err.message)||String(err);
  say((area?area+": ":"")+m,"error");
  console.error(area||"YACUSOL",m);
}
function el(tag,text,className){
 const item=document.createElement(tag);
 if(text!==undefined && text!==null) item.textContent=String(text);
 if(className)item.className=className;
 return item;
}
function empty(container,text){
 container.replaceChildren(el("p",text||"Sin registros","muted"));
}
function fmtDate(raw){
 if(!raw)return "Sin fecha";
 const d=new Date(raw.length===10?raw+"T12:00:00Z":raw);
 return Number.isNaN(d.getTime())?String(raw):new Intl.DateTimeFormat("es-PE",{day:"2-digit",month:"short",year:"numeric",timeZone:"America/Lima"}).format(d);
}
function localToday(){
 return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Lima",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}
function money(v){
 if(v===null||v===undefined||v==="")return "Precio por definir";
 return new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(Number(v));
}
function numberOrNull(v){ return v?Number(v):null; }

async function api(path,{method="GET",body=null,token=state.token,headers={}}={}) {
 const h={"apikey":API_KEY,Accept:"application/json",...headers};
 if(token)h.Authorization="Bearer "+token;
 if(body!==null && !(body instanceof File) && !(body instanceof Blob))h["Content-Type"]="application/json";
 const r=await fetch(API+path,{method,headers:h,body:body===null?undefined:typeof body==="string"||body instanceof File||body instanceof Blob?body:JSON.stringify(body)});
 const raw=await r.text();
 let data={};try{data=raw?JSON.parse(raw):{}}catch{data={message:raw.slice(0,250)}}
 if(!r.ok)throw new Error(data.msg||data.message||data.error_description||("Error de servidor "+r.status));
 return data;
}
async function list(table,limit=250){
 return api("/rest/v1/"+encodeURIComponent(table)+"?select=*&order=creado_en.desc&limit="+limit);
}
async function listRaw(table,order,limit=250){
 return api("/rest/v1/"+encodeURIComponent(table)+"?select=*&order="+encodeURIComponent(order)+"&limit="+limit);
}
async function insert(table,data){
 return api("/rest/v1/"+table,{method:"POST",body:data,headers:{"Prefer":"return=representation"}});
}
function loginScreen(){
 state.token=null;state.role=null;state.user=null;
 sessionStorage.removeItem("yacusol_session");
 elems.login.hidden=false;elems.app.hidden=true;$("password").value="";
}
async function resume(token){
 state.token=token;
 const u=await api("/auth/v1/user",{token});
 const role=u?.app_metadata?.yacusol_role;
 if(!ROLES.includes(role))throw new Error("Esta cuenta aún no tiene un rol autorizado. Solicita el acceso a un administrador.");
 state.user=u;state.role=role;
 $("user-label").textContent=(u.email||"Cuenta autorizada")+" · "+role;
 elems.login.hidden=true;elems.app.hidden=false;
 if(role==="tecnico"){
  document.querySelector('[data-tab="prospectos"]').hidden=true;
  document.querySelector('[data-tab="cotizaciones"]').hidden=true;
 }
 await refresh();
}
$("login-form").addEventListener("submit",async(event)=>{
 event.preventDefault();
 const button=event.target.querySelector("button");button.disabled=true;
 $("login-message").textContent="";
 try {
  const email=$("email").value.trim(), password=$("password").value;
  const s=await api("/auth/v1/token?grant_type=password",{method:"POST",body:{email,password},token:null});
  sessionStorage.setItem("yacusol_session",s.access_token);
  await resume(s.access_token);
 }catch(e){$("login-message").textContent=e.message;loginScreen();$("login-message").textContent=e.message;}
 finally{button.disabled=false}
});
$("logout").addEventListener("click",async()=>{
 try{await api("/auth/v1/logout",{method:"POST"})}catch(e){console.warn("Salida de sesión local",e.message)}
 loginScreen();
});
document.querySelectorAll(".nav [data-tab]").forEach(button=>button.addEventListener("click",()=>{
 state.tab=button.dataset.tab;
 document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b===button));
 document.querySelectorAll(".tab-pane").forEach(p=>p.hidden=p.id!=="tab-"+state.tab);
 const titles={inicio:"Resumen del negocio",prospectos:"Prospectos",cotizaciones:"Cotizaciones",media:"Fotos y videos",mantenimiento:"Mantenimiento",campanas:"Campañas"};
 $("page-heading").textContent=titles[state.tab];
 clearNotice();
}));
$("refresh").addEventListener("click",()=>refresh());

async function refresh(){
 clearNotice();
 // Una tabla todavía no migrada puede fallar: los demás módulos siguen visibles.
 const specs=[
  ["prospectos",()=>list("prospectos")],
  ["cotizaciones",()=>list("cotizaciones")],
  ["media_assets",()=>list("media_assets")],
  ["ventas",()=>listRaw("ventas","creado_en.desc")],
  ["equipos",()=>listRaw("equipos","creado_en.desc")],
  ["mantenimientos",()=>listRaw("mantenimientos","registrado_en.desc")]
 ];
 const results=await Promise.allSettled(specs.map(s=>s[1]()));
 for(let i=0;i<specs.length;i++){
  const k=specs[i][0],r=results[i];
  state.records[k]=r.status==="fulfilled"&&Array.isArray(r.value)?r.value:null;
  state.errors[k]=r.status==="rejected"?r.reason.message:null;
 }
 renderAll();
 const failing=Object.entries(state.errors).filter(x=>x[1]);
 if(failing.length)say("Módulos pendientes o restringidos: "+failing.map(x=>x[0]).join(", ")+". La ampliación de base de datos o los permisos pueden no estar listos.");
}
function count(k){const x=state.records[k];return x===null?"—":String(x.length);}
function recordLine(container,title,subtitle,badge,mode){
 const item=el("div",null,"record"); const head=el("div",null,"record-head");
 head.append(el("strong",title));
 if(badge)head.append(el("span",badge,"pill "+(mode||"")));
 item.append(head);if(subtitle)item.append(el("p",subtitle));container.append(item);
 return item;
}
function renderAll(){
 const ps=state.records.prospectos||[],qu=state.records.cotizaciones||[],vs=state.records.ventas||[],eq=state.records.equipos||[],media=state.records.media_assets||[];
 $("kpi-prospectos").textContent=count("prospectos");
 $("kpi-cotizaciones").textContent=state.records.cotizaciones===null?"—":String(qu.filter(x=>["enviada","aceptada"].includes(x.estado)).length);
 $("kpi-ventas").textContent=count("ventas");
 const due=dueItems();
 $("kpi-mantenimientos").textContent=state.records.equipos===null?"—":String(due.filter(x=>x.days<=30).length);
 const f=$("funnel");f.replaceChildren();
 for(const etapa of ["nuevo","contactado","calificado","cotizado","ganado","perdido"]){
  const c=ps.filter(x=>x.etapa===etapa).length;
  const item=el("div",null,"funnel-item"),track=el("div",null,"funnel-track"),bar=el("div",null,"funnel-bar");
  bar.style.width=(ps.length?100*c/ps.length:0)+"%";track.append(bar);
  item.append(el("span",etapa,"funnel-label"),track,el("span",state.records.prospectos===null?"—":c,"funnel-number"));f.append(item);
 }
 const pri=$("priorities");pri.replaceChildren();
 const todo=ps.filter(x=>x.etapa!=="ganado"&&x.etapa!=="perdido").sort((a,b)=>String(a.siguiente_contacto||a.creado_en).localeCompare(String(b.siguiente_contacto||b.creado_en))).slice(0,4);
 for(const p of todo)recordLine(pri,p.nombre,(p.distrito||"Distrito pendiente")+" · "+p.etapa,"Seguimiento");
 if(due.length)recordLine(pri,"Revisiones de mantenimiento",due.filter(x=>x.days<=30).length+" equipos próximos o vencidos","Posventa","warning");
 if(!pri.children.length)pri.append(el("p","Sin acciones registradas.","muted"));
 const pl=$("prospect-list");pl.replaceChildren();
 for(const p of ps.slice(0,80))recordLine(pl,p.nombre,(p.distrito||"Zona no registrada")+" · "+(p.fuente||"manual")+" · "+fmtDate(p.creado_en),p.etapa,p.etapa==="ganado"?"success":"");
 const ql=$("quote-list");ql.replaceChildren();
 for(const q of qu.slice(0,80))recordLine(ql,(q.referencia||q.modelo),money(q.precio_total)+" · "+fmtDate(q.creado_en),q.estado,q.estado==="aceptada"?"success":"");
 const select=$("quote-prospect"),current=select.value;select.replaceChildren(el("option","Sin prospecto vinculado"));
 select.firstChild.value="";
 for(const p of ps){const option=el("option",p.nombre+" · "+(p.distrito||"" ));option.value=p.id;select.append(option)}
 if([...select.options].some(o=>o.value===current))select.value=current;
 renderMedia(media);
 const ml=$("maintenance-list");ml.replaceChildren();
 for(const m of (state.records.mantenimientos||[]).slice(0,50))recordLine(ml,"Servicio "+fmtDate(m.fecha_realizada),(m.tipo||"Mantenimiento")+" · "+(m.observaciones||"Sin observaciones"),"Realizado","success");
 const eql=$("equipment-list");eql.replaceChildren();
 for(const x of due.slice(0,80))recordLine(eql,x.modelo+" "+(x.capacidad_l||"")+" L","Próxima revisión: "+fmtDate(x.date)+" · "+x.days+" días",x.days<0?"Vencido":x.days<=30?"Próximo":"Programado",x.days<=30?"warning":"");
 if(state.records.equipos===null)empty(eql,"No disponible: revisa permisos o conexión.");
}
function addMonths(base,months){
 const d=new Date(base+"T12:00:00Z");
 if(Number.isNaN(d.getTime()))return null;
 const original=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);
 const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
 d.setUTCDate(Math.min(original,last));return d;
}
function dueItems(){
 const arr=state.records.equipos||[], maint=state.records.mantenimientos||[],today=new Date(localToday()+"T12:00:00Z");
 return arr.map(x=>{
  const visits=maint.filter(m=>m.equipo_id===x.id).map(m=>m.fecha_realizada).filter(Boolean).sort();
  const anchor=visits.length?visits[visits.length-1]:x.instalado_el;
  if(!anchor)return null;
  const when=addMonths(anchor,Number(x.intervalo_meses||12));if(!when)return null;
  return {modelo:x.modelo,capacidad_l:x.capacidad_l,date:when.toISOString().slice(0,10),days:Math.round((when-today)/86400000)};
 }).filter(Boolean).sort((a,b)=>a.days-b.days);
}
$("prospect-form").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!["admin","ventas"].includes(state.role))return say("No tienes permisos para registrar prospectos.");
 const d=Object.fromEntries(new FormData(e.target));
 const data={nombre:d.nombre.trim(),telefono:d.telefono.replace(/[()\s-]/g,"")||null,distrito:d.distrito||null,fuente:d.fuente,campana:d.campana||null,personas:numberOrNull(d.personas),necesidad:d.necesidad||null};
 try{await insert("prospectos",data);e.target.reset();await refresh();say("Prospecto registrado. Completa su seguimiento y cotización.");}catch(err){showErr(err,"Prospecto")}
});
$("quote-form").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!["admin","ventas"].includes(state.role))return say("Tu rol no permite cotizar.");
 const d=Object.fromEntries(new FormData(e.target));
 const components=d.paquete==="navidad"?["Termotanque","Tubos","Estructura","Barra de magnesio","Resistencia eléctrica"]:["Termotanque","Tubos","Estructura"];
 const data={prospecto_id:d.prospecto_id||null,modelo:d.modelo.trim(),capacidad_l:numberOrNull(d.capacidad_l),precio_total:d.precio_total!==""?Number(d.precio_total):null,valido_hasta:d.valido_hasta||null,notas:d.notas||null,componentes:components,estado:"borrador"};
 try{await insert("cotizaciones",data);e.target.reset();await refresh();say("Borrador registrado. Verifica compatibilidad y condiciones comerciales antes de enviarlo.");}catch(err){showErr(err,"Cotización")}
});
async function sha256(file){
 if(!window.crypto?.subtle)throw new Error("El navegador debe usar HTTPS para verificar la huella del original.");
 const buffer=await file.arrayBuffer();
 const digest=await crypto.subtle.digest("SHA-256",buffer);
 return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
$("media-form").addEventListener("submit",async e=>{
 e.preventDefault();
 const d=Object.fromEntries(new FormData(e.target)),file=$("media-file").files[0];
 if(!file)return;
 const allowed=["image/jpeg","image/png","image/webp","video/mp4"];
 if(!allowed.includes(file.type))return say("Tipo de archivo no permitido.");
 if(file.size>50*1024*1024)return say("Archivo demasiado grande (máximo 50 MB).");
 if(!d.derechos_confirmados)return say("Debes confirmar derechos sobre el material.");
 if(d.permiso_publicitario&&!d.evidencia_permiso?.trim())return say("Registra una referencia verificable del permiso de publicidad.");
 const button=e.target.querySelector("button");button.disabled=true;
 try {
  const hash=await sha256(file);
  const ext={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","video/mp4":"mp4"}[file.type];
  const name=state.user.id+"/"+crypto.randomUUID()+"."+ext;
  await api("/storage/v1/object/yacusol-media/"+name,{method:"POST",body:file,headers:{"Content-Type":file.type,"x-upsert":"false","cache-control":"3600"}});
  try {
   await insert("media_assets",{bucket_key:name,nombre:d.nombre.trim(),tipo:file.type.startsWith("video")?"video":"foto",etapa_obra:d.etapa_obra,zona:d.zona||null,derechos_confirmados:true,permiso_publicitario:!!d.permiso_publicitario,evidencia_permiso:d.evidencia_permiso||null,sha256_hex:hash});
  } catch (dbError){
   throw new Error("El archivo se subió, pero su ficha no se guardó. Contacta al administrador con la ruta "+name+". Detalle: "+dbError.message);
  }
  e.target.reset();await refresh();say("Original guardado en el depósito privado. Su uso publicitario aún requiere revisión y aprobación.");
 }catch(err){showErr(err,"Subida")}finally{button.disabled=false}
});
async function signedLink(path){
 const data=await api("/storage/v1/object/sign/yacusol-media/"+path,{method:"POST",body:{expiresIn:120}});
 const signed=data.signedURL||data.signedUrl||data.url;
 if(!signed)throw new Error("No se pudo generar enlace temporal.");
 const final=new URL(signed.startsWith("/object/")?API+"/storage/v1"+signed:signed,API);
 if(final.origin!==new URL(API).origin)throw new Error("Destino de archivo inválido.");
 return final.href;
}
async function openMedia(m){
 const tab=window.open("about:blank","_blank");
 try {
  const link=await signedLink(m.bucket_key);
  if(tab){tab.opener=null;tab.location.replace(link)}
  else say("Tu navegador bloqueó la ventana del archivo. Permite ventanas emergentes para este dominio.");
 } catch(e){if(tab)tab.close();showErr(e,"Archivo")}
}
async function approveMedia(m){
 if(state.role!=="admin")return;
 if(!m.derechos_confirmados||!m.permiso_publicitario||!m.evidencia_permiso)return say("El original debe contar con derechos y consentimiento publicitario documentado.");
 if(!window.confirm("¿Has inspeccionado el archivo ORIGINAL y comprobado marca YACUSOL, integridad, estado de obra y consentimiento?"))return;
 try{
  await api("/rest/v1/media_assets?id=eq."+encodeURIComponent(m.id),{method:"PATCH",body:{original_verificado:true,aprobado_marketing:true,aprobado_por:state.user.id,aprobado_en:new Date().toISOString()},headers:{"Prefer":"return=representation"}});
  await refresh();say("Medio aprobado para uso publicitario. El agente IA aún necesita acceso autorizado.");
 }catch(e){showErr(e,"Aprobación")}
}
function renderMedia(arr){
 const target=$("media-list"),ok=$("approved-media");target.replaceChildren();ok.replaceChildren();
 for(const m of arr.slice(0,120)){
  const title=(m.tipo==="video"?"🎬 ":"📷 ")+m.nombre;
  const description=(m.etapa_obra||"Por verificar")+" · "+(m.zona||"Sin zona")+" · "+fmtDate(m.creado_en);
  const item=recordLine(target,title,description,m.aprobado_marketing?"Aprobado":"Privado",m.aprobado_marketing?"success":"warning");
  const open=el("button","Ver original (enlace temporal)");open.addEventListener("click",()=>openMedia(m));item.append(open);
  if(state.role==="admin"&&!m.aprobado_marketing){
   const approve=el("button","Verificar y aprobar marketing");
   approve.addEventListener("click",()=>approveMedia(m));item.append(approve);
  }
  if(m.aprobado_marketing)recordLine(ok,title,description,"Aprobado","success");
 }
}
(async()=>{
 const token=sessionStorage.getItem("yacusol_session");
 if(!token)return;
 try{await resume(token)}catch(err){loginScreen();$("login-message").textContent="Sesión expirada o no autorizada. Vuelve a ingresar.";}
})();
