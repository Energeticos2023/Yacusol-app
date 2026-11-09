-- Control 360: registro append-only de intervenciones de instalacion y puesta en servicio.
-- Ningun equipo existente se altera ni se fabrica evidencia retroactiva.
create table if not exists public.actas_instalacion (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null references public.equipos(id) on delete restrict,
  tipo_evento text not null default 'instalacion'
    check (tipo_evento in ('instalacion','puesta_servicio','inspeccion','correccion')),
  fecha_trabajo date not null,
  tecnico_principal text not null check (char_length(btrim(tecnico_principal)) between 2 and 160),
  empresa_instaladora text check (empresa_instaladora is null or char_length(empresa_instaladora)<=160),
  tecnicos_apoyo text check (tecnicos_apoyo is null or char_length(tecnicos_apoyo)<=500),
  responsable_pruebas text check (responsable_pruebas is null or char_length(responsable_pruebas)<=160),
  orden_referencia text check (orden_referencia is null or char_length(orden_referencia)<=120),
  fuente_registro text not null default 'declaracion'
    check (fuente_registro in ('presencial','acta_documental','declaracion','historico')),
  tipo_sistema text not null default 'sin_verificar'
    check (tipo_sistema in ('baja_presion','presurizado','otro','sin_verificar')),
  componentes_accesorios text check (componentes_accesorios is null or char_length(componentes_accesorios)<=3000),
  controles jsonb not null default '{}'::jsonb
    check (jsonb_typeof(controles) = 'object'),
  temperatura_salida_c numeric(5,2)
    check (temperatura_salida_c is null or (temperatura_salida_c between 0 and 120)),
  presion_entrada_kpa numeric(8,2)
    check (presion_entrada_kpa is null or (presion_entrada_kpa between 0 and 4000)),
  condiciones_y_riesgos text check (condiciones_y_riesgos is null or char_length(condiciones_y_riesgos)<=3000),
  observaciones_pruebas text check (observaciones_pruebas is null or char_length(observaciones_pruebas)<=3000),
  pendientes text check (pendientes is null or char_length(pendientes)<=2500),
  receptor_cliente text check (receptor_cliente is null or char_length(receptor_cliente)<=160),
  evidencia_entrega text check (evidencia_entrega is null or char_length(evidencia_entrega)<=500),
  estado_entrega text not null default 'sin_documentar'
    check (estado_entrega in ('sin_documentar','pendiente','entregado_con_evidencia')),
  referencia_evidencias text check (referencia_evidencias is null or char_length(referencia_evidencias)<=800),
  registrado_por uuid not null default auth.uid() references auth.users(id),
  registrado_en timestamptz not null default now()
);
comment on table public.actas_instalacion is
 'Registros historicos inmutables por equipo; registrar no es aprobar o certificar puesta en servicio.';
create index if not exists ix_actas_instalacion_equipo_fecha
 on public.actas_instalacion(equipo_id,registrado_en desc);
create index if not exists ix_actas_instalacion_registrador
 on public.actas_instalacion(registrado_por,registrado_en desc);
alter table public.actas_instalacion enable row level security;
revoke all on public.actas_instalacion from anon;
revoke all on public.actas_instalacion from authenticated;
grant select,insert on public.actas_instalacion to authenticated;
create policy actas_instalacion_lectura on public.actas_instalacion
 for select to authenticated using (
  auth.uid() is not null and (
   auth.jwt()->'app_metadata'->>'yacusol_role' in ('admin','ventas')
   or (
    auth.jwt()->'app_metadata'->>'yacusol_role' = 'tecnico'
    and exists (
     select 1 from public.asignaciones a
     where a.equipo_id = actas_instalacion.equipo_id and a.tecnico_id=auth.uid()
    )
   )
  )
 );
create policy actas_instalacion_registrar on public.actas_instalacion
 for insert to authenticated with check (
  auth.uid() is not null and registrado_por=auth.uid() and
  (
   auth.jwt()->'app_metadata'->>'yacusol_role' = 'admin'
   or (
    auth.jwt()->'app_metadata'->>'yacusol_role' = 'tecnico'
    and exists (
     select 1 from public.asignaciones a
     where a.equipo_id = actas_instalacion.equipo_id and a.tecnico_id=auth.uid()
    )
   )
  )
 );
-- Sin politicas UPDATE ni DELETE: correcciones se documentan como nuevas actas.
