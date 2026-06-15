-- Migration for existing database to support new contacts fields:
-- 1. Alter ruolo column to text[] (preserving existing data by casting to array)
ALTER TABLE public.contatti 
  ALTER COLUMN ruolo TYPE text[] USING CASE 
    WHEN ruolo IS NULL THEN '{}'::text[]
    ELSE ARRAY[ruolo]
  END;

-- Set a default for ruolo
ALTER TABLE public.contatti ALTER COLUMN ruolo SET DEFAULT '{}'::text[];

-- 2. Add note_contatto column
ALTER TABLE public.contatti ADD COLUMN IF NOT EXISTS note_contatto text;

-- 3. Add owned and managed property array columns
ALTER TABLE public.contatti ADD COLUMN IF NOT EXISTS immobili_posseduti bigint[] DEFAULT '{}'::bigint[];
ALTER TABLE public.contatti ADD COLUMN IF NOT EXISTS immobili_gestiti bigint[] DEFAULT '{}'::bigint[];
