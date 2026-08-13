/* =====================================================================
   ENERGÉTICOS · TERMAS SOLARES — App v5
   Los precios de este archivo son la fuente única para toda la app
   y coinciden con la lista publicada en energeticos2023.github.io/YACUSOL
   ===================================================================== */

const WA = {
  engineer:"51942899919",
  sales1:"51932757214",
  installer:"51961120481",
  sales2:"51983926721",
  sales3:"51941922712",
  maintenance:"51943354751"
};

const brands = {
  yacusol:{
    name:"YACUSOL", premium:true, hero:"yacusol-hero.jpg",
    tagline:"Calidad Premium de ENERGÉTICOS",
    desc:"Nuestra línea Premium para clientes que buscan respaldo técnico, calidad comercial y atención directa de ENERGÉTICOS.",
    specs:{
      "Tanque interno":"Acero inoxidable SUS 316",
      "Aplicación":"Agua caliente sanitaria para vivienda y negocio",
      "Soporte":"Asesoría técnica ENERGÉTICOS",
      "Despacho":"Disponible para atención a nivel nacional"
    }
  },
  xolmax:{
    name:"XOLMAX", hero:"xolmax-hero.png",
    tagline:"Alternativa robusta no presurizada",
    desc:"Línea comercial con capacidades variadas. En ficha técnica XOLMAX 286 L se indica tanque interno acero inox 316 de 0.5 mm y tanque externo acero inox 304.",
    specs:{
      "Tanque interno":"Acero inox 316 / grosor 0.5 mm",
      "Tanque externo":"Acero inox 304",
      "Aislamiento":"Poliuretano 55 mm · conservación hasta 72 h",
      "Tubos":"58 × 1800 mm · eficiencia mayor a 93%"
    }
  },
  luxxol:{
    name:"LUXXOL", hero:"luxxol-hero.png",
    tagline:"Modelo Luminum · tanque expandido",
    desc:"Línea con capacidades desde 107 L hasta 533 L. En ficha LUXXOL se indica tanque interno acero inox 316 de 0.5 mm y tanque externo galvanizado.",
    specs:{
      "Tanque interno":"Acero inox 316 / grosor 0.5 mm",
      "Tanque externo":"Galvanizado · acabado brillante",
      "Aislamiento":"Poliuretano 55 mm · conservación hasta 72 h",
      "Tubos":"58 × 1800 mm · resistencia al granizo 25 mm"
    }
  },
  intipower:{
    name:"INTIPOWER", hero:"intipower-hero.png",
    tagline:"Opción comercial adicional",
    desc:"Alternativa para ampliar la oferta según presupuesto y capacidad requerida por el cliente.",
    specs:{
      "Sistema":"Terma solar de tubos al vacío",
      "Aplicación":"Vivienda y pequeños negocios",
      "Recomendación":"Validar ficha técnica según modelo disponible",
      "Atención":"Cotización y soporte por ENERGÉTICOS"
    }
  }
};

/* --- MODELOS Y PRECIOS (fuente única) --- */
const models = [
  {brand:"yacusol",  liters:120, tubes:12, price:1700, personas:"3 personas"},
  {brand:"yacusol",  liters:150, tubes:15, price:1850, personas:"4 personas"},
  {brand:"yacusol",  liters:200, tubes:20, price:2550, personas:"5 personas"},
  {brand:"yacusol",  liters:250, tubes:25, price:2800, personas:"6 personas"},
  {brand:"yacusol",  liters:300, tubes:30, price:3550, personas:"7 a 8 personas"},
  {brand:"yacusol",  liters:400, tubes:40, price:4450, personas:"10 a 12 personas"},

  {brand:"xolmax",   liters:110, tubes:10, price:1700},
  {brand:"xolmax",   liters:149, tubes:12, price:1950},
  {brand:"xolmax",   liters:180, tubes:15, price:2400},
  {brand:"xolmax",   liters:233, tubes:20, price:2600},
  {brand:"xolmax",   liters:286, tubes:25, price:3000},
  {brand:"xolmax",   liters:339, tubes:30, price:3800},
  {brand:"xolmax",   liters:444, tubes:40, price:4700},
  {brand:"xolmax",   liters:533, tubes:50, price:5400},

  {brand:"luxxol",   liters:107, tubes:8,  price:1250},
  {brand:"luxxol",   liters:128, tubes:10, price:1550},
  {brand:"luxxol",   liters:149, tubes:12, price:1750},
  {brand:"luxxol",   liters:180, tubes:15, price:2200},
  {brand:"luxxol",   liters:233, tubes:20, price:2400},
  {brand:"luxxol",   liters:286, tubes:25, price:2850},
  {brand:"luxxol",   liters:339, tubes:30, price:3600},
  {brand:"luxxol",   liters:444, tubes:40, price:4500},
  {brand:"luxxol",   liters:533, tubes:50, price:5200},

  {brand:"intipower",liters:135, tubes:12, price:1280},
  {brand:"intipower",liters:150, tubes:15, price:1630},
  {brand:"intipower",liters:200, tubes:20, price:1840},
  {brand:"intipower",liters:300, tubes:30, price:2890}
];

