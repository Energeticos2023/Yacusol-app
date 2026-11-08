-- YACUSOL CONTROL 360 - extension segura y aditiva del proyecto existente
-- 2026-11-08. Esquema para clientes/ventas/equipos ya existentes.
-- Cambios en public: prospectos, cotizaciones, media_assets; mejora ventas.
-- Ni clientes ni ventas existentes se borran. Todos los nuevos datos con RLS.

create table if not exists public.prospectos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(btrim(nombre)) between 2 and 160),
  telefono text check (telefono is null or telefono ~ '^[+]?[1-9][0-9]{6,14}$'),
  distrito text check (distrito is null or length(distrito)<=160),
  fuente text not null default 'manual' check (fuente in ('manual','facebook','instagram','tiktok','whatsapp','web','referido','otro')),
  campana text,
  personas integer check (personas is null or personas between 1 and 100),
  necesidad text,
  etapa text not null default 'nuevo' check (etapa in ('nuevo','contactado','calificado','cotizado','ganado','perdido')),
  siguiente_contacto timestamptz,
  cliente_id uuid references public.clientes(id) on delete set null,
  creado_por uuid not null default auth.uid() references auth.users(id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create index if not exists y360_prospectos_etapa_idx on public.prospectos(etapa,creado_en desc);
alter table public.prospectos enable row level security;
revoke all on public.prospectos from anon;
grant select,insert,update on public.prospectos to authenticated;
create policy "y360_prospectos_select" on public.prospectos for select to authenticated
  using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));
create policy "y360_prospectos_insert" on public.prospectos for insert to authenticated
  with check (creado_por=auth.uid() and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));
create policy "y360_prospectos_update" on public.prospectos for update to authenticated
  using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'))
  with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));

create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid references public.prospectos(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  referencia text,
  modelo text not null check (length(btrim(modelo)) between 2 and 120),
  capacidad_l integer check (capacidad_l is null or capacidad_l between 1 and 2000),
  componentes jsonb not null default '[]'::jsonb check (jsonb_typeof(componentes)='array'),
  precio_total numeric(12,2) check (precio_total is null or precio_total>=0),
  moneda text not null default 'PEN' check (moneda in ('PEN','USD')),
  estado text not null default 'borrador' check (estado in ('borrador','enviada','aceptada','rechazada','vencida')),
  valido_hasta date,
  enviada_en timestamptz,
  aceptada_en timestamptz,
  notas text,
  creado_por uuid not null default auth.uid() references auth.users(id),
  creado_en timestamptz not null default now()
);
create index if not exists y360_cotizaciones_estado_idx on public.cotizaciones(estado,creado_en desc);
alter table public.cotizaciones enable row level security;
revoke all on public.cotizaciones from anon;
grant select,insert,update on public.cotizaciones to authenticated;
create policy "y360_cotizaciones_select" on public.cotizaciones for select to authenticated
  using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));
create policy "y360_cotizaciones_insert" on public.cotizaciones for insert to authenticated
  with check (creado_por=auth.uid() and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));
create policy "y360_cotizaciones_update" on public.cotizaciones for update to authenticated
  using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'))
  with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas'));

-- Ventas: completar información económica y relación con cotización, sin crear
-- otro registro paralelo que pueda producir doble conteo.
alter table public.ventas add column if not exists cotizacion_id uuid references public.cotizaciones(id);
alter table public.ventas add column if not exists monto_total numeric(12,2);
alter table public.ventas add column if not exists moneda text not null default 'PEN';
alter table public.ventas add constraint y360_ventas_monto_check check (monto_total is null or monto_total>=0);
alter table public.ventas add constraint y360_ventas_confirmacion_check check (estado <> 'confirmada' or monto_total > 0);
alter table public.ventas add constraint y360_ventas_moneda_check check (moneda in ('PEN','USD'));
create index if not exists y360_ventas_cotizacion_idx on public.ventas(cotizacion_id);

-- Reparar validación preexistente de teléfonos; patrón anterior confundía
-- escapes. Base comprobada sin datos al realizar esta extensión.
alter table public.clientes drop constraint if exists clientes_telefono_check;
alter table public.clientes add constraint clientes_telefono_check check (telefono is null or telefono ~ '^[+]?[1-9][0-9]{6,14}$');

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_key text not null unique check (position('..' in bucket_key)=0),
  nombre text not null check (length(btrim(nombre)) between 2 and 160),
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
  constraint y360_media_aprobacion_check check (
    not aprobado_marketing or
    (derechos_confirmados and permiso_publicitario and original_verificado and
     evidencia_permiso is not null and length(btrim(evidencia_permiso))>0 and
     aprobado_por is not null and aprobado_en is not null)
  )
);
create index if not exists y360_media_fecha_idx on public.media_assets(creado_en desc);
alter table public.media_assets enable row level security;
revoke all on public.media_assets from anon;
grant select,insert,update on public.media_assets to authenticated;
create policy "y360_media_select" on public.media_assets for select to authenticated
  using (auth.uid() is not null and (
    (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas')
    or ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and registrado_por=auth.uid())
  ));
create policy "y360_media_insert" on public.media_assets for insert to authenticated
  with check (
    registrado_por=auth.uid() and bucket_key like auth.uid()::text||'/%' and
    (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas','tecnico')
    and not aprobado_marketing and not original_verificado
  );
create policy "y360_media_update_admin" on public.media_assets for update to authenticated
  using (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin')
  with check (auth.uid() is not null and (auth.jwt()->'app_metadata'->>'yacusol_role')='admin');

-- Bucket privado. No hay política de UPDATE o DELETE, por tanto los archivos
-- originales no se sobrescriben ni eliminan desde el cliente.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('yacusol-media','yacusol-media',false,52428800,ARRAY['image/jpeg','image/png','image/webp','video/mp4'])
on conflict (id) do nothing;
create policy "y360_media_storage_select" on storage.objects for select to authenticated
  using (
    bucket_id='yacusol-media' and auth.uid() is not null and (
      (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas') or
      ((auth.jwt()->'app_metadata'->>'yacusol_role')='tecnico' and name like auth.uid()::text||'/%')
    )
  );
create policy "y360_media_storage_insert" on storage.objects for insert to authenticated
  with check (
    bucket_id='yacusol-media' and auth.uid() is not null and
    name like auth.uid()::text||'/%' and
    (auth.jwt()->'app_metadata'->>'yacusol_role') in ('admin','ventas','tecnico')
  );
