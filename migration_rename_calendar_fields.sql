-- Migration: Rename columns in public.visite to match requested fields
ALTER TABLE public.visite RENAME COLUMN data_ora TO inizio_evento;
ALTER TABLE public.visite RENAME COLUMN esito TO esito_e_note;
ALTER TABLE public.visite RENAME COLUMN immobile_id TO immobile_di_riferimento_id;
ALTER TABLE public.visite DROP COLUMN IF EXISTS feedback;
