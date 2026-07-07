const WA_NUMBER = '51942899919';

const brands = {
  yacusol: {
    key: 'yacusol',
    name: 'YACUSOL',
    hero: 'yacusol-hero.jpg',
    tagline: 'Termas solares ENERGÉTICOS',
    summary: 'Línea propia de ENERGÉTICOS orientada a hogares y proyectos que buscan durabilidad, respaldo técnico y despacho a nivel nacional.',
    specs: [
      ['Tanque interno', 'Acero inoxidable SUS 316'],
      ['Uso', 'Agua caliente sanitaria'],
      ['Aplicación', 'Vivienda y negocio'],
      ['Respaldo', 'Asesoría técnica ENERGÉTICOS']
    ]
  },
  xolmax: {
    key: 'xolmax',
    name: 'XOLMAX',
    hero: 'xolmax-hero.png',
    tagline: 'No presurizada · ficha técnica referencial',
    summary: 'Modelos de alta capacidad con buena conservación de calor. Según la ficha adjunta, su tanque interno es de acero inoxidable 316 y el externo de acero inoxidable 304.',
    specs: [
      ['Tanque interno', 'Acero inox 316 / 0.5 mm'],
      ['Tanque externo', 'Acero inox 304'],
      ['Aislamiento', 'PU 55 mm · hasta 72 hrs'],
      ['Tubos', '58 x 1800 mm · 3 capas']
    ]
  },
  luxxol: {
    key: 'luxxol',
    name: 'LUXXOL',
    hero: 'luxxol-hero.png',
    tagline: 'Modelo Luminum · no presurizada',
    summary: 'Alternativa comercial con diferentes capacidades. Según la ficha adjunta, usa tanque interno de acero inoxidable 316 y estructura con presentación brillante.',
    specs: [
      ['Tanque interno', 'Acero inox 316 / 0.5 mm'],
      ['Tanque externo', 'Galvanizado · acabado brillante'],
      ['Aislamiento', 'PU 55 mm · hasta 72 hrs'],
      ['Tubos', '58 x 1800 mm · 3 capas']
    ]
  },
  intipower: {
    key: 'intipower',
    name: 'INTIPOWER',
    hero: 'intipower-hero.png',
    tagline: 'Línea solar para variedad comercial',
    summary: 'Opción comercial adicional para ampliar el portafolio y brindar al cliente más alternativas por capacidad y presupuesto.',
    specs: [
      ['Uso', 'Agua caliente sanitaria'],
      ['Formato', 'Terma solar de tubos al vacío'],
      ['Aplicación', 'Vivienda y pequeños negocios'],
      ['Consulta', 'Validar ficha técnica por modelo']
    ]
  }
};