/* --- ACCESORIOS Y SERVICIOS (fuente única) --- */
const accessories = [
  {name:"Válvula termostática", price:350, image:"accesorio-valvula-termostatica.jpg",
   desc:"Regula la temperatura del agua en la ducha entre 30 °C y 45 °C con un simple giro. Una vez calibrada, el agua sale siempre a la temperatura ideal. Elimina el riesgo de quemaduras de primer y segundo grado, especialmente en niños y adultos mayores."},
  {name:"Controlador TK", price:450, image:"accesorio-controlador.jpg",
   desc:"Controlador digital de temperatura y nivel de agua. Gestión automática del sistema: visualización de temperatura, llenado y resistencia eléctrica."},
  {name:"Resistencia eléctrica de respaldo", price:110, image:"accesorio-resistencia.jpg",
   desc:"Resistencia eléctrica de respaldo para días sin sol, compatible con termas YACUSOL. Instalación en el tanque principal."},
  {name:"Barra de magnesio", price:80, image:"accesorio-varilla-magnesio.jpg",
   desc:"Ánodo de magnesio para protección anticorrosiva del tanque interior. Se recomienda su revisión o cambio periódico para prolongar la vida útil del equipo."},
  {name:"Tanque asistente 5 litros", price:150, image:"accesorio-tanque-asistente.jpg",
   desc:"Fabricado en acero inoxidable. Controla la presión de ingreso del agua al termotanque y elimina el riesgo de sobrepresión interna."},
  {name:"Tanque asistente 10 litros", price:250, image:"accesorio-tanque-asistente.jpg",
   desc:"Fabricado en acero inoxidable SUS316/SUS304. Recomendado para los modelos de 300 y 400 litros."},
  {name:"Tubo al vacío 58 × 1800 mm", price:80, image:"accesorio-tubo-vacio.png",
   desc:"Tubo al vacío de 58 mm de diámetro exterior × 1,800 mm de longitud, en vidrio de borosilicato 3.3 de 1.6 mm de espesor y tubo interior de 47 mm. Recubrimiento selectivo de triple capa por pulverización magnetrónica: absorción solar ≥ 92 % y emisividad ≤ 8 %."},
  {name:"Servicio de instalación", price:200, image:"",
   desc:"Instalación a cargo del personal técnico de ENERGÉTICOS, dirigido por el Ing. José Rafael Zeña Peche (CIP N° 85540). Incluye evaluación del techo, montaje, conexión hidráulica y eléctrica y puesta en marcha. Precio válido para Huaraz e Independencia."},
  {name:"Estructura de soporte SUS304", price:0, label:"Incluida", image:"",
   desc:"Estructura de soporte en acero inoxidable SUS304 de 1.2 mm de espesor, ángulo de 15°, apta para techos planos e inclinados. Va incluida con el equipo."},
  {name:"Kit de conexión hidráulica", price:0, label:"Según instalación", image:"",
   desc:"Accesorios para la conexión hidráulica de la terma: tuberías, conexiones de 3/4\" (20 mm), llaves y sellos. Se cotiza según la instalación."},
  {name:"Servicio de mantenimiento", price:0, image:"",
   desc:"Mantenimiento preventivo: limpieza de tubos al vacío, revisión de barra de magnesio, válvulas y controlador. Recomendado cada 12 meses. Se cotiza según ubicación y estado del equipo."},
  {name:"Flete o transporte", price:0, label:"Según destino", image:"",
   desc:"Transporte del equipo hasta la dirección o agencia del cliente. Varía según distancia y accesibilidad."}
];

