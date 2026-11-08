# Control de hallazgos — Ecosistema ENERGÉTICOS

Auditoría base: «REVISIÓN DE YACUSOL Y ECOSISTEMA ENERGÉTICOS», 08/11/2026.
Última actualización documental: 08/11/2026. No confundir estado de GitHub con prueba comercial de usuarios.

| Clave | Hallazgo | Estado | Evidencia real | Pendiente / criterio de cierre |
|---|---|---|---|---|
| ENERGETICOS-TECGO-SEC-XSS | HTML construido a partir de datos del usuario | **CERRADO (código)** | [TecGo PR #2](https://github.com/Energeticos2023/TecGo/pull/2), QA de XSS y despliegue Pages exitoso | Prueba adicional con navegador real recomendada |
| ENERGETICOS-PWA-CACHE | Borrado de cachés entre apps del mismo origen | **CERRADO (código)** | [TecGo #2](https://github.com/Energeticos2023/TecGo/pull/2), [YACUSOL #6](https://github.com/Energeticos2023/YACUSOL/pull/6), [Calculo-SFV #2](https://github.com/Energeticos2023/Calculo-SFV/pull/2); GitHub Actions de aislamiento aprobado | Confirmar actualización de PWAs ya instaladas en dispositivos reales |
| ENERGETICOS-CRM-LEADS | Abrir WhatsApp no confirma solicitud recibida ni crea prospecto | **EN PROCESO** | TecGo PR #2 corrige estado; [TecGo #3](https://github.com/Energeticos2023/TecGo/pull/3) y [YACUSOL #8](https://github.com/Energeticos2023/YACUSOL/pull/8) incorporan UUID local | Integración oficial con WhatsApp Business, consentimiento, antispam, CRM y estado realmente recibido; sin API no declarar resuelto |
| ENERGETICOS-CRM-PAGINACION | Truncamiento a 250 filas en Control 360 | **EN PROCESO** | [Control 360 #14](https://github.com/Energeticos2023/Yacusol-app/pull/14): lotes de 500 y aviso al alcanzar 10 000 | Consultas, conteos y filtros de servidor para operación de gran escala |
| ENERGETICOS-CONTROL-QA | Prueba de IDs emitía IDs=0 | **CERRADO (CI)** | [Control 360 #14](https://github.com/Energeticos2023/Yacusol-app/pull/14): 75 IDs detectados y prueba con eliminación simulada | Pruebas E2E con cuentas admin, ventas y técnico |
| ENERGETICOS-PRECIOS-FUENTE | Precios repetidos y riesgo de divergencia | **EN PROCESO** | [YACUSOL #7](https://github.com/Energeticos2023/YACUSOL/pull/7) JSON versionado + tests, [Control 360 #16](https://github.com/Energeticos2023/Yacusol-app/pull/16) prueba entre repositorios | Convertir interfaces a lectura única de fuente versionada o pipeline de generación; formalizar aprobaciones por marca |
| ENERGETICOS-CONTROL-SESIONES | Persistencia de datos y pestañas al cambiar de usuario | **CERRADO (código)** | [Control 360 #14](https://github.com/Energeticos2023/Yacusol-app/pull/14): datos limpios, navegación por rol y protección contra respuestas tardías | Validación real de RLS y revocación de tokens, MFA/recuperación |
| ENERGETICOS-SFV-RESGUARDO | Actualización/cache y datos locales sin respaldo | **EN PROCESO** | [Calculo-SFV #2](https://github.com/Energeticos2023/Calculo-SFV/pull/2): red primero y caché aislada | Respaldo/exportación verificable con privacidad, sincronización central solo con consentimiento |
| ENERGETICOS-FLUTTER-FUENTE | No hay fuente Dart verificada de app pública compilada | **BLOQUEADO** | Inspección de repositorio Yacusol-app: solo artefactos compilados en copia examinada | Ubicar proyecto fuente Dart y proceso reproducible antes de cambios en Flutter |
| ENERGETICOS-DOCS-ESTADO | Documentación contradictoria de activación | **CERRADO (código)** | [Control 360 #15](https://github.com/Energeticos2023/Yacusol-app/pull/15) actualiza estado real y límites | Mantener estado vivo tras cada despliegue |
| ENERGETICOS-CONTROL-HEADERS | Protección anti-enmarcado solo en meta CSP | **BLOQUEADO POR ALOJAMIENTO** | [Control 360 #15](https://github.com/Energeticos2023/Yacusol-app/pull/15) retira directiva ineficaz y documenta limitación | Mover módulo privado a hosting con cabeceras HTTP controlables si se necesita frame-ancestors |
| ENERGETICOS-SUPABASE-AUTH | Protección de contraseñas filtradas deshabilitada | **BLOQUEADO POR CONFIGURACIÓN** | Supabase security advisor 08/11/2026 | Activar en Authentication del proyecto, revisar MFA y renovación de sesiones |

## Reglas de evidencia
- **CERRADO (código)** no equivale a prueba con usuario autenticado.
- **WhatsApp abierto** no equivale a mensaje recibido; un UUID local no es número de orden emitido por servidor.
- No publicar fotos privadas de instalaciones ni supuestos de ventas en GitHub o redes.
- No marcar precio aprobado de XOLMAX, LUXXOL, INTIPOWER o TERMOINOX sin catálogo y fuente verificada.
- El cliente real conserva derecho a privacidad y los datos quedan bajo RLS y almacenamiento privado.

## Próximas acciones priorizadas
1. Validar acceso real de 3 perfiles (admin, ventas y técnico), RLS, URL firmadas y logout en navegador; responsable: administrador y técnico autorizado.
2. Configurar contraseñas filtradas/MFA desde el proyecto Supabase; responsable: propietario del proyecto.
3. Diseñar integración oficial de WhatsApp Business y la captura **de mensajes realmente recibidos** con consentimiento, antispam y deduplicación; responsable: integración con Meta autorizada.
4. Centralizar origen operativo de catálogo y aprobar fichas/precios de otras marcas; responsable: responsable comercial.
5. Consultas específicas y exportación/respaldo para 10 000+ filas; responsable: desarrollo.
