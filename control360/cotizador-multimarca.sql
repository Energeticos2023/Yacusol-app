-- Ampliación no destructiva: ENERGÉTICOS comercializa cinco marcas.
-- Se conserva la fuente del precio de cada cotización existente y su historial.
ALTER TABLE public.cotizaciones
 ADD COLUMN IF NOT EXISTS marca text NOT NULL DEFAULT 'YACUSOL';
ALTER TABLE public.cotizaciones
 ADD COLUMN IF NOT EXISTS modelo_fabricante text;
ALTER TABLE public.cotizaciones
 ADD CONSTRAINT y360_cot_marca_check CHECK (marca IN ('YACUSOL','XOLMAX','LUXXOL','INTIPOWER','TERMOINOX'));
ALTER TABLE public.cotizaciones
 ADD CONSTRAINT y360_cot_modelo_fabricante_check CHECK (modelo_fabricante IS NULL OR length(modelo_fabricante)<=160);
CREATE INDEX IF NOT EXISTS y360_cot_marca_fecha_idx ON public.cotizaciones(marca,creado_en DESC);
