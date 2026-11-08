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
 const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Lima",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
 const get=type=>parts.find(x=>x.type===type)?.value;
 return get("year")+"-"+get("month")+"-"+get("day");
}
function money(v){
 if(v===null||v===undefined||v==="")return "Precio por definir";
 return new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(Number(v));
}
function numberOrNull(v){ return v?Number(v):null; }

async function api(path,{method="GET",body=null,token=state.token,headers={},retried=false}={}) {
 const h={"apikey":API_KEY,Accept:"application/json",...headers};
 if(token)h.Authorization="Bearer "+token;
 if(body!==null && !(body instanceof File) && !(body instanceof Blob))h["Content-Type"]="application/json";
 let r=await fetch(API+path,{method,headers:h,body:body===null?undefined:typeof body==="string"||body instanceof File||body instanceof Blob?body:JSON.stringify(body)});
 if(r.status===401 && token && !retried && !path.startsWith("/auth/v1/token")){
  const fresh=await refreshSession();
  return api(path,{method,body,token:fresh,headers,retried:true});
 }
 const raw=await r.text();
 let data={};try{data=raw?JSON.parse(raw):{}}catch{data={message:raw.slice(0,250)}}
 if(!r.ok)throw new Error(data.msg||data.message||data.error_description||("Error de servidor "+r.status));
 return data;
}
async function refreshSession(){
 const refresh=sessionStorage.getItem("yacusol_refresh");
 if(!refresh)throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
 const r=await fetch(API+"/auth/v1/token?grant_type=refresh_token",{
  method:"POST",
  headers:{"apikey":API_KEY,"Content-Type":"application/json"},
  body:JSON.stringify({refresh_token:refresh})
 });
 if(!r.ok)throw new Error("La sesión expiró. Inicia sesión nuevamente.");
 const data=await r.json();
 if(!data.access_token||!data.refresh_token)throw new Error("No fue posible renovar la sesión.");
 sessionStorage.setItem("yacusol_session",data.access_token);
 sessionStorage.setItem("yacusol_refresh",data.refresh_token);
 state.token=data.access_token;return data.access_token;
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
 sessionStorage.removeItem("yacusol_refresh");
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
  for(const tab of ["prospectos","cotizaciones","ventas"])document.querySelector(`[data-tab="${tab}"]`).hidden=true;
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
  if(s.refresh_token)sessionStorage.setItem("yacusol_refresh",s.refresh_token);
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
 const titles={inicio:"Resumen del negocio",prospectos:"Prospectos",cotizaciones:"Cotizaciones",ventas:"Ventas e instalaciones",media:"Fotos y videos",mantenimiento:"Mantenimiento",campanas:"Campañas"};
 $("page-heading").textContent=titles[state.tab];
 clearNotice();
}));
$("refresh").addEventListener("click",()=>refresh());

