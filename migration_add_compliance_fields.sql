-- ============================================================
-- MIGRATION: Aggiunta campi documentali e conformità a immobili
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- 1. Modifica spese_condominiali da numeric a text (Si/No)
ALTER TABLE public.immobili
  ALTER COLUMN spese_condominiali TYPE text USING
    CASE
      WHEN spese_condominiali IS NULL OR spese_condominiali = 0 THEN 'No'
      ELSE 'Si'
    END;

-- 2. Aggiunta dei nuovi campi (IF NOT EXISTS per sicurezza)
ALTER TABLE public.immobili
  ADD COLUMN IF NOT EXISTS planimetria text,
  ADD COLUMN IF NOT EXISTS numero_di_mappale text,
  ADD COLUMN IF NOT EXISTS tipo_di_residenza text[],
  ADD COLUMN IF NOT EXISTS vendibile_a_stranieri text,
  ADD COLUMN IF NOT EXISTS estratto_registro_fondiario text,
  ADD COLUMN IF NOT EXISTS estratto_registro_fondiario_doc text,
  ADD COLUMN IF NOT EXISTS descrittivo_tecnico text,
  ADD COLUMN IF NOT EXISTS descrittivo_tecnico_doc text,
  ADD COLUMN IF NOT EXISTS regolamento_condominiale text,
  ADD COLUMN IF NOT EXISTS regolamento_condominiale_doc text,
  ADD COLUMN IF NOT EXISTS spese_condominiali_doc text,
  ADD COLUMN IF NOT EXISTS assicurazione_stabile text,
  ADD COLUMN IF NOT EXISTS assicurazione_stabile_doc text,
  ADD COLUMN IF NOT EXISTS verbale_ultima_assemblea text,
  ADD COLUMN IF NOT EXISTS verbale_ultima_assemblea_doc text,
  ADD COLUMN IF NOT EXISTS fondo_rinnovamento text,
  ADD COLUMN IF NOT EXISTS fondo_rinnovamento_doc text,
  ADD COLUMN IF NOT EXISTS valore_di_stima text,
  ADD COLUMN IF NOT EXISTS valore_di_stima_doc text,
  ADD COLUMN IF NOT EXISTS piano_assegnazioni_parti_comuni text,
  ADD COLUMN IF NOT EXISTS piano_assegnazioni_parti_comuni_doc text,
  ADD COLUMN IF NOT EXISTS rasi text,
  ADD COLUMN IF NOT EXISTS rasi_doc text,
  ADD COLUMN IF NOT EXISTS certificato_radon text,
  ADD COLUMN IF NOT EXISTS certificato_radon_doc text;

-- 3. Crea manualmente il profilo per l'utente esistente (se mancante)
-- Sostituisci 'IL-TUO-USER-ID' con: f21982b9-019c-4eef-a71c-5f65274ab0a8
INSERT INTO public.profiles (id, nome, cognome, ruolo)
VALUES (
  'f21982b9-019c-4eef-a71c-5f65274ab0a8',
  'Massimiliano',
  'Boldi',
  'Admin'
)
ON CONFLICT (id) DO NOTHING;

-- Verifica finale
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'immobili' AND table_schema = 'public'
ORDER BY ordinal_position;
