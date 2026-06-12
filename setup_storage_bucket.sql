-- ============================================================
-- SETUP SUPABASE STORAGE per HomeLab CRM
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- 1. Crea il bucket 'immobili-media' (pubblico, max 50MB per file)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'immobili-media',
  'immobili-media',
  true,
  52428800,   -- 50 MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;


-- 2. Policy: lettura pubblica (chiunque può vedere le URL pubbliche)
CREATE POLICY "Public read immobili-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'immobili-media');


-- 3. Policy: upload solo per utenti autenticati
CREATE POLICY "Authenticated upload immobili-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'immobili-media');


-- 4. Policy: update solo per utenti autenticati
CREATE POLICY "Authenticated update immobili-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'immobili-media');


-- 5. Policy: delete solo per utenti autenticati
CREATE POLICY "Authenticated delete immobili-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'immobili-media');


-- Verifica: mostra il bucket creato
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'immobili-media';
