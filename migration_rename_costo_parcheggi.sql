-- Migration to rename costo_parcheggi to prezzo_di_vendita_parcheggi in public.immobili
ALTER TABLE public.immobili RENAME COLUMN costo_parcheggi TO prezzo_di_vendita_parcheggi;
