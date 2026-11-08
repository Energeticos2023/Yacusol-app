# Manual operativo - Album técnico exclusivo por cliente y terma

Fecha de revisión: 2026-11-08.

## Principio de trazabilidad
Cada archivo tiene un original privado inmutable y una ficha de metadatos. La relación correcta es:
`cliente.id -> equipos.id -> media_assets.equipo_id`.
Para fotos de mantenimiento, el vínculo adicional `mantenimientos.id` identifica el servicio.

Una misma persona puede tener varias termas. Nunca clasificar material por nombre escrito en el título solamente; verificar las imágenes y la identificación de la instalación antes de asociar. La base de datos rechaza asociaciones con equipos de otro cliente y fotos ligadas a un servicio de otro equipo.

## Pasos en la aplicación
1. Ingresar con usuario autorizado.
2. Abrir **Ficha técnica y visita**, seleccionar cliente/terma. Solo aparecen equipos permitidos por el backend.
3. Revisar originales privados y notas de acceso, hidraúlica, estructura, electricidad y otros.
4. Completar formulario de preparación como observaciones verificables: tipo de acceso, altura estimada, espacio, riesgos observados o por confirmar, herramientas y repuestos por verificar. Indicar el nivel de verificación (pendiente, documental o presencial). Nunca presentar un riesgo no evaluado como seguro.
5. Imprimir ficha para visita y seguir procedimientos de trabajo seguro, permiso de trabajo en altura si corresponde, verificación de condiciones reales en el lugar.
6. Cargar nuevos archivos desde **Mi álbum** o **Subir fotos de esta terma**, eligiendo cliente, terma y categoría; para registro post-servicio, elegir servicio real (opcional).
7. En **Archivos y permisos** el administrador debe revisar y clasificar cada una de las ocho fotos históricas que actualmente no tienen relación con clientes. No se reasignan automáticamente por título.
8. Consentimiento para publicidad es diferente de consentimiento para almacenamiento técnico. La ficha técnica nunca autoriza publicación en redes.

## Acceso técnico
- Admin/ventas: visibilidad según funciones comerciales autorizadas.
- Técnico: solamente clientes y equipos asignados, evidencias propias y de equipos asignados, ficha de preparación en lectura. Puede cargar fotos para equipos asignados. La asignación al técnico debe ser realizada por administración en Supabase.
- El bucket 'yacusol-media' continúa privado; imágenes y videos se muestran mediante URLs firmadas temporales.
- No compartir URLs firmadas en redes públicas; no se permite copia de material de un cliente al expediente de otro.
- La integración con ChatGPT para leer este material permanece pendiente de conectar un servicio autorizado, auditado y que solo entregue material permitido.

## Categorías fotográficas
Vista general, acceso, estructura, hidráulica, electricidad, termotanque/tubos, antes, durante y después de servicio, otras. Registrar fecha de captura y observación técnica, si se conocen.

## Control previo de visita
Confirmar cliente/dirección y acceso, fotos verificadas, condición de techo/superficie, posibilidad de trabajar en altura y autorización, herramientas, repuestos compatibles, suministro de agua, aislamiento eléctrico, personal y traslado. Las fotos no reemplazan inspección del emplazamiento ni procedimiento aprobado.

## Datos a validar después de despliegue
- Las ocho fotos históricas todavía requieren asociación manual.
- No existen usuarios técnicos ni asignaciones de trabajo verificadas, por tanto no se ha comprobado aún el flujo de lectura con una cuenta de técnico real.
- Confirmar carga de JPEG y MP4 de instalaciones futuras, aislamiento de álbum para dos termas del mismo cliente, selección del servicio previo y permisos de impresión.
- No modificar información existente sin verificar la asignación real.