/* --- Componentes del Paquete Todo en Uno (solo YACUSOL) --- */
const PAQUETE = ["Válvula termostática","Controlador TK","Resistencia eléctrica de respaldo","Barra de magnesio"];
const DESCUENTO_PAQUETE = {};            // ej. {120:100} resta S/ 100 al paquete de 120 L
const INSTALACION_INCLUIDA_HUARAZ = true;

/* ===================================================================== */

let selectedModel = null;
let listaBrand = "yacusol";
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => "S/ " + Number(n).toLocaleString("es-PE");
const brandKeys = () => ["yacusol","xolmax","luxxol","intipower"];
const accByName = n => accessories.find(a => a.name === n);
const etiqueta = a => a.price > 0 ? money(a.price) : (a.label || "A cotizar");

function paqueteDe(m){
  const asistente = m.liters >= 300 ? "Tanque asistente 10 litros" : "Tanque asistente 5 litros";
  const items = PAQUETE.concat([asistente]);
  const total = items.reduce((t,n) => t + accByName(n).price, m.price) - (DESCUENTO_PAQUETE[m.liters] || 0);
  return {items, total};
}

function nav(id){
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === id));
  window.scrollTo({top:0, behavior:"smooth"});
}
function wa(number, message){
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
}

/* ---------- Marcas ---------- */
function renderBrandCard(key){
  const b = brands[key], count = models.filter(m => m.brand === key).length;
  return `<button class="brand-card ${key}" type="button" data-brand="${key}">
    <img src="${b.hero}" alt="${b.name}" loading="lazy">
    <span class="brand-info"><strong>${b.name}</strong>
    <span>${b.tagline}<br>${count} capacidades disponibles</span></span>
    ${key === "yacusol" ? '<span class="brand-flag">Premium</span>' : ''}
  </button>`;
}
function renderHomeBrands(){
  $("#homeBrands").innerHTML = brandKeys().map(renderBrandCard).join("");
  $("#brandMenu").innerHTML  = brandKeys().map(renderBrandCard).join("");
  $$("[data-brand]").forEach(btn => btn.addEventListener("click", () => openBrand(btn.dataset.brand)));
}

function openBrand(key){
  const b = brands[key];
  $("#brandHeader").innerHTML = `
    <button class="back-btn" type="button" data-nav="marcas">← Volver a marcas</button>
    <span class="pill ${key === "yacusol" ? "premium-pill" : ""}">${key === "yacusol" ? "Calidad Premium" : "Marca disponible"}</span>
    <h2>${b.name}</h2>
    <p class="lead">${b.desc}</p>
    <img src="${b.hero}" alt="${b.name}" class="brand-hero">`;
  $("#capacityList").innerHTML = models.filter(m => m.brand === key).map(m => `
    <button class="capacity-btn" type="button" data-model="${m.brand}|${m.liters}">
      <strong>${m.liters} L</strong><span>${m.tubes} tubos</span><em>${money(m.price)}</em>
    </button>`).join("");
  $$("#capacityList [data-model]").forEach(btn => btn.addEventListener("click", () => {
    const [brand, liters] = btn.dataset.model.split("|");
    openModel(brand, Number(liters));
  }));
  bindNav();
  nav("capacidades");
}

