-- Migration to add piano, numero_piani and superficie_terreno columns to public.immobili
ALTER TABLE public.immobili 
ADD COLUMN piano text,
ADD COLUMN numero_piani integer DEFAULT 0,
ADD COLUMN superficie_terreno integer DEFAULT 0;
