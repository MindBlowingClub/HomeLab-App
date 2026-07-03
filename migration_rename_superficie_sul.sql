-- Migration to rename column superficie_sul to superficie_utile in public.immobili
ALTER TABLE public.immobili RENAME COLUMN superficie_sul TO superficie_utile;
