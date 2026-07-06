-- ============================================================
-- FIX RLS POLICIES FOR TABELLA IMMOBILI_LOGS
-- Da eseguire nel SQL Editor di Supabase
-- ============================================================

-- 1. Rimuove la vecchia policy generica (se esiste)
DROP POLICY IF EXISTS "Logs accessibili da autenticati" ON public.immobili_logs;

-- 2. Crea policy esplicita per la lettura (SELECT)
CREATE POLICY "Consenti SELECT a utenti autenticati" 
ON public.immobili_logs FOR SELECT 
TO authenticated 
USING (true);

-- 3. Crea policy esplicita per la scrittura (INSERT)
CREATE POLICY "Consenti INSERT a utenti autenticati" 
ON public.immobili_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);
