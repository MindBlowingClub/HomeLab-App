-- Migration: Add tutto_giorno (all day event) to public.visite
ALTER TABLE public.visite ADD COLUMN IF NOT EXISTS tutto_giorno boolean DEFAULT false;
