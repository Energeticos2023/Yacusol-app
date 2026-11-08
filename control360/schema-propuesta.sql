-- YACUSOL Control 360: propuesta de ampliacion. NO ejecutar en produccion sin revisar.
-- Esquema de los componentes nuevos; conserva clientes, ventas, equipos,
-- mantenimientos y citas ya existentes. PostgreSQL/Supabase.
-- 2026-11-08

create table if not exists public.prospectos (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check (length(trim(nombre)) between 2 and 160),
 telefono text check (telefono is null or telefono ~ '^\\+?[1-9][0-9]{6,14}$'),
 distrito text,
 fuente text not null default 'manual' check (fuente in ('manual','facebook','instagram','tiktok','whatsapp','web','referido','otro')),
 campana text,
 personas integer check (personas is null or personas between 1 and 100),
 necesidad text,
 etapa text not null default 'nuevo' check (etapa in ('nuevo','contactado','calificado','cotizado','ganado','perdido')),
 siguiente_contacto timestamptz,
 creado_por uuid not null default auth.uid() references auth.users(id),
 creado_en timestamptz not null default now(),
 actualizado_en timestamptz not null default now()
);
create index if not exists prospectos_etapa_idx on public.prospectos (etapa, creado_en desc);
alter table public.prospectos enable row level security;
revoke all on table public.prospectos from anon;
grant select, insert, update on public.prospectos to authenticated;
create policy "prospectos_ver" on public.prospectos for select to authenticated using (auth.uid() is not null and (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas'));
create policy "prospectos_insertar" on public.prospectos for insert to authenticated with check (creado_por = auth.uid() and (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas'));
create policy "prospectos_actualizar" on public.prospectos for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas')) with check ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas') and creado_por is not null);

create table if not exists public.cotizaciones (
 id uuid primary key default gen_random_uuid(),
 prospecto_id uuid references public.prospectos(id) on delete set null,
 cliente_id uuid references public.clientes(id) on delete set null,
 referencia text,
 modelo text not null,
 capacidad_l integer check (capacidad_l is null or capacidad_l > 0),
 componentes jsonb not null default '[]'::jsonb check (jsonb_typeof(componentes) = 'array'),
 precio_total numeric(12,2) check (precio_total is null or precio_total >= 0),
 moneda text not null default 'PEN' check (moneda in ('PEN','USD')),
 estado text not null default 'borrador' check (estado in ('borrador','enviada','aceptada','rechazada','vencida')),
 valido_hasta date,
 notas text,
 creado_por uuid not null default auth.uid() references auth.users(id),
 creado_en timestamptz not null default now()
);
create index if not exists cotizaciones_estado_idx on public.cotizaciones (estado, creado_en desc);
alter table public.cotizaciones enable row level security;
revoke all on table public.cotizaciones from anon;
grant select,insert,update on public.cotizaciones to authenticated;
create policy "cotizaciones_ver" on public.cotizaciones for select to authenticated using (auth.uid() is not null and (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas'));
create policy "cotizaciones_insertar" on public.cotizaciones for insert to authenticated with check (creado_por = auth.uid() and (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas'));
create policy "cotizaciones_actualizar" on public.cotizaciones for update to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas')) with check ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas'));

create table if not exists public.media_assets (
 id uuid primary key default gen_random_uuid(),
 bucket_key text not null unique check (bucket_key !~ '\\.\\.'),
 nombre text not null,
 tipo text not null check (tipo in ('foto','video')),
 etapa_obra text not null default 'por_verificar' check (etapa_obra in ('por_verificar','montaje','instalado','mantenimiento')),
 cliente_id uuid references public.clientes(id) on delete set null,
 equipo_id uuid references public.equipos(id) on delete set null,
 zona text,
 registrado_por uuid not null default auth.uid() references auth.users(id),
 creado_en timestamptz not null default now(),
 sha256_hex text check (sha256_hex is null or sha256_hex ~ '^[0-9a-f]{64}$'),
 derechos_confirmados boolean not null default false,
 permiso_publicitario boolean not null default false,
 evidencia_permiso text,
 original_verificado boolean not null default false,
 aprobado_marketing boolean not null default false,
 aprobado_por uuid references auth.users(id),
 aprobado_en timestamptz,
 observaciones text,
 constraint aprobacion_media_controlada check (not aprobado_marketing or (derechos_confirmados and permiso_publicitario and original_verificado and evidencia_permiso is not null and length(trim(evidencia_permiso))>0))
);
create index if not exists media_assets_registro_idx on public.media_assets (creado_en desc);
alter table public.media_assets enable row level security;
revoke all on table public.media_assets from anon;
grant select,insert,update on public.media_assets to authenticated;
create policy "media_ver" on public.media_assets for select to authenticated using (auth.uid() is not null and (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas','tecnico'));
create policy "media_insertar" on public.media_assets for insert to authenticated with check (
 registrado_por = auth.uid() and bucket_key like auth.uid()::text || '/%' and
 (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas','tecnico')
 and not aprobado_marketing and not original_verificado
);
create policy "media_actualizar_admin" on public.media_assets for update to authenticated
 using ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') = 'admin')
 with check ((auth.jwt() -> 'app_metadata' ->> 'yacusol_role') = 'admin');

-- Los archivos NO se hacen publicos. Crear bucket privado para imagen/video.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('yacusol-media','yacusol-media',false,52428800, array['image/jpeg','image/png','image/webp','video/mp4'])
on conflict (id) do nothing;
create policy "yacusol_media_lectura" on storage.objects for select to authenticated using (
 bucket_id = 'yacusol-media' and auth.uid() is not null and
 (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas','tecnico')
);
create policy "yacusol_media_subida" on storage.objects for insert to authenticated with check (
 bucket_id = 'yacusol-media' and auth.uid() is not null and
 name like auth.uid()::text || '/%' and
 (auth.jwt() -> 'app_metadata' ->> 'yacusol_role') in ('admin','ventas','tecnico')
);
-- No habilitar public download, overwrite ni delete automaticos.
-- Admin puede gestionar autorizaciones desde media_assets, no alterar el original.
