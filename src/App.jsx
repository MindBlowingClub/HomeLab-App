import { useState, useEffect } from 'react';
import { supabase, isRealSupabase } from './supabaseClient';

// --- INLINE BEAUTIFUL SVG ICONS (Apple Style) ---
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
  </svg>
);

const IconImmobili = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconContatti = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconCalendario = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconCloud = ({ connected }) => (
  <svg className={`w-5 h-5 ${connected ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

// --- INITIAL MOCK DATA FROM REAL CSVs ---
const INITIAL_CONTATTI = [
  {
    id: 1,
    cognome: "Honchar",
    nome: "Olga",
    societa: "HOME LAB Real Estate Sagl",
    ruolo: ["Agente Immobiliare"],
    telefono: "+41 79 533 74 19",
    mail: "o.honchar@homelabrealestate.ch",
    note: "Agente principale di riferimento per le proprietà di alto standing a Lugano.",
    note_contatto: "Agente principale di riferimento per le proprietà di alto standing a Lugano.",
    immobili_posseduti: [],
    immobili_gestiti: [101, 102]
  },
  {
    id: 2,
    cognome: "Iannone",
    nome: "Andrea",
    societa: "",
    ruolo: ["Proprietario", "Locatore"],
    telefono: "+41 76 458 29 29",
    mail: "a.iannone@exclusive-properties.ch",
    note: "Proprietario dell'appartamento esclusivo con piscina a Bissone.",
    note_contatto: "Proprietario dell'appartamento esclusivo con piscina a Bissone.",
    immobili_posseduti: [101, 102, 103],
    immobili_gestiti: []
  },
  {
    id: 3,
    cognome: "Boldi",
    nome: "Massimiliano",
    societa: "HOME LAB Real Estate Sagl",
    ruolo: ["Intermediario"],
    telefono: "+41 79 457 95 58",
    mail: "m.boldi@homelabrealestate.ch",
    note: "Gestore delle relazioni con i clienti e procacciatore d'affari.",
    note_contatto: "Gestore delle relazioni con i clienti e procacciatore d'affari.",
    immobili_posseduti: [],
    immobili_gestiti: [103]
  },
  {
    id: 4,
    cognome: "Cau",
    nome: "Stefano",
    societa: "Design Addict",
    ruolo: ["Fotografo"],
    telefono: "+41 76 526 28 82",
    mail: "studio@designaddict.ch",
    note: "Fotografo professionista specializzato in architettura d'interni e video droni.",
    note_contatto: "Fotografo professionista specializzato in architettura d'interni e video droni.",
    immobili_posseduti: [],
    immobili_gestiti: []
  },
  {
    id: 5,
    cognome: "Kogan Amaro",
    nome: "Julio",
    societa: "",
    ruolo: ["Acquirente"],
    telefono: "+41 78 991 12 23",
    mail: "j.kogan@vip-invest.ch",
    note: "Potenziale acquirente interessato ad attici di lusso con vista lago.",
    note_contatto: "Potenziale acquirente interessato ad attici di lusso con vista lago.",
    immobili_posseduti: [],
    immobili_gestiti: []
  },
  {
    id: 6,
    cognome: "Rossi",
    nome: "Marco",
    societa: "Rossi Investments",
    ruolo: ["Proprietario", "Locatore"],
    telefono: "+41 79 123 45 67",
    mail: "m.rossi@rossi-invest.ch",
    note: "Investitore immobiliare locale focalizzato sul mercato degli appartamenti da reddito.",
    note_contatto: "Investitore immobiliare locale focalizzato sul mercato degli appartamenti da reddito.",
    immobili_posseduti: [102],
    immobili_gestiti: []
  },
  {
    id: 7,
    cognome: "Bianchi",
    nome: "Elena",
    societa: "",
    ruolo: ["Acquirente", "Affittuario"],
    telefono: "+41 76 987 65 43",
    mail: "elena.bianchi@gmail.com",
    note: "Cerca un appartamento in affitto o acquisto in zona Paradiso o Lugano centro.",
    note_contatto: "Cerca un appartamento in affitto o acquisto in zona Paradiso o Lugano centro.",
    immobili_posseduti: [],
    immobili_gestiti: []
  }
];

const INITIAL_IMMOBILI = [
  {
    id: 101,
    nome_immobile: "ESCLUSIVA PROPRIETÀ VISTA LAGO A CADEMARIO",
    codice_immobile: "#0001",
    immagine_di_riferimento: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    immobile_in: ["Vendita"],
    stato: "Disponibile",
    mandato_firmato: "Si",
    tipo_di_mandato: "In Esclusiva",
    mandato: "RF-Cademario-1024.pdf",
    prezzo_di_vendita: 3450000,
    prezzo_di_affitto: 0,
    spese_condominiali: 0,
    costo_parcheggi: 0,
    indirizzo: "Via Cantonale 45",
    comune: "Cademario",
    npa: 6936,
    nazione: "Svizzera",
    categoria: "Casa",
    tipo: ["Villa"],
    superficie_abitabile: 320,
    superficie_sul: 380,
    numero_di_locali: 6.5,
    numero_bagni: 4,
    anno_di_costruzione: 2018,
    ultimo_rinnovo: 202400,
    garage: 1,
    parcheggio: 1,
    descrizione_immobile: "Stupenda villa minimalista con piscina a sfioro riscaldata, esposizione solare ottimale e vista mozzafiato a 180 gradi sul Lago di Lugano.",
    proprietario_id: 2,
    agente_id: 1,
    creato_da: "OLGA HONCHAR",
    ultima_modifica_il: "2026-05-26",
    ultima_modifica_fatta_da: "MASSIMILIANO BOLDI",
    planimetria: "planimetria-cademario.pdf",
    link_a_cartella_condivisa: "https://drive.google.com/drive/folders/12345",
    numero_di_mappale: "1234",
    tipo_di_residenza: ["Primaria", "Secondaria"],
    vendibile_a_stranieri: "Si",
    estratto_registro_fondiario: "Si",
    estratto_registro_fondiario_doc: "estratto-cademario.pdf",
    descrittivo_tecnico: "Si",
    descrittivo_tecnico_doc: "descrittivo-cademario.pdf",
    regolamento_condominiale: "No",
    regolamento_condominiale_doc: null,
    spese_condominiali_doc: null,
    assicurazione_stabile: "Si",
    assicurazione_stabile_doc: "assicurazione-cademario.pdf",
    verbale_ultima_assemblea: "No",
    verbale_ultima_assemblea_doc: null,
    fondo_rinnovamento: "No",
    fondo_rinnovamento_doc: null,
    valore_di_stima: "Si",
    valore_di_stima_doc: "stima-cademario.pdf",
    piano_assegnazioni_parti_comuni: "No",
    piano_assegnazioni_parti_comuni_doc: null,
    rasi: "Si",
    rasi_doc: "rasi-cademario.pdf",
    certificato_radon: "No",
    certificato_radon_doc: null
  },
  {
    id: 102,
    nome_immobile: "PRESTIGIOSO 3.5 LOCALI CON FINITURE DI ALTO STANDING",
    codice_immobile: "#0006",
    immagine_di_riferimento: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    immobile_in: ["Affitto"],
    stato: "Disponibile",
    mandato_firmato: "Si",
    tipo_di_mandato: "Non in Esclusiva",
    mandato: "RF-Paradiso-411.pdf",
    prezzo_di_vendita: 0,
    prezzo_di_affitto: 3100,
    spese_condominiali: 250,
    costo_parcheggi: 150,
    indirizzo: "Via San Salvatore 12",
    comune: "Paradiso",
    npa: 6900,
    nazione: "Svizzera",
    categoria: "Appartamento",
    tipo: ["Appartamento"],
    superficie_abitabile: 110,
    superficie_sul: 125,
    numero_di_locali: 3.5,
    numero_bagni: 2,
    anno_di_costruzione: 2021,
    ultimo_rinnovo: 0,
    garage: 1,
    parcheggio: 0,
    descrizione_immobile: "Elegante appartamento situato a pochi passi dal lungolago. Dotato di domotica integrata, riscaldamento a pavimento e cantina vinicola privata.",
    proprietario_id: 2,
    agente_id: 1,
    creato_da: "OLGA HONCHAR",
    ultima_modifica_il: "2026-05-12",
    ultima_modifica_fatta_da: "OLGA HONCHAR",
    planimetria: "planimetria-paradiso.pdf",
    link_a_cartella_condivisa: "",
    numero_di_mappale: "5678",
    tipo_di_residenza: ["Primaria"],
    vendibile_a_stranieri: "Si",
    estratto_registro_fondiario: "Si",
    estratto_registro_fondiario_doc: "estratto-paradiso.pdf",
    descrittivo_tecnico: "Si",
    descrittivo_tecnico_doc: "descrittivo-paradiso.pdf",
    regolamento_condominiale: "Si",
    regolamento_condominiale_doc: "regolamento-paradiso.pdf",
    spese_condominiali_doc: "spese-paradiso.pdf",
    assicurazione_stabile: "Si",
    assicurazione_stabile_doc: "assicurazione-paradiso.pdf",
    verbale_ultima_assemblea: "Si",
    verbale_ultima_assemblea_doc: "verbale-paradiso.pdf",
    fondo_rinnovamento: "Si",
    fondo_rinnovamento_doc: "fondo-paradiso.pdf",
    valore_di_stima: "No",
    valore_di_stima_doc: null,
    piano_assegnazioni_parti_comuni: "Si",
    piano_assegnazioni_parti_comuni_doc: "assegnazione-paradiso.pdf",
    rasi: "No",
    rasi_doc: null,
    certificato_radon: "No",
    certificato_radon_doc: null
  },
  {
    id: 103,
    nome_immobile: "ESCLUSIVO APPARTAMENTO CON PISCINA E GIARDINO VISTA LAGO",
    codice_immobile: "#0007",
    immagine_di_riferimento: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    immobile_in: ["Vendita"],
    stato: "In Trattativa",
    mandato_firmato: "Si",
    tipo_di_mandato: "In Esclusiva",
    mandato: "RF-Bissone-902.pdf",
    prezzo_di_vendita: 2850000,
    prezzo_di_affitto: 0,
    spese_condominiali: 180,
    costo_parcheggi: 0,
    indirizzo: "Via Riviera 8",
    comune: "Bissone",
    npa: 6816,
    nazione: "Svizzera",
    categoria: "Appartamento",
    tipo: ["Appartamento", "Duplex"],
    superficie_abitabile: 240,
    superficie_sul: 325,
    numero_di_locali: 5.5,
    numero_bagni: 4,
    anno_di_costruzione: 2015,
    ultimo_rinnovo: 202300,
    garage: 1,
    parcheggio: 1,
    descrizione_immobile: "Meravigliosa proprietà bilivello con giardino privato pianeggiante, terrazza panoramica e accesso directo alla darsena condominiale.",
    proprietario_id: 2,
    agente_id: 1,
    creato_da: "MASSIMILIANO BOLDI",
    ultima_modifica_il: "2026-05-20",
    ultima_modifica_fatta_da: "OLGA HONCHAR",
    planimetria: "planimetria-bissone.pdf",
    link_a_cartella_condivisa: "https://drive.google.com/drive/folders/67890",
    numero_di_mappale: "9012",
    tipo_di_residenza: ["Secondaria"],
    vendibile_a_stranieri: "No",
    estratto_registro_fondiario: "Si",
    estratto_registro_fondiario_doc: "estratto-bissone.pdf",
    descrittivo_tecnico: "No",
    descrittivo_tecnico_doc: null,
    regolamento_condominiale: "Si",
    regolamento_condominiale_doc: "regolamento-bissone.pdf",
    spese_condominiali_doc: "spese-bissone.pdf",
    assicurazione_stabile: "Si",
    assicurazione_stabile_doc: "assicurazione-bissone.pdf",
    verbale_ultima_assemblea: "Si",
    verbale_ultima_assemblea_doc: "verbale-bissone.pdf",
    fondo_rinnovamento: "Si",
    fondo_rinnovamento_doc: "fondo-bissone.pdf",
    valore_di_stima: "Si",
    valore_di_stima_doc: "stima-bissone.pdf",
    piano_assegnazioni_parti_comuni: "Si",
    piano_assegnazioni_parti_comuni_doc: "assegnazione-bissone.pdf",
    rasi: "Si",
    rasi_doc: "rasi-bissone.pdf",
    certificato_radon: "Si",
    certificato_radon_doc: "radon-bissone.pdf"
  }
];

const INITIAL_VISITE = [
  {
    id: 30,
    immobile_id: 102,
    data_ora: "2026-05-12T10:00",
    tipo_visita: "Shooting Fotografico",
    esito: "NEUTRO",
    feedback: "Realizzazione dello shooting fotografico d'interni ed esterni completata con successo.",
    cliente_id: 4, // Stefano Cau
    partecipanti: "Olga Honchar, Massimiliano Boldi, Stefano Cau",
    creato_da: "MASSIMILIANO BOLDI"
  },
  {
    id: 31,
    immobile_id: 103,
    data_ora: "2026-05-12T13:00",
    tipo_visita: "Shooting Fotografico",
    esito: "NEUTRO",
    feedback: "Foto aeree tramite drone per valorizzare la vista lago e la terrazza rooftop.",
    cliente_id: 4,
    partecipanti: "Olga Honchar, Stefano Cau",
    creato_da: "MASSIMILIANO BOLDI"
  },
  {
    id: 32,
    immobile_id: 101,
    data_ora: "2026-06-18T15:30",
    tipo_visita: "Visita Cliente",
    esito: "POSITIVO",
    feedback: "Il cliente è rimasto entusiasta della zona giorno e della vista. Ha richiesto planimetria e rasi.",
    cliente_id: 5, // Julio Kogan
    partecipanti: "Olga Honchar, Julio Kogan Amaro",
    creato_da: "OLGA HONCHAR"
  }
];

const INITIAL_IMMOBILI_LOGS = [
  {
    id: 1,
    immobile_id: 101,
    descrizione: "Creazione immobile",
    utente: "OLGA HONCHAR",
    data_ora: "2026-05-26T10:00:00Z"
  },
  {
    id: 2,
    immobile_id: 101,
    descrizione: "Prezzo Vendita: \"3400000\" -> \"3450000\"",
    utente: "MASSIMILIANO BOLDI",
    data_ora: "2026-05-26T15:30:00Z"
  }
];

export default function App() {
  // --- AUTHENTICATION STATES ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [isCRMLoading, setIsCRMLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simulated login session for local fallback
  const [simulatedSession, setSimulatedSession] = useState(null);

  // --- CRM APP STATES ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [immobili, setImmobili] = useState(isRealSupabase ? [] : INITIAL_IMMOBILI);
  const [contatti, setContatti] = useState(isRealSupabase ? [] : INITIAL_CONTATTI);
  const [visite, setVisite] = useState(isRealSupabase ? [] : INITIAL_VISITE);
  const [localLogs, setLocalLogs] = useState(INITIAL_IMMOBILI_LOGS);
  const [immobileLogs, setImmobileLogs] = useState([]);

  // Search & Filter states
  const [searchProperty, setSearchProperty] = useState('');
  const [filterPropertyType, setFilterPropertyType] = useState('Tutti');
  const [filterTipo, setFilterTipo] = useState('Tutti');
  const [filterStato, setFilterStato] = useState('Tutti');
  const [filterPrezzoMin, setFilterPrezzoMin] = useState('');
  const [filterPrezzoMax, setFilterPrezzoMax] = useState('');
  const [filterLocaliMin, setFilterLocaliMin] = useState('Tutti');
  const [filterSuperficieMin, setFilterSuperficieMin] = useState('');
  const [filterComune, setFilterComune] = useState('Tutti');
  const [filterVendibileStranieri, setFilterVendibileStranieri] = useState('Tutti');
  const [filterResidenza, setFilterResidenza] = useState('Tutti');
  const [filterMandatoFirmato, setFilterMandatoFirmato] = useState('Tutti');
  const [filterAgenteId, setFilterAgenteId] = useState('Tutti');
  const [filterGarageMin, setFilterGarageMin] = useState('');
  const [filterPostiAutoMin, setFilterPostiAutoMin] = useState('');
  const [filterBagniMin, setFilterBagniMin] = useState('Tutti');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortProperty, setSortProperty] = useState('creazione-desc');

  const [searchContact, setSearchContact] = useState('');
  const [filterContactRuolo, setFilterContactRuolo] = useState('Tutti');
  const [sortContactOrder, setSortContactOrder] = useState('nome-cognome');
  const [searchVisit, setSearchVisit] = useState('');

  // Editing modals
  const [currentImmobile, setCurrentImmobile] = useState(null);
  const [isImmobileModalOpen, setIsImmobileModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('principale');
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);
  const [tempProfileFotoUrl, setTempProfileFotoUrl] = useState(null);

  // Detail inspector (Immobili)
  const [viewingImmobile, setViewingImmobile] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('generale');

  // Detail inspector (Contatti)
  const [viewingContatto, setViewingContatto] = useState(null);
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false);

  // Modals for Contatti and Visite
  const [currentContatto, setCurrentContatto] = useState(null);
  const [isContattoModalOpen, setIsContattoModalOpen] = useState(false);
  const [selectedPosseduti, setSelectedPosseduti] = useState([]);
  const [selectedGestiti, setSelectedGestiti] = useState([]);
  const [addingPropertyForContact, setAddingPropertyForContact] = useState(null);
  const [searchPossedutiQuery, setSearchPossedutiQuery] = useState('');
  const [searchGestitiQuery, setSearchGestitiQuery] = useState('');
  const [currentVisita, setCurrentVisita] = useState(null);
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- SUPABASE SESSION LISTENER & DATA FETCHING ---
  useEffect(() => {
    if (isRealSupabase && supabase) {
      let lastUserId = null;

      // Listen to auth changes (handles INITIAL_SESSION and subsequent changes)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          const userId = session.user.id;
          if (userId !== lastUserId) {
            lastUserId = userId;
            fetchProfile(userId);
            fetchCRMData();
          }
        } else {
          setProfile(null);
          lastUserId = null;
        }
        setIsAuthInitializing(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsAuthInitializing(false);
    }
  }, []);

  // --- SUPABASE REALTIME SUBSCRIPTIONS ---
  useEffect(() => {
    if (!isRealSupabase || !supabase) return;

    const channel = supabase
      .channel('crm-realtime-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'immobili' },
        (payload) => {
          console.log('Realtime change received for immobili:', payload);
          if (payload.eventType === 'INSERT') {
            setImmobili(prev => {
              if (prev.some(item => item.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            triggerToast("Nuovo immobile registrato da un collega", "success");
          } else if (payload.eventType === 'UPDATE') {
            setImmobili(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
            
            setViewingImmobile(current => {
              if (current && current.id === payload.new.id) {
                triggerToast("Scheda immobile aggiornata in tempo reale da un altro utente", "info");
                return payload.new;
              }
              return current;
            });
            
            setCurrentImmobile(current => {
              if (current && current.id === payload.new.id) {
                triggerToast("Attenzione: questo immobile è stato appena modificato e salvato da un altro utente!", "warning");
              }
              return current;
            });
          } else if (payload.eventType === 'DELETE') {
            setImmobili(prev => prev.filter(item => item.id !== payload.old.id));
            triggerToast("Un immobile è stato rimosso in tempo reale", "info");
            setViewingImmobile(current => current && current.id === payload.old.id ? null : current);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contatti' },
        (payload) => {
          console.log('Realtime change received for contatti:', payload);
          if (payload.eventType === 'INSERT') {
            setContatti(prev => {
              if (prev.some(item => item.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            triggerToast("Nuovo contatto registrato in tempo reale", "success");
          } else if (payload.eventType === 'UPDATE') {
            setContatti(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
            
            setViewingContatto(current => {
              if (current && current.id === payload.new.id) {
                triggerToast("Anagrafica contatto aggiornata in tempo reale", "info");
                return payload.new;
              }
              return current;
            });
            
            setCurrentContatto(current => {
              if (current && current.id === payload.new.id) {
                triggerToast("Attenzione: questa anagrafica contatto è stata modificata da un altro utente!", "warning");
              }
              return current;
            });
          } else if (payload.eventType === 'DELETE') {
            setContatti(prev => prev.filter(item => item.id !== payload.old.id));
            triggerToast("Un contatto è stato rimosso in tempo reale", "info");
            setViewingContatto(current => current && current.id === payload.old.id ? null : current);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visite' },
        (payload) => {
          console.log('Realtime change received for visite:', payload);
          if (payload.eventType === 'INSERT') {
            setVisite(prev => {
              if (prev.some(item => item.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
            triggerToast("Nuovo appuntamento pianificato in tempo reale", "success");
          } else if (payload.eventType === 'UPDATE') {
            setVisite(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
            triggerToast("Pianificazione appuntamenti aggiornata da un altro utente", "info");
          } else if (payload.eventType === 'DELETE') {
            setVisite(prev => prev.filter(item => item.id !== payload.old.id));
            triggerToast("Un appuntamento è stato rimosso in tempo reale", "info");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRealSupabase]);

  useEffect(() => {
    if (viewingImmobile) {
      if (isRealSupabase && supabase) {
        const fetchLogs = async () => {
          const { data, error } = await supabase
            .from('immobili_logs')
            .select('*')
            .eq('immobile_id', viewingImmobile.id)
            .order('data_ora', { ascending: false });
          if (error) {
            console.error("Errore caricamento log:", error);
            triggerToast("Errore caricamento log: " + error.message, "error");
          } else if (data) {
            setImmobileLogs(data);
          }
        };
        fetchLogs();
      } else {
        const filtered = localLogs.filter(log => log.immobile_id === viewingImmobile.id);
        filtered.sort((a, b) => new Date(b.data_ora) - new Date(a.data_ora));
        setImmobileLogs(filtered);
      }
    } else {
      setImmobileLogs([]);
    }
  }, [viewingImmobile, localLogs, isRealSupabase]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      const localFoto = localStorage.getItem(`homelab_user_foto_${userId}`);
      if (data) {
        setProfile({ ...data, foto: localFoto || data.foto || '' });
      } else {
        // Profilo non ancora creato (trigger non eseguito): inseriscilo ora
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, nome: 'Utente', cognome: 'HomeLab', ruolo: 'User' }])
          .select()
          .maybeSingle();
        setProfile((inserted ? { ...inserted, foto: localFoto || inserted.foto || '' } : null) || { nome: 'Utente', cognome: 'HomeLab', ruolo: 'User', foto: localFoto || '' });
        if (insertError) console.warn("Impossibile creare profilo automatico:", insertError.message);
      }
    } catch (err) {
      console.warn("Profilo non trovato o errore:", err.message);
      const localFoto = localStorage.getItem(`homelab_user_foto_${userId}`);
      setProfile({ nome: 'Utente', cognome: 'HomeLab', ruolo: 'User', foto: localFoto || '' });
    }
  };

  const fetchCRMData = async () => {
    setIsCRMLoading(true);

    // Tutte e 3 le query in parallelo — molto più veloce delle sequenziali
    const [contattiRes, immobiliRes, visiteRes] = await Promise.all([
      supabase.from('contatti').select('*').order('id', { ascending: true }),
      supabase.from('immobili').select('*').order('id', { ascending: true }),
      supabase.from('visite').select('*').order('id', { ascending: true }),
    ]);

    let anyError = false;

    if (contattiRes.error) {
      console.warn('fetchCRMData [contatti] error:', contattiRes.error.message);
      anyError = true;
    } else if (contattiRes.data && contattiRes.data.length > 0) {
      setContatti(contattiRes.data);
    }

    if (immobiliRes.error) {
      console.warn('fetchCRMData [immobili] error:', immobiliRes.error.message);
      anyError = true;
    } else if (immobiliRes.data && immobiliRes.data.length > 0) {
      setImmobili(immobiliRes.data);
    }

    if (visiteRes.error) {
      console.warn('fetchCRMData [visite] error:', visiteRes.error.message);
      anyError = true;
    } else if (visiteRes.data && visiteRes.data.length > 0) {
      setVisite(visiteRes.data);
    }

    setIsCRMLoading(false);
    if (anyError) {
      triggerToast("Alcune tabelle non disponibili. Visualizzati dati locali.", "error");
    } else {
      triggerToast("Dati sincronizzati con Supabase", "success");
    }
  };

  // --- AUTH HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!isRealSupabase) {
      // Local demo mode credentials check (simulates log in)
      setTimeout(() => {
        if (email && password) {
          setSimulatedSession({
            user: { email, id: 'simulated-uuid-12345' },
          });
          const localFoto = localStorage.getItem('homelab_user_foto_simulated-uuid-12345');
          setProfile({ nome: 'Massimiliano', cognome: 'Boldi', ruolo: 'Admin (Demo)', foto: localFoto || '' });
          setSuccessMsg('Accesso simulato effettuato!');
          triggerToast("Benvenuto in HomeLab CRM (Demo)", "success");
        } else {
          setErrorMsg('Inserisci un indirizzo email e password validi.');
        }
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setSession(data.session);
      fetchProfile(data.user.id);
      fetchCRMData();
      setSuccessMsg('Accesso effettuato con successo!');
    } catch (err) {
      setErrorMsg(err.message || "Si è verificato un errore durante l'accesso.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isRealSupabase && supabase) {
      await supabase.auth.signOut();
    } else {
      setSimulatedSession(null);
      setProfile(null);
    }
    setSuccessMsg('Sei uscito correttamente.');
    setEmail('');
    setPassword('');
    setIsUserSettingsModalOpen(false);
  };

  const handleSaveUserSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nome = formData.get('nome');
    const cognome = formData.get('cognome');
    const fotoFile = formData.get('foto_file');

    setLoading(true);
    try {
      const userId = currentSession?.user?.id || 'simulated-uuid-12345';
      let fotoUrl = profile?.foto || '';

      if (fotoFile && fotoFile.size > 0) {
        if (isRealSupabase) {
          const uploadedUrl = await uploadToSupabase(fotoFile, 'immobili-media');
          if (uploadedUrl) {
            fotoUrl = uploadedUrl;
          }
        } else {
          fotoUrl = await readAsBase64(fotoFile);
        }
      }

      // Salva nel localStorage
      localStorage.setItem(`homelab_user_foto_${userId}`, fotoUrl);

      if (isRealSupabase && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ nome, cognome })
          .eq('id', userId);
        if (error) throw error;
        // prova ad aggiornare anche la colonna foto nel DB
        try {
          await supabase.from('profiles').update({ foto: fotoUrl }).eq('id', userId);
        } catch (_) {}
      }

      setProfile(prev => ({ ...prev, nome, cognome, foto: fotoUrl }));
      triggerToast("Impostazioni utente aggiornate!");
      setIsUserSettingsModalOpen(false);
    } catch (err) {
      triggerToast("Errore durante l'aggiornamento: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const currentSession = isRealSupabase ? session : simulatedSession;

  const uniqueComuni = Array.from(
    new Set(immobili.map(item => item.comune).filter(Boolean))
  ).sort();

  // --- MOCKUP VALUE RENDERER WITH TRATTINO (-) FALLBACK ---
  const formatField = (value, unit = "", isCurrency = false) => {
    if (value === undefined || value === null || value === "" || value === 0 || value === "0" || value === false) {
      return <span className="text-gray-400 font-normal italic">-</span>;
    }
    if (typeof value === 'boolean') {
      return value ? "Sì" : "No";
    }
    if (isCurrency) {
      const numVal = Number(value);
      if (isNaN(numVal)) {
        return `${value} ${unit}`.trim();
      }
      return `CHF ${numVal.toLocaleString('it-CH')}${unit}`;
    }
    return `${value.toLocaleString('it-CH')} ${unit}`.trim();
  };

  // --- FILE PROCESSING HELPERS (BASE64 & STORAGE UPLOAD) ---
  const readAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const uploadToSupabase = async (file, bucketName = 'immobili-media') => {
    if (!isRealSupabase || !supabase) return null;
    const fileExt = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(fileExt);
    const folder = isImage ? 'images' : 'docs';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError.message);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleUploadOrBase64 = async (fileField, existingValue) => {
    if (fileField && fileField.size > 0) {
      if (isRealSupabase) {
        const url = await uploadToSupabase(fileField);
        if (!url) {
          throw new Error("Impossibile generare l'URL pubblico per il file caricato.");
        }
        return url;
      }
      // Demo mode: usa base64 locale
      return await readAsBase64(fileField);
    }
    return existingValue || "";
  };

  // Helper to format ultimo_rinnovo (YYYYMM -> MM/YYYY)
  const formatUltimoRinnovo = (val) => {
    if (!val) return '-';
    const num = Number(val);
    if (num > 100000) {
      return String(Math.floor(num / 100));
    }
    return String(val);
  };

  // --- HANDLERS FOR IMMOBILI ---
  const handleSaveImmobile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idVal = formData.get('id');
    const id = idVal ? parseInt(idVal) : null;

    const existing = id ? immobili.find(item => item.id === id) : null;

    let immagine_di_riferimento = "";
    let mandato = "";
    let planimetria = "";
    let estratto_registro_fondiario_doc = "";
    let descrittivo_tecnico_doc = "";
    let regolamento_condominiale_doc = "";
    let spese_condominiali_doc = "";
    let assicurazione_stabile_doc = "";
    let verbale_ultima_assemblea_doc = "";
    let fondo_rinnovamento_doc = "";
    let valore_di_stima_doc = "";
    let piano_assegnazioni_parti_comuni_doc = "";
    let rasi_doc = "";
    let certificato_radon_doc = "";

    try {
      immagine_di_riferimento = await handleUploadOrBase64(formData.get('immagine_di_riferimento_file'), existing ? existing.immagine_di_riferimento : "");
      mandato = await handleUploadOrBase64(formData.get('mandato_file'), existing ? existing.mandato : "");
      planimetria = await handleUploadOrBase64(formData.get('planimetria_file'), existing ? existing.planimetria : "");
      estratto_registro_fondiario_doc = await handleUploadOrBase64(formData.get('estratto_registro_fondiario_doc_file'), existing ? existing.estratto_registro_fondiario_doc : "");
      descrittivo_tecnico_doc = await handleUploadOrBase64(formData.get('descrittivo_tecnico_doc_file'), existing ? existing.descrittivo_tecnico_doc : "");
      regolamento_condominiale_doc = await handleUploadOrBase64(formData.get('regolamento_condominiale_doc_file'), existing ? existing.regolamento_condominiale_doc : "");
      spese_condominiali_doc = await handleUploadOrBase64(formData.get('spese_condominiali_doc_file'), existing ? existing.spese_condominiali_doc : "");
      assicurazione_stabile_doc = await handleUploadOrBase64(formData.get('assicurazione_stabile_doc_file'), existing ? existing.assicurazione_stabile_doc : "");
      verbale_ultima_assemblea_doc = await handleUploadOrBase64(formData.get('verbale_ultima_assemblea_doc_file'), existing ? existing.verbale_ultima_assemblea_doc : "");
      fondo_rinnovamento_doc = await handleUploadOrBase64(formData.get('fondo_rinnovamento_doc_file'), existing ? existing.fondo_rinnovamento_doc : "");
      valore_di_stima_doc = await handleUploadOrBase64(formData.get('valore_di_stima_doc_file'), existing ? existing.valore_di_stima_doc : "");
      piano_assegnazioni_parti_comuni_doc = await handleUploadOrBase64(formData.get('piano_assegnazioni_parti_comuni_doc_file'), existing ? existing.piano_assegnazioni_parti_comuni_doc : "");
      rasi_doc = await handleUploadOrBase64(formData.get('rasi_doc_file'), existing ? existing.rasi_doc : "");
      certificato_radon_doc = await handleUploadOrBase64(formData.get('certificato_radon_doc_file'), existing ? existing.certificato_radon_doc : "");
    } catch (fileErr) {
      console.error("File processing error:", fileErr);
      triggerToast("Errore durante il caricamento dei file: " + (fileErr.message || fileErr), "error");
      return;
    }

    const immobile_in = [];
    if (formData.get('immobile_in_Affitto') === 'on') immobile_in.push('Affitto');
    if (formData.get('immobile_in_Vendita') === 'on') immobile_in.push('Vendita');

    const tipo_di_residenza = [];
    if (formData.get('tipo_di_residenza_Primaria') === 'on') tipo_di_residenza.push('Primaria');
    if (formData.get('tipo_di_residenza_Secondaria') === 'on') tipo_di_residenza.push('Secondaria');

    const tipo = [];
    const TIPO_OPTIONS = [
      "Appartamento", "Attico", "Villa", "Duplex", "Loft", "Casa a Schiera",
      "Casa Unifamiliare", "Ufficio", "Rustico", "Parcheggio all'Aperto",
      "Parcheggio al Coperto", "Garage", "Terreno Commerciale", "Terreno per Costruire"
    ];
    TIPO_OPTIONS.forEach(opt => {
      if (formData.get(`tipo_${opt}`) === 'on') {
        tipo.push(opt);
      }
    });

    let codice_immobile = formData.get('codice_immobile') || (id ? String(id).slice(-3) : String(Date.now()).slice(-3));
    if (codice_immobile && !codice_immobile.startsWith('#')) {
      codice_immobile = '#' + codice_immobile;
    }

    const rinnovoVal = formData.get('ultimo_rinnovo');
    let ultimo_rinnovo = 0;
    if (rinnovoVal !== null && rinnovoVal !== undefined) {
      ultimo_rinnovo = Number(rinnovoVal) || 0;
    } else if (existing) {
      ultimo_rinnovo = existing.ultimo_rinnovo || 0;
    }
    console.log("ultimo_rinnovo debug (year-only):", { rinnovoVal, ultimo_rinnovo });

    const fields = {
      nome_immobile: formData.get('nome_immobile'),
      codice_immobile,
      immagine_di_riferimento,
      immobile_in,
      stato: formData.get('stato'),
      mandato_firmato: formData.get('mandato_firmato'),
      tipo_di_mandato: formData.get('tipo_di_mandato'),
      mandato,
      prezzo_di_vendita: Number(formData.get('prezzo_di_vendita')) || 0,
      prezzo_di_affitto: Number(formData.get('prezzo_di_affitto')) || 0,
      spese_condominiali: Number(formData.get('spese_condominiali')) || 0,
      costo_parcheggi: Number(formData.get('costo_parcheggi')) || 0,
      indirizzo: formData.get('indirizzo'),
      comune: formData.get('comune'),
      npa: Number(formData.get('npa')) || 0,
      nazione: formData.get('nazione') || "Svizzera",
      categoria: formData.get('categoria'),
      tipo,
      superficie_abitabile: Number(formData.get('superficie_abitabile')) || 0,
      superficie_sul: Number(formData.get('superficie_sul')) || 0,
      numero_di_locali: Number(formData.get('numero_di_locali')) || 0,
      numero_bagni: Number(formData.get('numero_bagni')) || 0,
      anno_di_costruzione: Number(formData.get('anno_di_costruzione')) || 0,
      ultimo_rinnovo,
      garage: Number(formData.get('garage')) || 0,
      parcheggio: Number(formData.get('parcheggio')) || 0,
      descrizione_immobile: formData.get('descrizione_immobile') || "",
      note_interne: formData.get('note_interne') || "",
      proprietario_id: Number(formData.get('proprietario_id')) || null,
      agente_id: Number(formData.get('agente_id')) || null,
      planimetria,
      link_a_cartella_condivisa: formData.get('link_a_cartella_condivisa') || "",
      numero_di_mappale: formData.get('numero_di_mappale') || "",
      tipo_di_residenza,
      vendibile_a_stranieri: formData.get('vendibile_a_stranieri') || "No",
      estratto_registro_fondiario: formData.get('estratto_registro_fondiario') || "No",
      estratto_registro_fondiario_doc,
      descrittivo_tecnico: formData.get('descrittivo_tecnico') || "No",
      descrittivo_tecnico_doc,
      regolamento_condominiale: formData.get('regolamento_condominiale') || "No",
      regolamento_condominiale_doc,
      spese_condominiali_doc,
      assicurazione_stabile: formData.get('assicurazione_stabile') || "No",
      assicurazione_stabile_doc,
      verbale_ultima_assemblea: formData.get('verbale_ultima_assemblea') || "No",
      verbale_ultima_assemblea_doc,
      fondo_rinnovamento: formData.get('fondo_rinnovamento') || "No",
      fondo_rinnovamento_doc,
      valore_di_stima: formData.get('valore_di_stima') || "No",
      valore_di_stima_doc,
      piano_assegnazioni_parti_comuni: formData.get('piano_assegnazioni_parti_comuni') || "No",
      piano_assegnazioni_parti_comuni_doc,
      rasi: formData.get('rasi') || "No",
      rasi_doc,
      certificato_radon: formData.get('certificato_radon') || "No",
      certificato_radon_doc,
      creato_da: existing ? existing.creato_da : (currentSession?.user?.email ? currentSession.user.email.toUpperCase() : "UTENTE CRM"),
      ultima_modifica_il: new Date().toISOString(),
      ultima_modifica_fatta_da: currentSession?.user?.email ? currentSession.user.email.toUpperCase() : "UTENTE CRM"
    };

    // Compare existing fields to find changes
    const changes = [];
    const userEmail = currentSession?.user?.email ? currentSession.user.email.toUpperCase() : "UTENTE CRM";
    
    if (existing) {
      const compareFields = [
        { key: 'nome_immobile', label: 'Nome' },
        { key: 'immobile_in', label: 'Contratto (Affitto/Vendita)' },
        { key: 'stato', label: 'Stato' },
        { key: 'mandato_firmato', label: 'Mandato Firmato' },
        { key: 'tipo_di_mandato', label: 'Tipo di Mandato' },
        { key: 'prezzo_di_vendita', label: 'Prezzo Vendita' },
        { key: 'prezzo_di_affitto', label: 'Prezzo Affitto' },
        { key: 'spese_condominiali', label: 'Spese Condominiali' },
        { key: 'costo_parcheggi', label: 'Costo Parcheggi' },
        { key: 'indirizzo', label: 'Indirizzo' },
        { key: 'comune', label: 'Comune' },
        { key: 'npa', label: 'NPA' },
        { key: 'nazione', label: 'Nazione' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'tipo', label: 'Tipologia' },
        { key: 'superficie_abitabile', label: 'Superficie Abitabile' },
        { key: 'superficie_sul', label: 'Superficie SUL' },
        { key: 'numero_di_locali', label: 'Locali' },
        { key: 'numero_bagni', label: 'Bagni' },
        { key: 'anno_di_costruzione', label: 'Anno Costruzione' },
        { key: 'ultimo_rinnovo', label: 'Ultimo Rinnovo' },
        { key: 'garage', label: 'Garage' },
        { key: 'parcheggio', label: 'Parcheggio' },
        { key: 'descrizione_immobile', label: 'Descrizione' },
        { key: 'numero_di_mappale', label: 'Mappale' },
        { key: 'tipo_di_residenza', label: 'Residenza' },
        { key: 'vendibile_a_stranieri', label: 'Stranieri' },
        { key: 'link_a_cartella_condivisa', label: 'Link Cartella' },
        { key: 'note_interne', label: 'Note Interne' },
        { key: 'proprietario_id', label: 'ID Proprietario' },
        { key: 'agente_id', label: 'ID Agente' },
        { key: 'immagine_di_riferimento', label: 'Foto Principale' },
        { key: 'mandato', label: 'File Mandato' },
        { key: 'planimetria', label: 'File Planimetria' },
        { key: 'estratto_registro_fondiario', label: 'Estratto RF' },
        { key: 'estratto_registro_fondiario_doc', label: 'File Estratto RF' },
        { key: 'descrittivo_tecnico', label: 'Descrittivo Tecnico' },
        { key: 'descrittivo_tecnico_doc', label: 'File Descrittivo Tecnico' },
        { key: 'regolamento_condominiale', label: 'Regolamento Condominiale' },
        { key: 'regolamento_condominiale_doc', label: 'File Regolamento Condominiale' },
        { key: 'spese_condominiali_doc', label: 'File Spese Condominiali' },
        { key: 'assicurazione_stabile', label: 'Assicurazione Stabile' },
        { key: 'assicurazione_stabile_doc', label: 'File Assicurazione Stabile' },
        { key: 'verbale_ultima_assemblea', label: 'Verbale Ultima Assemblea' },
        { key: 'verbale_ultima_assemblea_doc', label: 'File Verbale Assemblea' },
        { key: 'fondo_rinnovamento', label: 'Fondo Rinnovamento' },
        { key: 'fondo_rinnovamento_doc', label: 'File Fondo Rinnovamento' },
        { key: 'valore_di_stima', label: 'Valore di Stima' },
        { key: 'valore_di_stima_doc', label: 'File Valore di Stima' },
        { key: 'piano_assegnazioni_parti_comuni', label: 'Piano Assegnazioni Parti Comuni' },
        { key: 'piano_assegnazioni_parti_comuni_doc', label: 'File Piano Assegnazioni' },
        { key: 'rasi', label: 'Rasi' },
        { key: 'rasi_doc', label: 'File Rasi' },
        { key: 'certificato_radon', label: 'Certificato Radon' },
        { key: 'certificato_radon_doc', label: 'File Certificato Radon' },
      ];

      const formatLogValue = (val) => {
        if (!val) return '-';
        const str = String(val);
        if (str.startsWith('data:')) {
          const match = str.match(/^data:([^;]+);/);
          return match ? `[Nuovo File: ${match[1]}]` : '[Nuovo File]';
        }
        if (str.startsWith('http://') || str.startsWith('https://')) {
          try {
            const urlObj = new URL(str);
            const pathname = urlObj.pathname;
            return pathname.split('/').pop() || str;
          } catch (_) {
            return str.split('/').pop() || str;
          }
        }
        if (str.includes('/')) {
          return str.split('/').pop();
        }
        return str;
      };

      compareFields.forEach(f => {
        let oldVal = existing[f.key];
        let newVal = fields[f.key];
        if (oldVal === undefined || oldVal === null) oldVal = "";
        if (newVal === undefined || newVal === null) newVal = "";
        if (String(oldVal) !== String(newVal)) {
          const oldFormatted = formatLogValue(oldVal);
          const newFormatted = formatLogValue(newVal);
          changes.push(`${f.label}: "${oldFormatted}" ➔ "${newFormatted}"`);
        }
      });
    } else {
      changes.push("Creazione immobile");
    }

    const logDesc = changes.join(', ');

    if (isRealSupabase) {
      try {
        if (id) {
          const { data, error } = await supabase
            .from('immobili')
            .update(fields)
            .eq('id', id)
            .select();
          if (error) throw error;
          const record = data[0] || { id, ...fields };
          setImmobili(immobili.map(item => item.id === id ? record : item));
          triggerToast("Immobile aggiornato nel database");
          
          if (changes.length > 0 && supabase) {
            const { error: logErr } = await supabase.from('immobili_logs').insert([{
              immobile_id: id,
              descrizione: logDesc,
              utente: userEmail,
              data_ora: new Date().toISOString()
            }]);
            if (logErr) {
              console.error("Errore salvataggio log:", logErr);
              triggerToast("Errore salvataggio log: " + logErr.message, "error");
            }
            
            // Force reload logs for viewingImmobile
            if (viewingImmobile && viewingImmobile.id === id) {
              const { data: logData } = await supabase
                .from('immobili_logs')
                .select('*')
                .eq('immobile_id', id)
                .order('data_ora', { ascending: false });
              if (logData) setImmobileLogs(logData);
            }
          }

          if (viewingImmobile && viewingImmobile.id === id) {
            setViewingImmobile(record);
          }
        } else {
          const { data, error } = await supabase
            .from('immobili')
            .insert([fields])
            .select();
          if (error) throw error;
          const record = data[0];
          setImmobili([...immobili, record]);
          triggerToast("Immobile salvato nel database");

          if (supabase) {
            const { error: logErr } = await supabase.from('immobili_logs').insert([{
              immobile_id: record.id,
              descrizione: "Creazione immobile",
              utente: userEmail,
              data_ora: new Date().toISOString()
            }]);
            if (logErr) {
              console.error("Errore salvataggio log creazione:", logErr);
              triggerToast("Errore salvataggio log creazione: " + logErr.message, "error");
            }
          }

          if (addingPropertyForContact) {
            if (addingPropertyForContact.type === 'posseduti') {
              setSelectedPosseduti(prev => [...prev, record.id]);
            } else if (addingPropertyForContact.type === 'gestiti') {
              setSelectedGestiti(prev => [...prev, record.id]);
            }
            setAddingPropertyForContact(null);
          }
        }
      } catch (err) {
        console.error(err);
        triggerToast("Errore salvataggio Supabase", "error");
      }
    } else {
      const finalId = id || Date.now();
      const localFields = { id: finalId, ...fields };
      if (id) {
        setImmobili(immobili.map(item => item.id === id ? localFields : item));
        triggerToast("Immobile aggiornato localmente");
        if (viewingImmobile && viewingImmobile.id === id) {
          setViewingImmobile(localFields);
        }
        if (changes.length > 0) {
          const newLog = {
            id: Date.now(),
            immobile_id: id,
            descrizione: logDesc,
            utente: userEmail,
            data_ora: new Date().toISOString()
          };
          setLocalLogs(prev => [newLog, ...prev]);
        }
      } else {
        setImmobili([...immobili, localFields]);
        triggerToast("Immobile aggiunto localmente");
        const newLog = {
          id: Date.now(),
          immobile_id: finalId,
          descrizione: "Creazione immobile",
          utente: userEmail,
          data_ora: new Date().toISOString()
        };
        setLocalLogs(prev => [newLog, ...prev]);

        if (addingPropertyForContact) {
          if (addingPropertyForContact.type === 'posseduti') {
            setSelectedPosseduti(prev => [...prev, finalId]);
          } else if (addingPropertyForContact.type === 'gestiti') {
            setSelectedGestiti(prev => [...prev, finalId]);
          }
          setAddingPropertyForContact(null);
        }
      }
    }
    setIsImmobileModalOpen(false);
    setCurrentImmobile(null);
  };

  const handleEditImmobile = (item) => {
    setCurrentImmobile(item);
    setActiveFormTab('principale');
    setIsImmobileModalOpen(true);
  };

  const handleViewImmobile = (item) => {
    setViewingImmobile(item);
    setActiveDetailTab('generale');
    setIsDetailModalOpen(true);
  };

  const handleDeleteImmobile = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo immobile?")) {
      if (isRealSupabase) {
        try {
          const { error } = await supabase
            .from('immobili')
            .delete()
            .eq('id', id);
          if (error) throw error;
          setImmobili(immobili.filter(item => item.id !== id));
          triggerToast("Immobile rimosso dal database");
          if (viewingImmobile && viewingImmobile.id === id) {
            setIsDetailModalOpen(false);
            setViewingImmobile(null);
          }
        } catch (err) {
          console.error(err);
          triggerToast("Errore eliminazione Supabase", "error");
        }
      } else {
        setImmobili(immobili.filter(item => item.id !== id));
        triggerToast("Immobile rimosso localmente", "info");
        if (viewingImmobile && viewingImmobile.id === id) {
          setIsDetailModalOpen(false);
          setViewingImmobile(null);
        }
      }
    }
  };

  // --- HANDLERS FOR CONTATTI ---
  const handleSaveContatto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idVal = formData.get('id');
    const id = idVal ? parseInt(idVal) : null;

    const ruolo = [];
    const RUOLO_OPTIONS = ["Proprietario", "Locatore", "Acquirente", "Affittuario", "Agente Immobiliare", "Intermediario", "Fotografo"];
    RUOLO_OPTIONS.forEach(r => {
      if (formData.get(`ruolo_${r}`) === 'on') {
        ruolo.push(r);
      }
    });

    const fields = {
      cognome: formData.get('cognome'),
      nome: formData.get('nome'),
      societa: formData.get('societa'),
      ruolo,
      telefono: formData.get('telefono'),
      mail: formData.get('mail'),
      note: formData.get('note_contatto'),
      note_contatto: formData.get('note_contatto'),
      immobili_posseduti: selectedPosseduti,
      immobili_gestiti: selectedGestiti
    };

    if (isRealSupabase) {
      try {
        if (id) {
          const { data, error } = await supabase
            .from('contatti')
            .update(fields)
            .eq('id', id)
            .select();
          if (error) throw error;
          const record = data[0] || { id, ...fields };
          setContatti(contatti.map(item => item.id === id ? record : item));
          triggerToast("Contatto aggiornato nel database");
          if (viewingContatto && viewingContatto.id === id) {
            setViewingContatto(record);
          }

          // Rimuove l'associazione per gli immobili precedentemente posseduti/gestiti ma non più selezionati
          await supabase
            .from('immobili')
            .update({ proprietario_id: null })
            .eq('proprietario_id', id)
            .not('id', 'in', `(${selectedPosseduti.join(',') || 0})`);
          
          await supabase
            .from('immobili')
            .update({ agente_id: null })
            .eq('agente_id', id)
            .not('id', 'in', `(${selectedGestiti.join(',') || 0})`);

          // Imposta l'associazione per gli immobili correnti
          if (selectedPosseduti.length > 0) {
            await supabase
              .from('immobili')
              .update({ proprietario_id: id })
              .in('id', selectedPosseduti);
          }
          if (selectedGestiti.length > 0) {
            await supabase
              .from('immobili')
              .update({ agente_id: id })
              .in('id', selectedGestiti);
          }

          // Aggiorna lo stato locale degli immobili
          setImmobili(prevImmobili => prevImmobili.map(imm => {
            let updatedImm = { ...imm };
            if (selectedPosseduti.includes(Number(imm.id))) {
              updatedImm.proprietario_id = id;
            } else if (imm.proprietario_id === id) {
              updatedImm.proprietario_id = null;
            }
            if (selectedGestiti.includes(Number(imm.id))) {
              updatedImm.agente_id = id;
            } else if (imm.agente_id === id) {
              updatedImm.agente_id = null;
            }
            return updatedImm;
          }));

        } else {
          const { data, error } = await supabase
            .from('contatti')
            .insert([fields])
            .select();
          if (error) throw error;
          const record = data[0];
          setContatti([...contatti, record]);
          triggerToast("Contatto salvato nel database");

          const newId = record.id;
          if (selectedPosseduti.length > 0) {
            await supabase
              .from('immobili')
              .update({ proprietario_id: newId })
              .in('id', selectedPosseduti);
          }
          if (selectedGestiti.length > 0) {
            await supabase
              .from('immobili')
              .update({ agente_id: newId })
              .in('id', selectedGestiti);
          }

          // Aggiorna lo stato locale degli immobili
          setImmobili(prevImmobili => prevImmobili.map(imm => {
            let updatedImm = { ...imm };
            if (selectedPosseduti.includes(Number(imm.id))) {
              updatedImm.proprietario_id = newId;
            }
            if (selectedGestiti.includes(Number(imm.id))) {
              updatedImm.agente_id = newId;
            }
            return updatedImm;
          }));
        }
      } catch (err) {
        console.error(err);
        triggerToast("Errore salvataggio contatto", "error");
      }
    } else {
      const finalId = id || Date.now();
      const localFields = { id: finalId, ...fields };
      if (id) {
        setContatti(contatti.map(item => item.id === id ? localFields : item));
        triggerToast("Contatto aggiornato localmente");
        if (viewingContatto && viewingContatto.id === id) {
          setViewingContatto(localFields);
        }

        // Aggiorna lo stato locale degli immobili
        setImmobili(prevImmobili => prevImmobili.map(imm => {
          let updatedImm = { ...imm };
          if (selectedPosseduti.includes(Number(imm.id))) {
            updatedImm.proprietario_id = id;
          } else if (imm.proprietario_id === id) {
            updatedImm.proprietario_id = null;
          }
          if (selectedGestiti.includes(Number(imm.id))) {
            updatedImm.agente_id = id;
          } else if (imm.agente_id === id) {
            updatedImm.agente_id = null;
          }
          return updatedImm;
        }));
      } else {
        setContatti([...contatti, localFields]);
        triggerToast("Contatto aggiunto localmente");

        // Aggiorna lo stato locale degli immobili
        setImmobili(prevImmobili => prevImmobili.map(imm => {
          let updatedImm = { ...imm };
          if (selectedPosseduti.includes(Number(imm.id))) {
            updatedImm.proprietario_id = finalId;
          }
          if (selectedGestiti.includes(Number(imm.id))) {
            updatedImm.agente_id = finalId;
          }
          return updatedImm;
        }));
      }
    }
    setIsContattoModalOpen(false);
    setCurrentContatto(null);
  };

  const handleEditContatto = (item) => {
    setCurrentContatto(item);
    setSelectedPosseduti(item.immobili_posseduti || []);
    setSelectedGestiti(item.immobili_gestiti || []);
    setSearchPossedutiQuery('');
    setSearchGestitiQuery('');
    setIsContattoModalOpen(true);
  };

  const handleCreateContatto = () => {
    setCurrentContatto(null);
    setSelectedPosseduti([]);
    setSelectedGestiti([]);
    setSearchPossedutiQuery('');
    setSearchGestitiQuery('');
    setIsContattoModalOpen(true);
  };

  const handleViewContatto = (item) => {
    setViewingContatto(item);
    setIsContactDetailModalOpen(true);
  };

  const handleDeleteContatto = async (id) => {
    if (window.confirm("Rimuovere definitivamente questo contatto dalle anagrafiche?")) {
      if (isRealSupabase) {
        try {
          const { error } = await supabase
            .from('contatti')
            .delete()
            .eq('id', id);
          if (error) throw error;
          setContatti(contatti.filter(item => item.id !== id));
          // Reset delle associazioni locali
          setImmobili(prevImmobili => prevImmobili.map(imm => {
            let updated = { ...imm };
            if (imm.proprietario_id === id) updated.proprietario_id = null;
            if (imm.agente_id === id) updated.agente_id = null;
            return updated;
          }));
          triggerToast("Contatto rimosso dal database");
          if (viewingContatto && viewingContatto.id === id) {
            setIsContactDetailModalOpen(false);
            setViewingContatto(null);
          }
        } catch (err) {
          console.error(err);
          triggerToast("Errore eliminazione contatto", "error");
        }
      } else {
        setContatti(contatti.filter(item => item.id !== id));
        // Reset delle associazioni locali
        setImmobili(prevImmobili => prevImmobili.map(imm => {
          let updated = { ...imm };
          if (imm.proprietario_id === id) updated.proprietario_id = null;
          if (imm.agente_id === id) updated.agente_id = null;
          return updated;
        }));
        triggerToast("Contatto eliminato localmente", "info");
        if (viewingContatto && viewingContatto.id === id) {
          setIsContactDetailModalOpen(false);
          setViewingContatto(null);
        }
      }
    }
  };

  // --- HANDLERS FOR VISITE (CALENDARIO) ---
  const handleSaveVisita = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idVal = formData.get('id');
    const id = idVal ? parseInt(idVal) : null;

    const fields = {
      immobile_id: Number(formData.get('immobile_id')),
      data_ora: formData.get('data_ora'),
      tipo_visita: formData.get('tipo_visita'),
      esito: formData.get('esito'),
      feedback: formData.get('feedback'),
      cliente_id: Number(formData.get('cliente_id')) || null,
      partecipanti: formData.get('partecipanti'),
      creato_da: formData.get('creato_da') || "MASSIMILIANO BOLDI"
    };

    if (isRealSupabase) {
      try {
        if (id) {
          const { data, error } = await supabase
            .from('visite')
            .update(fields)
            .eq('id', id)
            .select();
          if (error) throw error;
          setVisite(visite.map(item => item.id === id ? (data[0] || { id, ...fields }) : item));
          triggerToast("Appuntamento aggiornato");
        } else {
          const { data, error } = await supabase
            .from('visite')
            .insert([fields])
            .select();
          if (error) throw error;
          setVisite([...visite, data[0]]);
          triggerToast("Nuovo evento aggiunto a calendario");
        }
      } catch (err) {
        console.error(err);
        triggerToast("Errore salvataggio visita", "error");
      }
    } else {
      const finalId = id || Date.now();
      const localFields = { id: finalId, ...fields };
      if (id) {
        setVisite(visite.map(item => item.id === id ? localFields : item));
        triggerToast("Appuntamento aggiornato localmente");
      } else {
        setVisite([...visite, localFields]);
        triggerToast("Nuovo evento aggiunto localmente");
      }
    }
    setIsVisitaModalOpen(false);
    setCurrentVisita(null);
  };

  const handleEditVisita = (item) => {
    setCurrentVisita(item);
    setIsVisitaModalOpen(true);
  };

  const handleDeleteVisita = async (id) => {
    if (window.confirm("Annullare questo appuntamento a calendario?")) {
      if (isRealSupabase) {
        try {
          const { error } = await supabase
            .from('visite')
            .delete()
            .eq('id', id);
          if (error) throw error;
          setVisite(visite.filter(item => item.id !== id));
          triggerToast("Visita rimossa dal database");
        } catch (err) {
          console.error(err);
          triggerToast("Errore eliminazione visita", "error");
        }
      } else {
        setVisite(visite.filter(item => item.id !== id));
        triggerToast("Visita rimossa localmente", "info");
      }
    }
  };

  // Helpers to get related data easily
  const getContactName = (id) => {
    const contact = contatti.find(c => c.id === id);
    return contact ? `${contact.nome} ${contact.cognome}` : 'Non assegnato';
  };

  const getContactPhone = (id) => {
    const contact = contatti.find(c => c.id === id);
    return contact ? contact.telefono : '';
  };

  const getContactEmail = (id) => {
    const contact = contatti.find(c => c.id === id);
    return contact ? contact.mail : '';
  };

  const getImmobileName = (id) => {
    const imm = immobili.find(i => i.id === id);
    return imm ? imm.nome : 'Immobile sconosciuto';
  };

  return (
    <div className="relative min-h-screen liquid-bg text-slate-100 font-sans antialiased overflow-hidden selection:bg-[#0071E3] selection:text-white">

      {/* Background Decorative Glows for overall premium style */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[150px] pointer-events-none" />

      {/* APPLE NOTIFICATION TOAST */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-white/95 backdrop-blur-lg border border-[#D2D2D7] py-3 px-5 rounded-2xl shadow-xl transition-all duration-300 animate-bounce">
          <div className={`w-2.5 h-2.5 rounded-full mr-3 ${toast.type === 'success' ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`} />
          <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">{toast.message}</span>
        </div>
      )}

      {isAuthInitializing ? (
        <div className="min-h-screen flex flex-col justify-center items-center relative z-20">
          <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#0071E3]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-[#5AC8FA]/5 blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col items-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] flex items-center justify-center shadow-xl shadow-[#0071E3]/25 animate-pulse">
              <span className="text-white font-bold text-3xl">H</span>
            </div>
            <div className="text-center space-y-2 animate-pulse">
              <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
              <p className="text-xs text-[#86868B] font-medium tracking-wide">Inizializzazione sessione sicura...</p>
            </div>
            
            <div className="pt-4 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-[#0071E3]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        </div>
      ) : !currentSession ? (
        /* ========================================================= */
        /* Schermata di Login */
        /* ========================================================= */
        <div className="min-h-screen flex flex-col justify-between items-center px-4 py-12 relative z-10 text-[#1D1D1F]">

          {/* Header */}
          <div className="flex items-center space-x-3 mt-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] flex items-center justify-center text-white font-semibold text-lg shadow-md">
              H
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
              <p className="text-xs text-[#86868B] font-medium">Real Estate Office</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-md glass-modal p-8 rounded-3xl transition-all duration-300 my-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Bentornato</h2>
              <p className="text-xs text-[#86868B] mt-2">Accedi per gestire la tua applicazione</p>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="mb-5 bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-xs py-3 px-4 rounded-xl flex items-start space-x-2">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-xs py-3 px-4 rounded-xl flex items-start space-x-2">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input rounded-xl py-2.5 px-3.5 text-xs text-[#1D1D1F] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl py-2.5 px-3.5 text-xs text-[#1D1D1F] placeholder-gray-400 focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 btn-glossy text-white py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span>Accedi</span>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-[#86868B] mt-8">
            <p>© 2026 HomeLab App Starter • Autenticazione protetta</p>
          </footer>

        </div>
      ) : (
        /* ========================================================= */
        /* Protezione superata: Dashboard CRM Completa */
        /* ========================================================= */
        <div className="flex flex-col md:flex-row h-screen bg-transparent text-[#1D1D1F] antialiased overflow-hidden relative z-10 w-full">

          {/* MOBILE TOP HEADER */}
          <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-lg border-b border-white/20 z-30 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                H
              </div>
              <h1 className="text-sm font-bold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
            </div>
            
            {/* Clickable Avatar to open settings */}
            <div 
              onClick={() => { setIsUserSettingsModalOpen(true); setTempProfileFotoUrl(null); }}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer hover:scale-105 transition-transform"
            >
              {profile?.foto ? (
                <img src={profile.foto} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{(profile?.nome || 'U')[0]}{(profile?.cognome || '')[0]}</span>
              )}
            </div>
          </header>

          {/* LATERAL SIDEBAR (macOS / iPadOS style) */}
          <aside className="w-64 glass-sidebar hidden md:flex flex-col justify-between py-6 px-4 shrink-0 z-20">
            <div>
              {/* Brand Header */}
              <div className="flex items-center space-x-3 px-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  H
                </div>
                <div>
                  <h1 className="text-base font-semibold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
                  <p className="text-xs text-[#86868B]">Real Estate Office</p>
                </div>
              </div>

              {isCRMLoading && (
                <div className="flex items-center space-x-2 px-3 py-1.5 mb-6 bg-[#0071E3]/5 rounded-xl border border-[#0071E3]/15 text-[#0071E3] animate-pulse text-[11px] font-semibold w-fit">
                  <svg className="animate-spin h-3.5 w-3.5 text-[#0071E3]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Sincronizzazione in corso...</span>
                </div>
              )}

              {/* Nav Links */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard'
                      ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                      : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
                    }`}
                >
                  <IconDashboard />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('immobili')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'immobili'
                      ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                      : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
                    }`}
                >
                  <IconImmobili />
                  <span>Immobili</span>
                  <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full min-w-6 min-h-5 flex items-center justify-center">
                    {isCRMLoading ? (
                      <svg className="animate-spin h-3 w-3 text-[#86868B]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      immobili.length
                    )}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('contatti')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'contatti'
                      ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                      : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
                    }`}
                >
                  <IconContatti />
                  <span>Contatti</span>
                  <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full min-w-6 min-h-5 flex items-center justify-center">
                    {isCRMLoading ? (
                      <svg className="animate-spin h-3 w-3 text-[#86868B]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      contatti.length
                    )}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('visite'); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'visite'
                      ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                      : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
                    }`}
                >
                  <IconCalendario />
                  <span>Calendario</span>
                  <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full min-w-6 min-h-5 flex items-center justify-center">
                    {isCRMLoading ? (
                      <svg className="animate-spin h-3 w-3 text-[#86868B]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      visite.length
                    )}
                  </span>
                </button>
              </nav>
            </div>

             {/* Bottom Panel (Profile Settings Trigger) */}
             <div className="space-y-3">

               {/* Profile card */}
               <div
                 onClick={() => { setIsUserSettingsModalOpen(true); setTempProfileFotoUrl(null); }}
                 className="bg-white/80 hover:bg-white p-3 rounded-2xl border border-[#E5E5EA] shadow-sm flex items-center space-x-3 cursor-pointer hover:scale-[1.01] transition-all"
                 title="Impostazioni Profilo"
               >
                 {profile?.foto ? (
                   <img
                     src={profile.foto}
                     alt="Profile"
                     className="w-8 h-8 rounded-full object-cover shrink-0"
                   />
                 ) : (
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                     {profile?.nome?.[0] || 'U'}{profile?.cognome?.[0] || ''}
                   </div>
                 )}
                 <div className="overflow-hidden">
                   <span className="font-bold text-xs text-[#1D1D1F] block truncate">
                     {profile?.nome || 'Utente'} {profile?.cognome || ''}
                   </span>
                   <span className="text-[10px] text-[#86868B] block truncate uppercase tracking-wider font-semibold">
                     {profile?.ruolo || 'User'}
                   </span>
                 </div>
               </div>

             </div>
          </aside>

          {/* MAIN WORKSPACE AREA */}
          <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8 pb-24 md:pb-8">

            {/* TAB 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 max-w-6xl mx-auto">

                {/* Elegant Top Header with Welcome Message */}
                <div className="flex justify-between items-end border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Panoramica Globale</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Bentornato in HomeLab Real Estate</h2>
                      {isCRMLoading && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] animate-pulse">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Aggiornamento...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#86868B]">
                    <p className="font-medium text-[#1D1D1F]">Ufficio Lugano</p>
                    <p>Status: <span className="text-[#34C759] font-medium">Attivo (Giugno 2026)</span></p>
                  </div>
                </div>

                {/* macOS Widget Style Statistics cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Attivi</span>
                    <div className="my-2" key={isCRMLoading ? 'loading' : 'ready'}>
                      {isCRMLoading ? (
                        <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                      ) : (
                        <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{immobili.length}</span>
                      )}
                    </div>
                    <button onClick={() => setActiveTab('immobili')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                      Vedi archivio →
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Portafoglio Stimato</span>
                    <div className="my-2" key={isCRMLoading ? 'loading' : 'ready'}>
                      {isCRMLoading ? (
                        <div className="h-9 w-28 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                      ) : (
                        <span className="inline-block text-xl sm:text-2xl font-bold text-[#1D1D1F] whitespace-nowrap overflow-visible">
                          CHF {(immobili.reduce((acc, curr) => acc + (Number(curr.prezzo_di_vendita) || 0), 0) / 1000000).toFixed(2)}M
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#86868B]">Valore degli immobili in vendita</span>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Contatti in CRM</span>
                    <div className="my-2" key={isCRMLoading ? 'loading' : 'ready'}>
                      {isCRMLoading ? (
                        <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                      ) : (
                        <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{contatti.length}</span>
                      )}
                    </div>
                    <button onClick={() => setActiveTab('contatti')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                      Gestisci contatti →
                    </button>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                    <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Eventi a Calendario</span>
                    <div className="my-2" key={isCRMLoading ? 'loading' : 'ready'}>
                      {isCRMLoading ? (
                        <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                      ) : (
                        <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{visite.length}</span>
                      )}
                    </div>
                    <button onClick={() => setActiveTab('visite')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                      Apri calendario →
                    </button>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F] mb-4">Azioni Rapide</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => { setIsImmobileModalOpen(true); setCurrentImmobile(null); setActiveFormTab('principale'); }}
                      className="btn-glossy text-white p-4 rounded-2xl font-medium text-sm transition-all flex items-center justify-center space-x-2"
                    >
                      <IconPlus /> <span>Registra Nuovo Immobile</span>
                    </button>
                    <button
                      onClick={handleCreateContatto}
                      className="bg-white/45 backdrop-blur hover:bg-white/70 text-[#1D1D1F] p-4 rounded-2xl font-medium text-sm border border-white/40 shadow-sm transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
                    >
                      <IconPlus /> <span>Aggiungi Contatto</span>
                    </button>
                    <button
                      onClick={() => { setIsVisitaModalOpen(true); setCurrentVisita(null); }}
                      className="bg-white/45 backdrop-blur hover:bg-white/70 text-[#1D1D1F] p-4 rounded-2xl font-medium text-sm border border-white/40 shadow-sm transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
                    >
                      <IconPlus /> <span>Pianifica Visita/Shooting</span>
                    </button>
                  </div>
                </div>

                {/* Prossimi Appuntamenti in Calendario */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5E5EA] shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Prossimi Appuntamenti</h3>
                    <span className="text-xs text-[#86868B]">Giugno - Maggio 2026</span>
                  </div>

                  <div className="space-y-3">
                    {isCRMLoading ? (
                      [1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center justify-between p-3.5 bg-[#F5F5F7]/50 rounded-xl border border-transparent animate-pulse">
                          <div className="flex items-center space-x-4 w-full">
                            <div className="p-2.5 rounded-xl bg-[#E5E5EA] w-9 h-9 shrink-0"></div>
                            <div className="space-y-2 w-1/2">
                              <div className="h-4 bg-[#E5E5EA] rounded-full w-3/4"></div>
                              <div className="h-3 bg-[#E5E5EA] rounded-full w-1/2"></div>
                            </div>
                          </div>
                          <div className="space-y-1.5 w-16 text-right shrink-0">
                            <div className="h-3.5 bg-[#E5E5EA] rounded-full w-full ml-auto"></div>
                            <div className="h-3 bg-[#E5E5EA] rounded-full w-3/4 ml-auto"></div>
                          </div>
                        </div>
                      ))
                    ) : visite.length === 0 ? (
                      <p className="text-xs text-[#86868B] py-2 text-center">Nessun appuntamento in programma.</p>
                    ) : (
                      visite.slice(0, 3).map((v) => (
                        <div key={v.id} className="flex items-center justify-between p-3.5 bg-[#F5F5F7] rounded-xl border border-transparent hover:border-[#D2D2D7] transition-all">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2.5 rounded-xl ${v.tipo_visita === 'Shooting Fotografico' ? 'bg-[#5AC8FA]/15 text-[#0071E3]' : 'bg-[#AF52DE]/15 text-[#AF52DE]'
                              }`}>
                              <IconCalendario />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#1D1D1F]">{getImmobileName(v.immobile_id)}</h4>
                              <p className="text-xs text-[#86868B]">
                                {v.tipo_visita} • Con: <span className="font-medium text-[#1D1D1F]">{v.partecipanti}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-[#1D1D1F]">
                              {new Date(v.data_ora).toLocaleDateString('it-CH', { day: 'numeric', month: 'short' })}
                            </span>
                            <p className="text-[11px] text-[#86868B]">
                              {new Date(v.data_ora).toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: IMMOBILI */}
            {activeTab === 'immobili' && (
              <div className="space-y-6 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Portafoglio</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Immobili</h2>
                      {isCRMLoading && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] animate-pulse">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Aggiornamento...
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsImmobileModalOpen(true); setCurrentImmobile(null); setActiveFormTab('principale'); }}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center self-start"
                  >
                    <IconPlus /> Nuovo Immobile
                  </button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
                  {/* Search and Advanced Filters Button */}
                  <div className="flex gap-2 w-full sm:w-auto flex-1 max-w-lg">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <IconSearch />
                      </span>
                      <input
                        type="text"
                        placeholder="Cerca per nome, comune..."
                        value={searchProperty}
                        onChange={(e) => setSearchProperty(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                      />
                    </div>
                    <button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                        showAdvancedFilters
                          ? 'bg-[#0071E3] text-white border-transparent'
                          : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]/50 border-transparent text-[#1D1D1F]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span>Filtri</span>
                      {(filterTipo !== 'Tutti' || filterStato !== 'Tutti' || filterComune !== 'Tutti' || filterPrezzoMin || filterPrezzoMax || filterLocaliMin !== 'Tutti' || filterSuperficieMin || filterVendibileStranieri !== 'Tutti' || filterResidenza !== 'Tutti' || filterMandatoFirmato !== 'Tutti' || filterAgenteId !== 'Tutti' || filterGarageMin || filterPostiAutoMin || filterBagniMin !== 'Tutti') && (
                        <span className={`w-2 h-2 rounded-full ${showAdvancedFilters ? 'bg-white' : 'bg-[#0071E3]'}`}></span>
                      )}
                    </button>

                    <select
                      value={sortProperty}
                      onChange={(e) => setSortProperty(e.target.value)}
                      className="px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] cursor-pointer shrink-0 transition-all"
                    >
                      <option value="creazione-desc">Ultimo creato (Default)</option>
                      <option value="prezzo-asc">Prezzo Crescente</option>
                      <option value="prezzo-desc">Prezzo decrescente</option>
                      <option value="superficie-asc">Superficie Crescente</option>
                      <option value="superficie-desc">Superficie Decrescente</option>
                      <option value="creazione-asc">Creazione Crescente</option>
                      <option value="modifica-asc">Modifica Crescente</option>
                      <option value="modifica-desc">Modifica Decrescente</option>
                    </select>
                  </div>

                  {/* Segmented filter */}
                  <div className="flex bg-[#F5F5F7] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {['Tutti', 'Vendita', 'Affitto'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterPropertyType(type)}
                        className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${filterPropertyType === type
                            ? 'bg-white text-[#1D1D1F] shadow-sm'
                            : 'text-[#86868B] hover:text-[#1D1D1F]'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                  <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm animate-fade-in space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Tipo */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Tipo Immobile</label>
                        <select
                          value={filterTipo}
                          onChange={(e) => setFilterTipo(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti i tipi</option>
                          {[
                            "Appartamento", "Attico", "Villa", "Duplex", "Loft", "Casa a Schiera",
                            "Casa Unifamiliare", "Ufficio", "Rustico", "Parcheggio all'Aperto",
                            "Parcheggio al Coperto", "Garage", "Terreno Commerciale", "Terreno per Costruire"
                          ].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {/* Stato */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Stato</label>
                        <select
                          value={filterStato}
                          onChange={(e) => setFilterStato(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti gli stati</option>
                          <option value="Disponibile">Disponibile</option>
                          <option value="In Trattativa">In Trattativa</option>
                          <option value="Venduto">Venduto</option>
                        </select>
                      </div>

                      {/* Comune */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Comune</label>
                        <select
                          value={filterComune}
                          onChange={(e) => setFilterComune(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti i comuni</option>
                          {uniqueComuni.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Agente Referente */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Agente Referente</label>
                        <select
                          value={filterAgenteId}
                          onChange={(e) => setFilterAgenteId(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti gli agenti</option>
                          {contatti.filter(c => {
                            const roles = c.ruolo;
                            if (Array.isArray(roles)) {
                              return roles.some(r => r.toLowerCase().includes('agente'));
                            }
                            return String(roles || '').toLowerCase().includes('agente');
                          }).map(ag => (
                            <option key={ag.id} value={ag.id}>{ag.cognome} {ag.nome}</option>
                          ))}
                        </select>
                      </div>

                      {/* Vendibile a stranieri */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Vendibile a Stranieri</label>
                        <select
                          value={filterVendibileStranieri}
                          onChange={(e) => setFilterVendibileStranieri(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti</option>
                          <option value="Si">Sì</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {/* Tipo di Residenza */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Tipo Residenza</label>
                        <select
                          value={filterResidenza}
                          onChange={(e) => setFilterResidenza(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutte</option>
                          <option value="Primaria">Primaria</option>
                          <option value="Secondaria">Secondaria</option>
                        </select>
                      </div>

                      {/* Mandato Firmato */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Mandato Firmato</label>
                        <select
                          value={filterMandatoFirmato}
                          onChange={(e) => setFilterMandatoFirmato(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Tutti</option>
                          <option value="Si">Sì</option>
                          <option value="No">No</option>
                          <option value="Stand By">Stand By</option>
                        </select>
                      </div>

                      {/* Locali Minimo */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Locali (minimo)</label>
                        <select
                          value={filterLocaliMin}
                          onChange={(e) => setFilterLocaliMin(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Qualsiasi</option>
                          <option value="1">1+ locali</option>
                          <option value="2">2+ locali</option>
                          <option value="3">3+ locali</option>
                          <option value="4">4+ locali</option>
                          <option value="5">5+ locali</option>
                        </select>
                      </div>

                      {/* Bagni Minimo */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Bagni (minimo)</label>
                        <select
                          value={filterBagniMin}
                          onChange={(e) => setFilterBagniMin(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                        >
                          <option value="Tutti">Qualsiasi</option>
                          <option value="1">1+ bagni</option>
                          <option value="2">2+ bagni</option>
                          <option value="3">3+ bagni</option>
                          <option value="4">4+ bagni</option>
                        </select>
                      </div>

                      {/* Prezzo Min */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Prezzo Minimo</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="es. 500000"
                            value={filterPrezzoMin}
                            onChange={(e) => setFilterPrezzoMin(e.target.value)}
                            className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs pointer-events-none font-semibold">CHF</span>
                        </div>
                      </div>

                      {/* Prezzo Max */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Prezzo Massimo</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="es. 2000000"
                            value={filterPrezzoMax}
                            onChange={(e) => setFilterPrezzoMax(e.target.value)}
                            className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs pointer-events-none font-semibold">CHF</span>
                        </div>
                      </div>

                      {/* Superficie Min */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Superficie Min (mq)</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="es. 100"
                            value={filterSuperficieMin}
                            onChange={(e) => setFilterSuperficieMin(e.target.value)}
                            className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs pointer-events-none font-semibold">m²</span>
                        </div>
                      </div>

                      {/* Garage Min */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Box / Garage (min)</label>
                        <input
                          type="number"
                          placeholder="es. 1"
                          value={filterGarageMin}
                          onChange={(e) => setFilterGarageMin(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none text-[#1D1D1F] transition-all"
                        />
                      </div>

                      {/* Posti Auto Min */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Posti Auto est. (min)</label>
                        <input
                          type="number"
                          placeholder="es. 1"
                          value={filterPostiAutoMin}
                          onChange={(e) => setFilterPostiAutoMin(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none text-[#1D1D1F] transition-all"
                        />
                      </div>

                      {/* Actions / Reset / Apply */}
                      <div className="flex items-end md:col-span-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAdvancedFilters(false)}
                          className="flex-1 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center shadow-sm"
                        >
                          Applica Filtri
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilterTipo('Tutti');
                            setFilterStato('Tutti');
                            setFilterComune('Tutti');
                            setFilterPrezzoMin('');
                            setFilterPrezzoMax('');
                            setFilterLocaliMin('Tutti');
                            setFilterSuperficieMin('');
                            setFilterVendibileStranieri('Tutti');
                            setFilterResidenza('Tutti');
                            setFilterMandatoFirmato('Tutti');
                            setFilterAgenteId('Tutti');
                            setFilterGarageMin('');
                            setFilterPostiAutoMin('');
                            setFilterBagniMin('Tutti');
                          }}
                          className="flex-1 py-2 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center"
                        >
                          Reset Filtri
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Properties Grid */}
                {(isCRMLoading || (isRealSupabase && immobili.length === 0)) ? (
                  <div className="space-y-4">
                    {/* Loading banner */}
                    <div className="flex items-center gap-3 bg-[#0071E3]/8 border border-[#0071E3]/20 rounded-2xl px-5 py-3">
                      <svg className="w-4 h-4 text-[#0071E3] shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <span className="text-xs font-semibold text-[#0071E3]">Caricamento portafoglio immobili in corso…</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
                          <div className="h-44 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] animate-pulse"></div>
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-gradient-to-r from-[#E5E5EA] via-[#D8D8DC] to-[#E5E5EA] rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gradient-to-r from-[#E5E5EA] via-[#D8D8DC] to-[#E5E5EA] rounded-full w-1/2 animate-pulse"></div>
                            <div className="h-3 bg-gradient-to-r from-[#E5E5EA] via-[#D8D8DC] to-[#E5E5EA] rounded-full w-1/3 animate-pulse"></div>
                            <div className="h-8 bg-gradient-to-r from-[#E5E5EA] via-[#D8D8DC] to-[#E5E5EA] rounded-xl w-2/5 mt-2 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {immobili
                      .filter(item => {
                        const propName = (item.nome_immobile || '').toLowerCase();
                        const propComune = (item.comune || '').toLowerCase();
                        const matchSearch = propName.includes(searchProperty.toLowerCase()) || propComune.includes(searchProperty.toLowerCase());
                        
                        const matchType = filterPropertyType === 'Tutti' || (item.immobile_in && item.immobile_in.includes(filterPropertyType));
                        
                        const matchTipo = filterTipo === 'Tutti' || (item.tipo && item.tipo.some(t => t.toLowerCase() === filterTipo.toLowerCase()));
                        
                        const matchStato = filterStato === 'Tutti' || (item.stato && item.stato.toLowerCase() === filterStato.toLowerCase());
                        
                        const matchComune = filterComune === 'Tutti' || (item.comune && item.comune.toLowerCase() === filterComune.toLowerCase());
                        
                        const matchVendibileStranieri = filterVendibileStranieri === 'Tutti' || (item.vendibile_a_stranieri && item.vendibile_a_stranieri.toLowerCase() === filterVendibileStranieri.toLowerCase());
                        
                        const matchResidenza = filterResidenza === 'Tutti' || (item.tipo_di_residenza && item.tipo_di_residenza.some(r => r.toLowerCase() === filterResidenza.toLowerCase()));
                        
                        const matchMandatoFirmato = filterMandatoFirmato === 'Tutti' || (item.mandato_firmato && item.mandato_firmato.toLowerCase() === filterMandatoFirmato.toLowerCase());
                        
                        const matchAgenteId = filterAgenteId === 'Tutti' || String(item.agente_id) === String(filterAgenteId);
                        
                        const isRent = item.immobile_in && item.immobile_in.includes('Affitto');
                        const price = isRent ? Number(item.prezzo_di_affitto || 0) : Number(item.prezzo_di_vendita || 0);
                        const matchPrezzoMin = !filterPrezzoMin || price >= Number(filterPrezzoMin);
                        const matchPrezzoMax = !filterPrezzoMax || price <= Number(filterPrezzoMax);
                        
                        const matchLocali = filterLocaliMin === 'Tutti' || Number(item.numero_di_locali || 0) >= Number(filterLocaliMin);
                        const matchBagni = filterBagniMin === 'Tutti' || Number(item.numero_bagni || 0) >= Number(filterBagniMin);
                        
                        const matchSuperficie = !filterSuperficieMin || Number(item.superficie_abitabile || item.superficie_sul || 0) >= Number(filterSuperficieMin);
                        
                        const matchGarage = !filterGarageMin || Number(item.garage || 0) >= Number(filterGarageMin);
                        const matchPostiAuto = !filterPostiAutoMin || Number(item.parcheggio || 0) >= Number(filterPostiAutoMin);
                        
                        return matchSearch && matchType && matchTipo && matchStato && matchComune && 
                               matchVendibileStranieri && matchResidenza && matchMandatoFirmato && matchAgenteId &&
                               matchPrezzoMin && matchPrezzoMax && matchLocali && matchBagni && matchSuperficie &&
                               matchGarage && matchPostiAuto;
                      })
                      .sort((a, b) => {
                        if (sortProperty === 'prezzo-asc') {
                          const aIsRent = a.immobile_in && a.immobile_in.includes('Affitto');
                          const bIsRent = b.immobile_in && b.immobile_in.includes('Affitto');
                          const aPrice = aIsRent ? Number(a.prezzo_di_affitto || 0) : Number(a.prezzo_di_vendita || 0);
                          const bPrice = bIsRent ? Number(b.prezzo_di_affitto || 0) : Number(b.prezzo_di_vendita || 0);
                          return aPrice - bPrice;
                        }
                        if (sortProperty === 'prezzo-desc') {
                          const aIsRent = a.immobile_in && a.immobile_in.includes('Affitto');
                          const bIsRent = b.immobile_in && b.immobile_in.includes('Affitto');
                          const aPrice = aIsRent ? Number(a.prezzo_di_affitto || 0) : Number(a.prezzo_di_vendita || 0);
                          const bPrice = bIsRent ? Number(b.prezzo_di_affitto || 0) : Number(b.prezzo_di_vendita || 0);
                          return bPrice - aPrice;
                        }
                        if (sortProperty === 'superficie-asc') {
                          const aSup = Number(a.superficie_abitabile || a.superficie_sul || 0);
                          const bSup = Number(b.superficie_abitabile || b.superficie_sul || 0);
                          return aSup - bSup;
                        }
                        if (sortProperty === 'superficie-desc') {
                          const aSup = Number(a.superficie_abitabile || a.superficie_sul || 0);
                          const bSup = Number(b.superficie_abitabile || b.superficie_sul || 0);
                          return bSup - aSup;
                        }
                        if (sortProperty === 'creazione-asc') {
                          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                          return aTime - bTime;
                        }
                        if (sortProperty === 'creazione-desc') {
                          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                          return bTime - aTime;
                        }
                        if (sortProperty === 'modifica-asc') {
                          const aTime = a.ultima_modifica_il ? new Date(a.ultima_modifica_il).getTime() : 0;
                          const bTime = b.ultima_modifica_il ? new Date(b.ultima_modifica_il).getTime() : 0;
                          return aTime - bTime;
                        }
                        if (sortProperty === 'modifica-desc') {
                          const aTime = a.ultima_modifica_il ? new Date(a.ultima_modifica_il).getTime() : 0;
                          const bTime = b.ultima_modifica_il ? new Date(b.ultima_modifica_il).getTime() : 0;
                          return bTime - aTime;
                        }
                        return 0;
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleViewImmobile(item)}
                          className="glass-panel rounded-3xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl duration-300"
                        >
                          {/* Header Photo / Placeholder */}
                          <div
                            className="h-44 relative overflow-hidden flex items-center justify-center bg-cover bg-center"
                            style={{
                              backgroundImage: item.immagine_di_riferimento
                                ? `url(${item.immagine_di_riferimento})`
                                : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                            }}
                          >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-3 left-3 flex space-x-2 z-10">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${item.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                                  item.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                                    item.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' : 'bg-[#0071E3] text-white'
                                }`}>
                                {item.stato}
                              </span>
                              <span className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide shadow-sm">
                                {item.categoria}
                              </span>
                            </div>

                            {!item.immagine_di_riferimento && (
                              <div className="text-center text-[#86868B] select-none z-10">
                                <svg className="w-12 h-12 mx-auto text-[#86868B]/60 mb-1 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-xs font-semibold block">{item.comune}, {item.nazione}</span>
                              </div>
                            )}

                            {item.immagine_di_riferimento && (
                              <div className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow-md z-10">
                                {item.comune}, {item.nazione}
                              </div>
                            )}

                            <span className="absolute bottom-3 right-3 bg-[#0071E3] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
                              In {item.immobile_in ? item.immobile_in.join(' / ') : ''}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h3 className="font-bold text-base tracking-tight text-[#1D1D1F] line-clamp-2 leading-tight group-hover:text-[#0071E3] transition-colors">
                                {item.nome_immobile}
                              </h3>
                              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed line-clamp-3">
                                {item.descrizione_immobile}
                              </p>
                            </div>

                            {/* Technical Spec Metrics */}
                            <div className="grid grid-cols-3 gap-2 border-t border-b border-[#F5F5F7] py-3 text-center">
                              <div>
                                <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Codice</span>
                                <span className="text-xs font-semibold text-[#1D1D1F]">{item.codice_immobile || 'N/D'}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Locali</span>
                                <span className="text-xs font-semibold text-[#1D1D1F]">{item.numero_di_locali}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Sup. Abitabile</span>
                                <span className="text-xs font-semibold text-[#1D1D1F]">
                                  {item.superficie_abitabile ? `${item.superficie_abitabile} m²` : '—'}
                                </span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between pt-1">
                              <div>
                                <span className="block text-[10px] text-[#86868B] uppercase font-semibold">Prezzo</span>
                                <div className="space-y-0.5">
                                  {Number(item.prezzo_di_vendita) > 0 && (
                                    <div className="text-[11px] font-extrabold text-[#1D1D1F]">
                                      <span className="text-[9px] text-[#86868B] font-semibold uppercase mr-1">Vendita:</span>
                                      CHF {(Number(item.prezzo_di_vendita)).toLocaleString('it-CH')}
                                    </div>
                                  )}
                                  {Number(item.prezzo_di_affitto) > 0 && (
                                    <div className="text-[11px] font-extrabold text-[#1D1D1F]">
                                      <span className="text-[9px] text-[#86868B] font-semibold uppercase mr-1">Affitto:</span>
                                      CHF {(Number(item.prezzo_di_affitto)).toLocaleString('it-CH')}/mese
                                    </div>
                                  )}
                                  {!(Number(item.prezzo_di_vendita) > 0) && !(Number(item.prezzo_di_affitto) > 0) && (
                                    <span className="text-xs font-semibold text-gray-400 italic">Trattativa Riservata</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditImmobile(item);
                                  }}
                                  className="p-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-gray-700 transition-all"
                                  title="Modifica"
                                >
                                  <IconEdit />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImmobile(item.id);
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all"
                                  title="Elimina"
                                >
                                  <IconTrash />
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: CONTATTI */}
            {activeTab === 'contatti' && (
              <div className="space-y-6 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Anagrafiche</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Contatti</h2>
                      {isCRMLoading && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] animate-pulse">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Aggiornamento...
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCreateContatto}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center self-start"
                  >
                    <IconPlus /> Nuovo Contatto
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <IconSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Cerca per cognome, nome, mail..."
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-stretch sm:items-center">
                    {/* Role Filter */}
                    <div className="flex-1 sm:flex-none relative">
                      <select
                        value={filterContactRuolo}
                        onChange={(e) => setFilterContactRuolo(e.target.value)}
                        className="w-full sm:w-44 px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all appearance-none pr-8 cursor-pointer"
                      >
                        <option value="Tutti">Tutti i Ruoli</option>
                        <option value="Agente Immobiliare">Agente Immobiliare</option>
                        <option value="Proprietario">Proprietario</option>
                        <option value="Locatore">Locatore</option>
                        <option value="Intermediario">Intermediario</option>
                        <option value="Fotografo">Fotografo</option>
                        <option value="Cliente">Cliente</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#86868B]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Sorting */}
                    <div className="flex-1 sm:flex-none relative">
                      <select
                        value={sortContactOrder}
                        onChange={(e) => setSortContactOrder(e.target.value)}
                        className="w-full sm:w-52 px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs font-semibold text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all appearance-none pr-8 cursor-pointer"
                      >
                        <option value="nome-cognome">Ordina per: Nome e Cognome</option>
                        <option value="cognome-nome">Ordina per: Cognome e Nome</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#86868B]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacts Table View (Desktop) */}
                <div className="hidden sm:block glass-panel rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F5F5F7] text-[11px] font-bold text-[#86868B] uppercase tracking-wider border-b border-[#E5E5EA]">
                          <th className="py-4 px-6">Contatto</th>
                          <th className="py-4 px-6">Società</th>
                          <th className="py-4 px-6">Ruolo principale</th>
                          <th className="py-4 px-6">Recapiti</th>
                          <th className="py-4 px-6 text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5EA]">
                        {isCRMLoading ? (
                          [1, 2, 3, 4, 5].map((n) => (
                            <tr key={n} className="animate-pulse">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-[#E5E5EA] shrink-0" />
                                  <div className="space-y-2 w-32">
                                    <div className="h-4 bg-[#E5E5EA] rounded-full w-full" />
                                    <div className="h-3 bg-[#E5E5EA] rounded-full w-2/3" />
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="h-4 bg-[#E5E5EA] rounded-full w-24" />
                              </td>
                              <td className="py-4 px-6">
                                <div className="h-6 bg-[#E5E5EA] rounded-full w-20" />
                              </td>
                              <td className="py-4 px-6 space-y-1.5">
                                <div className="h-3 bg-[#E5E5EA] rounded-full w-28" />
                                <div className="h-3 bg-[#E5E5EA] rounded-full w-32" />
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <div className="w-8 h-8 bg-[#E5E5EA] rounded-xl" />
                                  <div className="w-8 h-8 bg-[#E5E5EA] rounded-xl" />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : contatti.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-xs text-[#86868B]">
                              Nessun contatto trovato.
                            </td>
                          </tr>
                        ) : (
                          contatti
                            .filter(item => {
                              const fullName = `${item.nome || ''} ${item.cognome || ''}`.toLowerCase();
                              const matchSearch = fullName.includes(searchContact.toLowerCase()) || (item.mail || '').toLowerCase().includes(searchContact.toLowerCase());
                              const matchRuolo = filterContactRuolo === 'Tutti' || 
                                (Array.isArray(item.ruolo) 
                                  ? item.ruolo.includes(filterContactRuolo) 
                                  : String(item.ruolo || '').includes(filterContactRuolo)
                                );
                              return matchSearch && matchRuolo;
                            })
                            .sort((a, b) => {
                              if (sortContactOrder === 'cognome-nome') {
                                const cognomeA = (a.cognome || '').toLowerCase();
                                const cognomeB = (b.cognome || '').toLowerCase();
                                if (cognomeA !== cognomeB) return cognomeA.localeCompare(cognomeB);
                                return (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase());
                              } else {
                                const nomeA = (a.nome || '').toLowerCase();
                                const nomeB = (b.nome || '').toLowerCase();
                                if (nomeA !== nomeB) return nomeA.localeCompare(nomeB);
                                return (a.cognome || '').toLowerCase().localeCompare((b.cognome || '').toLowerCase());
                              }
                            })
                            .map((item) => (
                              <tr
                                key={item.id}
                                onClick={() => handleViewContatto(item)}
                                className="hover:bg-[#F5F5F7] transition-all cursor-pointer group"
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-full bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                                      {(item.nome || 'U').charAt(0)}{(item.cognome || '').charAt(0)}
                                    </div>
                                    <div>
                                      <span className="font-bold text-sm block text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{item.cognome} {item.nome}</span>
                                      <span className="text-[11px] text-[#86868B] block truncate max-w-[200px]">{item.note_contatto || item.note}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-[#1D1D1F]">
                                  {item.societa || <span className="text-xs text-gray-400">—</span>}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-1 rounded-full text-xs font-semibold">
                                    {Array.isArray(item.ruolo) ? item.ruolo.join(', ') : (item.ruolo || '')}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-xs space-y-1">
                                  <div className="flex items-center text-[#1D1D1F]">
                                    <span className="mr-1.5 text-gray-400">📞</span>
                                    {item.telefono}
                                  </div>
                                  <div className="flex items-center text-[#86868B]">
                                    <span className="mr-1.5 text-gray-400">✉️</span>
                                    {item.mail}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditContatto(item);
                                      }}
                                      className="p-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-gray-700 transition-all"
                                    >
                                      <IconEdit />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteContatto(item.id);
                                      }}
                                      className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all"
                                    >
                                      <IconTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contacts Card View (Mobile) */}
                <div className="block sm:hidden space-y-4">
                  {isCRMLoading ? (
                    [1, 2, 3].map((n) => (
                      <div key={n} className="glass-panel p-4 rounded-3xl border border-[#E5E5EA] bg-white flex flex-col space-y-3 animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#E5E5EA]" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-[#E5E5EA] rounded w-1/3" />
                            <div className="h-3 bg-[#E5E5EA] rounded w-1/2" />
                          </div>
                        </div>
                        <div className="h-3 bg-[#E5E5EA] rounded w-full" />
                        <div className="h-8 bg-[#E5E5EA] rounded-xl w-full" />
                      </div>
                    ))
                  ) : contatti.length === 0 ? (
                    <p className="text-center text-xs text-[#86868B] py-8">Nessun contatto trovato.</p>
                  ) : (
                    (() => {
                      const filtered = contatti.filter(item => {
                        const fullName = `${item.nome || ''} ${item.cognome || ''}`.toLowerCase();
                        const matchSearch = fullName.includes(searchContact.toLowerCase()) || (item.mail || '').toLowerCase().includes(searchContact.toLowerCase());
                        const matchRuolo = filterContactRuolo === 'Tutti' || 
                          (Array.isArray(item.ruolo) 
                            ? item.ruolo.includes(filterContactRuolo) 
                            : String(item.ruolo || '').includes(filterContactRuolo)
                          );
                        return matchSearch && matchRuolo;
                      });
                      
                      if (filtered.length === 0) {
                        return <p className="text-center text-xs text-[#86868B] py-8">Nessun risultato per la ricerca.</p>;
                      }

                      // Apply sorting
                      filtered.sort((a, b) => {
                        if (sortContactOrder === 'cognome-nome') {
                          const cognomeA = (a.cognome || '').toLowerCase();
                          const cognomeB = (b.cognome || '').toLowerCase();
                          if (cognomeA !== cognomeB) return cognomeA.localeCompare(cognomeB);
                          return (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase());
                        } else {
                          const nomeA = (a.nome || '').toLowerCase();
                          const nomeB = (b.nome || '').toLowerCase();
                          if (nomeA !== nomeB) return nomeA.localeCompare(nomeB);
                          return (a.cognome || '').toLowerCase().localeCompare((b.cognome || '').toLowerCase());
                        }
                      });
                      
                      return filtered.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => handleViewContatto(item)}
                          className="glass-panel p-4 rounded-3xl border border-[#E5E5EA] bg-white flex flex-col space-y-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                                {(item.nome || 'U').charAt(0)}{(item.cognome || '').charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-sm text-[#1D1D1F] block group-hover:text-[#0071E3] transition-colors">{item.cognome} {item.nome}</span>
                                {item.societa && (
                                  <span className="text-xs text-[#86868B] block font-medium mt-0.5">{item.societa}</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleEditContatto(item)}
                                className="p-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-gray-700 transition-all"
                                title="Modifica"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteContatto(item.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all"
                                title="Elimina"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </div>

                          {/* Roles badges */}
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(item.ruolo) ? (
                              item.ruolo.map(r => (
                                <span key={r} className="bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                  {r}
                                </span>
                              ))
                            ) : (
                              item.ruolo && (
                                <span className="bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                                  {item.ruolo}
                                </span>
                              )
                            )}
                          </div>

                          {/* Notes snippet */}
                          {(item.note_contatto || item.note) && (
                            <p className="text-[11px] text-[#86868B] leading-relaxed bg-[#F5F5F7] p-2.5 rounded-2xl line-clamp-2">
                              {item.note_contatto || item.note}
                            </p>
                          )}

                          {/* Contact quick connections */}
                          {(item.telefono || item.mail) && (
                            <div className="grid grid-cols-2 gap-2 border-t border-[#F5F5F7] pt-3 text-xs" onClick={(e) => e.stopPropagation()}>
                              {item.telefono && (
                                <a 
                                  href={`tel:${item.telefono}`}
                                  className="flex items-center text-[#0071E3] hover:underline bg-[#F5F5F7] p-2 rounded-xl justify-center font-medium"
                                >
                                  <span className="mr-1.5">📞</span>
                                  <span className="truncate">{item.telefono}</span>
                                </a>
                              )}
                              {item.mail && (
                                <a 
                                  href={`mailto:${item.mail}`}
                                  className="flex items-center text-[#0071E3] hover:underline bg-[#F5F5F7] p-2 rounded-xl justify-center font-medium"
                                >
                                  <span className="mr-1.5">✉️</span>
                                  <span className="truncate">{item.mail}</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ));
                    })()
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: CALENDARIO / VISITE */}
            {activeTab === 'visite' && (
              <div className="space-y-6 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Calendario</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Attività e Visite</h2>
                      {isCRMLoading && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] animate-pulse">
                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Aggiornamento...
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsVisitaModalOpen(true); setCurrentVisita(null); }}
                    className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center self-start"
                  >
                    <IconPlus /> Nuovo Appuntamento
                  </button>
                </div>

                {/* Filter */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <IconSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Filtra per immobile, esito..."
                      value={searchVisit}
                      onChange={(e) => setSearchVisit(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="text-xs text-[#86868B] font-medium">
                    Pianificazioni per l'anno di esercizio <span className="text-[#1D1D1F] font-bold">2026</span>
                  </div>
                </div>

                {/* Timeline List */}
                <div className="space-y-4">
                  {isCRMLoading ? (
                    [1, 2, 3].map((n) => (
                      <div key={n} className="bg-white rounded-3xl p-5 border border-[#E5E5EA] shadow-sm animate-pulse flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                        <div className="flex items-center space-x-4 min-w-[150px]">
                          <div className="text-center bg-[#F5F5F7] py-2 px-3.5 rounded-2xl border border-[#E5E5EA] w-14 h-14 shrink-0" />
                          <div className="space-y-1.5 w-16">
                            <div className="h-3 bg-[#E5E5EA] rounded-full w-2/3" />
                            <div className="h-4 bg-[#E5E5EA] rounded-full w-full" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-4 bg-[#E5E5EA] rounded-full w-20" />
                            <div className="h-4 bg-[#E5E5EA] rounded-full w-16" />
                          </div>
                          <div className="h-4 bg-[#E5E5EA] rounded-full w-3/4" />
                          <div className="h-3 bg-[#E5E5EA] rounded-full w-1/2" />
                          <div className="h-3 bg-[#E5E5EA] rounded-full w-1/3" />
                        </div>

                        <div className="flex items-center space-x-2 w-full md:w-auto justify-end shrink-0">
                          <div className="w-20 h-7 bg-[#E5E5EA] rounded-xl" />
                          <div className="w-8 h-8 bg-[#E5E5EA] rounded-xl" />
                        </div>
                      </div>
                    ))
                  ) : visite.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 border border-[#E5E5EA] text-center text-xs text-[#86868B]">
                      Nessuna visita o appuntamento in programma.
                    </div>
                  ) : (
                    visite
                      .filter(item => {
                        const immName = getImmobileName(item.immobile_id).toLowerCase();
                        const matchSearch = immName.includes(searchVisit.toLowerCase()) || (item.esito || '').toLowerCase().includes(searchVisit.toLowerCase()) || (item.tipo_visita || '').toLowerCase().includes(searchVisit.toLowerCase());
                        return matchSearch;
                      })
                      .map((item) => {
                        const dateObj = new Date(item.data_ora);
                        return (
                           <div key={item.id} className="glass-panel rounded-3xl p-5 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">

                            <div className="flex items-center space-x-4 min-w-[150px]">
                              <div className="text-center bg-[#F5F5F7] py-2 px-3.5 rounded-2xl border border-[#E5E5EA]">
                                <span className="block text-xs uppercase text-[#86868B] font-bold">
                                  {dateObj.toLocaleDateString('it-CH', { month: 'short' })}
                                </span>
                                <span className="block text-2xl font-extrabold text-[#1D1D1F] tracking-tight leading-none">
                                  {dateObj.toLocaleDateString('it-CH', { day: 'numeric' })}
                                </span>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-[#86868B]">Ora d'inizio</span>
                                <span className="text-base font-bold text-[#1D1D1F]">
                                  {dateObj.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5E5EA] text-[#86868B]">
                                  Codice ID: {item.id}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${item.esito === 'POSITIVO' ? 'bg-[#34C759]/10 text-[#34C759]' : item.esito === 'NEGATIVO' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                  Esito {item.esito}
                                </span>
                              </div>
                              <h3 className="font-bold text-base text-[#1D1D1F] hover:text-[#0071E3] transition-all">
                                {getImmobileName(item.immobile_id)}
                              </h3>
                              <p className="text-xs text-[#86868B] max-w-xl">
                                <span className="font-semibold text-[#1D1D1F]">{item.tipo_visita}</span> • Feedback: {item.feedback || "In attesa dell'appuntamento"}
                              </p>
                              <p className="text-[11px] text-[#86868B]">
                                Partecipanti: <span className="font-medium text-[#1D1D1F]">{item.partecipanti}</span> • Creato da: <span className="font-medium">{item.creato_da}</span>
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                              <button
                                onClick={() => handleEditVisita(item)}
                                className="px-3 py-1.5 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold rounded-xl text-gray-700 transition-all flex items-center"
                              >
                                <IconEdit /> Modifica
                              </button>
                              <button
                                onClick={() => handleDeleteVisita(item.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all"
                              >
                                <IconTrash />
                              </button>
                            </div>

                          </div>
                        );
                      })
                  )}
                </div>

              </div>
            )}

          </main>

          {/* ========================================================= */}
          {/* DETTAGLIO COMPLETO IMMOBILE (CON TUTTI I CAMPI CSV E TRATTINO) */}
          {/* ========================================================= */}
          {isDetailModalOpen && viewingImmobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all">
              <div className="absolute inset-0 -z-10" onClick={() => setIsDetailModalOpen(false)}></div>

              <div className="w-full max-w-2xl h-full bg-white/70 backdrop-blur-2xl shadow-2xl border-l border-white/30 flex flex-col animate-slide-left overflow-hidden">

                {/* Header Banner */}
                <div className="bg-[#F5F5F7] border-b border-[#E5E5EA] flex flex-col relative">
                  {/* Property Image Banner */}
                  {viewingImmobile.immagine_di_riferimento ? (
                    <div className="w-full h-48 overflow-hidden relative">
                      <img
                        src={viewingImmobile.immagine_di_riferimento}
                        alt={viewingImmobile.nome_immobile}
                        className="w-full h-full object-cover"
                      />
                      {/* Floating close button */}
                      <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="absolute top-4 right-4 w-7 h-7 bg-white/90 hover:bg-white rounded-full border border-[#D2D2D7]/50 flex items-center justify-center font-bold text-sm text-[#86868B] transition-colors shadow-md z-10 animate-fade-in"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}

                  {/* Property Info Area */}
                  <div className="p-6 flex justify-between items-start">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#86868B] bg-white px-2.5 py-0.5 rounded-full border border-[#D2D2D7] shadow-sm">
                          ID: #{formatField(viewingImmobile.id)}
                        </span>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-0.5 rounded-full font-semibold">
                          CODICE: {formatField(viewingImmobile.codice_immobile)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] leading-snug">
                        {viewingImmobile.nome_immobile}
                      </h3>
                      <p className="text-xs text-[#86868B] flex items-center font-medium">
                        <span className="mr-1 text-sm">🗺️</span>
                        {viewingImmobile.indirizzo ? `${viewingImmobile.indirizzo}; ` : ''}
                        {viewingImmobile.npa ? `${viewingImmobile.npa}; ` : ''}
                        {viewingImmobile.comune ? `${viewingImmobile.comune}, ` : ''}
                        {viewingImmobile.nazione || 'Svizzera'}
                      </p>
                    </div>
                    {/* Fallback close button if no image */}
                    {!viewingImmobile.immagine_di_riferimento && (
                      <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="w-7 h-7 bg-white/80 hover:bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] transition-colors shadow-sm ml-4"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Bar inner Inspector */}
                <div className="px-6 py-2 bg-white border-b border-[#E5E5EA] flex space-x-1 overflow-x-auto">
                  {[
                    { id: 'generale', label: 'Generale & Prezzi' },
                    { id: 'contatti', label: 'Contatti' },
                    { id: 'amministrazione', label: 'Amministrazione' },
                    { id: 'documenti', label: 'Documenti' },
                    { id: 'note_interne', label: 'Note Interne' },
                    { id: 'log', label: 'Log' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDetailTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight whitespace-nowrap transition-all ${activeDetailTab === tab.id
                          ? 'bg-[#0071E3] text-white shadow-sm'
                          : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Drawer Scrollable with dynamic tabs */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white text-[#1D1D1F]">

                  {/* TAB 2: GENERALE & PREZZI */}
                  {activeDetailTab === 'generale' && (
                    <div className="space-y-6">
                      {/* Stato & Immobile_in outside the main grey container */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">stato</span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${viewingImmobile.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                              viewingImmobile.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                                viewingImmobile.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' : 'bg-[#FF3B30] text-white'
                            }`}>
                            {formatField(viewingImmobile.stato)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">immobile_in</span>
                          <span className="text-sm font-bold">
                            {viewingImmobile.immobile_in ? viewingImmobile.immobile_in.join(' / ') : '-'}
                          </span>
                        </div>
                      </div>

                      {/* Main Grey Container holding the 17 specified fields */}
                      <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">prezzo_di_vendita</span>
                          <span className="text-base font-extrabold">
                            {formatField(viewingImmobile.prezzo_di_vendita, "", true)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">prezzo_di_affitto</span>
                          <span className="text-base font-extrabold">
                            {formatField(viewingImmobile.prezzo_di_affitto, "/mese", true)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">spese_condominiali</span>
                          <span className="text-base font-extrabold text-[#1D1D1F]">
                            {formatField(viewingImmobile.spese_condominiali, "/mese", true)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">costo_parcheggi</span>
                          <span className="text-base font-extrabold">
                            {formatField(viewingImmobile.costo_parcheggi, "", true)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">categoria</span>
                          <span className="font-semibold">{formatField(viewingImmobile.categoria)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">tipo</span>
                          <span className="font-semibold">{viewingImmobile.tipo ? viewingImmobile.tipo.join(', ') : '-'}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">superficie_abitabile</span>
                          <span className="font-semibold">{formatField(viewingImmobile.superficie_abitabile, " m²")}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">superficie_sul</span>
                          <span className="font-semibold">{formatField(viewingImmobile.superficie_sul, " m²")}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">numero_di_locali</span>
                          <span className="font-semibold">{formatField(viewingImmobile.numero_di_locali)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">numero_bagni</span>
                          <span className="font-semibold">{formatField(viewingImmobile.numero_bagni)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">garage</span>
                          <span className="font-semibold">{formatField(viewingImmobile.garage)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">parcheggio</span>
                          <span className="font-semibold">{formatField(viewingImmobile.parcheggio)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">anno_di_costruzione</span>
                          <span className="font-semibold">{formatField(viewingImmobile.anno_di_costruzione)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">ultimo_rinnovo</span>
                          <span className="font-semibold">{formatUltimoRinnovo(viewingImmobile.ultimo_rinnovo)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">tipo_di_residenza</span>
                          <span className="font-semibold">{viewingImmobile.tipo_di_residenza ? viewingImmobile.tipo_di_residenza.join(', ') : '-'}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">vendibile_a_stranieri</span>
                          <span className="font-semibold">{formatField(viewingImmobile.vendibile_a_stranieri)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3 col-span-2">
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">numero_di_mappale</span>
                          <span className="font-semibold">{formatField(viewingImmobile.numero_di_mappale)}</span>
                        </div>
                      </div>

                      {/* Descrizione immobile */}
                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">descrizione_immobile</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-[#E5E5EA]">
                          {viewingImmobile.descrizione_immobile || <span className="text-gray-400 italic">- Nessuna descrizione inserita</span>}
                        </p>
                      </div>

                      {/* Planimetria */}
                      <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📐</span>
                          <div>
                            <span className="font-bold text-sm block">planimetria</span>
                            <span className="text-[10px] text-[#86868B] block mt-0.5">planimetria_doc</span>
                          </div>
                        </div>
                        {viewingImmobile.planimetria ? (
                          <a
                            href={viewingImmobile.planimetria}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-semibold transition-all shadow-sm"
                          >
                            Apri Planimetria
                          </a>
                        ) : (
                          <span className="text-xs text-[#86868B] font-medium bg-gray-200 px-3 py-1 rounded-full">Assente</span>
                        )}
                      </div>

                      {/* Cartella Condivisa */}
                      <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📂</span>
                          <div>
                            <span className="font-bold text-sm block">link_a_cartella_condivisa</span>
                            <span className="text-[10px] text-[#86868B] block mt-0.5">cartella_condivisa_url</span>
                          </div>
                        </div>
                        {viewingImmobile.link_a_cartella_condivisa ? (
                          <a
                            href={viewingImmobile.link_a_cartella_condivisa}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-semibold transition-all shadow-sm"
                          >
                            Apri Cartella
                          </a>
                        ) : (
                          <span className="text-xs text-[#86868B] font-medium bg-gray-200 px-3 py-1 rounded-full">Assente</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTATTI */}
                  {activeDetailTab === 'contatti' && (
                    <div className="space-y-6">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">anagrafiche_collegate</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3.5 rounded-xl border border-[#E5E5EA]">
                          <span className="block text-[9px] uppercase font-bold text-[#86868B]">proprietario_oreferrente_id</span>
                          <span className="font-bold text-sm block mt-0.5">
                            {getContactName(viewingImmobile.proprietario_id)}
                          </span>
                          {viewingImmobile.proprietario_id && (
                            <div className="mt-2 text-xs text-[#86868B] space-y-0.5">
                              <p>📞 {getContactPhone(viewingImmobile.proprietario_id)}</p>
                              <p>✉️ {getContactEmail(viewingImmobile.proprietario_id)}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-[#E5E5EA]">
                          <span className="block text-[9px] uppercase font-bold text-[#86868B]">agente_id</span>
                          <span className="font-bold text-sm block mt-0.5">
                            {getContactName(viewingImmobile.agente_id)}
                          </span>
                          {viewingImmobile.agente_id && (
                            <div className="mt-2 text-xs text-[#86868B] space-y-0.5">
                              <p>📞 {getContactPhone(viewingImmobile.agente_id)}</p>
                              <p>✉️ {getContactEmail(viewingImmobile.agente_id)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: AMMINISTRAZIONE */}
                  {activeDetailTab === 'amministrazione' && (
                    <div className="space-y-6">
                      <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">mandato_firmato</span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${viewingImmobile.mandato_firmato === 'Si' ? 'bg-[#34C759] text-white' :
                              viewingImmobile.mandato_firmato === 'Stand By' ? 'bg-[#FF9500] text-white' : 'bg-[#FF3B30] text-white'
                            }`}>
                            {formatField(viewingImmobile.mandato_firmato)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">tipo_di_mandato</span>
                          <span className="text-sm font-bold">
                            {formatField(viewingImmobile.tipo_di_mandato)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">mandato</span>
                        {viewingImmobile.mandato ? (
                          <div className="p-4 bg-gray-50 rounded-xl border border-[#E5E5EA] flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">📄</span>
                              <div>
                                <span className="font-bold text-xs block truncate max-w-[280px]">mandato</span>
                                <span className="text-[10px] text-gray-400">mandato_doc</span>
                              </div>
                            </div>
                            <a
                              href={viewingImmobile.mandato}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full font-semibold transition-all shadow-sm"
                            >
                              Apri Documento
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-[#86868B] italic">Nessun file di mandato caricato.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: DOCUMENTI */}
                  {activeDetailTab === 'documenti' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">conformità & documenti</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { key: 'estratto_registro_fondiario', label: 'estratto_registro_fondiario', desc: 'estratto_registro_fondiario_doc' },
                            { key: 'descrittivo_tecnico', label: 'descrittivo_tecnico', desc: 'descrittivo_tecnico_doc' },
                            { key: 'regolamento_condominiale', label: 'regolamento_condominiale', desc: 'regolamento_condominiale_doc' },
                            { key: 'spese_condominiali_doc', label: 'spese_condominiali_doc', desc: 'spese_condominiali_doc', isFileOnly: true },
                            { key: 'assicurazione_stabile', label: 'assicurazione_stabile', desc: 'assicurazione_stabile_doc' },
                            { key: 'verbale_ultima_assemblea', label: 'verbale_ultima_assemblea', desc: 'verbale_ultima_assemblea_doc' },
                            { key: 'fondo_rinnovamento', label: 'fondo_rinnovamento', desc: 'fondo_rinnovamento_doc' },
                            { key: 'valore_di_stima', label: 'valore_di_stima', desc: 'valore_di_stima_doc' },
                            { key: 'piano_assegnazioni_parti_comuni', label: 'piano_assegnazioni_parti_comuni', desc: 'piano_assegnazioni_parti_comuni_doc' },
                            { key: 'rasi', label: 'rasi', desc: 'rasi_doc' },
                            { key: 'certificato_radon', label: 'certificato_radon', desc: 'certificato_radon_doc' }
                          ].map(doc => {
                            const status = viewingImmobile[doc.key];
                            const fileUrl = doc.isFileOnly ? status : viewingImmobile[`${doc.key}_doc`];
                            const isPresent = doc.isFileOnly ? !!fileUrl : status === 'Si';
                            return (
                              <div key={doc.key} className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] flex flex-col justify-between space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="block text-xs font-bold text-[#1D1D1F]">{doc.label}</span>
                                    <span className="text-[10px] text-[#86868B] block mt-0.5">{doc.desc}</span>
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-sm ${
                                    isPresent ? 'bg-[#34C759] text-white' : 'bg-[#8E8E93] text-white'
                                  }`}>
                                    {isPresent ? 'Sì' : 'No'}
                                  </span>
                                </div>
                                {fileUrl ? (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-center text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white py-1.5 rounded-xl font-semibold transition-all shadow-sm block w-full"
                                  >
                                    Apri Documento
                                  </a>
                                ) : (
                                  <span className="text-center text-[10px] text-gray-400 italic block">Nessun file caricato</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: NOTE INTERNE */}
                  {activeDetailTab === 'note_interne' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">note_interne</span>
                        <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] text-sm text-[#1D1D1F] whitespace-pre-wrap leading-relaxed min-h-[150px]">
                          {viewingImmobile.note_interne || (
                            <span className="text-gray-400 italic">Nessuna nota interna inserita per questo immobile.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: LOG */}
                  {activeDetailTab === 'log' && (
                    <div className="space-y-6">
                      <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] space-y-3 text-sm">
                        <span className="block font-bold text-gray-500 uppercase tracking-wide text-[9px] mb-2">log_sincronizzazione_crm</span>
                        <div>
                          <span className="block text-xs text-[#86868B] mb-0.5">creato_da</span>
                          <span className="font-semibold text-gray-700">{formatField(viewingImmobile.creato_da)}</span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-2">
                          <span className="block text-xs text-[#86868B] mb-0.5">created_at</span>
                          <span className="font-semibold text-gray-700">
                            {viewingImmobile.created_at ? new Date(viewingImmobile.created_at).toLocaleString('it-CH', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-2">
                          <span className="block text-xs text-[#86868B] mb-0.5">ultima_modifica_il</span>
                          <span className="font-semibold text-gray-700">
                            {viewingImmobile.ultima_modifica_il ? new Date(viewingImmobile.ultima_modifica_il).toLocaleString('it-CH', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                          </span>
                        </div>
                        <div className="border-t border-gray-200/60 pt-2">
                          <span className="block text-xs text-[#86868B] mb-0.5">ultima_modifica_fatta_da</span>
                          <span className="font-semibold text-gray-700">{formatField(viewingImmobile.ultima_modifica_fatta_da)}</span>
                        </div>
                      </div>

                      {/* Timeline Cronologia */}
                      {profile?.ruolo && profile.ruolo.toLowerCase().includes('admin') ? (
                        <div className="space-y-4">
                          <span className="block font-bold text-gray-500 uppercase tracking-wide text-[9px]">cronologia_modifiche</span>
                          {immobileLogs.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-[#E5E5EA] text-center text-sm text-gray-400 italic">
                              Nessuna modifica registrata
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                              {immobileLogs.map((log) => (
                                <div key={log.id} className="bg-white p-4 rounded-2xl border border-[#E5E5EA] space-y-2 relative shadow-sm hover:shadow transition-all">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-[#0071E3]">{log.utente}</span>
                                    <span className="text-gray-400 font-medium">
                                      {log.data_ora ? new Date(log.data_ora).toLocaleString('it-CH', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : ''}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {log.descrizione}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                </div>

                <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleEditImmobile(viewingImmobile);
                    }}
                    className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm flex items-center justify-center space-x-1"
                  >
                    <IconEdit /> <span>Modifica Scheda</span>
                  </button>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                  >
                    Chiudi Inspector
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* DETTAGLIO SCHEDA COMPLETA CONTATTO (Apple Drawer) */}
          {isContactDetailModalOpen && viewingContatto && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all">
              <div className="absolute inset-0 -z-10" onClick={() => setIsContactDetailModalOpen(false)}></div>

              <div className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-[#E5E5EA] flex flex-col animate-slide-left overflow-hidden">

                <div className="bg-[#F5F5F7] p-6 border-b border-[#E5E5EA] flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-bold text-xl border border-white shadow-inner">
                      {(viewingContatto.nome || 'U').charAt(0)}{(viewingContatto.cognome || '').charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] leading-snug">
                        {viewingContatto.cognome} {viewingContatto.nome}
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          {Array.isArray(viewingContatto.ruolo) ? viewingContatto.ruolo.join(', ') : (viewingContatto.ruolo || '')}
                        </span>
                        {viewingContatto.societa && (
                          <span className="text-xs text-[#86868B] font-medium">
                            🏢 {viewingContatto.societa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsContactDetailModalOpen(false)}
                    className="w-7 h-7 bg-white/80 hover:bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] transition-colors shadow-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#1D1D1F]">
                  <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] space-y-4">
                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Recapiti Diretti</h4>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="block text-xs text-[#86868B]">Telefono:</span>
                        <span className="font-semibold">{viewingContatto.telefono}</span>
                      </div>
                      <a
                        href={`tel:${viewingContatto.telefono}`}
                        className="bg-[#34C759] hover:bg-[#30B651] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm"
                      >
                        Chiama
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-sm border-t border-gray-200/60 pt-3">
                      <div>
                        <span className="block text-xs text-[#86868B]">Indirizzo Email:</span>
                        <span className="font-semibold break-all">{viewingContatto.mail}</span>
                      </div>
                      <a
                        href={`mailto:${viewingContatto.mail}`}
                        className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm"
                      >
                        Scrivi
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Note operative</h4>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {viewingContatto.note_contatto || viewingContatto.note || "Nessuna nota aggiuntiva registrata per questo contatto."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Immobili Collegati</h4>
                    
                    {/* Immobili Posseduti */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Immobili Posseduti (Proprietà)</span>
                      {(() => {
                        const owned = immobili.filter(imm => 
                          (viewingContatto.immobili_posseduti && viewingContatto.immobili_posseduti.includes(imm.id)) ||
                          imm.proprietario_id === viewingContatto.id
                        );
                        if (owned.length === 0) return <p className="text-xs text-gray-400 italic pl-1">Nessun immobile posseduto collegato.</p>;
                        return owned.map(imm => (
                          <div
                            key={imm.id}
                            onClick={() => {
                              setIsContactDetailModalOpen(false);
                              handleViewImmobile(imm);
                            }}
                            className="bg-white p-3.5 rounded-xl border border-[#E5E5EA] flex justify-between items-center hover:border-[#0071E3] cursor-pointer transition-all group shadow-sm"
                          >
                            <div>
                              <span className="font-bold text-sm group-hover:text-[#0071E3] transition-all">{imm.nome_immobile}</span>
                              <span className="block text-xs text-[#86868B]">{imm.comune} • {formatField(imm.prezzo_di_vendita || imm.prezzo_di_affitto, "", true)}</span>
                            </div>
                            <span className="text-xs text-[#86868B] group-hover:text-[#0071E3] transition-all">→</span>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Immobili Gestiti */}
                    <div className="space-y-2 pt-2">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Immobili Gestiti (Agente)</span>
                      {(() => {
                        const managed = immobili.filter(imm => 
                          (viewingContatto.immobili_gestiti && viewingContatto.immobili_gestiti.includes(imm.id)) ||
                          imm.agente_id === viewingContatto.id
                        );
                        if (managed.length === 0) return <p className="text-xs text-gray-400 italic pl-1">Nessun immobile gestito collegato.</p>;
                        return managed.map(imm => (
                          <div
                            key={imm.id}
                            onClick={() => {
                              setIsContactDetailModalOpen(false);
                              handleViewImmobile(imm);
                            }}
                            className="bg-white p-3.5 rounded-xl border border-[#E5E5EA] flex justify-between items-center hover:border-[#0071E3] cursor-pointer transition-all group shadow-sm"
                          >
                            <div>
                              <span className="font-bold text-sm group-hover:text-[#0071E3] transition-all">{imm.nome_immobile}</span>
                              <span className="block text-xs text-[#86868B]">{imm.comune} • {formatField(imm.prezzo_di_vendita || imm.prezzo_di_affitto, "", true)}</span>
                            </div>
                            <span className="text-xs text-[#86868B] group-hover:text-[#0071E3] transition-all">→</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Attività e Visite Relazionate</h4>
                    {visite.filter(v => v.cliente_id === viewingContatto.id || (v.partecipanti || '').toLowerCase().includes((viewingContatto.cognome || '').toLowerCase())).length > 0 ? (
                      <div className="space-y-2">
                        {visite.filter(v => v.cliente_id === viewingContatto.id || (v.partecipanti || '').toLowerCase().includes((viewingContatto.cognome || '').toLowerCase())).map(v => {
                          const dateObj = new Date(v.data_ora);
                          return (
                            <div key={v.id} className="bg-white p-3.5 rounded-xl border border-[#E5E5EA] flex items-center justify-between">
                              <div>
                                <span className="block text-[9px] uppercase font-bold text-[#86868B]">
                                  {v.tipo_visita} • Esito: {v.esito}
                                </span>
                                <span className="font-bold text-sm">
                                  {getImmobileName(v.immobile_id)}
                                </span>
                                <p className="text-xs text-[#86868B]">
                                  Pianificato il: {dateObj.toLocaleDateString('it-CH')} alle {dateObj.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#86868B]">Nessun appuntamento in calendario per questo contatto.</p>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                  <button
                    onClick={() => {
                      setIsContactDetailModalOpen(false);
                      handleEditContatto(viewingContatto);
                    }}
                    className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm flex items-center justify-center space-x-1"
                  >
                    <IconEdit /> <span>Modifica Contatto</span>
                  </button>
                  <button
                    onClick={() => setIsContactDetailModalOpen(false)}
                    className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                  >
                    Chiudi Inspector
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* MODALE IMPOSTAZIONI UTENTE (Apple style) */}
          {isUserSettingsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
              <div className="glass-modal w-full max-w-md rounded-none md:rounded-3xl shadow-2xl overflow-hidden h-full md:h-auto md:max-h-[90vh] flex flex-col text-[#1D1D1F]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-[#1D1D1F]">
                      Impostazioni Profilo
                    </h3>
                    <p className="text-[10px] text-[#86868B]">Gestisci i tuoi dettagli anagrafici e la foto profilo</p>
                  </div>
                  <button
                    onClick={() => { setIsUserSettingsModalOpen(false); setTempProfileFotoUrl(null); }}
                    className="w-6 h-6 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-xs text-[#86868B] hover:text-[#1D1D1F] transition-all shadow-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveUserSettings} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Photo Section */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      {tempProfileFotoUrl || profile?.foto ? (
                        <img
                          src={tempProfileFotoUrl || profile.foto}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border border-white/50 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-2xl shadow-md border border-white/50">
                          {profile?.nome?.[0] || 'U'}{profile?.cognome?.[0] || ''}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        Carica Foto
                        <input
                          type="file"
                          name="foto_file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setTempProfileFotoUrl(URL.createObjectURL(file));
                              triggerToast("Nuova immagine selezionata", "success");
                            }
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-[#86868B]">Clicca sull'avatar per caricare una nuova foto</span>
                  </div>

                  {/* Name and Surname Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        required
                        defaultValue={profile?.nome || ''}
                        className="w-full px-3.5 py-2 glass-input rounded-xl text-sm focus:outline-none focus:bg-white text-[#1D1D1F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Cognome</label>
                      <input
                        type="text"
                        name="cognome"
                        required
                        defaultValue={profile?.cognome || ''}
                        className="w-full px-3.5 py-2 glass-input rounded-xl text-sm focus:outline-none focus:bg-white text-[#1D1D1F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Ruolo</label>
                      <input
                        type="text"
                        disabled
                        value={profile?.ruolo || 'User'}
                        className="w-full px-3.5 py-2 bg-gray-100/70 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-[#E5E5EA]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center space-x-1 border border-red-100"
                    >
                      <span>Logout Account</span>
                    </button>
                  </div>

                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-glossy text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                    >
                      Salva Impostazioni
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsUserSettingsModalOpen(false); setTempProfileFotoUrl(null); }}
                      className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                    >
                      Annulla
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* 1. MODALE IMMOBILI (FORM COMPLETO PER CREAZIONE/MODIFICA) */}
          {isImmobileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
              <div className="glass-modal w-full max-w-3xl rounded-none md:rounded-3xl shadow-2xl overflow-hidden my-0 md:my-8 h-full md:h-[680px] flex flex-col text-[#1D1D1F]">

                <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
                      {currentImmobile ? 'Modifica Scheda Immobile' : 'Registra Nuovo Prodotto Immobile'}
                    </h3>
                    <p className="text-xs text-[#86868B]">Compila tutti i campi presenti nell'anagrafica d'importazione</p>
                  </div>
                  <button
                    onClick={() => setIsImmobileModalOpen(false)}
                    className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F] transition-all shadow-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Tab selector per il form */}
                <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-[#E5E5EA] overflow-x-auto flex space-x-1 scrollbar-none">
                  {[
                    { id: 'principale', label: 'Principale' },
                    { id: 'generale', label: 'Generale & Prezzi' },
                    { id: 'contatti', label: 'Contatti' },
                    { id: 'amministrazione', label: 'Amministrazione' },
                    { id: 'documenti', label: 'Documenti' },
                    { id: 'note_interne', label: 'Note Interne' },
                    { id: 'log', label: 'Log', hidden: !currentImmobile },
                  ].filter(t => !t.hidden).map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFormTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight whitespace-nowrap transition-all ${
                        activeFormTab === tab.id
                          ? 'bg-[#0071E3] text-white shadow-sm'
                          : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA]/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSaveImmobile} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {currentImmobile && <input type="hidden" name="id" value={currentImmobile.id} />}

                  {/* ========= SEZIONE 1: INFORMAZIONI PRINCIPALI ========= */}
                  <div className={activeFormTab === 'principale' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">1. Informazioni Principali</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">nome_immobile *</label>
                        <input
                          type="text"
                          name="nome_immobile"
                          required
                          placeholder="es. ESCLUSIVA PROPRIETÀ VISTA LAGO A CADEMARIO"
                          defaultValue={currentImmobile ? currentImmobile.nome_immobile : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">codice_immobile *</label>
                        <input
                          type="text"
                          name="codice_immobile"
                          required
                          placeholder="es. #0001"
                          defaultValue={currentImmobile ? currentImmobile.codice_immobile : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>



                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">immagine_di_riferimento</label>
                        <input
                          type="file"
                          name="immagine_di_riferimento_file"
                          accept="image/*"
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20 cursor-pointer"
                        />
                        {currentImmobile && currentImmobile.immagine_di_riferimento && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-gray-400">File attuale:</span>
                            <a href={currentImmobile.immagine_di_riferimento} target="_blank" rel="noreferrer" className="text-[10px] text-[#0071E3] underline truncate max-w-[240px]">{currentImmobile.immagine_di_riferimento.split('/').pop()}</a>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">indirizzo *</label>
                        <input
                          type="text"
                          name="indirizzo"
                          required
                          placeholder="Via Cantonale 1"
                          defaultValue={currentImmobile ? currentImmobile.indirizzo : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">npa *</label>
                        <input
                          type="number"
                          name="npa"
                          required
                          placeholder="6900"
                          defaultValue={currentImmobile ? currentImmobile.npa : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">comune *</label>
                        <input
                          type="text"
                          name="comune"
                          required
                          placeholder="Lugano"
                          defaultValue={currentImmobile ? currentImmobile.comune : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">nazione</label>
                        <input
                          type="text"
                          name="nazione"
                          defaultValue={currentImmobile ? currentImmobile.nazione : 'Svizzera'}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ========= SEZIONE 2: GENERALE & PREZZI ========= */}
                  <div className={activeFormTab === 'generale' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">2. Generale & Prezzi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">stato *</label>
                        <select
                          name="stato"
                          defaultValue={currentImmobile ? currentImmobile.stato : 'Disponibile'}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        >
                          <option value="Disponibile">Disponibile</option>
                          <option value="In Trattativa">In Trattativa</option>
                          <option value="Venduto">Venduto</option>
                          <option value="Affittato">Affittato</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-2">immobile_in *</label>
                        <div className="flex space-x-4 py-1.5">
                          {['Affitto', 'Vendita'].map(val => (
                            <label key={val} className="flex items-center space-x-2 text-sm text-[#1D1D1F]">
                              <input
                                type="checkbox"
                                name={`immobile_in_${val}`}
                                defaultChecked={currentImmobile && currentImmobile.immobile_in ? currentImmobile.immobile_in.includes(val) : (val === 'Vendita')}
                                className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                              />
                              <span>{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Container wrapping pricing and specifications */}
                    <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] space-y-4">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Specifiche e Prezzi</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">prezzo_di_vendita</label>
                          <input
                            type="number"
                            name="prezzo_di_vendita"
                            placeholder="es. 3450000"
                            defaultValue={currentImmobile ? currentImmobile.prezzo_di_vendita : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">prezzo_di_affitto</label>
                          <input
                            type="number"
                            name="prezzo_di_affitto"
                            placeholder="es. 3100"
                            defaultValue={currentImmobile ? currentImmobile.prezzo_di_affitto : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">spese_condominiali</label>
                          <input
                            type="number"
                            name="spese_condominiali"
                            placeholder="es. 250"
                            defaultValue={currentImmobile ? currentImmobile.spese_condominiali : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">costo_parcheggi</label>
                          <input
                            type="number"
                            name="costo_parcheggi"
                            placeholder="es. 150"
                            defaultValue={currentImmobile ? currentImmobile.costo_parcheggi : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">categoria *</label>
                          <select
                            name="categoria"
                            defaultValue={currentImmobile ? currentImmobile.categoria : 'Appartamento'}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          >
                            <option value="Appartamento">Appartamento</option>
                            <option value="Casa">Casa</option>
                            <option value="Locali di Servizio">Locali di Servizio</option>
                            <option value="Terreno">Terreno</option>
                            <option value="Parcheggio">Parcheggio</option>
                            <option value="Box">Box</option>
                          </select>
                        </div>



                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[#86868B] mb-2">tipo</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white p-4 rounded-2xl border border-[#E5E5EA]">
                            {[
                              "Appartamento", "Attico", "Villa", "Duplex", "Loft", "Casa a Schiera",
                              "Casa Unifamiliare", "Ufficio", "Rustico", "Parcheggio all'Aperto",
                              "Parcheggio al Coperto", "Garage", "Terreno Commerciale", "Terreno per Costruire"
                            ].map(val => (
                              <label key={val} className="flex items-center space-x-2 text-xs text-[#1D1D1F]">
                                <input
                                  type="checkbox"
                                  name={`tipo_${val}`}
                                  defaultChecked={currentImmobile && currentImmobile.tipo ? currentImmobile.tipo.includes(val) : false}
                                  className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                                />
                                <span>{val}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">superficie_abitabile</label>
                          <input
                            type="number"
                            name="superficie_abitabile"
                            defaultValue={currentImmobile ? currentImmobile.superficie_abitabile : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">superficie_sul</label>
                          <input
                            type="number"
                            name="superficie_sul"
                            defaultValue={currentImmobile ? currentImmobile.superficie_sul : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">numero_di_locali</label>
                          <input
                            type="number"
                            step="0.1"
                            name="numero_di_locali"
                            placeholder="es. 3.5"
                            defaultValue={currentImmobile ? currentImmobile.numero_di_locali : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">numero_bagni</label>
                          <input
                            type="number"
                            name="numero_bagni"
                            placeholder="es. 2"
                            defaultValue={currentImmobile ? currentImmobile.numero_bagni : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">garage</label>
                          <input
                            type="number"
                            name="garage"
                            placeholder="es. 1"
                            defaultValue={currentImmobile ? currentImmobile.garage : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">parcheggio</label>
                          <input
                            type="number"
                            name="parcheggio"
                            placeholder="es. 2"
                            defaultValue={currentImmobile ? currentImmobile.parcheggio : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">anno_di_costruzione</label>
                          <input
                            type="number"
                            name="anno_di_costruzione"
                            placeholder="es. 2018"
                            defaultValue={currentImmobile ? currentImmobile.anno_di_costruzione : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">ultimo_rinnovo</label>
                          <input
                            type="number"
                            name="ultimo_rinnovo"
                            placeholder="es. 2020"
                            defaultValue={currentImmobile ? (() => {
                              const val = currentImmobile.ultimo_rinnovo;
                              if (!val) return "";
                              if (val > 100000) {
                                return Math.floor(val / 100);
                              }
                              return val;
                            })() : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-2">tipo_di_residenza</label>
                          <div className="flex space-x-6 bg-white p-3 rounded-2xl border border-[#E5E5EA]">
                            {['Primaria', 'Secondaria'].map(res => (
                              <label key={res} className="flex items-center space-x-2 text-xs text-[#1D1D1F]">
                                <input
                                  type="checkbox"
                                  name={`tipo_di_residenza_${res}`}
                                  defaultChecked={currentImmobile && currentImmobile.tipo_di_residenza ? currentImmobile.tipo_di_residenza.includes(res) : false}
                                  className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                                />
                                <span>{res}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">vendibile_a_stranieri</label>
                          <select
                            name="vendibile_a_stranieri"
                            defaultValue={currentImmobile ? currentImmobile.vendibile_a_stranieri : 'No'}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          >
                            <option value="No">No</option>
                            <option value="Si">Si</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">numero_di_mappale</label>
                          <input
                            type="text"
                            name="numero_di_mappale"
                            placeholder="es. 1234"
                            defaultValue={currentImmobile ? currentImmobile.numero_di_mappale : ''}
                            className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Outside container: descrizione_immobile, planimetria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">descrizione_immobile</label>
                        <textarea
                          name="descrizione_immobile"
                          rows="4"
                          defaultValue={currentImmobile ? currentImmobile.descrizione_immobile : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">planimetria</label>
                        <input
                          type="file"
                          name="planimetria_file"
                          accept="image/*,application/pdf"
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20 cursor-pointer"
                        />
                        {currentImmobile && currentImmobile.planimetria && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-gray-400">File attuale:</span>
                            <a href={currentImmobile.planimetria} target="_blank" rel="noreferrer" className="text-[10px] text-[#0071E3] underline truncate max-w-[240px]">{currentImmobile.planimetria.split('/').pop()}</a>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">link_a_cartella_condivisa</label>
                        <input
                          type="url"
                          name="link_a_cartella_condivisa"
                          placeholder="es. https://drive.google.com/drive/folders/..."
                          defaultValue={currentImmobile ? currentImmobile.link_a_cartella_condivisa : ''}
                          className="w-full px-3.5 py-2 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ========= SEZIONE 3: CONTATTI ========= */}
                  <div className={activeFormTab === 'contatti' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">3. Contatti</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">proprietario_oreferrente_id *</label>
                        <select
                          name="proprietario_id"
                          defaultValue={currentImmobile ? currentImmobile.proprietario_id : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        >
                          <option value="">Nessuno (Seleziona contatto)</option>
                          {contatti.map(c => (
                            <option key={c.id} value={c.id}>{c.cognome} {c.nome}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">agente_id</label>
                        <select
                          name="agente_id"
                          defaultValue={currentImmobile ? currentImmobile.agente_id : ''}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        >
                          <option value="">Nessuno</option>
                          {contatti
                            .filter(c => {
                              const roles = c.ruolo;
                              if (Array.isArray(roles)) {
                                return roles.some(r => r.toLowerCase().includes('agente'));
                              }
                              return String(roles || '').toLowerCase().includes('agente');
                            })
                            .map(c => (
                              <option key={c.id} value={c.id}>{c.cognome} {c.nome}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ========= SEZIONE 4: AMMINISTRAZIONE ========= */}
                  <div className={activeFormTab === 'amministrazione' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">4. Amministrazione</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">mandato_firmato *</label>
                        <select
                          name="mandato_firmato"
                          defaultValue={currentImmobile ? currentImmobile.mandato_firmato : 'No'}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        >
                          <option value="No">No</option>
                          <option value="Stand By">Stand By</option>
                          <option value="Si">Si</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">tipo_di_mandato *</label>
                        <select
                          name="tipo_di_mandato"
                          defaultValue={currentImmobile ? currentImmobile.tipo_di_mandato : 'Non in Esclusiva'}
                          className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        >
                          <option value="Non in Esclusiva">Non in Esclusiva</option>
                          <option value="In Esclusiva">In Esclusiva</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">mandato</label>
                        <input
                          type="file"
                          name="mandato_file"
                          accept="image/*,application/pdf"
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20 cursor-pointer"
                        />
                        {currentImmobile && currentImmobile.mandato && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-gray-400">File attuale:</span>
                            <a href={currentImmobile.mandato} target="_blank" rel="noreferrer" className="text-[10px] text-[#0071E3] underline truncate max-w-[240px]">{currentImmobile.mandato.split('/').pop()}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ========= SEZIONE 5: DOCUMENTI ========= */}
                  <div className={activeFormTab === 'documenti' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">5. Documenti</h4>
                    <p className="text-[11px] text-[#86868B] -mt-2">
                      Indica per ogni documento se è presente e carica il relativo file (Foto o PDF).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'estratto_registro_fondiario', label: 'estratto_registro_fondiario', desc: 'estratto_registro_fondiario_doc' },
                        { key: 'descrittivo_tecnico', label: 'descrittivo_tecnico', desc: 'descrittivo_tecnico_doc' },
                        { key: 'regolamento_condominiale', label: 'regolamento_condominiale', desc: 'regolamento_condominiale_doc' },
                        { key: 'spese_condominiali_doc', label: 'spese_condominiali_doc', desc: 'spese_condominiali_doc', isFileOnly: true },
                        { key: 'assicurazione_stabile', label: 'assicurazione_stabile', desc: 'assicurazione_stabile_doc' },
                        { key: 'verbale_ultima_assemblea', label: 'verbale_ultima_assemblea', desc: 'verbale_ultima_assemblea_doc' },
                        { key: 'fondo_rinnovamento', label: 'fondo_rinnovamento', desc: 'fondo_rinnovamento_doc' },
                        { key: 'valore_di_stima', label: 'valore_di_stima', desc: 'valore_di_stima_doc' },
                        { key: 'piano_assegnazioni_parti_comuni', label: 'piano_assegnazioni_parti_comuni', desc: 'piano_assegnazioni_parti_comuni_doc' },
                        { key: 'rasi', label: 'rasi', desc: 'rasi_doc' },
                        { key: 'certificato_radon', label: 'certificato_radon', desc: 'certificato_radon_doc' }
                      ].map(doc => {
                        const dbField = doc.key;
                        return (
                          <div key={doc.key} className="bg-[#F5F5F7] p-4 rounded-2xl border border-transparent space-y-3">
                            <span className="block text-xs font-bold text-[#1D1D1F]">{doc.label}</span>
                            <span className="block text-[10px] text-[#86868B] -mt-2">{doc.desc}</span>
                            {doc.isFileOnly ? (
                              <div className="pt-1">
                                <div>
                                  <label className="block text-[10px] text-[#86868B] mb-0.5">File</label>
                                  <input
                                    type="file"
                                    name={dbField + "_file"}
                                    accept="image/*,application/pdf"
                                    className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20 cursor-pointer"
                                  />
                                  {currentImmobile && currentImmobile[dbField] && (
                                    <span className="block text-[8px] text-gray-400 mt-1 truncate" title={currentImmobile[dbField]}>
                                      attuale: {currentImmobile[dbField].substring(0, 30)}...
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                <div>
                                  <label className="block text-[10px] text-[#86868B] mb-0.5">Presente?</label>
                                  <select
                                    name={dbField}
                                    defaultValue={currentImmobile ? currentImmobile[dbField] : 'No'}
                                    className="w-full px-2.5 py-1.5 bg-white border border-[#E5E5EA] rounded-lg text-xs focus:outline-none"
                                  >
                                    <option value="No">No</option>
                                    <option value="Si">Si</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#86868B] mb-0.5">File</label>
                                  <input
                                    type="file"
                                    name={dbField + "_doc_file"}
                                    accept="image/*,application/pdf"
                                    className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20 cursor-pointer"
                                  />
                                  {currentImmobile && currentImmobile[dbField + "_doc"] && (
                                    <span className="block text-[8px] text-gray-400 mt-1 truncate" title={currentImmobile[dbField + "_doc"]}>
                                      attuale: {currentImmobile[dbField + "_doc"].substring(0, 30)}...
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ========= SEZIONE: NOTE INTERNE ========= */}
                  <div className={activeFormTab === 'note_interne' ? 'space-y-4' : 'hidden'}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">Note Interne</h4>
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">note_interne</label>
                      <textarea
                        name="note_interne"
                        rows="8"
                        placeholder="Inserisci note interne riservate all'agenzia..."
                        defaultValue={currentImmobile ? currentImmobile.note_interne : ''}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:border-[#0071E3] text-[#1D1D1F] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* ========= SEZIONE 6: LOG ========= */}
                  {currentImmobile && (
                    <div className={activeFormTab === 'log' ? 'space-y-4' : 'hidden'}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">6. Log</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold text-[#86868B] mb-1">creato_da</label>
                          <input
                            type="text"
                            disabled
                            value={currentImmobile.creato_da || '-'}
                            className="w-full px-3.5 py-2 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#86868B] mb-1">created_at</label>
                          <input
                            type="text"
                            disabled
                            value={currentImmobile.created_at ? new Date(currentImmobile.created_at).toLocaleString('it-CH') : '-'}
                            className="w-full px-3.5 py-2 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#86868B] mb-1">ultima_modifica_il</label>
                          <input
                            type="text"
                            disabled
                            value={currentImmobile.ultima_modifica_il ? new Date(currentImmobile.ultima_modifica_il).toLocaleString('it-CH', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '-'}
                            className="w-full px-3.5 py-2 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#86868B] mb-1">ultima_modifica_fatta_da</label>
                          <input
                            type="text"
                            disabled
                            value={currentImmobile.ultima_modifica_fatta_da || '-'}
                            className="w-full px-3.5 py-2 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  </div>

                  {/* Buttons */}
                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                    >
                      Salva Scheda
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsImmobileModalOpen(false)}
                      className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                    >
                      Annulla
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* 2. MODALE CONTATTI (CREAZIONE E MODIFICA) */}
          {isContattoModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
              <div className="bg-white w-full max-w-lg rounded-none md:rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden h-full md:h-[600px] flex flex-col text-[#1D1D1F]">

                <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                  <h3 className="text-lg font-bold tracking-tight">
                    {currentContatto ? 'Aggiorna Dati Contatto' : 'Registra Nuovo Contatto CRM'}
                  </h3>
                  <button
                    onClick={() => setIsContattoModalOpen(false)}
                    className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F]"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveContatto} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentContatto && <input type="hidden" name="id" value={currentContatto.id} />}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Cognome</label>
                      <input
                        type="text"
                        name="cognome"
                        placeholder="es. Boldi"
                        defaultValue={currentContatto ? currentContatto.cognome : ''}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        placeholder="es. Massimiliano"
                        defaultValue={currentContatto ? currentContatto.nome : ''}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Società / Ente</label>
                    <input
                      type="text"
                      name="societa"
                      placeholder="es. HOME LAB Real Estate Sagl"
                      defaultValue={currentContatto ? currentContatto.societa : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-2">Ruoli del Contatto</label>
                    <div className="grid grid-cols-2 gap-2 bg-[#F5F5F7] p-3 rounded-2xl border border-transparent">
                      {["Proprietario", "Locatore", "Acquirente", "Affittuario", "Agente Immobiliare", "Intermediario", "Fotografo"].map(r => {
                        const currentRoles = currentContatto ? (Array.isArray(currentContatto.ruolo) ? currentContatto.ruolo : String(currentContatto.ruolo || '').split(',').map(x => x.trim())) : [];
                        const isChecked = currentRoles.includes(r);
                        return (
                          <label key={r} className="flex items-center space-x-2 text-xs font-semibold text-[#1D1D1F] cursor-pointer">
                            <input
                              type="checkbox"
                              name={`ruolo_${r}`}
                              defaultChecked={isChecked}
                              className="rounded text-[#0071E3] focus:ring-[#0071E3] w-4 h-4"
                            />
                            <span>{r}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Telefono</label>
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="+41 79 000 00 00"
                        defaultValue={currentContatto ? currentContatto.telefono : ''}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">E-mail</label>
                      <input
                        type="email"
                        name="mail"
                        placeholder="nome@dominio.ch"
                        defaultValue={currentContatto ? currentContatto.mail : ''}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Note Libere Contatto (Testo Lungo)</label>
                    <textarea
                      name="note_contatto"
                      rows="3"
                      placeholder="Note operative, referenze e preferenze immobili..."
                      defaultValue={currentContatto ? (currentContatto.note_contatto || currentContatto.note) : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-[#86868B]">Immobili Posseduti (Proprietario)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingPropertyForContact({ contactId: currentContatto?.id || 'new', type: 'posseduti' });
                            setIsImmobileModalOpen(true);
                            setCurrentImmobile(null);
                          }}
                          className="text-[10px] text-[#0071E3] hover:underline font-semibold"
                        >
                          + Aggiungi Immobile
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="🔍 Cerca per nome, codice o comune..."
                        value={searchPossedutiQuery}
                        onChange={(e) => setSearchPossedutiQuery(e.target.value)}
                        className="w-full px-2.5 py-1.5 mb-2 bg-[#F5F5F7] border border-transparent rounded-lg text-xs focus:outline-none focus:border-[#0071E3] transition-all"
                      />

                      <div className="max-h-72 overflow-y-auto border border-[#E5E5EA] rounded-2xl p-2.5 bg-[#F5F5F7] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {immobili.length === 0 ? (
                          <p className="text-xs text-gray-400 italic col-span-2 text-center py-4">Nessun immobile a catalogo</p>
                        ) : (
                          (() => {
                            const filtered = immobili.filter(imm => 
                              (imm.nome_immobile || '').toLowerCase().includes(searchPossedutiQuery.toLowerCase()) || 
                              (imm.comune || '').toLowerCase().includes(searchPossedutiQuery.toLowerCase()) ||
                              (imm.codice_immobile || '').toLowerCase().includes(searchPossedutiQuery.toLowerCase())
                            );
                            if (filtered.length === 0) return <p className="text-[10px] text-gray-400 italic col-span-2 text-center py-4">Nessun risultato</p>;
                            return filtered.map(imm => {
                              const isSelected = selectedPosseduti.includes(imm.id);
                              return (
                                <label key={imm.id} className={`relative border rounded-2xl overflow-hidden bg-white flex flex-col cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-[#0071E3] ring-1 ring-[#0071E3]/25 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                                  {/* Floating checkbox */}
                                  <div className="absolute top-2 right-2 z-20">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedPosseduti([...selectedPosseduti, imm.id]);
                                        } else {
                                          setSelectedPosseduti(selectedPosseduti.filter(id => id !== imm.id));
                                        }
                                      }}
                                      className="rounded-full text-[#0071E3] focus:ring-[#0071E3] w-4.5 h-4.5 cursor-pointer shadow-sm bg-white border-gray-300"
                                    />
                                  </div>

                                  {/* Thumbnail header */}
                                  <div 
                                    className="h-32 bg-cover bg-center relative flex items-end"
                                    style={{
                                      backgroundImage: imm.immagine_di_riferimento 
                                        ? `url(${imm.immagine_di_riferimento})` 
                                        : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    
                                    <div className="absolute top-2 left-2 flex gap-1 z-10 flex-wrap">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase shadow-sm ${imm.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                                          imm.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                                            imm.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' : 'bg-[#0071E3] text-white'
                                        }`}>
                                        {imm.stato}
                                      </span>
                                      <span className="bg-black/40 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[8px] font-semibold tracking-wide shadow-sm">
                                        {imm.categoria}
                                      </span>
                                    </div>

                                    {!imm.immagine_di_riferimento && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#86868B]/60 select-none z-10 p-2">
                                        <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                      </div>
                                    )}

                                    <div className="absolute bottom-2 left-2 text-white text-[9px] font-bold drop-shadow-md z-10">
                                      {imm.comune}{imm.nazione ? `, ${imm.nazione}` : ''}
                                    </div>
                                    
                                    <span className="absolute bottom-2 right-2 bg-[#0071E3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                                      {imm.immobile_in ? imm.immobile_in.join(' / ') : ''}
                                    </span>
                                  </div>

                                  {/* Details */}
                                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                      <h4 className="font-bold text-xs text-[#1D1D1F] line-clamp-1 leading-tight group-hover:text-[#0071E3] transition-colors">
                                        {imm.nome_immobile}
                                      </h4>
                                      <p className="text-[10px] text-[#86868B] leading-snug line-clamp-2 mt-0.5">
                                        {imm.descrizione_immobile}
                                      </p>
                                    </div>

                                    {/* Tech Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-1 border-t border-b border-[#F5F5F7] py-1.5 text-center">
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Codice</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{imm.codice_immobile || 'N/D'}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Locali</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{imm.numero_di_locali}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Superficie</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">
                                          {imm.superficie_abitabile ? `${imm.superficie_abitabile} m²` : '—'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-0.5 pt-0.5">
                                      {Number(imm.prezzo_di_vendita) > 0 && (
                                        <div className="text-[10px] font-extrabold text-[#1D1D1F]">
                                          <span className="text-[8px] text-[#86868B] font-semibold uppercase mr-1">Vendita:</span>
                                          CHF {Number(imm.prezzo_di_vendita).toLocaleString('it-CH')}
                                        </div>
                                      )}
                                      {Number(imm.prezzo_di_affitto) > 0 && (
                                        <div className="text-[10px] font-extrabold text-[#1D1D1F]">
                                          <span className="text-[8px] text-[#86868B] font-semibold uppercase mr-1">Affitto:</span>
                                          CHF {Number(imm.prezzo_di_affitto).toLocaleString('it-CH')}/mese
                                        </div>
                                      )}
                                      {!(Number(imm.prezzo_di_vendita) > 0) && !(Number(imm.prezzo_di_affitto) > 0) && (
                                        <span className="text-[9px] font-semibold text-gray-400 italic">Trattativa Riservata</span>
                                      )}
                                    </div>
                                  </div>
                                </label>
                              );
                            });
                          })()
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-[#86868B]">Immobili Gestiti (Agente)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingPropertyForContact({ contactId: currentContatto?.id || 'new', type: 'gestiti' });
                            setIsImmobileModalOpen(true);
                            setCurrentImmobile(null);
                          }}
                          className="text-[10px] text-[#0071E3] hover:underline font-semibold"
                        >
                          + Aggiungi Immobile
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="🔍 Cerca per nome, codice o comune..."
                        value={searchGestitiQuery}
                        onChange={(e) => setSearchGestitiQuery(e.target.value)}
                        className="w-full px-2.5 py-1.5 mb-2 bg-[#F5F5F7] border border-transparent rounded-lg text-xs focus:outline-none focus:border-[#0071E3] transition-all"
                      />

                      <div className="max-h-72 overflow-y-auto border border-[#E5E5EA] rounded-2xl p-2.5 bg-[#F5F5F7] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {immobili.length === 0 ? (
                          <p className="text-xs text-gray-400 italic col-span-2 text-center py-4">Nessun immobile a catalogo</p>
                        ) : (
                          (() => {
                            const filtered = immobili.filter(imm => 
                              (imm.nome_immobile || '').toLowerCase().includes(searchGestitiQuery.toLowerCase()) || 
                              (imm.comune || '').toLowerCase().includes(searchGestitiQuery.toLowerCase()) ||
                              (imm.codice_immobile || '').toLowerCase().includes(searchGestitiQuery.toLowerCase())
                            );
                            if (filtered.length === 0) return <p className="text-[10px] text-gray-400 italic col-span-2 text-center py-4">Nessun risultato</p>;
                            return filtered.map(imm => {
                              const isSelected = selectedGestiti.includes(imm.id);
                              return (
                                <label key={imm.id} className={`relative border rounded-2xl overflow-hidden bg-white flex flex-col cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-[#0071E3] ring-1 ring-[#0071E3]/25 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                                  {/* Floating checkbox */}
                                  <div className="absolute top-2 right-2 z-20">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedGestiti([...selectedGestiti, imm.id]);
                                        } else {
                                          setSelectedGestiti(selectedGestiti.filter(id => id !== imm.id));
                                        }
                                      }}
                                      className="rounded-full text-[#0071E3] focus:ring-[#0071E3] w-4.5 h-4.5 cursor-pointer shadow-sm bg-white border-gray-300"
                                    />
                                  </div>

                                  {/* Thumbnail header */}
                                  <div 
                                    className="h-32 bg-cover bg-center relative flex items-end"
                                    style={{
                                      backgroundImage: imm.immagine_di_riferimento 
                                        ? `url(${imm.immagine_di_riferimento})` 
                                        : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    
                                    <div className="absolute top-2 left-2 flex gap-1 z-10 flex-wrap">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase shadow-sm ${imm.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                                          imm.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                                            imm.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' : 'bg-[#0071E3] text-white'
                                        }`}>
                                        {imm.stato}
                                      </span>
                                      <span className="bg-black/40 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[8px] font-semibold tracking-wide shadow-sm">
                                        {imm.categoria}
                                      </span>
                                    </div>

                                    {!imm.immagine_di_riferimento && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#86868B]/60 select-none z-10 p-2">
                                        <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                      </div>
                                    )}

                                    <div className="absolute bottom-2 left-2 text-white text-[9px] font-bold drop-shadow-md z-10">
                                      {imm.comune}{imm.nazione ? `, ${imm.nazione}` : ''}
                                    </div>
                                    
                                    <span className="absolute bottom-2 right-2 bg-[#0071E3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                                      {imm.immobile_in ? imm.immobile_in.join(' / ') : ''}
                                    </span>
                                  </div>

                                  {/* Details */}
                                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                      <h4 className="font-bold text-xs text-[#1D1D1F] line-clamp-1 leading-tight group-hover:text-[#0071E3] transition-colors">
                                        {imm.nome_immobile}
                                      </h4>
                                      <p className="text-[10px] text-[#86868B] leading-snug line-clamp-2 mt-0.5">
                                        {imm.descrizione_immobile}
                                      </p>
                                    </div>

                                    {/* Tech Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-1 border-t border-b border-[#F5F5F7] py-1.5 text-center">
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Codice</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{imm.codice_immobile || 'N/D'}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Locali</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{imm.numero_di_locali}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Superficie</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">
                                          {imm.superficie_abitabile ? `${imm.superficie_abitabile} m²` : '—'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-0.5 pt-0.5">
                                      {Number(imm.prezzo_di_vendita) > 0 && (
                                        <div className="text-[10px] font-extrabold text-[#1D1D1F]">
                                          <span className="text-[8px] text-[#86868B] font-semibold uppercase mr-1">Vendita:</span>
                                          CHF {Number(imm.prezzo_di_vendita).toLocaleString('it-CH')}
                                        </div>
                                      )}
                                      {Number(imm.prezzo_di_affitto) > 0 && (
                                        <div className="text-[10px] font-extrabold text-[#1D1D1F]">
                                          <span className="text-[8px] text-[#86868B] font-semibold uppercase mr-1">Affitto:</span>
                                          CHF {Number(imm.prezzo_di_affitto).toLocaleString('it-CH')}/mese
                                        </div>
                                      )}
                                      {!(Number(imm.prezzo_di_vendita) > 0) && !(Number(imm.prezzo_di_affitto) > 0) && (
                                        <span className="text-[9px] font-semibold text-gray-400 italic">Trattativa Riservata</span>
                                      )}
                                    </div>
                                  </div>
                                </label>
                              );
                            });
                          })()
                        )}
                      </div>
                    </div>
                  </div>

                  </div>

                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                    >
                      Salva Contatto
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsContattoModalOpen(false)}
                      className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                    >
                      Annulla
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* 3. MODALE VISITE E APPUNTAMENTI (CALENDARIO) */}
          {isVisitaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
              <div className="bg-white w-full max-w-lg rounded-none md:rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden h-full md:h-[600px] flex flex-col text-[#1D1D1F]">

                <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                  <h3 className="text-lg font-bold tracking-tight">
                    {currentVisita ? 'Modifica Appuntamento' : 'Pianifica Attività / Visita'}
                  </h3>
                  <button
                    onClick={() => setIsVisitaModalOpen(false)}
                    className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F]"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveVisita} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {currentVisita && <input type="hidden" name="id" value={currentVisita.id} />}

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Immobile Visitato / Target *</label>
                    <select
                      name="immobile_id"
                      required
                      defaultValue={currentVisita ? currentVisita.immobile_id : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    >
                      <option value="">Seleziona l'immobile...</option>
                      {immobili.map(i => (
                        <option key={i.id} value={i.id}>{i.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Data e Ora *</label>
                      <input
                        type="datetime-local"
                        name="data_ora"
                        required
                        defaultValue={currentVisita ? currentVisita.data_ora : '2026-05-12T10:00'}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Tipologia Attività *</label>
                      <select
                        name="tipo_visita"
                        defaultValue={currentVisita ? currentVisita.tipo_visita : 'Shooting Fotografico'}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                      >
                        <option value="Shooting Fotografico">Shooting Fotografico</option>
                        <option value="Visita Cliente">Visita Cliente</option>
                        <option value="Primo Incontro">Primo Incontro</option>
                        <option value="Sopralluogo Tecnico">Sopralluogo Tecnico</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Esito Appuntamento</label>
                      <select
                        name="esito"
                        defaultValue={currentVisita ? currentVisita.esito : 'NEUTRO'}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                      >
                        <option value="NEUTRO">Neutro</option>
                        <option value="POSITIVO">Positivo</option>
                        <option value="NEGATIVO">Negativo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Referente / Cliente</label>
                      <select
                        name="cliente_id"
                        defaultValue={currentVisita ? currentVisita.cliente_id : ''}
                        className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                      >
                        <option value="">Seleziona...</option>
                        {contatti.map(c => (
                          <option key={c.id} value={c.id}>{c.cognome} {c.nome} ({c.ruolo})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nomi Partecipanti (Separati da virgola)</label>
                    <input
                      type="text"
                      name="partecipanti"
                      placeholder="es. Olga Honchar, Massimiliano Boldi, Stefano Cau"
                      defaultValue={currentVisita ? currentVisita.partecipanti : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Creato Da (Agente)</label>
                    <input
                      type="text"
                      name="creato_da"
                      placeholder="es. MASSIMILIANO BOLDI"
                      defaultValue={currentVisita ? currentVisita.creato_da : 'MASSIMILIANO BOLDI'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Note operative & Feedback post-visita</label>
                    <textarea
                      name="feedback"
                      rows="3"
                      placeholder="Inserisci l'esito del colloquio, richieste speciali o note sulla logistica..."
                      defaultValue={currentVisita ? currentVisita.feedback : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  </div>

                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                    >
                      Salva Appuntamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVisitaModalOpen(false)}
                      className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                    >
                      Annulla
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* MOBILE BOTTOM TAB BAR */}
          <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/75 backdrop-blur-xl border-t border-white/30 justify-around items-center z-30 px-2 shadow-lg">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
              { id: 'immobili', label: 'Immobili', icon: <IconImmobili /> },
              { id: 'contatti', label: 'Contatti', icon: <IconContatti /> },
              { id: 'visite', label: 'Visite', icon: <IconCalendario /> },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  activeTab === tab.id ? 'text-[#0071E3] font-semibold scale-105' : 'text-[#86868B]'
                }`}
              >
                <div className="w-5 h-5 mb-0.5 flex items-center justify-center">
                  {tab.icon}
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            ))}
          </nav>

        </div>
      )}

    </div>
  );
}