-- Migration to add Accordi fields to public.immobili
ALTER TABLE public.immobili
ADD COLUMN provvigione_tipo text DEFAULT 'Percentuale',
ADD COLUMN provvigione_valore numeric DEFAULT 0,
ADD COLUMN collab_attiva boolean DEFAULT false,
ADD COLUMN collab_contatto_id bigint REFERENCES public.contatti(id) ON DELETE SET NULL,
ADD COLUMN collab_valore numeric DEFAULT 0,
ADD COLUMN segnalatore_attivo boolean DEFAULT false,
ADD COLUMN segnalatore_contatto_id bigint REFERENCES public.contatti(id) ON DELETE SET NULL,
ADD COLUMN segnalatore_valore numeric DEFAULT 0,
ADD COLUMN accordi_note text,
ADD COLUMN collab_accordo_file text,
ADD COLUMN collab_note text,
ADD COLUMN segnalatore_accordo_file text,
ADD COLUMN segnalatore_note text;
