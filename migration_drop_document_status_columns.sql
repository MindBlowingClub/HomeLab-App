-- Migration: Remove redundant Si/No document status columns from public.immobili
-- These columns are superseded by the corresponding _doc columns (file URL presence)
ALTER TABLE public.immobili
  DROP COLUMN IF EXISTS estratto_registro_fondiario,
  DROP COLUMN IF EXISTS descrittivo_tecnico,
  DROP COLUMN IF EXISTS regolamento_condominiale,
  DROP COLUMN IF EXISTS assicurazione_stabile,
  DROP COLUMN IF EXISTS verbale_ultima_assemblea,
  DROP COLUMN IF EXISTS fondo_rinnovamento,
  DROP COLUMN IF EXISTS valore_di_stima,
  DROP COLUMN IF EXISTS piano_assegnazioni_parti_comuni,
  DROP COLUMN IF EXISTS rasi,
  DROP COLUMN IF EXISTS certificato_radon;
