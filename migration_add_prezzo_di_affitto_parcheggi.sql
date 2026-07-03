-- Migration to add prezzo_di_affitto_parcheggi column to public.immobili
ALTER TABLE public.immobili 
ADD COLUMN prezzo_di_affitto_parcheggi numeric DEFAULT 0;
