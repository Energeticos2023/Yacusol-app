const WHATSAPP = "51942899919";

const products = [
  {id:"T120", modelo:"YACUSOL 120 L", personas:"3 personas", min:1, max:3, precio:1350, desc:"Modelo compacto para familia pequeña o vivienda con bajo consumo."},
  {id:"T150", modelo:"YACUSOL 150 L", personas:"4 personas", min:4, max:4, precio:1450, desc:"Modelo recomendado para familia de 4 personas."},
  {id:"T200", modelo:"YACUSOL 200 L", personas:"5 personas", min:5, max:5, precio:2100, desc:"Modelo familiar de alta demanda para ducha y lavatorio."},
  {id:"T250", modelo:"YACUSOL 250 L", personas:"6 personas", min:6, max:6, precio:2700, desc:"Modelo para familias con consumo superior de agua caliente."},
  {id:"T300", modelo:"YACUSOL 300 L", personas:"7 a 8 personas", min:7, max:8, precio:3300, desc:"Modelo de alta capacidad para familia numerosa."},
  {id:"T400", modelo:"YACUSOL 400 L", personas:"10 a 12 personas", min:9, max:12, precio:4200, desc:"Modelo para vivienda grande, negocio u hospedaje. Requiere evaluación técnica."}
];

const accessories = [
  {name:"Válvula termostática", price:350, client:"Entrega agua a temperatura más segura y confortable.", tech:"Mezcla agua caliente y fría para estabilizar la salida.", when:"Recomendada para familias con niños o adultos mayores."},
  {name:"Tanque asistente 5 L", price:150, client:"Ayuda a mejorar el abastecimiento hacia la terma.", tech:"Apoya el control de alimentación hidráulica.", when:"Cuando la vivienda requiere estabilizar el ingreso de agua."},
  {name:"Tanque asistente 10 L", price:250, client:"Cumple la misma función con mayor reserva.", tech:"Apoya el suministro con mayor margen de operación.", when:"Cuando el recorrido o abastecimiento requiere mayor capacidad."},
  {name:"Barra de magnesio", price:80, client:"Ayuda a proteger el tanque y prolongar su vida útil.", tech:"Elemento de sacrificio contra corrosión interna.", when:"Recomendada en mantenimiento preventivo."},
  {name:"Controlador TK", price:450, client:"Permite monitorear o controlar funciones del sistema.", tech:"Visualización y control según configuración.", when:"Para clientes que desean mayor control del sistema."},
  {name:"Resistencia eléctrica", price:110, client:"Respaldo en días con baja radiación solar.", tech:"Elemento eléctrico de apoyo, sujeto a instalación segura.", when:"Zonas frías o clientes que quieren respaldo adicional."}
];

const sol = new Intl.NumberFormat("es-PE", {style:"currency", currency:"PEN", maximumFractionDigits:0});

function navTo(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === id));
  window.scrollTo({top:0, behavior:"smooth"});
}

document.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", () => navTo(el.dataset.nav)));

function renderProducts(){
  const list = document.getElementById("modelsList");
  list.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-head">
        <h3 class="product-title">${p.modelo}</h3>
        <div class="price">${sol.format(p.precio)}</div>
      </div>
      <div class="meta">
        <span class="badge">${p.personas}</span>
        <span class="badge">${p.id}</span>
        <span class="badge">Garantía 5 años</span>
        <span class="badge">SUS 316</span>
      </div>
      <p class="desc">${p.desc}</p>
      <div class="card-actions">
        <button class="btn secondary" onclick="quoteModel('${p.id}')">Cotizar</button>
        <a class="btn whatsapp" target="_blank" rel="noopener" href="${whatsAppUrl(`Hola, quiero información del modelo ${p.modelo} de ${p.personas}.`)}">WhatsApp</a>
      </div>
    </article>
  `).join("");
}

function renderAccessories(){
  const list = document.getElementById("accessoriesList");
  list.innerHTML = accessories.map(a => `
    <article class="accessory-card">
      <span class="price">${sol.format(a.price)}</span>
      <h4>${a.name}</h4>
      <p><strong>Para el cliente:</strong> ${a.client}</p>
      <p><strong>Función técnica:</strong> ${a.tech}</p>
      <p><strong>Cuándo recomendar:</strong> ${a.when}</p>
    </article>
  `).join("");
}

function recommendByPeople(n){
  n = Number(n);
  return products.find(p => n >= p.min && n <= p.max) || products[products.length-1];
}

function updateRecommendation(){
  const p = recommendByPeople(document.getElementById("qPeople").value);
  const box = document.getElementById("recommendationBox");
  box.innerHTML = `<span>Modelo recomendado</span><strong>${p.modelo}</strong><small>${sol.format(p.precio)} · ${p.personas}</small>`;
  box.dataset.model = p.modelo;
  box.dataset.price = p.precio;
}

function whatsAppUrl(message){
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function quoteModel(id){
  const p = products.find(x => x.id === id);
  document.getElementById("qPeople").value = Math.min(p.max, 12);
  updateRecommendation();
  navTo("cotizar");
}

document.getElementById("qPeople").addEventListener("change", updateRecommendation);

document.getElementById("quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("qName").value.trim() || "Cliente por confirmar";
  const city = document.getElementById("qCity").value.trim() || "Ubicación por confirmar";
  const people = document.getElementById("qPeople").value;
  const roof = document.getElementById("qRoof").value;
  const tank = document.getElementById("qTank").value;
  const p = recommendByPeople(people);
  const msg = `Hola, deseo cotizar una terma solar YACUSOL.%0A%0ACliente: ${name}%0AUbicación: ${city}%0APersonas: ${people}%0AModelo recomendado: ${p.modelo}%0APrecio referencial: ${sol.format(p.precio)}%0ATecho: ${roof}%0ATanque elevado: ${tank}%0A%0APor favor confirmar disponibilidad, instalación y condiciones técnicas.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener("click", async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

renderProducts();
renderAccessories();
updateRecommendation();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(console.warn));
}