-- Migration to drop the foreign key constraint first, then change agente_id to text
-- to support multiple assigned agent IDs (separated by commas).

ALTER TABLE public.immobili 
  DROP CONSTRAINT IF EXISTS immobili_agente_id_fkey;

ALTER TABLE public.immobili 
  ALTER COLUMN agente_id TYPE text USING agente_id::text;
