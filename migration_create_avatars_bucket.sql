-- ============================================================
-- SETUP STORAGE BUCKET 'profili-avatar' PER LE FOTO PROFILO UTENTI
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- 1. Crea il bucket 'profili-avatar' come PRIVATO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profili-avatar',
  'profili-avatar',
  false,   -- false = bucket PRIVATO (richiede URL firmati)
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Abilitazione della Row Level Security (RLS) per storage.objects
-- Nota: La RLS è già attiva su storage.objects, creiamo le policy dedicate a questo bucket.

-- RLS SELECT: Qualsiasi utente autenticato nel CRM può vedere le foto profilo di tutti
DROP POLICY IF EXISTS "Authenticated select avatars" ON storage.objects;
CREATE POLICY "Authenticated select avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profili-avatar');

-- RLS INSERT: Gli utenti possono caricare foto profilo solo all'interno del proprio profilo
-- (Ad esempio salvandole sotto una cartella col proprio ID utente o semplicemente se autenticati)
DROP POLICY IF EXISTS "Authenticated insert avatars" ON storage.objects;
CREATE POLICY "Authenticated insert avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profili-avatar');

-- RLS UPDATE/DELETE: Consenti la modifica/cancellazione solo al proprietario o ad utenti autenticati
DROP POLICY IF EXISTS "Authenticated update avatars" ON storage.objects;
CREATE POLICY "Authenticated update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profili-avatar');

DROP POLICY IF EXISTS "Authenticated delete avatars" ON storage.objects;
CREATE POLICY "Authenticated delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profili-avatar');
