/* =====================================================================
   DATOS DEL ASISTENTE — App YACUSOL
   Precios iguales a los de la app y de la web YACUSOL.
   Si cambias un precio en la app, cámbialo también aquí.
   ===================================================================== */
window.ASISTENTE_CONFIG = {
  whatsapp: "51942899919",

  equipos: [
    {cap:120, tubos:12, personas:"3 personas",       precio:1700, asistente:"5 L"},
    {cap:150, tubos:15, personas:"4 personas",       precio:1850, asistente:"5 L"},
    {cap:200, tubos:20, personas:"5 personas",       precio:2550, asistente:"5 L"},
    {cap:250, tubos:25, personas:"6 personas",       precio:2800, asistente:"5 L"},
    {cap:300, tubos:30, personas:"7 a 8 personas",   precio:3550, asistente:"10 L"},
    {cap:400, tubos:40, personas:"10 a 12 personas", precio:4450, asistente:"10 L"},
    {cap:500, tubos:50, personas:"Consultar según consumo", precio:5700, asistente:"Según configuración"}
  ],

  accesorios: [
    {id:"valvula",    nombre:"Válvula termostática",             uso:"Regula la ducha entre 30 y 45 °C y evita quemaduras", precio:350},
    {id:"tanque5",    nombre:"Tanque asistente 5 L",             uso:"Controla la presión de ingreso al termotanque",        precio:150},
    {id:"tanque10",   nombre:"Tanque asistente 10 L",            uso:"Para los modelos de 300 y 400 litros",                 precio:250},
    {id:"magnesio",   nombre:"Barra de magnesio",                uso:"Ánodo anticorrosión, protege el tanque interior",      precio:80},
    {id:"controlador",nombre:"Controlador TK",                   uso:"Muestra temperatura y nivel, gestiona el llenado",     precio:450},
    {id:"resistencia",nombre:"Resistencia eléctrica de respaldo",uso:"Calienta el agua en días sin sol",                     precio:110},
    {id:"tubo",       nombre:"Tubo al vacío 58 × 1800 mm",       uso:"Repuesto de tubo triple capa",                         precio:80},
    {id:"instalacion",nombre:"Instalación básica",               uso:"Montaje, conexión y puesta en marcha en Huaraz",       precio:200},
    {id:"mantto",     nombre:"Mantenimiento preventivo",         uso:"Limpieza y revisión general, una vez al año",          precio:0},
    {id:"flete",      nombre:"Flete a otra ciudad",              uso:"Depende del destino y la agencia de transporte",       precio:0}
  ],

  componentesPaquete: ["valvula","asistente","magnesio","controlador","resistencia"],
  instalacionIncluida: true,

  /* Promoción vigente (la misma de la ventana de bienvenida). Déjalo en {} cuando termine. */
  descuentos: {120:50, 150:50, 250:100, 300:100}
};
