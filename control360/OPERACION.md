# YACUSOL CONTROL 360 - Operación y productividad comercial

Actualización: 2026-11-08. Documento operativo, no prueba de venta ni sustituto de facturación.

## Responsable principal
Correo administrador previsto: energeticos.ryc@gmail.com. Crear mediante invitación segura de Supabase; asignar rol de administrador solo tras comprobar titularidad.

## Ciclo comercial único
1. Captar prospecto y guardar su fuente y campaña. Visualizaciones de redes no son prospectos.
2. Registrar necesidad, distrito, personas y seguimiento; no registrar clientes ficticios.
3. Registrar cotización con precio, capacidad, componentes y condiciones. Estado enviada solo tras comprobar envío real.
4. Aceptación únicamente con respuesta verificable del cliente.
5. Venta en borrador y confirmación exclusiva de administrador cuando exista evidencia de cierre; nunca contabilizar borradores.
6. Instalación vinculada a cliente/equipo, serie, fecha real y materiales, sin confundir montaje con instalación concluida.
7. Mantenimiento cada 12 meses de forma predeterminada desde instalación o servicio real; registro técnico al ejecutar.
8. Usar imágenes/testimonios de clientes únicamente con permisos verificables.

## Indicadores
- Prospectos con contacto voluntario y fuente identificada.
- Cotizaciones enviadas / prospectos; distinguir denominador al filtrar.
- Ventas confirmadas / cotizaciones enviadas cuando la vinculación sea comprobable.
- Importes vendidos en PEN y USD por separado.
- Equipos que requieren mantenimiento a 30 días y mantenimientos realmente ejecutados.
- Alcance/retención de Metricool y consulta/cotización/venta de Supabase; no inferir ventas de los likes.
- Margen real pendiente de incorporar costos, transporte, instalación y precio de compra.

## Rutina y aprendizaje
- Diaria: consultas, cotizaciones, facturación corroborada y próximas revisiones. Radar aproximadamente 07:00 y revisión publicitaria 08:00 Perú, sujetos a ejecución real.
- Semanal: hipótesis A/B con una diferencia relevante, segmentos y conversiones por campaña; datos incompletos expresamente señalados.
- Mensual: auditoría de registros duplicados, calidad, consentimientos, ventas confirmadas y resultados.
- Trimestral: expansión comercial solo después de verificar capacidad técnica, servicio y cobertura geográfica.

## Seguridad y estado
- Supabase activo con tablas CRM, índice único de cotización-venta y bucket privado. RLS habilitado.
- El frontend es público como código de Pages; los datos requieren JWT y permisos autorizados.
- El agente no accede automáticamente a medios privados: falta integración auditada de lectura de activos aprobados.
- WhatsApp Cloud API/Coexistence aún sin conexión completa; mensajes no se contabilizan automáticamente.
- No ejecutar publicidad pagada, gastar créditos HeyGen o enviar WhatsApp masivo sin permisos.
- Ley peruana de datos personales y consentimiento a revisar antes de escalar.

## Criterios de salida a operación
1. Invitar al administrador principal desde Supabase Dashboard, confirmar correo y asignar rol en app_metadata.
2. Login real y prueba RLS: usuario anónimo, técnico y administrador.
3. Probar foto JPG y video MP4 propios en bucket privado y descarga mediante URL firmada.
4. Crear un prospecto de prueba distinguible, cotización y venta de prueba; limpiar datos sintéticos al terminar.
5. Registrar cliente/equipo de prueba y servicio técnico; probar el cálculo de próxima revisión.
6. Validar resultados con datos reales y establecer una persona responsable de registrar cada operación.

Toda mejora futura debe mantener trazabilidad de requerimiento, prueba y aprobación. Mantener aislada la consola administrativa de la aplicación Flutter pública.
