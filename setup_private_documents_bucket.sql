-- ============================================================
-- SETUP STORAGE BUCKETS PRIVATI PER HomeLab CRM
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- ------------------------------------------------------------
-- 1. BUCKET 'immobili-documenti' (Privato per file e PDF sensibili)
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'immobili-documenti',
  'immobili-documenti',
  false,   -- false = bucket PRIVATO
  52428800,   -- 50 MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS: Consenti la lettura dei documenti solo a utenti autenticati
DROP POLICY IF EXISTS "Authenticated select documents" ON storage.objects;
CREATE POLICY "Authenticated select documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'immobili-documenti');

-- RLS: Consenti l'inserimento/upload solo a utenti autenticati
DROP POLICY IF EXISTS "Authenticated insert documents" ON storage.objects;
CREATE POLICY "Authenticated insert documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'immobili-documenti');

-- RLS: Consenti la modifica solo a utenti autenticati
DROP POLICY IF EXISTS "Authenticated update documents" ON storage.objects;
CREATE POLICY "Authenticated update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'immobili-documenti');

-- RLS: Consenti la cancellazione solo a utenti autenticati
DROP POLICY IF EXISTS "Authenticated delete documents" ON storage.objects;
CREATE POLICY "Authenticated delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'immobili-documenti');


-- ------------------------------------------------------------
-- 2. RENDERE PRIVATO IL BUCKET 'immobili-media' (Foto e Immagini)
-- ------------------------------------------------------------

-- Aggiorna il bucket esistente per renderlo PRIVATO
UPDATE storage.buckets 
SET public = false 
WHERE id = 'immobili-media';

-- Rimuove la policy di lettura pubblica precedente se esiste
DROP POLICY IF EXISTS "Public read immobili-media" ON storage.objects;

-- RLS: Consenti la lettura delle foto solo a utenti autenticati
DROP POLICY IF EXISTS "Authenticated select media" ON storage.objects;
CREATE POLICY "Authenticated select media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'immobili-media');
