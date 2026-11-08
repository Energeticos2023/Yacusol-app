-- YACUSOL Control 360: asociar evidencia de antes/durante/despues a un servicio real
alter table public.mantenimientos
 add constraint y360_mantenimiento_id_equipo_unq unique(id,equipo_id);
alter table public.media_assets add column if not exists mantenimiento_id uuid;
alter table public.media_assets add constraint y360_media_servicio_requiere_equipo check (
 mantenimiento_id is null or equipo_id is not null
);
alter table public.media_assets add constraint y360_media_servicio_equipo_fk
 foreign key (mantenimiento_id,equipo_id) references public.mantenimientos(id,equipo_id);
create index if not exists y360_media_servicio_idx on public.media_assets(mantenimiento_id,creado_en desc);
