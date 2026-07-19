-- Migration: Add address fields to contatti table
-- Date: 2026-07-19

ALTER TABLE contatti
  ADD COLUMN IF NOT EXISTS indirizzo TEXT,
  ADD COLUMN IF NOT EXISTS npa       TEXT,
  ADD COLUMN IF NOT EXISTS comune    TEXT,
  ADD COLUMN IF NOT EXISTS nazione   TEXT;
