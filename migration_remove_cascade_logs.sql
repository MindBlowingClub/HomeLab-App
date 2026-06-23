-- Migration: Remove foreign key constraint from immobili_logs to prevent cascade deletion of logs when a property is deleted.
-- This ensures that logs are preserved as a historical audit trail.

ALTER TABLE public.immobili_logs
DROP CONSTRAINT IF EXISTS immobili_logs_immobile_id_fkey;
