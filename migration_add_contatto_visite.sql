-- Migration to add contatto_visite_id column to public.immobili as text (to support multiple comma-separated contact IDs)
ALTER TABLE public.immobili 
ADD COLUMN contatto_visite_id text;