const models = [
  { brand:'luxxol', liters:107, tubes:8, price:1250, desc:'Modelo compacto para consumo básico del hogar.' },
  { brand:'xolmax', liters:110, tubes:10, price:1700, desc:'Opción práctica para vivienda pequeña y agua caliente diaria.' },
  { brand:'yacusol', liters:120, tubes:12, price:1700, desc:'Modelo ideal para familia pequeña con uso residencial.' },
  { brand:'luxxol', liters:128, tubes:10, price:1550, desc:'Modelo recomendado para familia de 4 a 6 personas.' },
  { brand:'intipower', liters:135, tubes:12, price:1280, desc:'Alternativa económica para consumo medio en el hogar.' },
  { brand:'luxxol', liters:149, tubes:12, price:1750, desc:'Capacidad intermedia con buen rendimiento térmico.' },
  { brand:'xolmax', liters:149, tubes:12, price:1950, desc:'Versión de 149 L para mayor caudal en el hogar.' },
  { brand:'intipower', liters:150, tubes:15, price:1630, desc:'Modelo residencial con 15 tubos y capacidad media.' },
  { brand:'yacusol', liters:150, tubes:15, price:1850, desc:'YACUSOL 150 L para familia de 4 a 5 personas.' },
  { brand:'luxxol', liters:180, tubes:15, price:2200, desc:'Capacidad reforzada para mayor demanda diaria.' },
  { brand:'xolmax', liters:180, tubes:15, price:2400, desc:'Modelo de 180 L para viviendas con mayor consumo.' },
  { brand:'intipower', liters:200, tubes:20, price:1840, desc:'Modelo robusto para hogares grandes o pequeños negocios.' },
  { brand:'yacusol', liters:200, tubes:20, price:2550, desc:'YACUSOL 200 L con mayor disponibilidad de agua caliente.' },
  { brand:'luxxol', liters:233, tubes:20, price:2400, desc:'Modelo de alta capacidad para 7 a 11 duchas aprox.' },
  { brand:'xolmax', liters:233, tubes:20, price:2600, desc:'Opción potente para hogares con más usuarios.' },
  { brand:'yacusol', liters:250, tubes:25, price:2800, desc:'YACUSOL 250 L para consumo elevado.' },
  { brand:'luxxol', liters:286, tubes:25, price:2850, desc:'Capacidad comercial alta con 25 tubos.' },
  { brand:'xolmax', liters:286, tubes:25, price:3000, desc:'XOLMAX 286 L según ficha técnica adjunta.' },
  { brand:'intipower', liters:300, tubes:30, price:2890, desc:'Modelo de alto desempeño para grandes familias.' },
  { brand:'yacusol', liters:300, tubes:30, price:3550, desc:'YACUSOL 300 L para demanda intensiva.' },
  { brand:'luxxol', liters:339, tubes:30, price:3600, desc:'Línea LUXXOL de 339 L y 30 tubos.' },
  { brand:'xolmax', liters:339, tubes:30, price:3800, desc:'XOLMAX 339 L para uso intensivo.' },
  { brand:'yacusol', liters:400, tubes:40, price:4450, desc:'YACUSOL 400 L para familias numerosas o negocios.' },
  { brand:'luxxol', liters:444, tubes:40, price:4500, desc:'LUXXOL 444 L, línea de gran capacidad.' },
  { brand:'xolmax', liters:444, tubes:40, price:4700, desc:'XOLMAX 444 L para alto volumen de agua caliente.' },
  { brand:'luxxol', liters:533, tubes:50, price:5200, desc:'LUXXOL 533 L, capacidad máxima del portafolio mostrado.' },
  { brand:'xolmax', liters:533, tubes:50, price:5400, desc:'XOLMAX 533 L, ideal para grandes requerimientos.' }
];

const accessories = [
  {name:'Válvula termostática', use:'Permite regular la temperatura del agua caliente y fría para una salida más segura y cómoda.'},
  {name:'Tanque elevado', use:'Necesario en sistemas no presurizados para alimentar correctamente la terma solar.'},
  {name:'Barra de magnesio', use:'Ayuda a proteger el tanque interno frente a corrosión y prolonga la vida útil del equipo.'},
  {name:'Controlador con resistencia', use:'Permite respaldo eléctrico y control de temperatura en días de baja radiación.'},
  {name:'Tubos al vacío 58 x 1800', use:'Repuestos clave del sistema. Se recomiendan ante rotura o bajo rendimiento.'},
  {name:'Kit de instalación hidráulica', use:'Incluye conexiones, llaves y accesorios para una instalación ordenada y segura.'},
  {name:'Base o estructura adicional', use:'Útil cuando la cobertura o el techo requieren refuerzo o adecuación especial.'},
  {name:'Aislante para tuberías', use:'Reduce pérdidas de calor entre la terma y los puntos de consumo.'}
];

let selectedBrand = 'all';

