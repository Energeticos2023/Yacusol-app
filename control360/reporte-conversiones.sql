-- Implementado en Supabase mediante migraciones 20261108.
-- Vista de agregados para aprendizaje publicitario. No expone datos personales.
-- Seguridad: security_invoker aplica RLS de tablas fuente a cada usuario.
create or replace view public.y360_embudo_campana with (security_invoker=true) as
select p.fuente as canal, coalesce(nullif(btrim(p.campana),''),'Sin campaña') as campana,
 count(distinct p.id)::bigint as prospectos,
 count(distinct q.id) filter(where q.estado in ('enviada','aceptada'))::bigint as cotizaciones_enviadas,
 count(distinct q.id) filter(where q.estado='aceptada')::bigint as cotizaciones_aceptadas,
 count(distinct v.id) filter(where v.estado='confirmada')::bigint as ventas_confirmadas,
 coalesce(sum(v.monto_total) filter(where v.estado='confirmada' and v.moneda='PEN'),0)::numeric(14,2) as ventas_monto_pen,
 coalesce(sum(v.monto_total) filter(where v.estado='confirmada' and v.moneda='USD'),0)::numeric(14,2) as ventas_monto_usd
from public.prospectos p
left join public.cotizaciones q on q.prospecto_id=p.id
left join public.ventas v on v.cotizacion_id=q.id
group by p.fuente,coalesce(nullif(btrim(p.campana),''),'Sin campaña');
revoke all on public.y360_embudo_campana from public,anon;
grant select on public.y360_embudo_campana to authenticated;
