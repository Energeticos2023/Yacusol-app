# YACUSOL CONTROL 360 - Arquitectura funcional (08/11/2026)

## Propósito
Una consola administrativa privada, móvil y PWA, para centralizar: banco de fotografías/videos reales de instalaciones; captación y seguimiento de prospectos; cotizaciones; ventas; equipos instalados y su garantía; agenda de mantenimientos; campañas y resultados atribuibles.

## Decisión arquitectónica
- No sustituir la app pública Flutter Yacusol-app ni modificar el archivo compilado main.dart.js.
- Añadir un submódulo administrativo independiente en `/control360` dentro del repositorio existente. La rama de trabajo NO modifica producción hasta revisión y merge.
- Usar el proyecto Supabase EXISTENTE YACUSOL_Gestion, ref kdlthtyxsmcehxwgjkrn (no crear proyecto de pago).
- Tablas existentes al 08/11/2026: clientes, ventas, equipos, asignaciones, mantenimientos, citas, consentimientos, auditoria, whatsapp_recibos. Todas tienen RLS habilitado, cero registros según la inspección. CERO cuentas en auth.users. CERO buckets en Supabase Storage. La app no estará operativa hasta crear un usuario administrador autorizado, ejecutar ampliación SQL, crear bucket y probar RLS.
- En frontend usar únicamente URL de proyecto y clave publicable, nunca service_role ni secretos.

## Módulos
1. **Inicio**: prospectos nuevos, cotizaciones abiertas, ventas cerradas, instalaciones, mantenimiento próximo/vencido, campañas del día, ingresos cobrados si existen evidencias (sin totales inventados).
2. **Mediateca YACUSOL**: capturar desde cámara del móvil o cargar JPEG/PNG/WebP/MP4 (límite configurable), fecha, zona, modelo/capacidad, estado de obra (montaje/en servicio/mantenimiento), etiqueta, derechos, permiso específico de marketing. Original intacto; edición derivada almacenada como nueva versión. Registro SHA-256.
3. **Prospectos/CRM**: origen TikTok/Instagram/Facebook/WhatsApp/referido/web, campaña y UTM, localidad, requerimiento, responsable, etapa nuevo/contactado/calificado/cotizado/ganado/perdido y próxima acción; deduplicación por contacto cuando legalmente proceda.
4. **Cotizaciones**: relación con prospecto o cliente, modelo/capacidad, componentes y alcance, costo, margen interno protegido, precio y vigencia, estado borrador/enviada/aceptada/rechazada; PDF en fase posterior.
5. **Ventas e instalaciones**: fecha, modelo/serie, accesorios comprometidos/entregados, documentos, instalación y protocolos; enlaza con tablas ventas/equipos existentes sin duplicarlas.
6. **Mantenimiento**: programar primer servicio según fecha de instalación y frecuencia comercial (por defecto 12 meses según política vigente), reprogramar tras visita real, evidencia fotográfica, historial de averías, recordatorios pendientes y consentimiento por canal. No enviar WhatsApp fuera de una integración oficial.
7. **Marketing**: calendario Metricool, activos aptos para publicidad, campañas, métricas verificadas, solicitudes atribuibles, cotizaciones y cierres; propuestas de Radar de Mercado; IA solo usa medios con aprobación.
8. **Administración**: roles admin/ventas/tecnico, consentimiento y retención, respaldo, auditoría y exportación.

## Flujo esencial
Foto/video -> guardar archivo privado -> completar metadatos -> confirmar titularidad/permisos -> marcar original verificado -> aprobación marketing por admin -> cola de activos publicitarios -> agente accede por integración de lectura acotada y auditable -> producción creativa -> QA -> publicación Metricool autorizada -> consultas -> cotización -> venta -> equipo instalado -> mantenimiento.

IMPORTANTE: subir una foto por sí solo NO otorga acceso automático al asistente de ChatGPT. La integración segura agente <-> almacenamiento privado debe implementarse aparte (conector/servicio autorizado para lectura con tokens de duración limitada, o exportación manual controlada). Hasta entonces, medio registrado pero NO ACCESIBLE al agente.

## Gobierno y seguridad
- Base de datos y fotos comerciales privadas. Consentimiento expreso para usar foto del inmueble o personas con finalidad publicitaria; consentimiento de contacto separado del consentimiento de publicar imágenes. Limpiar metadatos EXIF/GPS en copias promocionales; conservar originales privados.
- MFA para administradores cuando se habilite, sesiones seguras, roles a través de auth.app_metadata (el usuario no puede autoproclamarse admin), RLS de lectura/escritura, bucket privado, enlaces firmados breves.
- Respetar Ley 29733, reglamento vigente y obligaciones de privacidad aplicables en Perú; verificar redacción legal con asesoría cuando se implemente.
- El botón 'Recordar mantenimiento' crea tarea interna, nunca promete haber enviado mensaje sin confirmación real del canal WhatsApp.
- Nunca mostrar clientes ni registros de compra en repositorio GitHub público.
- No financiar servicios, desplegar a producción, empezar pauta o consumir HeyGen sin autorización separada.

## Entregas por fase
Fase 1: login con rol, mediateca privada autenticada y catálogos, CRM y cotizaciones básicas, tablero de registros reales.
Fase 2: ventas/equipos integrados, agenda y recordatorios internos, flujo de autorización de fotos, reportes operativos.
Fase 3: lectura autorizada de medios por agente IA, Metricool, analítica de atribución, seguimiento WhatsApp oficial y alertas, permisos y exportaciones.
Fase 4: cotizaciones PDF, OCR opcional con consentimiento, optimización y previsión de demanda.

## Criterios de aceptación antes de publicar
1. Desde móvil se puede subir 1 JPEG y 1 MP4 al bucket privado con autenticación.
2. Usuario no autenticado no puede descargar objetos, listar clientes o insertar cotizaciones; técnicos no pueden aprobar creatividades ni leer ventas.
3. Cada foto conserva autor, fecha, hash, obra, aprobación y consentimiento, incluyendo estado 'montaje'.
4. Tablero no confunde publicaciones con consultas ni ventas.
5. Un equipo genera próxima fecha de mantenimiento con reglas verificables, sin mensaje de WhatsApp enviado automáticamente.
6. Una publicidad solo puede usar un asset cuando original verificado y marketing aprobado.
7. El proyecto actual y el calendario Metricool hasta 16/11/2026 quedan sin modificaciones.
