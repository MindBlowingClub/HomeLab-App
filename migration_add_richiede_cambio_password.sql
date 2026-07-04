-- Aggiunta della colonna richiede_cambio_password alla tabella profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS richiede_cambio_password boolean DEFAULT true;

-- Aggiornamento della funzione trigger per includere la nuova colonna
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, cognome, ruolo, richiede_cambio_password)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome', ''),
    COALESCE(new.raw_user_meta_data->>'cognome', ''),
    COALESCE(new.raw_user_meta_data->>'ruolo', 'User'),
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Revoca dei permessi di esecuzione pubblica e per utenti autenticati sulla funzione di trigger per sicurezza
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, authenticated;
