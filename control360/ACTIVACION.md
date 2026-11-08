# ENERGÉTICOS Control 360 — estado operativo y controles de puesta en marcha

**Última verificación: 08/11/2026 (America/Lima).** Este documento describe el estado ACTUAL. Los estados históricos se conservan en commits y solicitudes de cambios, no en instrucciones contradictorias.

## Disponible y comprobado
- Frontend publicado en https://energeticos2023.github.io/Yacusol-app/control360/
- Supabase existente: proyecto `YACUSOL_Gestion`, ref `kdlthtyxsmcehxwgjkrn`. No se creó un segundo proyecto.
- Usuario administrador autorizado existente, correo confirmado y con inicio de sesión registrado. No publicar aquí contraseñas ni tokens.
- RLS activo en las tablas de clientes, prospectos, cotizaciones, ventas, equipos, mantenimiento, asignaciones, álbum y preparación de visitas.
- Bucket `yacusol-media` privado. Fotografías y videos se almacenan allí, nunca en GitHub.
- Formularios de clientes, cotizaciones multimarca, ventas, equipos, mantenimiento y álbum técnico publicados. Los estados de venta y cotización no se presumen confirmados.
- Último corte de datos consultado: 7 clientes, 6 equipos, 10 archivos, 0 cotizaciones, 0 prospectos y 0 ventas confirmadas. Estas cifras **no son un reporte en tiempo real**.
- Corregidos en el código: cierre de sesión con limpieza de información, navegación por rol, lectura paginada y protección contra respuestas tardías de sesiones anteriores.
- Prueba de integración continua de la interfaz: identifica 75 IDs, falla si se elimina un elemento y comprueba varias reglas de funcionamiento. **No equivale a pruebas E2E reales ni certifica todos los permisos**.

## Funciones pendientes de prueba integral
1. Entrar con cuentas separadas de administración, ventas y técnico asignado y probar RLS de datos y Storage con registros de prueba autorizados.
2. Recorrido real: prospecto -> cotización -> PDF -> WhatsApp (envío manual confirmado) -> venta -> equipo -> mantenimiento.
3. Registrar relaciones correctas para los archivos privados existentes; no inferir el cliente por el nombre del fichero.
4. Respaldo, recuperación, registro de auditoría, revisión de protección de datos personales y procedimiento de recuperación de contraseña.
5. Integración oficial WhatsApp Business Platform/Coexistence para capturar mensajes realmente recibidos y registrar eventos comerciales con deduplicación, consentimiento y seguridad.
6. Servicio de lectura autorizado para el agente de IA. La carga en el álbum **no concede acceso automático al asistente**.
7. Paginación y búsqueda en servidor para volúmenes superiores al límite operativo actual de 10 000 filas por tabla; ante ese umbral la interfaz señala error, no muestra estadísticas incompletas.
8. Protección contra contraseñas filtradas (advertencia del asesor de seguridad de Supabase, requiere configuración del responsable).

## Seguridad y alojamiento
- Solo clave publicable en frontend; no cargar service_role ni credenciales de cuentas en GitHub.
- El código de GitHub Pages es público; los datos quedan sujetos a autenticación/RLS y almacenamiento privado.
- El encabezado HTTP `Content-Security-Policy: frame-ancestors 'none'` **no puede imponerse con una etiqueta meta**. Para protección efectiva contra enmarcado, cambiar a alojamiento que permita cabeceras HTTP reales. No confundir CSP meta con garantía anti-clickjacking.
- No enviar campañas pagadas ni mensajes masivos por este módulo sin permisos adicionales.
- Consentimiento técnico para conservar fotografías NO equivale a permiso para publicarlas.

## Calidad, control y responsables
- Las correcciones se integran mediante PR con CI exitosa y se verifican los despliegues antes de declararlas publicadas.
- No marcar un flujo como operativo por la sola existencia de código.
- Toda cifra comercial debe derivarse de una venta confirmada o una consulta efectivamente recibida; abrir WhatsApp sin enviarlo no prueba captación.
- El propietario valida tarifas, identidad del emisor y autorización de marketing. Los técnicos validan condiciones reales de instalación y seguridad, no solo imágenes.
