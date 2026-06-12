# HomeLab CRM - Real Estate Office

Questa è la versione reale e pronta per la produzione dell'applicazione **HomeLab CRM**, migrata a partire dal mockup React. Il sistema è ora integrato con un database relazionale **Supabase (PostgreSQL)**, configurato con **Tailwind CSS v4** e predisposto per l'hosting gratuito e continuo su **Vercel**.

---

## Struttura del Progetto

- `src/App.jsx`: Il componente principale dell'app con tutta l'interfaccia utente macOS-style e le query reali a Supabase.
- `src/supabaseClient.js`: Il client SDK di Supabase con supporto per il fallback locale automatico se le chiavi non sono ancora configurate.
- `schema.sql`: Lo script SQL per creare le tabelle e inserire i dati iniziali su Supabase.
- `.env.example`: Template per configurare le variabili d'ambiente locali.

---

## Guida di Avvio Rapido

### 1. Avvio Locale in Modalità Demo
Se avvii l'app senza configurare Supabase, funzionerà automaticamente in **modalità demo** usando i dati in memoria (i dati inseriti o modificati rimarranno attivi fino al ricaricamento della pagina).

1. Installa le dipendenze:
   ```bash
   npm install
   ```
2. Avvia il server di sviluppo locale:
   ```bash
   npm run dev
   ```
3. Apri l'indirizzo mostrato nel terminale (solitamente `http://localhost:5173`).

---

### 2. Configurazione di Supabase (Database)
Per connettere l'applicazione al tuo database reale su Supabase:

1. Accedi a [Supabase](https://supabase.com) e crea un nuovo progetto (es. `homelab-crm`).
2. Nel menu laterale sinistro di Supabase, vai su **SQL Editor** e clicca su **New Query**.
3. Apri il file `schema.sql` di questo progetto, copia l'intero contenuto e incollalo nell'SQL Editor di Supabase.
4. Clicca su **Run** in alto a destra. Questo creerà automaticamente le tabelle `contatti`, `immobili` e `visite` con i dati iniziali del mockup.

---

### 3. Configurazione delle Chiavi Locali (`.env`)
1. Crea un file nominato `.env` nella directory principale del progetto copiando il template:
   ```bash
   cp .env.example .env
   ```
2. Accedi al pannello del tuo progetto Supabase, vai in **Project Settings** (icona dell'ingranaggio in basso a sinistra) > **API**.
3. Copia i seguenti valori:
   - **Project URL** -> Incollalo in `VITE_SUPABASE_URL` nel file `.env`.
   - **anon public (key)** -> Incollalo in `VITE_SUPABASE_ANON_KEY` nel file `.env`.
4. Riavvia il server di sviluppo (`npm run dev`). Ora l'app mostrerà **"Supabase Status: Connesso"** nel pannello laterale ed eseguirà query reali sul database!

---

### 4. Caricamento su GitHub
Avendo già un account GitHub, puoi caricare il codice eseguendo questi comandi nel tuo terminale:

```bash
# Inizializza Git (se non è già stato fatto)
git init

# Aggiungi i file
git add .

# Esegui il primo commit
git commit -m "Initial commit: HomeLab CRM con integrazione Supabase"

# Crea un repository vuoto su GitHub (chiamalo 'homelab-crm')
# Associa il repository locale a quello remoto (sostituisci con il tuo username)
git remote add origin https://github.com/TUO-USERNAME/homelab-crm.git

# Cambia il nome del branch principale in main
git branch -M main

# Carica il codice
git push -u origin main
```

---

### 5. Configurazione e Deploy su Vercel
Avendo già un account Vercel, puoi mettere l'app online in meno di 2 minuti:

1. Accedi a [Vercel](https://vercel.com) e clicca su **Add New** > **Project**.
2. Importa il repository `homelab-crm` che hai appena caricato su GitHub.
3. Nella sezione **Environment Variables** (durante la configurazione del deploy), inserisci le due chiavi seguenti:
   - Nome: `VITE_SUPABASE_URL` | Valore: *[Inserisci l'URL del tuo Supabase]*
   - Nome: `VITE_SUPABASE_ANON_KEY` | Valore: *[Inserisci l'anon key del tuo Supabase]*
4. Clicca su **Deploy**.
5. Vercel compilerà l'applicazione e ti fornirà un URL pubblico (es. `https://homelab-crm.vercel.app`) sicuro (HTTPS) e connesso al tuo database!

Ogni volta che farai un nuovo commit e lo caricherai su GitHub con `git push`, Vercel aggiornerà automaticamente l'applicazione in tempo reale.
