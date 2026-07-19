-- Migration: Add ricerca/search fields to contatti table for Immobile Ricercato
-- Date: 2026-07-19

ALTER TABLE public.contatti
  ADD COLUMN IF NOT EXISTS ricerca_categoria          TEXT,
  ADD COLUMN IF NOT EXISTS ricerca_tipo               TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS ricerca_prezzo_max         NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_spese_max          NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_superficie_min     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_terreno_min        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_locali_min         NUMERIC(3,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_bagni_min          INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_garage_min         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_parcheggio_min     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ricerca_residenza          TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS ricerca_stranieri          TEXT DEFAULT 'Indifferente',
  ADD COLUMN IF NOT EXISTS ricerca_comune             TEXT,
  ADD COLUMN IF NOT EXISTS ricerca_caratteristiche    TEXT[] DEFAULT '{}'::TEXT[];
