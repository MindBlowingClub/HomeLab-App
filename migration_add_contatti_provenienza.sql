-- Migration: Add provenienza fields to contatti table
-- Date: 2026-07-19

ALTER TABLE contatti
  ADD COLUMN IF NOT EXISTS provenienza_tipo        TEXT,
  ADD COLUMN IF NOT EXISTS provenienza_contatto_id INTEGER REFERENCES contatti(id) ON DELETE SET NULL;
