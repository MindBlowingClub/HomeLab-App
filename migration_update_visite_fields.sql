-- Migration: Add nome_evento and fine_evento to public.visite
ALTER TABLE public.visite ADD COLUMN IF NOT EXISTS nome_evento text;
ALTER TABLE public.visite ADD COLUMN IF NOT EXISTS fine_evento timestamptz;