function openModel(brand, liters){
  selectedModel = models.find(m => m.brand === brand && m.liters === liters);
  const b = brands[brand];
  $("#modelHeader").innerHTML = `
    <button class="back-btn" type="button" onclick="openBrand('${brand}')">← Volver a ${b.name}</button>
    <span class="pill ${brand === "yacusol" ? "premium-pill" : ""}">${b.name}</span>
    <h2>${b.name} ${selectedModel.liters} L</h2>
    <div class="price-display">${money(selectedModel.price)}</div>
    <p class="muted">Precio del equipo. Accesorios, instalación y flete se cotizan aparte.</p>
    <div class="model-summary">
      <div><strong>Capacidad</strong><span>${selectedModel.liters} litros</span></div>
      <div><strong>Tubos</strong><span>${selectedModel.tubes} tubos</span></div>
      <div><strong>Uso referencial</strong><span>${selectedModel.personas || "Consultar"}</span></div>
      <div><strong>Marca</strong><span>${b.name}</span></div>
    </div>`;

  if (brand === "yacusol"){
    const p = paqueteDe(selectedModel);
    $("#packPanel").innerHTML = `
      <h3>Paquete Todo en Uno</h3>
      <div class="price-display alt">${money(p.total)}</div>
      <ul class="pack-list">
        <li>Terma solar ${selectedModel.liters} L</li>
        ${p.items.map(i => `<li>${i}</li>`).join("")}
        ${INSTALACION_INCLUIDA_HUARAZ ? "<li>Traslado e instalación básica en Huaraz e Independencia</li>" : ""}
      </ul>
      <button class="btn whatsapp big" type="button" onclick="quotePack()">Cotizar el paquete</button>`;
    $("#packPanel").classList.remove("hidden");
  } else {
    $("#packPanel").classList.add("hidden");
  }

  $("#specPanel").classList.add("hidden");
  nav("modeloDetalle");
}

function showSpecs(){
  if (!selectedModel) return;
  const b = brands[selectedModel.brand];
  $("#specPanel").innerHTML = `<h3>Especificaciones técnicas</h3>
    <div class="spec-list">
      ${Object.entries(b.specs).map(([k,v]) => `<div class="spec-item"><strong>${k}</strong><span>${v}</span></div>`).join("")}
      <div class="spec-item"><strong>Capacidad seleccionada</strong><span>${selectedModel.liters} litros · ${selectedModel.tubes} tubos</span></div>
    </div>
    <p class="note">Las especificaciones pueden variar por lote o modelo. Confirme la ficha técnica final antes de la compra.</p>`;
  $("#specPanel").classList.remove("hidden");
  $("#specPanel").scrollIntoView({behavior:"smooth", block:"start"});
}

function quoteSelected(){
  if (!selectedModel) return;
  const b = brands[selectedModel.brand];
  wa(WA.sales1, `Hola, deseo cotizar la terma solar ${b.name} ${selectedModel.liters} L de ${selectedModel.tubes} tubos. Precio de lista: ${money(selectedModel.price)}. Por favor confirmar disponibilidad, despacho e instalación.`);
}
function quotePack(){
  if (!selectedModel) return;
  const p = paqueteDe(selectedModel);
  wa(WA.sales1, `Hola, deseo el Paquete Todo en Uno YACUSOL ${selectedModel.liters} L. Precio de lista: ${money(p.total)}. Por favor confirmar disponibilidad e instalación.`);
}

/* ---------- Lista de precios completa ---------- */
function renderLista(){
  $("#listaTabs").innerHTML = brandKeys().map(k =>
    `<button class="tab ${k === listaBrand ? "active" : ""}" type="button" data-lista="${k}">${brands[k].name}</button>`).join("");
  $$("[data-lista]").forEach(b => b.addEventListener("click", () => { listaBrand = b.dataset.lista; renderLista(); }));

  const filas = models.filter(m => m.brand === listaBrand).map(m => `
    <tr>
      <td><strong>${brands[m.brand].name} ${m.liters} L</strong><small>${m.personas || m.tubes + " tubos al vacío"}</small></td>
      <td class="col-tubos">${m.tubes}</td>
      <td class="col-precio">${money(m.price)}</td>
    </tr>`).join("");

  $("#listaEquipos").innerHTML = `
    <table class="price-table">
      <thead><tr><th>Modelo</th><th class="col-tubos">Tubos</th><th class="col-precio">Precio</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>`;

  $("#listaAccesorios").innerHTML = `
    <table class="price-table">
      <thead><tr><th>Accesorio o servicio</th><th class="col-precio">Precio</th></tr></thead>
      <tbody>${accessories.map(a => `
        <tr><td><strong>${a.name}</strong></td>
        <td class="col-precio">${etiqueta(a)}</td></tr>`).join("")}
      </tbody>
    </table>`;
}

