-- YACUSOL Control 360: datos de cotización verificables y congelados por oferta.
-- No modifica los documentos legales de otras empresas ni cotizaciones existentes.
alter table public.cotizaciones add column if not exists cantidad integer not null default 1;
alter table public.cotizaciones add column if not exists precio_unitario numeric(12,2);
alter table public.cotizaciones add column if not exists modalidad text not null default 'regular';
alter table public.cotizaciones add column if not exists adicionales jsonb not null default '[]'::jsonb;
alter table public.cotizaciones add column if not exists exclusiones jsonb not null default '[]'::jsonb;
alter table public.cotizaciones add column if not exists precio_fuente text;
alter table public.cotizaciones add column if not exists precio_verificado_en timestamptz;
alter table public.cotizaciones add column if not exists emisor_legal text;
alter table public.cotizaciones add column if not exists ruc_emisor text;
alter table public.cotizaciones add column if not exists igv_incluido boolean not null default true;
alter table public.cotizaciones add column if not exists revision integer not null default 0;
alter table public.cotizaciones add constraint y360_cot_cantidad_check check (cantidad between 1 and 100);
alter table public.cotizaciones add constraint y360_cot_unitario_check check(precio_unitario is null or precio_unitario >= 0);
alter table public.cotizaciones add constraint y360_cot_modalidad_check check(modalidad in ('regular','navidad_2026'));
alter table public.cotizaciones add constraint y360_cot_adicionales_check check(jsonb_typeof(adicionales)='array');
alter table public.cotizaciones add constraint y360_cot_exclusiones_check check(jsonb_typeof(exclusiones)='array');
alter table public.cotizaciones add constraint y360_cot_revision_check check(revision between 0 and 100);
alter table public.cotizaciones add constraint y360_cot_total_coherente check (
 precio_total is null or precio_unitario is null or
 abs(precio_total - (precio_unitario * cantidad)) < 0.02
);
-- El documento enviado debe referir a un cliente o prospecto y tener fecha de vigencia.
alter table public.cotizaciones add constraint y360_cot_envio_completo check (
 estado not in ('enviada','aceptada') or
 (valido_hasta is not null and precio_total > 0 and (cliente_id is not null or prospecto_id is not null))
);
create index if not exists y360_cotizaciones_cliente_fecha_idx on public.cotizaciones(cliente_id,creado_en desc);