const currency = n => `S/ ${Number(n).toLocaleString('es-PE', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
const brandOptions = ['yacusol','xolmax','luxxol','intipower'];

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return [...document.querySelectorAll(sel)]; }

function showScreen(id){
  qsa('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  qsa('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === id));
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderHomeBrands(){
  const box = qs('#homeBrands');
  box.innerHTML = brandOptions.map(key => `
    <button class="brand-chip" type="button" data-brand-shortcut="${key}">
      ${brands[key].name}
      <small>${models.filter(m => m.brand === key).length} modelos</small>
    </button>`).join('');
  qsa('[data-brand-shortcut]').forEach(btn => btn.addEventListener('click', () => {
    selectedBrand = btn.dataset.brandShortcut;
    renderBrandFilters();
    renderBrandHighlight();
    renderModels();
    showScreen('marcas');
  }));
}

function renderBrandFilters(){
  const box = qs('#brandFilters');
  const items = [{key:'all', name:'Todas'}].concat(brandOptions.map(k=>({key:k, name:brands[k].name})));
  box.innerHTML = items.map(item => `
    <button class="brand-chip ${selectedBrand === item.key ? 'active':''}" type="button" data-filter-brand="${item.key}">${item.name}</button>`).join('');
  qsa('[data-filter-brand]').forEach(btn => btn.addEventListener('click', () => {
    selectedBrand = btn.dataset.filterBrand;
    renderBrandFilters();
    renderBrandHighlight();
    renderModels();
  }));
}

function renderBrandHighlight(){
  const box = qs('#brandHighlight');
  if(selectedBrand === 'all'){
    box.innerHTML = `
      <h3>Portafolio multimarca</h3>
      <p class="meta">Seleccione una marca para ver su foto oficial, resumen y características referenciales.</p>
      <div class="benefits">
        <div><strong>${models.length}</strong><span>Modelos cargados</span></div>
        <div><strong>4 marcas</strong><span>Variedad comercial</span></div>
        <div><strong>WhatsApp</strong><span>Atención directa</span></div>
        <div><strong>Mantenimiento</strong><span>Solicitud rápida</span></div>
      </div>`;
    return;
  }
  const b = brands[selectedBrand];
  box.innerHTML = `
    <img src="${b.hero}" alt="Foto oficial ${b.name}" class="brand-hero-img">
    <span class="pill">${b.name}</span>
    <h3>${b.name}</h3>
    <p class="meta">${b.tagline}</p>
    <p class="lead">${b.summary}</p>
    <div class="spec-grid">
      ${b.specs.map(([k,v]) => `<div><strong>${k}</strong><span>${v}</span></div>`).join('')}
    </div>`;
}

function modelMessage(m){
  const name = `${brands[m.brand].name} ${m.liters} L`;
  return `Hola, deseo información de la terma solar ${name}, ${m.tubes} tubos, precio ${currency(m.price)}.`;
}

function renderModels(){
  const list = qs('#modelsList');
  const filtered = selectedBrand === 'all' ? models : models.filter(m => m.brand === selectedBrand);
  list.innerHTML = filtered.map(m => `
    <article class="model-card">
      <div class="card-top">
        <div>
          <h4>${brands[m.brand].name} ${m.liters} L</h4>
          <div class="meta-row">
            <span class="meta-tag">${m.tubes} tubos</span>
            <span class="meta-tag">${brands[m.brand].name}</span>
          </div>
        </div>
        <div class="price">${currency(m.price).replace('.00','')}</div>
      </div>
      <p>${m.desc}</p>
      <div class="card-actions">
        <button class="btn secondary" type="button" data-prefill-quote="${brands[m.brand].name}|${m.liters} L | ${m.tubes} tubos">Cotizar</button>
        <a class="btn whatsapp" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(modelMessage(m))}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </article>
  `).join('');

  qsa('[data-prefill-quote]').forEach(btn => btn.addEventListener('click', () => {
    const [brandName, modelText] = btn.dataset.prefillQuote.split('|');
    const brandKey = Object.keys(brands).find(k => brands[k].name === brandName.trim());
    qs('#qBrand').value = brandKey;
    fillQuoteModels();
    const found = models.find(m => m.brand === brandKey && `${m.liters} L | ${m.tubes} tubos` === modelText.trim());
    if(found) qs('#qModel').value = `${found.brand}|${found.liters}|${found.tubes}|${found.price}`;
    updateRecommendation();
    showScreen('cotizar');
  }));
}

function renderAccessories(){
  const list = qs('#accessoriesList');
  list.innerHTML = accessories.map(a => `
    <article class="model-card">
      <h4>${a.name}</h4>
      <p>${a.use}</p>
      <a class="btn whatsapp big" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola, deseo información del accesorio: ${a.name}.`) }" target="_blank" rel="noopener">Solicitar por WhatsApp</a>
    </article>
  `).join('');
}

function fillSelects(){
  const brandSelectHtml = brandOptions.map(k => `<option value="${k}">${brands[k].name}</option>`).join('');
  qs('#qBrand').innerHTML = brandSelectHtml;
  qs('#mBrand').innerHTML = brandSelectHtml;
  fillQuoteModels();
}

function fillQuoteModels(){
  const brandKey = qs('#qBrand').value;
  const filtered = models.filter(m => m.brand === brandKey);
  qs('#qModel').innerHTML = filtered.map(m => `<option value="${m.brand}|${m.liters}|${m.tubes}|${m.price}">${brands[m.brand].name} ${m.liters} L · ${m.tubes} tubos · ${currency(m.price)}</option>`).join('');
  updateRecommendation();
}

function updateRecommendation(){
  const raw = qs('#qModel').value;
  if(!raw) return;
  const [brandKey, liters, tubes, price] = raw.split('|');
  qs('#recommendationBox').innerHTML = `<span>Resumen de interés</span><strong>${brands[brandKey].name} ${liters} L</strong><small>${tubes} tubos · ${currency(price)} · atención por WhatsApp</small>`;
}