async function refresh(){
 clearNotice();
 // Una tabla todavía no migrada puede fallar: los demás módulos siguen visibles.
 const specs=[
  ["prospectos",()=>state.role==="tecnico"?[]:list("prospectos")],
  ["clientes",()=>state.role==="tecnico"?[]:list("clientes")],
  ["cotizaciones",()=>state.role==="tecnico"?[]:list("cotizaciones")],
  ["media_assets",()=>list("media_assets")],
  ["ventas",()=>state.role==="tecnico"?[]:listRaw("ventas","creado_en.desc")],
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
 const ps=state.records.prospectos||[],qu=state.records.cotizaciones||[],vs=state.records.ventas||[],eq=state.records.equipos||[],media=state.records.media_assets||[],customers=state.records.clientes||[];
 $("kpi-prospectos").textContent=count("prospectos");
 $("kpi-cotizaciones").textContent=state.records.cotizaciones===null?"—":String(qu.filter(x=>["enviada","aceptada"].includes(x.estado)).length);
 $("kpi-ventas").textContent=state.records.ventas===null?"—":String(vs.filter(v=>v.estado==="confirmada").length);
 const due=dueItems();
 $("kpi-mantenimientos").textContent=state.records.equipos===null?"—":String(due.filter(x=>x.days<=30).length);
 const f=$("funnel");f.replaceChildren();
 for(const etapa of ["nuevo","contactado","calificado","cotizado","ganado","perdido"]){
  const c=ps.filter(x=>x.etapa===etapa).length;
  const item=el("div",null,"funnel-item"),track=el("progress",null,"funnel-meter");
  track.max=Math.max(ps.length,1);track.value=c;
  item.append(el("span",etapa,"funnel-label"),track,el("span",state.records.prospectos===null?"—":c,"funnel-number"));f.append(item);
 }
 const pri=$("priorities");pri.replaceChildren();
 const todo=ps.filter(x=>x.etapa!=="ganado"&&x.etapa!=="perdido").sort((a,b)=>String(a.siguiente_contacto||a.creado_en).localeCompare(String(b.siguiente_contacto||b.creado_en))).slice(0,4);
 for(const p of todo)recordLine(pri,p.nombre,(p.distrito||"Distrito pendiente")+" · "+p.etapa,"Seguimiento");
 if(due.length)recordLine(pri,"Revisiones de mantenimiento",due.filter(x=>x.days<=30).length+" equipos próximos o vencidos","Posventa","warning");
 if(!pri.children.length)pri.append(el("p","Sin acciones registradas.","muted"));
 const pl=$("prospect-list");pl.replaceChildren();
 for(const p of ps.slice(0,80)){
  const row=recordLine(pl,p.nombre,(p.distrito||"Zona no registrada")+" · "+(p.fuente||"manual")+" · "+fmtDate(p.creado_en),p.etapa,p.etapa==="ganado"?"success":"");
  if(["admin","ventas"].includes(state.role)){
   const select=el("select");select.setAttribute("aria-label","Cambiar estado de prospecto "+p.nombre);
   for(const etapa of ["nuevo","contactado","calificado","cotizado","ganado","perdido"]){
    const o=el("option",etapa);o.value=etapa;select.append(o);
   }
   select.value=p.etapa;select.addEventListener("change",async()=>{
    if(!window.confirm("¿Has verificado el cambio de etapa de este prospecto?")){select.value=p.etapa;return;}
    try{await patchRecord("prospectos",p.id,{etapa:select.value,actualizado_en:new Date().toISOString()});await refresh();say("Etapa del prospecto actualizada.");}
    catch(e){select.value=p.etapa;showErr(e,"Etapa")}
   });
   row.append(select);
  }
 }
 const ql=$("quote-list");ql.replaceChildren();
 for(const q of qu.slice(0,80)){
  const row=recordLine(ql,(q.referencia||q.modelo),money(q.precio_total)+" · "+fmtDate(q.creado_en),q.estado,q.estado==="aceptada"?"success":"");
  if(["admin","ventas"].includes(state.role)&&q.estado==="borrador"){
   const b=el("button","Marcar cotización enviada");
   b.addEventListener("click",()=>updateQuoteStatus(q,"enviada"));row.append(b);
  }else if(["admin","ventas"].includes(state.role)&&q.estado==="enviada"){
   const b=el("button","Registrar aceptación confirmada");
   b.addEventListener("click",()=>updateQuoteStatus(q,"aceptada"));row.append(b);
  }
 }
 const select=$("quote-prospect"),current=select.value;select.replaceChildren(el("option","Sin prospecto vinculado"));
 select.firstChild.value="";
 for(const p of ps){const option=el("option",p.nombre+" · "+(p.distrito||"" ));option.value=p.id;select.append(option)}
 if([...select.options].some(o=>o.value===current))select.value=current;
 renderSalesAndCustomers(customers,vs,qu,eq);
 renderMedia(media);
 renderChannelPerformance(ps,qu,vs);
 const ml=$("maintenance-list");ml.replaceChildren();
 for(const m of (state.records.mantenimientos||[]).slice(0,50))recordLine(ml,"Servicio "+fmtDate(m.fecha_realizada),(m.tipo||"Mantenimiento")+" · "+(m.observaciones||"Sin observaciones"),"Realizado","success");
 const eql=$("equipment-list");eql.replaceChildren();
 for(const x of due.slice(0,80))recordLine(eql,x.modelo+" "+(x.capacidad_l||"")+" L","Próxima revisión: "+fmtDate(x.date)+" · "+x.days+" días",x.days<0?"Vencido":x.days<=30?"Próximo":"Programado",x.days<=30?"warning":"");
 for(const x of eq.filter(x=>!x.instalado_el).slice(0,30))recordLine(eql,x.modelo+" "+x.capacidad_l+" L","Fecha de instalación pendiente","Pendiente","warning");
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

function renderChannelPerformance(prospects,quotes,sales){
 const target=$("channel-performance");target.replaceChildren();
 const sources=["facebook","instagram","tiktok","whatsapp","web","referido","manual","otro"];
 const confirmed=sales.filter(v=>v.estado==="confirmada");
 for(const source of sources){
  const prs=prospects.filter(p=>p.fuente===source);
  if(!prs.length)continue;
  const ids=new Set(prs.map(p=>p.id));
  const qs=quotes.filter(q=>ids.has(q.prospecto_id));
  const quoteIds=new Set(qs.map(q=>q.id));
  const sold=confirmed.filter(v=>quoteIds.has(v.cotizacion_id));
  recordLine(target,source.toUpperCase(),prs.length+" prospectos · "+qs.filter(q=>["enviada","aceptada"].includes(q.estado)).length+" cotizaciones enviadas · "+sold.length+" ventas confirmadas","Medido","success");
 }
 if(!target.children.length)empty(target,"No existen contactos atribuibles a canales de campaña.");
}
async function patchRecord(table,id,changes){
 const result=await api("/rest/v1/"+table+"?id=eq."+encodeURIComponent(id),{method:"PATCH",body:changes,headers:{"Prefer":"return=representation"}});
 if(!Array.isArray(result)||result.length!==1)throw new Error("No se confirmó el cambio: revisa permisos y estado del registro.");
 return result[0];
}
async function updateQuoteStatus(quote,status){
 if(!["admin","ventas"].includes(state.role))return;
 if(status==="enviada"&&(!quote.precio_total||quote.precio_total<=0))return say("La cotización necesita precio positivo y condiciones comerciales verificadas.");
 const confirmed=window.confirm(status==="enviada"?"Confirma que la cotización se envió realmente al cliente, fuera de la aplicación.":"Confirma que el cliente aceptó explícitamente la propuesta.");
 if(!confirmed)return;
 try{
  const changes=status==="enviada"?{estado:"enviada",enviada_en:new Date().toISOString()}:{estado:"aceptada",aceptada_en:new Date().toISOString()};
  await patchRecord("cotizaciones",quote.id,changes);await refresh();
  say("Estado verificado: "+status+". El cambio no envía mensajes por WhatsApp.");
 }catch(err){showErr(err,"Cotización")}
}
function fillSelect(id,items,placeholder,valueKey,labelFn,filterFn=()=>true){
 const select=$(id),current=select.value;select.replaceChildren();
 const first=el("option",placeholder);first.value="";select.append(first);
 for(const item of items.filter(filterFn)){
  const o=el("option",labelFn(item));o.value=item[valueKey];select.append(o);
 }
 if(Array.from(select.options).some(o=>o.value===current))select.value=current;
}
function renderSalesAndCustomers(customers,sales,quotes,equipment){
 const list=$("customer-list");list.replaceChildren();
 for(const c of customers.slice(0,30))recordLine(list,c.nombre,(c.zona||"Sin distrito")+" · "+(c.telefono||"Sin teléfono"));
 fillSelect("sale-customer",customers,"Selecciona cliente","id",x=>x.nombre);
 fillSelect("equipment-customer",customers,"Selecciona cliente","id",x=>x.nombre);
 fillSelect("sale-quote",quotes,"Sin cotización asociada","id",x=>x.modelo+" · "+money(x.precio_total),x=>x.estado==="aceptada");
 fillSelect("equipment-sale",sales,"Sin venta vinculada","id",x=>(x.referencia||x.id.slice(0,8))+" · "+money(x.monto_total),x=>x.estado==="confirmada");
 fillSelect("maintenance-equipment",equipment,"Selecciona equipo","id",x=>x.modelo+" "+x.capacidad_l+" L · "+(x.serie||x.id.slice(0,8)));
 const target=$("sales-list");target.replaceChildren();
 for(const v of sales.slice(0,80)){
  const owner=customers.find(c=>c.id===v.cliente_id);
  const row=recordLine(target,owner?.nombre||"Cliente",money(v.monto_total)+" · "+fmtDate(v.fecha)+" · "+(v.referencia||"Sin referencia"),v.estado,v.estado==="confirmada"?"success":"warning");
  if(state.role==="admin"&&v.estado==="borrador"){
   const b=el("button","Confirmar venta");
   b.addEventListener("click",()=>confirmSale(v));row.append(b);
  }
 }
 if(state.role==="tecnico"){
  for(const id of ["customer-form","sale-form","equipment-form"])$(id).hidden=true;
 }
 if(state.role==="ventas"){
  $("maintenance-form").hidden=true;
 }
}
async function confirmSale(sale){
 if(state.role!=="admin")return;
 if(!sale.monto_total||sale.monto_total<=0)return say("Falta el monto de venta real.");
 if(!window.confirm("¿Existe evidencia documental de que la venta se cerró? No confirmar simples reservas o cotizaciones."))return;
 try{await patchRecord("ventas",sale.id,{estado:"confirmada"});await refresh();say("Venta confirmada y contabilizada.");}
 catch(e){showErr(e,"Confirmación de venta")}
}
$("customer-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!["admin","ventas"].includes(state.role))return say("No autorizado.");
 const d=Object.fromEntries(new FormData(e.target));
 try{
  await insert("clientes",{nombre:d.nombre.trim(),telefono:d.telefono.replace(/[()\s-]/g,"")||null,zona:d.zona||null});
  e.target.reset();await refresh();say("Cliente registrado.");
 }catch(err){showErr(err,"Cliente")}
});
$("sale-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!["admin","ventas"].includes(state.role))return say("No autorizado.");
 const d=Object.fromEntries(new FormData(e.target));
 if(!d.cliente_id||!d.fecha||Number(d.monto_total)<=0)return say("Completa cliente, fecha y monto válido.");
 if(d.cotizacion_id){
  const q=(state.records.cotizaciones||[]).find(q=>q.id===d.cotizacion_id);
  if(!q||q.estado!=="aceptada")return say("Solo se puede vincular una cotización aceptada.");
 }
 try{
  await insert("ventas",{cliente_id:d.cliente_id,cotizacion_id:d.cotizacion_id||null,fecha:d.fecha,monto_total:Number(d.monto_total),referencia:d.referencia||null,estado:"borrador"});
  e.target.reset();await refresh();say("Venta registrada en borrador. Un administrador debe verificarla y confirmarla.");
 }catch(err){showErr(err,"Venta")}
});
$("equipment-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!["admin","ventas"].includes(state.role))return say("No autorizado.");
 const d=Object.fromEntries(new FormData(e.target));
 const sale=(state.records.ventas||[]).find(v=>v.id===d.venta_id);
 if(sale&&(sale.estado!=="confirmada"||sale.cliente_id!==d.cliente_id))return say("La venta seleccionada debe estar confirmada y corresponder al cliente.");
 if(d.instalado_el&&d.instalado_el>localToday())return say("No registres como realizada una instalación futura.");
 try{
  await insert("equipos",{cliente_id:d.cliente_id,venta_id:d.venta_id||null,modelo:d.modelo.trim(),capacidad_l:Number(d.capacidad_l),serie:d.serie||null,instalado_el:d.instalado_el||null,intervalo_meses:Number(d.intervalo_meses)});
  e.target.reset();await refresh();say("Equipo registrado. Próximo mantenimiento calculado según fecha de instalación.");
 }catch(err){showErr(err,"Instalación")}
});
$("maintenance-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!["admin","tecnico"].includes(state.role))return say("No autorizado.");
 const d=Object.fromEntries(new FormData(e.target));
 if(!d.equipo_id||!d.fecha_realizada||d.fecha_realizada>localToday())return say("El servicio debe corresponder a un equipo y una fecha realizada.");
 try{
  await insert("mantenimientos",{equipo_id:d.equipo_id,fecha_realizada:d.fecha_realizada,tipo:d.tipo,observaciones:d.observaciones||null});
  e.target.reset();await refresh();say("Servicio registrado; se ha actualizado el cálculo de próxima revisión.");
 }catch(err){showErr(err,"Mantenimiento")}
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
