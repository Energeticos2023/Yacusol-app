-- YACUSOL CONTROL 360: album tecnico exclusivo por cliente y terma + preparacion de visita
-- Aditiva, sin modificar, publicar ni borrar los originales ya guardados.
-- La fotografia publicitaria exige permiso separado; verificacion tecnica NO equivale a permiso comercial.

-- Informacion clasificada de cada foto/video sin exponer el objeto privado.
alter table public.media_assets add column if not exists categoria_tecnica text not null default 'sin_clasificar';
alter table public.media_assets add column if not exists nota_tecnica text;
alter table public.media_assets add column if not exists fecha_captura date;
alter table public.media_assets add constraint y360_media_categoria_check check (
 categoria_tecnica in ('sin_clasificar','vista_general','acceso','estructura','hidraulica','electrica','termotanque_tubos','antes_servicio','durante_servicio','despues_servicio','otra')
);
alter table public.media_assets add constraint y360_media_nota_max check (
 nota_tecnica is null or char_length(nota_tecnica)<=2000
);
-- Dos equipos de un mismo cliente son objetos distintos, nunca mezclar sus medios.
alter table public.equipos add constraint y360_equipos_id_cliente_unq unique(id,cliente_id);
alter table public.media_assets add constraint y360_media_equipo_requiere_cliente check (
 equipo_id is null or cliente_id is not null
);
alter table public.media_assets add constraint y360_media_equipo_cliente_fk
 foreign key (equipo_id,cliente_id) references public.equipos(id,cliente_id);
create index if not exists y360_media_album_idx on public.media_assets(cliente_id,equipo_id,creado_en desc);

create table if not exists public.preparacion_visitas (
 id uuid primary key default gen_random_uuid(),
 equipo_id uuid not null unique references public.equipos(id),
 referencia_acceso text check(referencia_acceso is null or char_length(referencia_acceso)<=600),
 tipo_acceso text not null default 'sin_evaluar'
  check(tipo_acceso in ('sin_evaluar','a_nivel','escalera_fija','escalera_portatil','otro')),
 altura_aprox_m numeric(5,2) check(altura_aprox_m is null or altura_aprox_m between 0 and 100),
 espacio_trabajo text not null default 'sin_evaluar'
  check(espacio_trabajo in ('sin_evaluar','verificar_en_sitio','limitado','restricciones_reportadas')),
 riesgos_observados text check(riesgos_observados is null or char_length(riesgos_observados)<=3000),
 herramientas_prever text check(herramientas_prever is null or char_length(herramientas_prever)<=2000),
 repuestos_prever text check(repuestos_prever is null or char_length(repuestos_prever)<=2000),
 observaciones text check(observaciones is null or char_length(observaciones)<=3000),
 nivel_verificacion text not null default 'pendiente'
  check(nivel_verificacion in ('pendiente','revision_documental','verificado_presencial')),
 creado_por uuid not null default auth.uid() references auth.users(id),
 actualizado_por uuid not null default auth.uid() references auth.users(id),
 creado_en timestamptz not null default now(),
 actualizado_en timestamptz not null default now()
);
create index if not exists y360_preparacion_equipo_idx on public.preparacion_visitas(equipo_id);
alter table public.preparacion_visitas enable row level security;
revoke all on public.preparacion_visitas from anon;
grant select,insert,update on public.preparacion_visitas to authenticated;
create policy "y360_preparacion_select" on public.preparacion_visitas for select to authenticated
 using (
  auth.uid() is not null and
  ((auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
    ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and
      exists(select 1 from public.asignaciones a
        where a.equipo_id=preparacion_visitas.equipo_id and a.tecnico_id=auth.uid())))
 );
create policy "y360_preparacion_insert_admin" on public.preparacion_visitas for insert to authenticated
 with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin' and creado_por=auth.uid() and actualizado_por=auth.uid());
create policy "y360_preparacion_update_admin" on public.preparacion_visitas for update to authenticated
 using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin')
 with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin' and actualizado_por=auth.uid());

-- Tecnico asignado solo puede ver la ficha del cliente correspondiente a sus equipos.
drop policy if exists "clientes_lectura" on public.clientes;
create policy "clientes_lectura" on public.clientes for select to authenticated
 using (
  auth.uid() is not null and (
    (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
    ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and
      exists(select 1 from public.equipos e
         join public.asignaciones a on a.equipo_id=e.id
         where e.cliente_id=clientes.id and a.tecnico_id=auth.uid()))
  )
 );

-- Tecnico: ver fotos suyas, y fotos de otros SOLO de equipos asignados.
drop policy if exists "y360_media_select" on public.media_assets;
create policy "y360_media_select" on public.media_assets for select to authenticated
 using (
  auth.uid() is not null and (
    (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
    ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and
      (registrado_por=auth.uid() or
       (equipo_id is not null and exists(
         select 1 from public.asignaciones a
         where a.equipo_id=media_assets.equipo_id and a.tecnico_id=auth.uid())))
  ))
 );

-- Tecnico solo sube evidencia a equipos que efectivamente tiene asignados.
drop policy if exists "y360_media_insert" on public.media_assets;
create policy "y360_media_insert" on public.media_assets for insert to authenticated
 with check (
  auth.uid() is not null and registrado_por=auth.uid()
  and bucket_key like auth.uid()::text||'/%'
  and not aprobado_marketing and not original_verificado
  and (
   (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
   ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and
     equipo_id is not null and exists(
       select 1 from public.asignaciones a
       where a.equipo_id=media_assets.equipo_id and a.tecnico_id=auth.uid()))
  )
 );

-- Se exige la misma autorizacion para obtener URL privada temporal del original.
drop policy if exists "y360_media_storage_select" on storage.objects;
create policy "y360_media_storage_select" on storage.objects for select to authenticated
 using (
  bucket_id='yacusol-media' and auth.uid() is not null and (
   (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
   ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and (
      name like auth.uid()::text||'/%' or exists(
       select 1 from public.media_assets m
       join public.asignaciones a on a.equipo_id=m.equipo_id
       where m.bucket_key=storage.objects.name and
         a.tecnico_id=auth.uid()
      )
   ))
  )
 );
-- Eliminaciones fisicas no autorizadas: el historial original permanece privado.
