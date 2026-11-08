# YACUSOL Control 360 · Puesta en marcha controlada

Este prototipo NO está publicado ni conectado a clientes reales: se encuentra en rama de desarrollo.

## Estado verificado 08/11/2026
- Repositorio de la app pública existente: Energeticos2023/Yacusol-app (Flutter compilado). No modificar main.dart.js.
- Proyecto Supabase existente y sano: YACUSOL_Gestion, ref kdlthtyxsmcehxwgjkrn.
- Tablas operativas ya existentes y protegidas por RLS: clientes, ventas, equipos, asignaciones, mantenimientos, citas, consentimientos, auditoria, whatsapp_recibos.
- Nuevas tablas previstas y NO desplegadas: prospectos, cotizaciones, media_assets.
- No existe ningún bucket de archivos. No existen usuarios en Auth. Todas las tablas comerciales revisadas estaban vacías.
- No hay acceso de ChatGPT a archivos privados: configurar conector/servicio específico con lectura limitada a material autorizado y auditado en una fase posterior.

## Antes de activar
1. Crear usuario administrador de ENERGÉTICOS **mediante Supabase Dashboard > Authentication > Users**, preferentemente con invitación, verificando su correo. No habilitar registro público. No crear usuarios ficticios ni usar la cuenta de otra persona.
2. Asignar en su app_metadata el atributo yacusol_role = admin con un procedimiento privilegiado documentado desde el Dashboard/SQL Editor. Nunca utilizar user_metadata o lógica en el frontend para elevar privilegios; la tabla de usuarios Auth inicialmente está vacía.
3. Revisar esquema, permisos y la política de privacidad con el responsable de datos. El archivo control360/schema-propuesta.sql es una PROPUESTA: analizar primero SQL por DBA, migrar en ventana autorizada y comprobar RLS con 3 cuentas de prueba (admin, ventas, tecnico).
4. Crear bucket privado y políticas de storage usando la propuesta revisada. Nunca hacer el bucket público. Configurar tipos JPEG/PNG/WebP/MP4 y límite según cuota verificada.
5. Publicar la carpeta control360 por una ruta HTTPS protegida, tras aprobar revisión de seguridad. Aunque la carpeta se aloje en GitHub Pages, su código es público y SOLO los datos se protegen mediante Auth/RLS; no copiar archivos originales de clientes al repositorio.
6. Probar iniciar sesión y registrar un prospecto, borrador de cotización, imagen y video privado. Verificar que usuarios no autenticados no puedan leer nada ni listar archivos.
7. Verificar consentimiento publicitario, autoría, estado de obra e integridad de logo en cada imagen. La aprobación de marketing es manual y restringida a admin; el prototipo no inserta imágenes automáticamente en campañas.
8. Conectar asistente solo mediante integración de lectura de archivos aprobados, registro de acceso y permisos expresos. **La carga no da acceso automático a ChatGPT**.
9. Conectar Metricool para resultados atribuidos y WhatsApp Business API oficial cuando esté disponible y autorizado. La tarea de mantenimiento genera fechas internas sin notificar a clientes directamente.
10. Revisar costos de almacenamiento/egreso, política de retención, respaldos y privacidad antes de gestionar datos de terceros.

## Comprobaciones estáticas realizadas
- Los cinco archivos existen en la rama de trabajo.
- El JavaScript compiló con un parser de sintaxis de JS.
- Todos los ids referenciados por script existen en el HTML.
- No hay service_role ni sb_secret en el código de cliente; solo clave publicable de Supabase.
- HTML usa CSP y la configuración SQL propuesta tiene RLS y bucket privado.
**Estas verificaciones NO sustituyen pruebas end-to-end con usuarios reales, videos, base de datos y red.**

## Casos de aceptación
- Inicio de sesión con contraseña y rol admin; rechazar login sin rol.
- Alta de prospecto y su relación con cotización con detalle de componentes promocionales.
- Subida de fotografía real JPEG y video MP4 al bucket privado, preservando huella SHA-256 y consentimiento publicitario separado.
- Prohibición de aprobar una foto sin referencia de consentimiento, con aprobación mediante admin y previa inspección visual.
- Recordatorio de mantenimiento derivado de fecha de instalación o última visita real, frecuencia de 12 meses salvo configuración.
- Ningún envío automático de WhatsApp, publicidad paga ni consumo de créditos HeyGen.
- Los datos en panel deben mostrar valores reales y fallos de conectividad de forma visible.

## Cambios pendientes para producción
Formulario de ventas y vinculación de equipos, PDF cotizaciones, asignaciones técnicas, gestión de citas, notificaciones consentidas, auditoría de aprobaciones, pruebas de móvil y accesibilidad, conteos agregados paginados a partir de más de 250 registros.
