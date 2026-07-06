-- ============================================================
-- SETUP BUCKET PRIVATO PER DOCUMENTI HomeLab CRM
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- 1. Crea il bucket privato 'immobili-documenti' (max 50MB per file)
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

-- 2. RLS: Consenti la lettura dei documenti solo a utenti autenticati nel CRM
CREATE POLICY "Authenticated select documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'immobili-documenti');

-- 3. RLS: Consenti l'inserimento/upload solo a utenti autenticati
CREATE POLICY "Authenticated insert documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'immobili-documenti');

-- 4. RLS: Consenti la modifica solo a utenti autenticati
CREATE POLICY "Authenticated update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'immobili-documenti');

-- 5. RLS: Consenti la cancellazione solo a utenti autenticati
CREATE POLICY "Authenticated delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'immobili-documenti');