function handleQuoteSubmit(e){
  e.preventDefault();
  const [brandKey, liters, tubes, price] = qs('#qModel').value.split('|');
  const message = [
    'Hola, deseo cotizar una terma solar.',
    `Cliente: ${qs('#qName').value}`,
    `Celular: ${qs('#qPhone').value || 'No indicado'}`,
    `Ciudad: ${qs('#qCity').value || 'No indicada'}`,
    `Marca: ${brands[brandKey].name}`,
    `Modelo: ${liters} L - ${tubes} tubos` ,
    `Precio referencial: ${currency(price)}`,
    `Cantidad de personas: ${qs('#qPeople').value}`,
    `Tipo de techo: ${qs('#qRoof').value}`,
    `Tanque elevado: ${qs('#qTank').value}`,
    `Comentario: ${qs('#qNote').value || 'Sin comentario adicional'}`
  ].join('\n');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function handleMaintenanceSubmit(e){
  e.preventDefault();
  const brandKey = qs('#mBrand').value;
  const message = [
    'Hola, deseo solicitar mantenimiento para mi terma solar.',
    `Cliente: ${qs('#mName').value}`,
    `Celular: ${qs('#mPhone').value}`,
    `Marca: ${brands[brandKey].name}`,
    `N° de tubos: ${qs('#mTubes').value}`,
    `Dirección: ${qs('#mAddress').value}`,
    `Ciudad / distrito: ${qs('#mCity').value}`,
    `Problema principal: ${qs('#mProblem').value}`,
    `Comentario adicional: ${qs('#mComment').value || 'Sin comentario adicional'}`
  ].join('\n');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function getComments(){
  try { return JSON.parse(localStorage.getItem('energeticos_comments') || '[]'); }
  catch { return []; }
}
function saveComments(data){ localStorage.setItem('energeticos_comments', JSON.stringify(data)); }

function renderComments(){
  const box = qs('#commentsList');
  const comments = getComments();
  if(!comments.length){
    box.innerHTML = '<div class="comment-item"><p>Aún no hay comentarios guardados en este dispositivo.</p></div>';
    return;
  }
  box.innerHTML = comments.slice().reverse().map((c, idx) => `
    <article class="comment-item">
      <div class="head">
        <div>
          <strong>${c.name}</strong><br>
          <small>${c.city || 'Sin ciudad'} · ${c.topic}</small>
        </div>
        <small>${'⭐'.repeat(Number(c.rating))}</small>
      </div>
      <p>${c.text}</p>
    </article>`).join('');
}

function handleCommentSubmit(e){
  e.preventDefault();
  const comments = getComments();
  comments.push({
    name: qs('#cName').value.trim(),
    city: qs('#cCity').value.trim(),
    topic: qs('#cTopic').value,
    rating: qs('#cRating').value,
    text: qs('#cText').value.trim()
  });
  saveComments(comments);
  e.target.reset();
  renderComments();
  alert('Comentario guardado correctamente en esta aplicación.');
}

function shareCommentWhatsApp(){
  const message = [
    'Hola, quiero compartir el siguiente comentario:',
    `Nombre: ${qs('#cName').value || 'No indicado'}`,
    `Ciudad: ${qs('#cCity').value || 'No indicada'}`,
    `Tema: ${qs('#cTopic').value}`,
    `Calificación: ${qs('#cRating').value} estrellas`,
    `Comentario: ${qs('#cText').value || 'Sin comentario'}`
  ].join('\n');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function clearComments(){
  if(confirm('¿Desea borrar todos los comentarios guardados en este dispositivo?')){
    localStorage.removeItem('energeticos_comments');
    renderComments();
  }
}

function initNav(){
  qsa('[data-nav]').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.nav)));
}

function init(){
  renderHomeBrands();
  renderBrandFilters();
  renderBrandHighlight();
  renderModels();
  renderAccessories();
  fillSelects();
  renderComments();
  initNav();
  qs('#qBrand').addEventListener('change', fillQuoteModels);
  qs('#qModel').addEventListener('change', updateRecommendation);
  qs('#quoteForm').addEventListener('submit', handleQuoteSubmit);
  qs('#maintenanceForm').addEventListener('submit', handleMaintenanceSubmit);
  qs('#commentForm').addEventListener('submit', handleCommentSubmit);
  qs('#shareCommentBtn').addEventListener('click', shareCommentWhatsApp);
  qs('#clearCommentsBtn').addEventListener('click', clearComments);

  if('serviceWorker' in navigator){
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
  }
}

document.addEventListener('DOMContentLoaded', init);
