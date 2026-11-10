# ENERGÉTICOS / YACUSOL Control 360

## Estado a 08/11/2026
**Panel administrativo desplegado** en https://energeticos2023.github.io/Yacusol-app/control360/ sobre el proyecto existente Supabase `YACUSOL_Gestion`. No es solo una propuesta en rama. El rol de administrador fue creado y se registró un acceso.

La solución está **en fase de validación operativa**: hay datos comerciales y técnicos reales, pero los flujos completos, permisos de roles adicionales, envío de documentos, recuperación de sesión y tratamiento de datos personales todavía requieren pruebas E2E.

## Arquitectura
- Frontend: `control360/index.html`, `app.js`, `styles.css` con autenticación Supabase Auth y clave publicable.
- Fuente de datos: tablas con RLS en Supabase para clientes, prospectos, cotizaciones, ventas, equipos, asignaciones, mantenimientos, medios técnicos y fichas de visita.
- Almacenamiento: bucket **privado** `yacusol-media`; originales no deben copiarse al repositorio.
- App pública Flutter compilada del repositorio: independiente. No editar `main.dart.js` directamente porque carece del proyecto fuente Dart en esta copia.
- GitHub Actions: `node control360/qa-static.mjs` con prueba real de 75 IDs y lógica comercial; la validación CI no prueba login real.

## Funciones
- Gestión de clientes y prospectos y atribución de campañas verificable.
- Cotización multimarca: YACUSOL con precios publicados; XOLMAX, LUXXOL, INTIPOWER y TERMOINOX solo con tarifa y alcance aprobados.
- Preparación de cotización imprimible y apertura de WhatsApp: **NO adjunta el PDF ni garantiza envío**.
- Ventas: borradores separados de confirmadas, equipos instalados y mantenimiento.
- Álbum técnico exclusivo por cliente/equipo y ficha de visita con acceso restringido y autorización de marketing diferenciada.
- Posventa: fecha de revisión según fecha real del equipo o último mantenimiento no anulado.

## Instalación en celulares (09/11/2026)
- El panel es instalable como app (PWA): `manifest.webmanifest`, íconos en `icons/`, `sw.js` y `pwa.js`.
- Android (Chrome, Edge, Samsung Internet): botón «Instalar app» con el aviso nativo del sistema; si no está disponible, se muestran los pasos del menú ⋮.
- iPhone/iPad: Apple no permite botón de instalación; el botón muestra los pasos de Safari → Compartir → «Agregar a inicio».
- El service worker solo guarda archivos propios del panel (red primero), **nunca** datos de Supabase, y solo borra cachés con prefijo `y360-control360-` para no afectar a otras apps del mismo dominio.
- La sesión sigue en `sessionStorage`: al cerrar la app se vuelve a pedir el inicio de sesión.
- Prueba automática: `node control360/qa-pwa.mjs`.

## Presentación para celulares (10/11/2026)
- En pantallas de hasta 860 px el panel cambia a diseño de app: barra de módulos fija abajo, cabecera fija con Instalar, Actualizar y Salir, una sola columna y textos de 16 px (sin necesidad de zoom).
- Corrige el desborde anterior: el menú lateral obligaba a una página de 989 px en celulares de 390 px.
- La computadora conserva el diseño con menú lateral. Prueba automática: `node control360/qa-movil.mjs`.

## Correcciones de la auditoría 08/11/2026
- Prevención de fuga entre sesiones: reinicio de datos, roles y formularios; protección ante solicitudes asíncronas de otra sesión.
- Lectura paginada en lotes; umbral operativo de 10 000 registros con aviso explícito. **Pendiente:** consulta/filtrado y conteos agregados por servidor para alta escala.
- Prueba de IDs DOM corregida: la versión anterior aprobaba erróneamente con IDs=0. Ahora falla si se elimina un ID real.
- El frontend conserva la URL de sus recursos con una revisión explícita para reducir caché obsoleta.

## Riesgos conocidos y siguientes pasos
- Falta captura central segura y deduplicada de consultas realmente recibidas por WhatsApp.
- Falta validar autenticación, recuperación, roles y URL firmadas con usuarios de prueba autorizados.
- Falta catálogo fuente único versionado y sincronización automática de todas las interfaces.
- Las páginas de GitHub Pages no ofrecen cabeceras HTTP configurables para `frame-ancestors`: no afirmar protección contra iframe solo por la etiqueta `meta`.
- La cuenta de Supabase presenta aviso de protección contra contraseñas filtradas desactivada.
- No exponer listas de clientes, sus números, imágenes privadas, claves ni cookies en el repositorio.
- El acceso de ChatGPT a las fotografías del bucket requiere **conector privado autorizado**, no ocurre automáticamente.

Consulta `ACTIVACION.md`, `OPERACION.md` y `ALBUM_TECNICO_OPERACION.md` para procedimientos y responsabilidades.