/* ---------- Accesorios ---------- */
function renderAccessories(){
  $("#accessoriesList").innerHTML = accessories.map(item => {
    const priceLabel = etiqueta(item);
    const media = item.image
      ? `<img src="${item.image}" alt="${item.name}" class="accessory-media" loading="lazy">`
      : `<div class="accessory-media placeholder">Servicio</div>`;
    const msg = `Hola, deseo información sobre: ${item.name}. Precio de lista: ${priceLabel}.`;
    return `<article class="model-card accessory-card">${media}
      <div class="accessory-content">
        <h4>${item.name}</h4>
        <div class="accessory-price">${priceLabel}</div>
        <p>${item.desc}</p>
        <button class="btn whatsapp accessory-btn" type="button" onclick="wa('${WA.sales1}', ${JSON.stringify(msg)})">Consultar por WhatsApp</button>
      </div></article>`;
  }).join("");
}

/* ---------- Formularios ---------- */
function fillSelects(){
  const brandOpts = brandKeys().map(k => `<option value="${k}">${brands[k].name}${k === "yacusol" ? " Premium" : ""}</option>`).join("");
  $("#nBrand").innerHTML = brandOpts;
  $("#mBrand").innerHTML = brandOpts;
  const caps = [...new Set(models.map(m => `${m.liters} L`))].sort((a,b) => parseInt(a) - parseInt(b));
  $("#nCapacity").innerHTML = caps.map(c => `<option>${c}</option>`).join("");
  $("#mTubes").innerHTML = ["8","10","12","15","20","25","30","40","50","No sé / por verificar"]
    .map(t => `<option>${t}${isNaN(Number(t)) ? "" : " tubos"}</option>`).join("");
}
function submitNational(e){
  e.preventDefault();
  wa(WA.sales1, [
    "Hola, soy cliente de otra ciudad y deseo atención para una terma solar.",
    `Nombre: ${$("#nName").value}`,
    `Celular: ${$("#nPhone").value}`,
    `Ciudad / región: ${$("#nCity").value}`,
    `Marca de interés: ${brands[$("#nBrand").value].name}`,
    `Capacidad aproximada: ${$("#nCapacity").value}`,
    `Comentario: ${$("#nComment").value || "Sin comentario adicional"}`,
    "Por favor confirmar disponibilidad, despacho por agencia y costo de flete."
  ].join("\n"));
}
function submitMaintenance(e){
  e.preventDefault();
  wa(WA.maintenance, [
    "Hola, solicito mantenimiento para mi terma solar.",
    `Nombre: ${$("#mName").value}`,
    `Celular: ${$("#mPhone").value}`,
    `Marca: ${brands[$("#mBrand").value].name}`,
    `Número de tubos: ${$("#mTubes").value}`,
    `Dirección: ${$("#mAddress").value}`,
    `Distrito / ciudad: ${$("#mCity").value}`,
    `Problema principal: ${$("#mProblem").value}`,
    `Comentario: ${$("#mComment").value || "Sin comentario adicional"}`
  ].join("\n"));
}
function submitComment(e){
  e.preventDefault();
  wa(WA.engineer, [
    "Hola Ingeniero, deseo dejar un comentario o sugerencia.",
    `Nombre: ${$("#cName").value}`,
    `Celular: ${$("#cPhone").value || "No indicado"}`,
    `Ciudad: ${$("#cCity").value || "No indicada"}`,
    `Tema: ${$("#cTopic").value}`,
    `Comentario: ${$("#cText").value}`
  ].join("\n"));
}

function bindNav(){ $$("[data-nav]").forEach(btn => { btn.onclick = () => nav(btn.dataset.nav); }); }

function init(){
  renderHomeBrands();
  renderLista();
  renderAccessories();
  fillSelects();
  bindNav();
  $("#showSpecsBtn").addEventListener("click", showSpecs);
  $("#quoteSelectedBtn").addEventListener("click", quoteSelected);
  $("#nationalForm").addEventListener("submit", submitNational);
  $("#maintenanceForm").addEventListener("submit", submitMaintenance);
  $("#commentForm").addEventListener("submit", submitComment);
  if ("serviceWorker" in navigator){
    window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
  }
}
document.addEventListener("DOMContentLoaded", init);
