-- Migration to add caratteristiche column to public.immobili
ALTER TABLE public.immobili 
ADD COLUMN caratteristiche text[] DEFAULT '{}'::text[];
