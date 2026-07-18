-- Migration to add immobili_visite column to public.contatti as bigint array
ALTER TABLE public.contatti 
ADD COLUMN IF NOT EXISTS immobili_visite bigint[] DEFAULT '{}'::bigint[];
