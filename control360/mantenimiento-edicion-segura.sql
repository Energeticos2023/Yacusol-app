-- Historial seguro de equipos y mantenimientos. No borra registros reales.
alter table public.equipos add column if not exists activo boolean not null default true;
alter table public.equipos add column if not exists archivado_en timestamptz;
alter table public.equipos add column if not exists archivado_por uuid references auth.users(id);
alter table public.equipos add column if not exists motivo_archivo text;
alter table public.equipos add constraint y360_equipo_archivo_consistencia check (
 activo or (archivado_en is not null and archivado_por is not null and motivo_archivo is not null and char_length(btrim(motivo_archivo))>=6)
);
alter table public.mantenimientos add column if not exists anulado boolean not null default false;
alter table public.mantenimientos add column if not exists anulado_en timestamptz;
alter table public.mantenimientos add column if not exists anulado_por uuid references auth.users(id);
alter table public.mantenimientos add column if not exists motivo_anulacion text;
alter table public.mantenimientos add constraint y360_mantenimiento_anulacion_consistencia check (
 not anulado or (anulado_en is not null and anulado_por is not null and motivo_anulacion is not null and char_length(btrim(motivo_anulacion))>=6)
);
grant update on public.equipos to authenticated;
grant update on public.mantenimientos to authenticated;
create policy "y360_mantenimientos_editar_admin"
on public.mantenimientos for update to authenticated
using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin')
with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin');
create index if not exists y360_equipo_activo_fecha_idx on public.equipos(activo, instalado_el);
create index if not exists y360_mantenimiento_anulado_idx on public.mantenimientos(anulado, equipo_id, fecha_realizada);
