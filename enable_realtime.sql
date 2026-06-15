-- ========================================================
-- ENABLE REALTIME REPLICATION FOR HOMELAB CRM TABLES
-- ========================================================

-- Abilita la replica in tempo reale per le tabelle principali
ALTER PUBLICATION supabase_realtime ADD TABLE public.immobili;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contatti;
ALTER PUBLICATION supabase_realtime ADD TABLE public.visite;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
