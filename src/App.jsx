import { useState, useEffect, useRef, useMemo } from 'react';
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
    immobile_di_riferimento_id: 102,
    inizio_evento: "2026-05-12T10:00",
    fine_evento: "2026-05-12T11:00",
    nome_evento: "Shooting Fotografico",
    tipo_visita: "Shooting Fotografico",
    esito_e_note: "Realizzazione dello shooting fotografico d'interni ed esterni completata con successo.",
    cliente_id: 4, // Stefano Cau
    partecipanti: "Olga Honchar, Massimiliano Boldi, Stefano Cau",
    creato_da: "MASSIMILIANO BOLDI"
  },
  {
    id: 31,
    immobile_di_riferimento_id: 103,
    inizio_evento: "2026-05-12T13:00",
    fine_evento: "2026-05-12T14:00",
    nome_evento: "Shooting Fotografico",
    tipo_visita: "Shooting Fotografico",
    esito_e_note: "Foto aeree tramite drone per valorizzare la vista lago e la terrazza rooftop.",
    cliente_id: 4,
    partecipanti: "Olga Honchar, Stefano Cau",
    creato_da: "MASSIMILIANO BOLDI"
  },
  {
    id: 32,
    immobile_di_riferimento_id: 101,
    inizio_evento: "2026-06-18T15:30",
    fine_evento: "2026-06-18T16:30",
    nome_evento: "Visita Cliente",
    tipo_visita: "Visita Cliente",
    esito_e_note: "Il cliente è rimasto entusiasta della zona giorno e della vista. Ha richiesto planimetria e rasi.",
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

const formatDashboardWeekRange = (d = new Date()) => {
  const MONTHS_IT = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(date.setDate(diff));
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startDay = start.getDate();
  const startMonth = start.getMonth();
  const startYear = start.getFullYear();

  const endDay = end.getDate();
  const endMonth = end.getMonth();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return `Settimana dal ${startDay} ${MONTHS_IT[startMonth].slice(0, 3)} ${startYear} al ${endDay} ${MONTHS_IT[endMonth].slice(0, 3)} ${endYear}`;
  } else if (startMonth !== endMonth) {
    return `Settimana dal ${startDay} ${MONTHS_IT[startMonth].slice(0, 3)} al ${endDay} ${MONTHS_IT[endMonth].slice(0, 3)} ${endYear}`;
  } else {
    return `Settimana dal ${startDay} al ${endDay} ${MONTHS_IT[startMonth]} ${startYear}`;
  }
};

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

  // Offline support states
  const [isOffline, setIsOffline] = useState(typeof window !== 'undefined' ? !navigator.onLine : false);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('homelab_offline_queue') || '[]');
      } catch (_) {
        return [];
      }
    }
    return [];
  });


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

  const hasActiveFilters = 
    searchProperty !== '' ||
    filterPropertyType !== 'Tutti' ||
    filterTipo !== 'Tutti' ||
    filterStato !== 'Tutti' ||
    filterComune !== 'Tutti' ||
    filterPrezzoMin !== '' ||
    filterPrezzoMax !== '' ||
    filterLocaliMin !== 'Tutti' ||
    filterSuperficieMin !== '' ||
    filterVendibileStranieri !== 'Tutti' ||
    filterResidenza !== 'Tutti' ||
    filterMandatoFirmato !== 'Tutti' ||
    filterAgenteId !== 'Tutti' ||
    filterGarageMin !== '' ||
    filterPostiAutoMin !== '' ||
    filterBagniMin !== 'Tutti';

  const resetAllFilters = () => {
    setSearchProperty('');
    setFilterPropertyType('Tutti');
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
  };

  const mainContentRef = useRef(null);
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const [searchContact, setSearchContact] = useState('');
  const [filterContactRuolo, setFilterContactRuolo] = useState('Tutti');
  const [sortContactOrder, setSortContactOrder] = useState('nome-cognome');
  const [searchVisit, setSearchVisit] = useState('');
  const [calendarView, setCalendarView] = useState('week'); // 'day' | 'week' | 'month' | 'list'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCalendarView(window.innerWidth < 768 ? 'day' : 'week');
    }
  }, []);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [filterVisitAgent, setFilterVisitAgent] = useState('Tutti');
  const [filterVisitClient, setFilterVisitClient] = useState('Tutti');
  const [filterVisitProperty, setFilterVisitProperty] = useState('Tutti');
  const [filterVisitType, setFilterVisitType] = useState('Tutti');
  const [filterVisitOutcome, setFilterVisitOutcome] = useState('Tutti');
  const [showAdvancedCalendarFilters, setShowAdvancedCalendarFilters] = useState(false);
  const [selectedVisitaImmobileId, setSelectedVisitaImmobileId] = useState('');
  const [searchVisitaPropertyQuery, setSearchVisitaPropertyQuery] = useState('');
  const [selectedCalendarClientId, setSelectedCalendarClientId] = useState('');
  const [selectedCalendarParticipantIds, setSelectedCalendarParticipantIds] = useState([]);
  const [addingContactForVisit, setAddingContactForVisit] = useState(null); // 'cliente' | 'partecipanti' | null
  const [addingPropertyForVisit, setAddingPropertyForVisit] = useState(false);
  const [isCalendarAllDay, setIsCalendarAllDay] = useState(false);
  const [searchVisitClientQuery, setSearchVisitClientQuery] = useState('');
  const [searchVisitParticipantQuery, setSearchVisitParticipantQuery] = useState('');
  const [isClientSearchFocused, setIsClientSearchFocused] = useState(false);
  const [isParticipantSearchFocused, setIsParticipantSearchFocused] = useState(false);
  const [isPropertySearchFocused, setIsPropertySearchFocused] = useState(false);

  const calendarScrollRef = useRef(null);
  const listScrollRef = useRef(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    if (activeTab === 'visite' && (calendarView === 'week' || calendarView === 'day') && calendarScrollRef.current) {
      // Delay slightly to ensure layout and rendering are fully completed
      setTimeout(() => {
        if (calendarScrollRef.current) {
          const currentHour = new Date().getHours();
          const scrollTopPosition = Math.max(0, currentHour * 60 - 150);
          calendarScrollRef.current.scrollTop = scrollTopPosition;
        }
      }, 50);
    }
  }, [activeTab, calendarView]);

  useEffect(() => {
    if (activeTab === 'visite' && calendarView === 'list' && listScrollRef.current) {
      setTimeout(() => {
        if (listScrollRef.current) {
          const anchor = listScrollRef.current.querySelector('[data-today-anchor="true"]');
          if (anchor) {
            anchor.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      }, 50);
    }
  }, [activeTab, calendarView, visite, searchVisit, filterVisitAgent, filterVisitClient, filterVisitProperty, filterVisitType, filterVisitOutcome]);

  // Editing modals
  const [currentImmobile, setCurrentImmobile] = useState(null);
  const [isImmobileModalOpen, setIsImmobileModalOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('principale');
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [tempProfileFotoUrl, setTempProfileFotoUrl] = useState(null);

  // Detail inspector (Immobili)
  const [viewingImmobile, setViewingImmobile] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('generale');
  const [previousModalContext, setPreviousModalContext] = useState(null);
  const [previousVisitaModalContext, setPreviousVisitaModalContext] = useState(null);
  const [previousContattoModalContext, setPreviousContattoModalContext] = useState(null);

  // Detail inspector (Contatti)
  const [viewingContatto, setViewingContatto] = useState(null);
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false);

  // Detail inspector (Visite/Calendario)
  const [viewingVisita, setViewingVisita] = useState(null);
  const [isVisitaDetailModalOpen, setIsVisitaDetailModalOpen] = useState(false);

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

  useEffect(() => {
    if (isVisitaModalOpen) {
      setSearchVisitClientQuery('');
      setSearchVisitParticipantQuery('');
      if (!currentVisita) {
        setSelectedVisitaImmobileId('');
        setSelectedCalendarClientId('');
        setSelectedCalendarParticipantIds([]);
        setSearchVisitaPropertyQuery('');
        setIsCalendarAllDay(false);
      }
    }
  }, [isVisitaModalOpen, currentVisita]);

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

  // --- OFFLINE SYNC SYSTEM ---
  const uploadBase64Field = async (val, bucketName = 'immobili-media') => {
    if (typeof val === 'string' && val.startsWith('data:')) {
      try {
        const match = val.match(/^data:([^;]+);/);
        const mimeType = match ? match[1] : 'application/octet-stream';
        const ext = mimeType.split('/')[1] || 'bin';
        const uniqueName = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        
        const response = await fetch(val);
        const blob = await response.blob();
        const fileObj = new File([blob], uniqueName, { type: mimeType });
        
        const uploadedUrl = await uploadToSupabase(fileObj, bucketName);
        if (uploadedUrl) {
          return uploadedUrl;
        }
      } catch (uploadErr) {
        console.error("Errore upload file offline:", uploadErr);
      }
    }
    return val;
  };

  const syncOfflineQueue = async (queueToSync = null) => {
    if (!isRealSupabase || !supabase || !navigator.onLine) return;
    
    const queue = queueToSync || JSON.parse(localStorage.getItem('homelab_offline_queue') || '[]');
    if (queue.length === 0) return;

    setLoading(true);
    let successCount = 0;
    const tempIdMap = {};
    const updatedQueue = [...queue];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        // Resolve temp ID references
        if (item.type === 'visita') {
          if (item.fields.immobile_di_riferimento_id && tempIdMap[item.fields.immobile_di_riferimento_id]) {
            item.fields.immobile_di_riferimento_id = tempIdMap[item.fields.immobile_di_riferimento_id];
          }
          if (item.fields.cliente_id && tempIdMap[item.fields.cliente_id]) {
            item.fields.cliente_id = tempIdMap[item.fields.cliente_id];
          }
        } else if (item.type === 'contatto') {
          if (item.fields.immobili_posseduti) {
            item.fields.immobili_posseduti = item.fields.immobili_posseduti.map(id => tempIdMap[id] || id);
          }
          if (item.fields.immobili_gestiti) {
            item.fields.immobili_gestiti = item.fields.immobili_gestiti.map(id => tempIdMap[id] || id);
          }
        }

        // Upload base64 files
        if (item.type === 'immobile') {
          const fileFields = [
            'immagine_di_riferimento', 'mandato', 'planimetria', 'estratto_registro_fondiario_doc',
            'descrittivo_tecnico_doc', 'regolamento_condominiale_doc', 'spese_condominiali_doc',
            'assicurazione_stabile_doc', 'verbale_ultima_assemblea_doc', 'fondo_rinnovamento_doc',
            'valore_di_stima_doc', 'piano_assegnazioni_parti_comuni_doc', 'rasi_doc', 'certificato_radon_doc'
          ];
          for (const field of fileFields) {
            if (item.fields[field]) {
              item.fields[field] = await uploadBase64Field(item.fields[field]);
            }
          }
        }

        if (item.action === 'insert') {
          const { id, ...insertFields } = item.fields;
          const { data, error } = await supabase.from(item.table).insert([insertFields]).select();
          if (error) throw error;
          const realRecord = data[0];
          
          tempIdMap[item.id] = realRecord.id;

          if (item.type === 'immobile') {
            setImmobili(prev => prev.map(imm => Number(imm.id) === Number(item.id) ? realRecord : imm));
          } else if (item.type === 'contatto') {
            setContatti(prev => prev.map(con => Number(con.id) === Number(item.id) ? realRecord : con));
          } else if (item.type === 'visita') {
            setVisite(prev => prev.map(vis => Number(vis.id) === Number(item.id) ? realRecord : vis));
          }
        } else if (item.action === 'update') {
          const { data, error } = await supabase.from(item.table).update(item.fields).eq('id', item.targetId).select();
          if (error) throw error;
          const realRecord = data[0] || { id: item.targetId, ...item.fields };

          if (item.type === 'immobile') {
            setImmobili(prev => prev.map(imm => Number(imm.id) === Number(item.targetId) ? realRecord : imm));
          } else if (item.type === 'contatto') {
            setContatti(prev => prev.map(con => Number(con.id) === Number(item.targetId) ? realRecord : con));
          } else if (item.type === 'visita') {
            setVisite(prev => prev.map(vis => Number(vis.id) === Number(item.targetId) ? realRecord : vis));
          }
        } else if (item.action === 'delete') {
          const { error } = await supabase.from(item.table).delete().eq('id', item.targetId);
          if (error) throw error;
        }

        successCount++;
        updatedQueue.shift();
        localStorage.setItem('homelab_offline_queue', JSON.stringify(updatedQueue));
        setOfflineQueue([...updatedQueue]);
      } catch (err) {
        console.error(`Errore sincronizzazione elemento offline all'indice ${i}:`, err);
        triggerToast("Errore durante la sincronizzazione offline: " + err.message, "error");
        break;
      }
    }

    setLoading(false);
    if (successCount > 0) {
      triggerToast(`Sincronizzati con successo ${successCount} elementi!`, "success");
      fetchCRMData();
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerToast("Connessione ripristinata. Avvio sincronizzazione...", "info");
      const queue = JSON.parse(localStorage.getItem('homelab_offline_queue') || '[]');
      if (queue.length > 0) {
        syncOfflineQueue(queue);
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
      triggerToast("Sei offline. Le modifiche verranno salvate in locale.", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('homelab_offline_queue') || '[]');
      if (queue.length > 0) {
        syncOfflineQueue(queue);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isRealSupabase]);

  const saveImmobileOffline = (id, fields, changes, logDesc, userEmail) => {
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
      if (addingPropertyForVisit) {
        setSelectedVisitaImmobileId(finalId);
        setAddingPropertyForVisit(false);
      }
    }

    if (isRealSupabase) {
      const queueItem = {
        id: finalId,
        type: 'immobile',
        table: 'immobili',
        action: id ? 'update' : 'insert',
        targetId: id,
        fields: fields,
        timestamp: Date.now()
      };
      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('homelab_offline_queue', JSON.stringify(updatedQueue));
      triggerToast("Offline: salvato localmente e in attesa di sincronizzazione", "info");
    }
  };

  const saveContattoOffline = (id, fields) => {
    const finalId = id || Date.now();
    const localFields = { id: finalId, ...fields };
    if (id) {
      setContatti(contatti.map(item => item.id === id ? localFields : item));
      triggerToast("Contatto aggiornato localmente");
      if (viewingContatto && viewingContatto.id === id) {
        setViewingContatto(localFields);
      }

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
    if (addingContactForVisit) {
      if (addingContactForVisit === 'cliente') {
        setSelectedCalendarClientId(finalId);
      } else if (addingContactForVisit === 'partecipanti') {
        setSelectedCalendarParticipantIds(prev => [...prev, finalId]);
      }
      setAddingContactForVisit(null);
    }

    if (isRealSupabase) {
      const queueItem = {
        id: finalId,
        type: 'contatto',
        table: 'contatti',
        action: id ? 'update' : 'insert',
        targetId: id,
        fields: fields,
        timestamp: Date.now()
      };
      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('homelab_offline_queue', JSON.stringify(updatedQueue));
      triggerToast("Offline: salvato localmente e in attesa di sincronizzazione", "info");
    }
  };

  const saveVisitaOffline = (id, fields) => {
    const finalId = id || Date.now();
    const localFields = { id: finalId, ...fields };
    if (id) {
      setVisite(visite.map(item => item.id === id ? localFields : item));
      triggerToast("Appuntamento aggiornato localmente");
    } else {
      setVisite([...visite, localFields]);
      triggerToast("Nuovo evento aggiunto localmente");
    }

    if (isRealSupabase) {
      const queueItem = {
        id: finalId,
        type: 'visita',
        table: 'visite',
        action: id ? 'update' : 'insert',
        targetId: id,
        fields: fields,
        timestamp: Date.now()
      };
      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('homelab_offline_queue', JSON.stringify(updatedQueue));
      triggerToast("Offline: salvato localmente e in attesa di sincronizzazione", "info");
    }
  };

  const saveDeleteOffline = (type, table, id) => {
    if (type === 'immobile') {
      setImmobili(immobili.filter(item => item.id !== id));
      if (viewingImmobile && viewingImmobile.id === id) {
        handleCloseImmobileDetail();
      }
    } else if (type === 'contatto') {
      setContatti(contatti.filter(item => item.id !== id));
      if (viewingContatto && viewingContatto.id === id) {
        setIsContactDetailModalOpen(false);
        setViewingContatto(null);
      }
    } else if (type === 'visita') {
      setVisite(visite.filter(item => item.id !== id));
      if (viewingVisita && viewingVisita.id === id) {
        setIsVisitaDetailModalOpen(false);
        setViewingVisita(null);
      }
    }

    if (isRealSupabase) {
      const queueItem = {
        id: Date.now(),
        type,
        table,
        action: 'delete',
        targetId: id,
        fields: null,
        timestamp: Date.now()
      };
      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem('homelab_offline_queue', JSON.stringify(updatedQueue));
      triggerToast("Offline: eliminazione salvata in locale e in attesa di sincronizzazione", "info");
    } else {
      triggerToast("Elemento rimosso localmente", "info");
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

      if (tempProfileFotoUrl === '') {
        fotoUrl = '';
      } else if (fotoFile && fotoFile.size > 0) {
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
      if (isRealSupabase && !isOffline && navigator.onLine) {
        const url = await uploadToSupabase(fileField);
        if (!url) {
          throw new Error("Impossibile generare l'URL pubblico per il file caricato.");
        }
        return url;
      }
      // Demo mode o offline: usa base64 locale
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

    const isActuallyOffline = isOffline || !navigator.onLine;

    if (isRealSupabase && !isActuallyOffline) {
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
          if (addingPropertyForVisit) {
            setSelectedVisitaImmobileId(record.id);
            setAddingPropertyForVisit(false);
          }
        }
      } catch (err) {
        console.error(err);
        triggerToast("Errore salvataggio Supabase. Salvataggio offline...", "warning");
        saveImmobileOffline(id, fields, changes, logDesc, userEmail);
      }
    } else {
      saveImmobileOffline(id, fields, changes, logDesc, userEmail);
    }
    setIsImmobileModalOpen(false);
    setCurrentImmobile(null);
  };

  const canModifyEvent = (event) => {
    if (!profile) return false;
    const userRole = String(profile.ruolo || '').toLowerCase();
    if (userRole.includes('admin')) {
      return true;
    }
    if (userRole.includes('editor')) {
      const userDisplayName = `${profile.nome || ''} ${profile.cognome || ''}`.trim().toUpperCase();
      const eventCreator = String(event?.creato_da || '').trim().toUpperCase();
      if (eventCreator === userDisplayName) return true;
      if (userDisplayName === 'MASSIMILIANO BOLDI' && !eventCreator) return true;
      return false;
    }
    return false;
  };

  const canAddEvent = () => {
    if (!profile) return false;
    const userRole = String(profile.ruolo || '').toLowerCase();
    return userRole.includes('admin') || userRole.includes('editor');
  };

  const isMyEvent = (event) => {
    if (!profile) return false;
    const userDisplayName = `${profile.nome || ''} ${profile.cognome || ''}`.trim().toUpperCase();
    const eventCreator = String(event?.creato_da || '').trim().toUpperCase();
    if (eventCreator === userDisplayName) return true;
    if (userDisplayName === 'MASSIMILIANO BOLDI' && !eventCreator) return true;
    return false;
  };

  const getCreatorTag = (event) => {
    const creator = String(event?.creato_da || '').trim();
    if (!creator) return 'CRM';
    const parts = creator.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return creator.substring(0, 3).toUpperCase();
  };

  const handleEditImmobile = (item) => {
    setCurrentImmobile(item);
    setActiveFormTab('principale');
    setIsImmobileModalOpen(true);
  };

  const handleViewImmobile = (item, context = null) => {
    setPreviousModalContext(context);
    setViewingImmobile(item);
    setActiveDetailTab('generale');
    setIsDetailModalOpen(true);
  };

  const handleCloseImmobileDetail = () => {
    setIsDetailModalOpen(false);
    setViewingImmobile(null);
    if (previousModalContext) {
      if (previousModalContext.type === 'visita') {
        setViewingVisita(previousModalContext.item);
        setIsVisitaDetailModalOpen(true);
      } else if (previousModalContext.type === 'contatto') {
        setViewingContatto(previousModalContext.item);
        setIsContactDetailModalOpen(true);
      }
      setPreviousModalContext(null);
    }
  };

  const handleScrollToListToday = () => {
    if (listScrollRef.current) {
      const anchor = listScrollRef.current.querySelector('[data-today-anchor="true"]');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleDeleteImmobile = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo immobile?")) {
      const isActuallyOffline = isOffline || !navigator.onLine;
      if (isRealSupabase && !isActuallyOffline) {
        try {
          const { error } = await supabase
            .from('immobili')
            .delete()
            .eq('id', id);
          if (error) throw error;
          setImmobili(immobili.filter(item => item.id !== id));
          triggerToast("Immobile rimosso dal database");
          if (viewingImmobile && viewingImmobile.id === id) {
            handleCloseImmobileDetail();
          }
        } catch (err) {
          console.error(err);
          triggerToast("Errore eliminazione Supabase. Eliminazione offline...", "warning");
          saveDeleteOffline('immobile', 'immobili', id);
        }
      } else {
        saveDeleteOffline('immobile', 'immobili', id);
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

    const isActuallyOffline = isOffline || !navigator.onLine;

    if (isRealSupabase && !isActuallyOffline) {
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
          if (addingContactForVisit) {
            if (addingContactForVisit === 'cliente') {
              setSelectedCalendarClientId(newId);
            } else if (addingContactForVisit === 'partecipanti') {
              setSelectedCalendarParticipantIds(prev => [...prev, newId]);
            }
            setAddingContactForVisit(null);
          }
        }
      } catch (err) {
        console.error(err);
        triggerToast("Errore salvataggio contatto. Salvataggio offline...", "warning");
        saveContattoOffline(id, fields);
      }
    } else {
      saveContattoOffline(id, fields);
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

  const handleViewContatto = (item, context = null) => {
    setPreviousContattoModalContext(context);
    setViewingContatto(item);
    setIsContactDetailModalOpen(true);
  };

  const handleCloseContattoDetail = () => {
    setIsContactDetailModalOpen(false);
    setViewingContatto(null);
    if (previousContattoModalContext) {
      if (previousContattoModalContext.type === 'immobile') {
        setViewingImmobile(previousContattoModalContext.item);
        setActiveDetailTab(previousContattoModalContext.tab || 'generale');
        setIsDetailModalOpen(true);
      }
      setPreviousContattoModalContext(null);
    }
  };

  const handleDeleteContatto = async (id) => {
    if (window.confirm("Rimuovere definitivamente questo contatto dalle anagrafiche?")) {
      const isActuallyOffline = isOffline || !navigator.onLine;
      if (isRealSupabase && !isActuallyOffline) {
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
          triggerToast("Errore eliminazione contatto. Eliminazione offline...", "warning");
          saveDeleteOffline('contatto', 'contatti', id);
        }
      } else {
        saveDeleteOffline('contatto', 'contatti', id);
      }
    }
  };

  // --- HANDLERS FOR VISITE (CALENDARIO) ---
  const handleSaveVisita = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idVal = formData.get('id');
    const id = idVal ? parseInt(idVal) : null;

    if (id) {
      const existing = visite.find(v => v.id === id);
      if (!canModifyEvent(existing)) {
        triggerToast("Non hai i permessi per modificare questo evento", "error");
        return;
      }
    } else {
      if (!canAddEvent()) {
        triggerToast("Non hai i permessi per aggiungere eventi", "error");
        return;
      }
    }

    const participantNames = selectedCalendarParticipantIds
      .map(cid => {
        const match = contatti.find(c => String(c.id) === String(cid));
        return match ? `${match.nome || ''} ${match.cognome || ''}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const rawStart = formData.get('inizio_evento');
    const rawEnd = formData.get('fine_evento');

    if (rawStart && rawEnd) {
      const start = new Date(rawStart);
      const end = new Date(rawEnd);
      if (end < start) {
        triggerToast("La data di fine non può essere precedente all'inizio", "error");
        return;
      }
    }

    const fields = {
      immobile_di_riferimento_id: selectedVisitaImmobileId ? Number(selectedVisitaImmobileId) : null,
      inizio_evento: rawStart ? new Date(rawStart).toISOString() : null,
      fine_evento: rawEnd ? new Date(rawEnd).toISOString() : null,
      nome_evento: formData.get('nome_evento'),
      tipo_visita: formData.get('nome_evento') || 'Visita',
      esito_e_note: formData.get('esito_e_note') || '',
      cliente_id: selectedCalendarClientId ? Number(selectedCalendarClientId) : null,
      partecipanti: participantNames,
      creato_da: formData.get('creato_da') || "MASSIMILIANO BOLDI",
      tutto_giorno: formData.get('tutto_giorno') === 'on'
    };

    const isActuallyOffline = isOffline || !navigator.onLine;

    if (isRealSupabase && !isActuallyOffline) {
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
        triggerToast("Errore salvataggio visita. Salvataggio offline...", "warning");
        saveVisitaOffline(id, fields);
      }
    } else {
      saveVisitaOffline(id, fields);
    }
    setIsVisitaModalOpen(false);
    setCurrentVisita(null);
  };

  const handleViewVisita = (item, context = null) => {
    if (isResizingRef.current) return;
    setPreviousVisitaModalContext(context);
    setViewingVisita(item);
    setIsVisitaDetailModalOpen(true);
  };

  const handleCloseVisitaDetail = () => {
    setIsVisitaDetailModalOpen(false);
    setViewingVisita(null);
    if (previousVisitaModalContext) {
      if (previousVisitaModalContext.type === 'immobile') {
        setViewingImmobile(previousVisitaModalContext.item);
        setActiveDetailTab(previousVisitaModalContext.tab || 'generale');
        setIsDetailModalOpen(true);
      }
      setPreviousVisitaModalContext(null);
    }
  };

  const handleCreateVisita = () => {
    if (!canAddEvent()) {
      triggerToast("Non hai i permessi per aggiungere eventi", "error");
      return;
    }
    setCurrentVisita(null);
    setSelectedVisitaImmobileId('');
    setSearchVisitaPropertyQuery('');
    setSelectedCalendarClientId('');
    setSelectedCalendarParticipantIds([]);
    setIsCalendarAllDay(false);
    setIsVisitaModalOpen(true);
  };

  const handleEditVisita = (item) => {
    if (!canModifyEvent(item)) {
      triggerToast("Non hai i permessi per modificare questo evento", "error");
      return;
    }
    setCurrentVisita(item);
    setSelectedVisitaImmobileId(item.immobile_di_riferimento_id || '');
    setSelectedCalendarClientId(item.cliente_id || '');
    setIsCalendarAllDay(!!item.tutto_giorno);
    
    const participantNames = (item.partecipanti || '').split(',').map(n => n.trim().toLowerCase());
    const matchedIds = contatti.filter(c => {
      const name = `${c.nome} ${c.cognome}`.toLowerCase();
      return participantNames.includes(name);
    }).map(c => c.id);
    setSelectedCalendarParticipantIds(matchedIds);

    setSearchVisitaPropertyQuery('');
    setIsVisitaModalOpen(true);
  };

  const handleDeleteVisita = async (id) => {
    const event = visite.find(v => v.id === id);
    if (!canModifyEvent(event)) {
      triggerToast("Non hai i permessi per eliminare questo evento", "error");
      return;
    }
    if (window.confirm("Annullare questo appuntamento a calendario?")) {
      const isActuallyOffline = isOffline || !navigator.onLine;
      if (isRealSupabase && !isActuallyOffline) {
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
          triggerToast("Errore eliminazione visita. Eliminazione offline...", "warning");
          saveDeleteOffline('visita', 'visite', id);
        }
      } else {
        saveDeleteOffline('visita', 'visite', id);
      }
    }
  };

  const handleDropEvent = async (e, day, month, year, hour) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    if (!eventId) return;

    const event = visite.find(v => String(v.id) === String(eventId));
    if (!event) return;

    if (!canModifyEvent(event)) {
      triggerToast("Non hai i permessi per spostare questo evento", "error");
      return;
    }

    // Calculate duration
    const start = new Date(event.inizio_evento);
    const end = event.fine_evento ? new Date(event.fine_evento) : new Date(start.getTime() + 60 * 60 * 1000);
    const duration = end.getTime() - start.getTime();

    // Create new start and end times
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const hourStr = String(hour).padStart(2, '0');
    
    // Maintain old minutes if any
    const minutesStr = String(start.getMinutes()).padStart(2, '0');

    const newStartStr = `${year}-${monthStr}-${dayStr}T${hourStr}:${minutesStr}:00`;
    const newStartDate = new Date(newStartStr);
    const newEndDate = new Date(newStartDate.getTime() + duration);

    const fields = {
      inizio_evento: newStartDate.toISOString(),
      fine_evento: newEndDate.toISOString()
    };

    if (isRealSupabase) {
      try {
        const { data, error } = await supabase
          .from('visite')
          .update(fields)
          .eq('id', event.id)
          .select();
        if (error) throw error;
        setVisite(visite.map(item => item.id === event.id ? { ...item, ...fields } : item));
        triggerToast("Appuntamento spostato");
      } catch (err) {
        console.error(err);
        triggerToast("Errore durante lo spostamento", "error");
      }
    } else {
      setVisite(visite.map(item => item.id === event.id ? { ...item, ...fields } : item));
      triggerToast("Appuntamento spostato localmente");
    }
  };

  const handleResizeMouseDown = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canModifyEvent(event)) {
      triggerToast("Non hai i permessi per modificare questo evento", "error");
      return;
    }
    isResizingRef.current = true;

    const startY = e.clientY;
    const originalEnd = event.fine_evento ? new Date(event.fine_evento) : new Date(new Date(event.inizio_evento).getTime() + 60 * 60 * 1000);
    const originalEndTime = originalEnd.getTime();

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaMinutes = deltaY; // 1px = 1 min
      const roundedDeltaMinutes = Math.round(deltaMinutes / 15) * 15;
      
      const newEndTime = originalEndTime + roundedDeltaMinutes * 60 * 1000;
      const newEndDate = new Date(newEndTime);

      const startTime = new Date(event.inizio_evento).getTime();
      if (newEndDate.getTime() < startTime + 30 * 60 * 1000) {
        return;
      }

      setVisite(prev => prev.map(item => 
        item.id === event.id 
          ? { ...item, fine_evento: newEndDate.toISOString() } 
          : item
      ));
    };

    const onMouseUp = async (upEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const deltaY = upEvent.clientY - startY;
      const roundedDeltaMinutes = Math.round(deltaY / 15) * 15;
      let newEndTime = originalEndTime + roundedDeltaMinutes * 60 * 1000;
      const startTime = new Date(event.inizio_evento).getTime();
      
      if (newEndTime < startTime + 30 * 60 * 1000) {
        newEndTime = startTime + 30 * 60 * 1000;
      }
      
      const finalEndDate = new Date(newEndTime);
      const updatedFields = {
        fine_evento: finalEndDate.toISOString()
      };

      if (isRealSupabase) {
        try {
          const { error } = await supabase
            .from('visite')
            .update(updatedFields)
            .eq('id', event.id);
          if (error) throw error;
          triggerToast("Durata aggiornata");
        } catch (err) {
          console.error(err);
          triggerToast("Errore aggiornamento durata", "error");
        }
      } else {
        triggerToast("Durata aggiornata localmente");
      }

      setTimeout(() => {
        isResizingRef.current = false;
      }, 50);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
    if (!id) return 'Nessun immobile';
    const imm = immobili.find(i => Number(i.id) === Number(id));
    return imm ? (imm.nome || imm.nome_immobile) : 'Immobile sconosciuto';
  };

  const filteredImmobili = useMemo(() => {
    return immobili
      .filter(item => {
        const propName = (item.nome_immobile || '').toLowerCase();
        const propComune = (item.comune || '').toLowerCase();
        const matchSearch = propName.includes(searchProperty.toLowerCase()) || propComune.includes(searchProperty.toLowerCase());
        
        const matchType = filterPropertyType === 'Tutti' || (item.immobile_in && item.immobile_in.includes(filterPropertyType));
        
        const matchTipo = filterTipo === 'Tutti' || (item.tipo && item.tipo.some(t => t.toLowerCase() === filterTipo.toLowerCase()));
        
        const matchStato = filterStato === 'Tutti' ||
          (filterStato === 'Disponibile' && (item.stato === 'Disponibile' || item.stato === 'In Trattativa')) ||
          (item.stato && item.stato.toLowerCase() === filterStato.toLowerCase());
        
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
      });
  }, [
    immobili, searchProperty, filterPropertyType, filterTipo, filterStato,
    filterComune, filterVendibileStranieri, filterResidenza, filterMandatoFirmato,
    filterAgenteId, filterPrezzoMin, filterPrezzoMax, filterLocaliMin, filterBagniMin,
    filterSuperficieMin, filterGarageMin, filterPostiAutoMin, sortProperty
  ]);

  const filteredContatti = useMemo(() => {
    return contatti
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
      });
  }, [contatti, searchContact, filterContactRuolo, sortContactOrder]);

  const visiteStats = useMemo(() => {
    const uniqueAgents = Array.from(new Set([
      ...visite.map(v => v.creato_da).filter(Boolean),
      ...contatti.filter(c => {
        const roles = Array.isArray(c.ruolo) ? c.ruolo : [c.ruolo];
        return roles.some(r => String(r).toLowerCase().includes('agente'));
      }).map(c => `${c.nome} ${c.cognome}`.toUpperCase())
    ])).sort();

    const filteredVisite = visite.filter(item => {
      const immName = getImmobileName(item.immobile_di_riferimento_id).toLowerCase();
      const clientName = getContactName(item.cliente_id).toLowerCase();
      const query = searchVisit.toLowerCase();
      const matchesSearch = !query || 
        immName.includes(query) || 
        clientName.includes(query) ||
        (item.tipo_visita || '').toLowerCase().includes(query) ||
        (item.esito_e_note || '').toLowerCase().includes(query);

      const matchesAgent = filterVisitAgent === 'Tutti' || 
        item.creato_da === filterVisitAgent || 
        (item.partecipanti || '').includes(filterVisitAgent);

      const matchesClient = filterVisitClient === 'Tutti' || String(item.cliente_id) === String(filterVisitClient);
      const matchesProperty = filterVisitProperty === 'Tutti' || String(item.immobile_di_riferimento_id) === String(filterVisitProperty);
      const matchesType = filterVisitType === 'Tutti' || item.tipo_visita === filterVisitType;
      const matchesOutcome = filterVisitOutcome === 'Tutti' || item.esito_e_note === filterVisitOutcome;

      return matchesSearch && matchesAgent && matchesClient && matchesProperty && matchesType && matchesOutcome;
    });

    const totalActivities = filteredVisite.length;
    const customerVisits = filteredVisite.filter(v => v.tipo_visita === 'Visita Cliente').length;
    const withOutcome = filteredVisite.filter(v => v.esito_e_note === 'POSITIVO' || v.esito_e_note === 'NEGATIVO');
    const positiveCount = filteredVisite.filter(v => v.esito_e_note === 'POSITIVO').length;
    const successRate = withOutcome.length > 0 ? Math.round((positiveCount / withOutcome.length) * 100) : 0;

    return {
      uniqueAgents,
      filteredVisite,
      totalActivities,
      customerVisits,
      successRate
    };
  }, [
    visite, contatti, immobili, searchVisit, filterVisitAgent,
    filterVisitClient, filterVisitProperty, filterVisitType, filterVisitOutcome
  ]);

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
            <div className="h-16 w-16 flex items-center justify-center animate-pulse">
              <img src="https://vndajxcmgqjybhvppkqe.supabase.co/storage/v1/object/public/immobili-media/images/HomeLab-Nero.png" alt="Logo" className="w-full h-full object-contain" />
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
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="https://vndajxcmgqjybhvppkqe.supabase.co/storage/v1/object/public/immobili-media/images/HomeLab-Nero.png" alt="Logo" className="w-full h-full object-contain" />
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
              <div className="w-7 h-7 flex items-center justify-center">
                <img src="https://vndajxcmgqjybhvppkqe.supabase.co/storage/v1/object/public/immobili-media/images/HomeLab-Nero.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
            </div>
            
            <div 
              onClick={() => { setIsUserSettingsModalOpen(true); setTempProfileFotoUrl(null); setIsProfileEditing(false); }}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer hover:scale-105 transition-transform"
            >
              {profile?.foto && profile.foto.trim() !== '' ? (
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
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="https://vndajxcmgqjybhvppkqe.supabase.co/storage/v1/object/public/immobili-media/images/HomeLab-Nero.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-base font-semibold tracking-tight text-[#1D1D1F]">HomeLab CRM</h1>
                  <p className="text-xs text-[#86868B]">Real Estate Office</p>
                </div>
              </div>

              {isOffline && (
                <div className="flex flex-col space-y-1 mb-6 px-3">
                  <div className="flex items-center space-x-2 py-1.5 bg-amber-500/10 rounded-xl border border-amber-500/15 text-amber-600 text-[11px] font-semibold w-fit px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Sei Offline</span>
                  </div>
                  {offlineQueue.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      {offlineQueue.length} modifiche in attesa
                    </span>
                  )}
                </div>
              )}

              {!isOffline && offlineQueue.length > 0 && (
                <div className="flex flex-col space-y-2 mb-6 px-3">
                  <button
                    onClick={() => syncOfflineQueue()}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#0062C2] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                  >
                    <svg className={`h-3 w-3 text-white ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z" />
                    </svg>
                    <span>Sincronizza ({offlineQueue.length})</span>
                  </button>
                </div>
              )}

              {isCRMLoading && !isOffline && (
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
                 onClick={() => { setIsUserSettingsModalOpen(true); setTempProfileFotoUrl(null); setIsProfileEditing(false); }}
                 className="bg-white/80 hover:bg-white p-3 rounded-2xl border border-[#E5E5EA] shadow-sm flex items-center space-x-3 cursor-pointer hover:scale-[1.01] transition-all"
                 title="Impostazioni Profilo"
               >
                 {profile?.foto && profile.foto.trim() !== '' ? (
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
          <main ref={mainContentRef} className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8 pb-24 md:pb-8">

            {/* TAB 1: DASHBOARD */}
            <div className={`${activeTab === 'dashboard' ? 'block' : 'hidden'} space-y-8 max-w-6xl mx-auto`}>

                {/* Elegant Top Header with Welcome Message */}
                <div className="flex justify-between items-end border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Panoramica Globale</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Bentornato in HomeLab Real Estate</h2>
                      {isOffline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Offline
                        </span>
                      ) : isCRMLoading && (
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
                <div className="space-y-6">
                  {/* Prima riga: Immobili Attivi e Portafoglio */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Immobili in Vendita */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili in Vendita</span>
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs">🏷️ In Vendita</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                            {immobili.filter(imm => imm.immobile_in && imm.immobile_in.includes('Vendita') && imm.stato !== 'Venduto').length}
                          </span>
                        )}
                      </div>
                      <button onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Vendita'); setFilterStato('Disponibile'); }} className="text-xs text-[#0071E3] hover:underline flex items-center self-start">
                        Vedi archivio →
                      </button>
                    </div>

                    {/* Immobili in Affitto */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili in Affitto</span>
                        <span className="p-1.5 rounded-lg bg-green-50 text-green-600 text-xs">🔑 In Affitto</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                            {immobili.filter(imm => imm.immobile_in && imm.immobile_in.includes('Affitto') && imm.stato !== 'Affittato').length}
                          </span>
                        )}
                      </div>
                      <button onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Affitto'); setFilterStato('Disponibile'); }} className="text-xs text-[#0071E3] hover:underline flex items-center self-start">
                        Vedi archivio →
                      </button>
                    </div>

                    {/* Portafoglio Stimato (Somma del valore degli immobili in Vendita) */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 border border-blue-500/10 bg-gradient-to-br from-white to-blue-50/20">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Portafoglio Stimato</span>
                        <span className="p-1.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">💰 Valore</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-28 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="inline-block text-2xl font-bold text-[#0071E3] whitespace-nowrap overflow-visible">
                            CHF {(immobili.filter(imm => imm.immobile_in && imm.immobile_in.includes('Vendita') && imm.stato !== 'Venduto').reduce((acc, curr) => acc + (Number(curr.prezzo_di_vendita) || 0), 0) / 1000000).toFixed(2)}M
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#86868B]">Somma del valore di vendita attivo</span>
                    </div>
                  </div>

                  {/* Seconda riga: Pipeline e Chiusure */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Immobili in Trattativa */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili in Trattativa</span>
                        <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 text-xs">🤝 Trattativa</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                            {immobili.filter(imm => imm.stato === 'In Trattativa').length}
                          </span>
                        )}
                      </div>
                      <button onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Tutti'); setFilterStato('In Trattativa'); }} className="text-xs text-[#0071E3] hover:underline flex items-center self-start">
                        Vedi trattative →
                      </button>
                    </div>

                    {/* Immobili Venduti */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Venduti</span>
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs">✨ Venduti</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                            {immobili.filter(imm => imm.stato === 'Venduto').length}
                          </span>
                        )}
                      </div>
                      <button onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Vendita'); setFilterStato('Venduto'); }} className="text-xs text-[#0071E3] hover:underline flex items-center self-start">
                        Vedi venduti →
                      </button>
                    </div>

                    {/* Immobili Affittati */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Affittati</span>
                        <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 text-xs">🏡 Affittati</span>
                      </div>
                      <div className="my-1" key={isCRMLoading ? 'loading' : 'ready'}>
                        {isCRMLoading ? (
                          <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
                        ) : (
                          <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                            {immobili.filter(imm => imm.stato === 'Affittato').length}
                          </span>
                        )}
                      </div>
                      <button onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Affitto'); setFilterStato('Affittato'); }} className="text-xs text-[#0071E3] hover:underline flex items-center self-start">
                        Vedi affittati →
                      </button>
                    </div>
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
                      onClick={handleCreateVisita}
                      className="bg-white/45 backdrop-blur hover:bg-white/70 text-[#1D1D1F] p-4 rounded-2xl font-medium text-sm border border-white/40 shadow-sm transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
                    >
                      <IconPlus /> <span>Pianifica Visita/Shooting</span>
                    </button>
                  </div>
                </div>

                {/* Prossime Attività in Calendario */}
                <div className="bg-white p-6 rounded-3xl border border-[#E5E5EA] shadow-sm">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#F5F5F7]">
                    <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Prossime Attività</h3>
                    <button
                      onClick={() => setActiveTab('visite')}
                      className="text-xs text-[#0071E3] hover:text-[#005BB5] hover:underline font-semibold transition-colors"
                    >
                      Vedi calendario →
                    </button>
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
                    ) : (() => {
                      const upcomingEvents = [...visite]
                        .filter(v => new Date(v.inizio_evento) >= new Date().setHours(0,0,0,0))
                        .sort((a, b) => new Date(a.inizio_evento) - new Date(b.inizio_evento));
                      
                      const totalEvents = upcomingEvents.length > 0 
                        ? upcomingEvents 
                        : [...visite].sort((a, b) => new Date(a.inizio_evento) - new Date(b.inizio_evento));

                      const eventsToShow = totalEvents.slice(0, 5);
                      const extraCount = totalEvents.length - 5;

                      if (eventsToShow.length === 0) {
                        return <p className="text-xs text-[#86868B] py-2 text-center">Nessun appuntamento in programma.</p>;
                      }

                      return (
                        <div className="space-y-4">
                          <div className="space-y-4">
                            {eventsToShow.map((item) => {
                              const startObj = new Date(item.inizio_evento);
                              const endObj = item.fine_evento ? new Date(item.fine_evento) : null;
                              const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });
                              const clienteName = getContactName(item.cliente_id);
                              const immobileName = getImmobileName(item.immobile_di_riferimento_id);
                              const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => handleViewVisita(item)}
                                  className="group bg-white border border-[#E5E5EA] rounded-2xl cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                >
                                  <div className="flex">
                                    {/* Date column */}
                                    <div className="w-[72px] shrink-0 flex flex-col items-center justify-center bg-[#F5F5F7] border-r border-[#E5E5EA] py-4 gap-0.5">
                                      <span className="text-[11px] font-bold uppercase text-[#86868B] tracking-wider leading-none">
                                        {startObj.toLocaleDateString('it-IT', { month: 'short' })}
                                      </span>
                                      <span className="text-[32px] font-black text-[#1D1D1F] leading-none">
                                        {startObj.toLocaleDateString('it-IT', { day: 'numeric' })}
                                      </span>
                                      <span className="text-[10px] font-semibold text-[#86868B] capitalize leading-none">
                                        {startObj.toLocaleDateString('it-IT', { weekday: 'short' })}
                                      </span>
                                    </div>

                                    {/* Main content */}
                                    <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col gap-2.5">

                                      {/* Title + time */}
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                          <h3 className="text-[14px] font-extrabold text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors truncate">
                                            {item.nome_evento || item.tipo_visita || '—'}
                                          </h3>
                                          <span className="text-[10px] text-[#86868B] font-medium block mt-0.5">
                                            Gestito da: <span className="font-bold text-[#555]">{isMyEvent(item) ? 'Me' : (item.creato_da || 'CRM')}</span>
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] uppercase shadow-sm ${
                                            isMyEvent(item) 
                                              ? 'bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white border border-[#0071E3]/20' 
                                              : 'bg-gradient-to-tr from-[#8E8E93] to-[#D2D2D7] text-white border border-[#8E8E93]/20'
                                          }`} title={item.creato_da || 'MASSIMILIANO BOLDI'}>
                                            {isMyEvent(item) ? 'TU' : getCreatorTag(item)}
                                          </div>
                                          {item.tutto_giorno ? (
                                            <span className="shrink-0 inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FFB74D]/30 whitespace-nowrap">
                                              ☀️ Tutto il giorno
                                            </span>
                                          ) : (
                                            <span className="shrink-0 inline-flex items-center gap-1 bg-[#E8F4FF] text-[#0071E3] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#0071E3]/20 whitespace-nowrap">
                                              🕐 {fmtTime(startObj)}{endObj ? ' → ' + fmtTime(endObj) : ''}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Pills: cliente + partecipanti + immobile */}
                                      <div className="flex flex-wrap gap-1.5">
                                        {/* Cliente */}
                                        <span className="inline-flex items-center gap-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#374151]">
                                          👤 {clienteName || '—'}
                                        </span>
                                        {/* Partecipanti */}
                                        {partecipantiList.length > 0 ? (
                                          partecipantiList.map((p, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                                              👥 {p}
                                            </span>
                                          ))
                                        ) : null}
                                        {/* Immobile */}
                                        {immobileName && (
                                          <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#15803D]">
                                            🏠 {immobileName}
                                          </span>
                                        )}
                                      </div>

                                      {/* Note */}
                                      {item.esito_e_note && (
                                        <p className="text-[11px] text-[#86868B] leading-relaxed line-clamp-2 border-t border-[#F5F5F7] pt-2">
                                          <span className="font-semibold text-[#6B7280]">Note: </span>
                                          {item.esito_e_note}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {extraCount > 0 && (
                            <div className="flex items-center justify-between p-4 bg-[#F5F5F7]/80 rounded-2xl border border-[#E5E5EA]/70 mt-2 hover:bg-[#F5F5F7] transition-all">
                              <div className="flex items-center space-x-2">
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071E3] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0071E3]"></span>
                                </span>
                                <span className="text-xs text-[#86868B] font-medium">
                                  Ci sono altri <span className="font-extrabold text-[#1D1D1F]">{extraCount}</span> appuntamenti in programma.
                                </span>
                              </div>
                              <button
                                onClick={() => setActiveTab('visite')}
                                className="text-xs text-[#0071E3] hover:text-[#005BB5] hover:underline font-bold transition-all"
                              >
                                Apri calendario →
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

            </div>

            {/* TAB 2: IMMOBILI */}
            <div className={`${activeTab === 'immobili' ? 'block' : 'hidden'} space-y-6 max-w-6xl mx-auto`}>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Portafoglio</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Immobili</h2>
                      {isOffline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Offline
                        </span>
                      ) : isCRMLoading && (
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
                </div>



                {/* Filters Bar */}
                <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border transition-all duration-300 shadow-sm ${
                  hasActiveFilters 
                    ? 'border-blue-500/30 shadow-md shadow-blue-500/5 bg-gradient-to-r from-white via-blue-50/10 to-white' 
                    : 'border-[#E5E5EA]'
                }`}>
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
                          ? 'bg-[#0071E3] text-white border-transparent shadow-sm'
                          : hasActiveFilters
                            ? 'bg-blue-50 hover:bg-blue-100/70 border-blue-200 text-[#0071E3] font-bold'
                            : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]/50 border-transparent text-[#1D1D1F]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span>Filtri</span>
                      {hasActiveFilters && (
                        <span className={`w-2 h-2 rounded-full ${showAdvancedFilters ? 'bg-white' : 'bg-[#0071E3] animate-pulse'}`}></span>
                      )}
                    </button>
                  </div>

                  {/* Segmented filter and Reset button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {hasActiveFilters && (
                      <button
                        onClick={resetAllFilters}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1 flex items-center gap-1 hover:underline cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Azzera filtri</span>
                      </button>
                    )}
                    <div className="flex bg-[#F5F5F7] p-1 rounded-xl overflow-x-auto shrink-0">
                      {['Tutti', 'Vendita', 'Affitto'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilterPropertyType(type)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${filterPropertyType === type
                              ? 'bg-white text-[#1D1D1F] shadow-sm'
                              : 'text-[#86868B] hover:text-[#1D1D1F]'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
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
                          <option value="Disponibile">Disponibile (incl. in Trattativa)</option>
                          <option value="In Trattativa">In Trattativa</option>
                          <option value="Venduto">Venduto</option>
                          <option value="Affittato">Affittato</option>
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
                          onClick={resetAllFilters}
                          className="flex-1 py-2 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center"
                        >
                          Reset Filtri
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Properties Toolbar (Counters & Sorting) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#86868B] gap-2 pt-2 px-1">
                  <div>
                    {isCRMLoading ? (
                      <span>Calcolo immobili in corso...</span>
                    ) : (
                      <span>
                        Trovati <span className="font-bold text-[#1D1D1F]">{filteredImmobili.length}</span> immobili
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-semibold text-[#86868B]">Ordina per:</span>
                    <select
                      value={sortProperty}
                      onChange={(e) => setSortProperty(e.target.value)}
                      className="px-3 py-1.5 bg-[#F5F5F7] border border-transparent rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] cursor-pointer transition-all"
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
                </div>

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
                    {filteredImmobili.map((item) => (
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

                            {/* Price */}
                            <div className="pt-2">
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
                          </div>

                        </div>
                      ))}
                  </div>
                )}

            </div>

            {/* TAB 3: CONTATTI */}
            <div className={`${activeTab === 'contatti' ? 'block' : 'hidden'} space-y-6 max-w-6xl mx-auto`}>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Anagrafiche</span>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Contatti</h2>
                      {isOffline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Offline
                        </span>
                      ) : isCRMLoading && (
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
                          filteredContatti.map((item) => (
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
                    filteredContatti.length === 0 ? (
                      <p className="text-center text-xs text-[#86868B] py-8">Nessun risultato per la ricerca.</p>
                    ) : (
                      filteredContatti.map(item => (
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
                      ))
                    )
                  )}
                </div>

            </div>

            {/* TAB 4: CALENDARIO / VISITE */}
            <div className={`${activeTab === 'visite' ? 'block' : 'hidden'} max-w-6xl mx-auto`}>
              {(() => {
                const { uniqueAgents, filteredVisite, totalActivities, customerVisits, successRate } = visiteStats;

              const agentCounts = {};
              filteredVisite.forEach(v => {
                if (v.creato_da) {
                  agentCounts[v.creato_da] = (agentCounts[v.creato_da] || 0) + 1;
                }
              });
              let mostActiveAgent = 'Nessuno';
              let maxAgentActivities = 0;
              Object.entries(agentCounts).forEach(([agent, count]) => {
                if (count > maxAgentActivities) {
                  maxAgentActivities = count;
                  mostActiveAgent = agent;
                }
              });

              // Month View Calculations
              const year = currentCalendarDate.getFullYear();
              const month = currentCalendarDate.getMonth();
              const firstDayOfMonth = new Date(year, month, 1);
              const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday start
              const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

              const monthDays = [];
              const prevMonthDaysTotal = new Date(year, month, 0).getDate();
              for (let i = startDayOffset - 1; i >= 0; i--) {
                monthDays.push({
                  day: prevMonthDaysTotal - i,
                  month: month === 0 ? 11 : month - 1,
                  year: month === 0 ? year - 1 : year,
                  isCurrentMonth: false,
                });
              }
              for (let i = 1; i <= totalDaysInMonth; i++) {
                monthDays.push({
                  day: i,
                  month: month,
                  year: year,
                  isCurrentMonth: true,
                });
              }
              const remainingCells = 42 - monthDays.length;
              for (let i = 1; i <= remainingCells; i++) {
                monthDays.push({
                  day: i,
                  month: month === 11 ? 0 : month + 1,
                  year: month === 11 ? year + 1 : year,
                  isCurrentMonth: false,
                });
              }

              const isEventOnDay = (event, dayDate) => {
                const start = new Date(event.inizio_evento);
                const end = event.fine_evento ? new Date(event.fine_evento) : new Date(start.getTime() + 60 * 60 * 1000);
                
                const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
                const targetDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()).getTime();
                
                return targetDay >= startDay && targetDay <= endDay;
              };

              // Week View Calculations
              const getStartOfWeek = (d) => {
                const date = new Date(d);
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6 : 1);
                return new Date(date.setDate(diff));
              };
              const startOfWeek = getStartOfWeek(currentCalendarDate);
              const weekDays = [];
              for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                weekDays.push({
                  date: d,
                  dayName: d.toLocaleDateString('it-CH', { weekday: 'short' }),
                  dayNum: d.getDate(),
                  month: d.getMonth(),
                  year: d.getFullYear()
                });
              }
              const displayDays = calendarView === 'day' ? [{
                date: currentCalendarDate,
                dayName: currentCalendarDate.toLocaleDateString('it-CH', { weekday: 'short' }),
                dayNum: currentCalendarDate.getDate(),
                month: currentCalendarDate.getMonth(),
                year: currentCalendarDate.getFullYear()
              }] : weekDays;
              const hoursList = Array.from({ length: 24 }, (_, i) => i);

              const handleAddOnDate = (d, m, y, h = 9) => {
                if (!canAddEvent()) {
                  triggerToast("Non hai i permessi per aggiungere eventi", "error");
                  return;
                }
                const monthStr = String(m + 1).padStart(2, '0');
                const dayStr = String(d).padStart(2, '0');
                const hourStr = String(h).padStart(2, '0');
                const formattedDate = `${y}-${monthStr}-${dayStr}T${hourStr}:00`;
                setCurrentVisita({
                  inizio_evento: formattedDate,
                  immobile_di_riferimento_id: '',
                  tipo_visita: 'Visita Cliente',
                  esito_e_note: 'NEUTRO',
                  cliente_id: '',
                  partecipanti: '',
                  creato_da: profile?.nome ? `${profile.nome.toUpperCase()} ${profile.cognome ? profile.cognome.toUpperCase() : ''}`.trim() : 'MASSIMILIANO BOLDI'
                });
                setSelectedVisitaImmobileId('');
                setSearchVisitaPropertyQuery('');
                setIsVisitaModalOpen(true);
              };

              const WEEKDAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
              const MONTHS_IT = [
                'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
              ];

              return (
                <div className="space-y-6 max-w-6xl mx-auto">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Pannello CRM</span>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Calendario Attività</h2>
                        {isOffline ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Offline
                          </span>
                        ) : isCRMLoading && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] animate-pulse">
                            Aggiornamento...
                          </span>
                        )}
                      </div>
                    </div>


                  </div>

                  {/* CRM Stats Widgets */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-4 rounded-2xl border border-[#E5E5EA] bg-white flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868B]">Attività Totali</span>
                      <span className="text-2xl font-black text-[#1D1D1F] mt-1">{totalActivities}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Nel periodo selezionato</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl border border-[#E5E5EA] bg-white flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868B]">Visite Clienti</span>
                      <span className="text-2xl font-black text-[#0071E3] mt-1">{customerVisits}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Sopralluoghi di vendita/affitto</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl border border-[#E5E5EA] bg-white flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868B]">Tasso Successo</span>
                      <span className="text-2xl font-black text-[#34C759] mt-1">{successRate}%</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Esiti POSITIVI su conclusi</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl border border-[#E5E5EA] bg-white flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868B]">Agente Più Attivo</span>
                      <span className="text-base font-bold text-[#1D1D1F] mt-1 truncate" title={mostActiveAgent}>
                        {mostActiveAgent}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{maxAgentActivities} attività registrate</span>
                    </div>
                  </div>

                  {/* Search Bar Row & Toggle */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-[#E5E5EA] shadow-sm">
                    <div className="flex items-center gap-3 w-full sm:flex-1">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <IconSearch />
                        </span>
                        <input
                          type="text"
                          placeholder="Cerca per immobile, esito, note..."
                          value={searchVisit}
                          onChange={(e) => setSearchVisit(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                        />
                      </div>
                      <button
                        onClick={() => setShowAdvancedCalendarFilters(!showAdvancedCalendarFilters)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                          showAdvancedCalendarFilters
                            ? 'bg-[#0071E3] text-white border-transparent'
                            : 'bg-[#F5F5F7] hover:bg-[#E5E5EA]/50 border-transparent text-[#1D1D1F]'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>Filtri</span>
                        {(filterVisitAgent !== 'Tutti' || filterVisitClient !== 'Tutti' || filterVisitProperty !== 'Tutti' || filterVisitType !== 'Tutti' || filterVisitOutcome !== 'Tutti') && (
                          <span className={`w-2 h-2 rounded-full ${showAdvancedCalendarFilters ? 'bg-white' : 'bg-[#0071E3]'}`}></span>
                        )}
                      </button>
                    </div>

                    {/* View Toggles */}
                    <div className="flex bg-[#F5F5F7] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shrink-0">
                      {[{ id: 'day', label: 'Giorno' }, { id: 'week', label: 'Settimana' }, { id: 'month', label: 'Mese' }, { id: 'list', label: 'Lista' }].map((view) => (
                        <button
                          key={view.id}
                          onClick={() => setCalendarView(view.id)}
                          className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all whitespace-nowrap ${calendarView === view.id
                              ? 'bg-white text-[#1D1D1F] shadow-sm'
                              : 'text-[#86868B] hover:text-[#1D1D1F]'
                            }`}
                        >
                          {view.id === 'day' ? '☀️ ' : view.id === 'week' ? '🗓️ ' : view.id === 'month' ? '📅 ' : '📝 '}
                          {view.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showAdvancedCalendarFilters && (
                    <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm animate-fade-in space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Agente / Dipendente */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Agente / Dipendente</label>
                          <select
                            value={filterVisitAgent}
                            onChange={(e) => setFilterVisitAgent(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          >
                            <option value="Tutti">Tutti gli agenti</option>
                            {uniqueAgents.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>

                        {/* Cliente / Lead */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Cliente / Lead</label>
                          <select
                            value={filterVisitClient}
                            onChange={(e) => setFilterVisitClient(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          >
                            <option value="Tutti">Tutti i contatti</option>
                            {contatti.map(c => (
                              <option key={c.id} value={c.id}>{c.cognome} {c.nome}</option>
                            ))}
                          </select>
                        </div>

                        {/* Proprietà */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Proprietà</label>
                          <select
                            value={filterVisitProperty}
                            onChange={(e) => setFilterVisitProperty(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          >
                            <option value="Tutti">Tutte le proprietà</option>
                            {immobili.map(i => (
                              <option key={i.id} value={i.id}>{i.nome || i.nome_immobile}</option>
                            ))}
                          </select>
                        </div>

                        {/* Tipologia */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Tipologia</label>
                          <select
                            value={filterVisitType}
                            onChange={(e) => setFilterVisitType(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          >
                            <option value="Tutti">Tutte le tipologie</option>
                            <option value="Shooting Fotografico">Shooting Fotografico</option>
                            <option value="Visita Cliente">Visita Cliente</option>
                            <option value="Primo Incontro">Primo Incontro</option>
                            <option value="Sopralluogo Tecnico">Sopralluogo Tecnico</option>
                          </select>
                        </div>

                        {/* Esito */}
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Esito</label>
                          <select
                            value={filterVisitOutcome}
                            onChange={(e) => setFilterVisitOutcome(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                          >
                            <option value="Tutti">Tutti gli esiti</option>
                            <option value="NEUTRO">Neutro</option>
                            <option value="POSITIVO">Positivo</option>
                            <option value="NEGATIVO">Negativo</option>
                          </select>
                        </div>
                      </div>

                      {(searchVisit || filterVisitAgent !== 'Tutti' || filterVisitClient !== 'Tutti' || filterVisitProperty !== 'Tutti' || filterVisitType !== 'Tutti' || filterVisitOutcome !== 'Tutti') && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSearchVisit('');
                              setFilterVisitAgent('Tutti');
                              setFilterVisitClient('Tutti');
                              setFilterVisitProperty('Tutti');
                              setFilterVisitType('Tutti');
                              setFilterVisitOutcome('Tutti');
                            }}
                            className="text-xs text-[#0071E3] hover:underline font-bold"
                          >
                            Resetta tutti i filtri ✕
                          </button>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Calendar Navigation Panel */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E5E5EA] shadow-sm">
                    {calendarView !== 'list' ? (
                      <>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => {
                              const d = new Date(currentCalendarDate);
                              if (calendarView === 'month') {
                                d.setMonth(d.getMonth() - 1);
                              } else if (calendarView === 'day') {
                                d.setDate(d.getDate() - 1);
                              } else {
                                d.setDate(d.getDate() - 7);
                              }
                              setCurrentCalendarDate(d);
                            }}
                            className="p-1.5 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-[#1D1D1F] transition-all font-bold text-xs"
                          >
                            ◀ Precedente
                          </button>
                          <button
                            onClick={() => {
                              const d = new Date(currentCalendarDate);
                              if (calendarView === 'month') {
                                d.setMonth(d.getMonth() + 1);
                              } else if (calendarView === 'day') {
                                d.setDate(d.getDate() + 1);
                              } else {
                                d.setDate(d.getDate() + 7);
                              }
                              setCurrentCalendarDate(d);
                            }}
                            className="p-1.5 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-[#1D1D1F] transition-all font-bold text-xs"
                          >
                            Successivo ▶
                          </button>
                        </div>

                        <div className="text-sm font-bold text-[#1D1D1F] capitalize">
                          {calendarView === 'month' ? (
                            `${MONTHS_IT[month]} ${year}`
                          ) : calendarView === 'day' ? (
                            currentCalendarDate.toLocaleDateString('it-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                          ) : (
                            `Settimana del ${startOfWeek.toLocaleDateString('it-CH', { day: 'numeric', month: 'short' })} ${startOfWeek.getFullYear()}`
                          )}
                        </div>

                        <button
                          onClick={() => setCurrentCalendarDate(new Date())}
                          className="px-3 py-1 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold rounded-lg text-gray-700 transition-all"
                        >
                          Oggi
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-[#1D1D1F]">
                          Elenco Completo Attività
                        </div>
                        <button
                          onClick={handleScrollToListToday}
                          className="px-3 py-1 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-semibold rounded-lg text-gray-700 transition-all flex items-center gap-1.5"
                        >
                          📅 Vai a Oggi
                        </button>
                      </>
                    )}
                  </div>

                  {/* Month View Grid */}
                  {calendarView === 'month' && (
                    <div className="bg-white rounded-3xl border border-[#E5E5EA] shadow-sm overflow-hidden">
                      <div className="grid grid-cols-7 border-b border-[#E5E5EA] bg-[#F5F5F7]">
                        {WEEKDAYS_IT.map(day => (
                          <div key={day} className="py-2 text-center text-xs font-bold text-[#86868B]">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-[#E5E5EA] min-h-[500px]">
                        {monthDays.map((dayObj, index) => {
                          const isToday = new Date().toDateString() === new Date(dayObj.year, dayObj.month, dayObj.day).toDateString();
                          
                          // Events for this day
                          const dayEvents = filteredVisite.filter(item => {
                            return isEventOnDay(item, new Date(dayObj.year, dayObj.month, dayObj.day));
                          });

                          return (
                            <div
                              key={index}
                              className={`p-1.5 flex flex-col group min-h-[85px] transition-colors relative ${
                                dayObj.isCurrentMonth ? 'bg-white' : 'bg-gray-50/50 text-gray-400'
                              } hover:bg-[#F5F5F7]`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-bold ${
                                  isToday ? 'bg-[#0071E3] text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-gray-700'
                                }`}>
                                  {dayObj.day}
                                </span>

                                <button
                                  onClick={() => handleAddOnDate(dayObj.day, dayObj.month, dayObj.year)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#0071E3] hover:underline"
                                  title="Aggiungi appuntamento in questo giorno"
                                >
                                  ＋
                                </button>
                              </div>

                              <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] custom-scrollbar">
                                 {dayEvents.map(event => {
                                   const dateObj = new Date(event.inizio_evento);
                                   const timeStr = dateObj.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });
                                   const outcomeColor = event.esito_e_note === 'POSITIVO' ? 'bg-emerald-500' : event.esito_e_note === 'NEGATIVO' ? 'bg-rose-500' : 'bg-blue-500';
                                   return (
                                     <div
                                       key={event.id}
                                       onClick={() => handleViewVisita(event)}
                                       className={`text-[9px] font-bold leading-tight px-1.5 py-0.5 rounded-md text-white cursor-pointer ${outcomeColor} truncate hover:brightness-95 transition-all flex items-center justify-between`}
                                       title={`${event.tutto_giorno ? 'Tutto il giorno' : timeStr} - ${getImmobileName(event.immobile_di_riferimento_id)} (${event.nome_evento || event.tipo_visita})`}
                                     >
                                        <span className="truncate flex items-center">
                                          <span className="bg-white/30 px-1 py-0.2 rounded-[3px] text-[7.5px] mr-1 font-black shrink-0 leading-none">
                                            {isMyEvent(event) ? 'TU' : getCreatorTag(event)}
                                          </span>
                                          <span className="truncate">
                                            {event.tutto_giorno ? '⭐ ' : `${timeStr} `}
                                            {event.nome_evento || event.tipo_visita}{event.partecipanti ? ` (${event.partecipanti})` : ''}
                                          </span>
                                        </span>
                                     </div>
                                   );
                                 })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Week/Day View Grid */}
                  {(calendarView === 'week' || calendarView === 'day') && (
                    <div className="bg-white rounded-3xl border border-[#E5E5EA] shadow-sm overflow-hidden flex flex-col">
                      {/* Grid Header */}
                      <div className={`grid border-b border-[#E5E5EA] bg-[#F5F5F7] text-center shrink-0 ${calendarView === 'day' ? 'grid-cols-2' : 'grid-cols-8'}`}>
                        <div className="py-3 text-[10px] font-bold text-[#86868B] border-r border-[#E5E5EA] flex items-center justify-center">
                          Ora
                        </div>
                        {displayDays.map((wDay, idx) => {
                          const isToday = new Date().toDateString() === wDay.date.toDateString();
                          return (
                            <div key={idx} className={`py-2 text-xs font-semibold ${isToday ? 'text-red-500' : 'text-[#1D1D1F]'}`}>
                              <div className="text-[10px] uppercase font-bold text-[#86868B]">{wDay.dayName}</div>
                              <div className={`mt-0.5 text-sm font-bold w-7 h-7 flex items-center justify-center mx-auto rounded-full ${
                                isToday ? 'bg-red-500 text-white shadow-sm' : ''
                              }`}>
                                {wDay.dayNum}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* All Day Events Row (Apple macOS Style) */}
                      <div className={`grid border-b border-[#E5E5EA] bg-gray-50/70 text-center shrink-0 divide-x divide-[#E5E5EA] ${calendarView === 'day' ? 'grid-cols-2' : 'grid-cols-8'}`}>
                        <div className="py-2 text-[9px] font-bold text-gray-400 flex items-center justify-center bg-gray-100/50 select-none">
                          tutto il giorno
                        </div>
                        {displayDays.map((wDay, dayIdx) => {
                          const isToday = new Date().toDateString() === wDay.date.toDateString();
                          
                          // All-day events for this specific day
                          const dayAllDayEvents = filteredVisite.filter(item => {
                            if (!item.tutto_giorno) return false;
                            return isEventOnDay(item, wDay.date);
                          });

                          return (
                            <div 
                              key={dayIdx} 
                              className={`p-1 min-h-[36px] flex flex-col gap-1 justify-center relative ${
                                isToday ? 'bg-[#0071E3]/2' : ''
                              }`}
                            >
                              {dayAllDayEvents.map(event => {
                                const outcomeStyles = event.esito_e_note === 'POSITIVO' 
                                  ? 'border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-800' 
                                  : event.esito_e_note === 'NEGATIVO' 
                                  ? 'border-l-4 border-rose-500 bg-rose-500/10 text-rose-800' 
                                  : 'border-l-4 border-blue-500 bg-blue-500/10 text-blue-800';

                                return (
                                  <div
                                    key={event.id}
                                    onClick={() => handleViewVisita(event)}
                                    className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${outcomeStyles} shadow-sm flex items-center gap-1 hover:scale-[0.98] transition-all truncate`}
                                    title={`Tutto il giorno: ${event.nome_evento || event.tipo_visita} - ${getImmobileName(event.immobile_di_riferimento_id)}`}
                                  >
                                    <span className="shrink-0 text-[6.5px] tracking-wider uppercase font-black px-1.5 py-0.25 bg-black/5 text-black/70 rounded-full border border-black/5 leading-none">
                                      {isMyEvent(event) ? 'Tu' : getCreatorTag(event)}
                                    </span>
                                    <span className="truncate flex-1">⭐ {event.nome_evento || event.tipo_visita}{event.partecipanti ? ` (${event.partecipanti})` : ''}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>

                      {/* Scrollable grid body */}
                      <div ref={calendarScrollRef} className="h-[550px] overflow-y-auto custom-scrollbar relative bg-white border-t border-[#E5E5EA]">
                        
                        <div className={`grid divide-x divide-[#E5E5EA] relative min-h-[1440px] ${calendarView === 'day' ? 'grid-cols-2' : 'grid-cols-8'}`}>
                          
                          {/* Column 0: Hours Labels */}
                          <div className="flex flex-col bg-gray-50/30 select-none divide-y divide-[#E5E5EA]">
                            {hoursList.map(hour => (
                              <div key={hour} className="h-[60px] py-3 text-right pr-2 text-[10px] font-semibold text-gray-400 flex items-center justify-end">
                                {String(hour).padStart(2, '0')}:00
                              </div>
                            ))}
                          </div>

                          {/* Columns 1-7: Day Columns */}
                          {displayDays.map((wDay, dayIdx) => {
                            const isToday = new Date().toDateString() === wDay.date.toDateString();
                            
                            // Filter and position events for this specific day
                            const dayEvents = filteredVisite.filter(item => {
                              if (item.tutto_giorno) return false;
                              return isEventOnDay(item, wDay.date);
                            });

                            const positionedEvents = dayEvents.map(event => {
                              const start = new Date(event.inizio_evento);
                              const end = event.fine_evento ? new Date(event.fine_evento) : new Date(start.getTime() + 60 * 60 * 1000);
                              
                              const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                              const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
                              const targetDay = new Date(wDay.year, wDay.month, wDay.dayNum).getTime();

                              let startMin = 0;
                              let endMin = 1440;

                              if (targetDay === startDay && targetDay === endDay) {
                                startMin = start.getHours() * 60 + start.getMinutes();
                                endMin = end.getHours() * 60 + end.getMinutes();
                              } else if (targetDay === startDay) {
                                startMin = start.getHours() * 60 + start.getMinutes();
                                endMin = 1440;
                              } else if (targetDay === endDay) {
                                startMin = 0;
                                endMin = end.getHours() * 60 + end.getMinutes();
                              } else {
                                startMin = 0;
                                endMin = 1440;
                              }

                              const finalEndMin = Math.max(startMin + 30, endMin);
                              return {
                                event,
                                startMin,
                                endMin: finalEndMin,
                                width: 100,
                                left: 0,
                                colIdx: 0
                              };
                            });

                            positionedEvents.sort((a, b) => a.startMin - b.startMin);

                            // Overlap grouping and column distribution
                            let groups = [];
                            positionedEvents.forEach(evt => {
                              let merged = false;
                              for (let group of groups) {
                                const overlaps = group.some(ge => !(evt.endMin <= ge.startMin || evt.startMin >= ge.endMin));
                                if (overlaps) {
                                  group.push(evt);
                                  merged = true;
                                  break;
                                }
                              }
                              if (!merged) {
                                groups.push([evt]);
                              }
                            });

                            groups.forEach(group => {
                              const groupCols = [];
                              group.forEach(evt => {
                                let colIdx = 0;
                                while (true) {
                                  if (!groupCols[colIdx]) {
                                    groupCols[colIdx] = [];
                                  }
                                  const col = groupCols[colIdx];
                                  const overlaps = col.some(ce => !(evt.endMin <= ce.startMin || evt.startMin >= ce.endMin));
                                  if (!overlaps) {
                                    col.push(evt);
                                    evt.colIdx = colIdx;
                                    break;
                                  }
                                  colIdx++;
                                }
                              });
                              const totalCols = groupCols.length;
                              group.forEach(evt => {
                                evt.width = 100 / totalCols;
                                evt.left = evt.colIdx * evt.width;
                              });
                            });

                            // Current time line calculations
                            const currentHour = new Date().getHours();
                            const currentMinute = new Date().getMinutes();
                            const lineTop = (currentHour * 60 + currentMinute);

                            return (
                              <div key={dayIdx} className={`relative min-h-[1440px] divide-y divide-[#E5E5EA]/40 ${isToday ? 'bg-[#0071E3]/2' : ''}`}>
                                
                                {/* Background click grid and lines */}
                                {hoursList.map(hour => (
                                  <div
                                    key={hour}
                                    className="h-[60px] relative border-b border-[#E5E5EA] group"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDropEvent(e, wDay.dayNum, wDay.month, wDay.year, hour)}
                                  >
                                    <button
                                      onClick={() => handleAddOnDate(wDay.dayNum, wDay.month, wDay.year, hour)}
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-[#0071E3] hover:bg-[#0071E3]/5 transition-all z-0"
                                      title={`Pianifica appuntamento alle ${hour}:00`}
                                    >
                                      ＋
                                    </button>
                                  </div>
                                ))}

                                {/* Red Time indicator line */}
                                {isToday && (
                                  <div 
                                    className="absolute left-0 right-0 border-t-2 border-red-500 pointer-events-none z-20 flex items-center"
                                    style={{ top: `${lineTop}px` }}
                                    title={`Ora corrente: ${new Date().toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}`}
                                  >
                                    <span className="w-2 h-2 rounded-full bg-red-500 -ml-1"></span>
                                  </div>
                                )}

                                {/* Absolutely Positioned Events */}
                                {positionedEvents.map(({ event, startMin, endMin, width, left }) => {
                                  const top = startMin;
                                  const height = endMin - startMin;

                                  const outcomeStyles = event.esito_e_note === 'POSITIVO' 
                                    ? 'border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-800' 
                                    : event.esito_e_note === 'NEGATIVO' 
                                    ? 'border-l-4 border-rose-500 bg-rose-500/10 text-rose-800' 
                                    : 'border-l-4 border-blue-500 bg-blue-500/10 text-blue-800';

                                  return (
                                    <div
                                      key={event.id}
                                      draggable={true}
                                      onDragStart={(e) => {
                                        if (!canModifyEvent(event)) {
                                          e.preventDefault();
                                          triggerToast("Non hai i permessi per spostare questo evento", "error");
                                          return;
                                        }
                                        e.dataTransfer.setData("text/plain", event.id);
                                        e.dataTransfer.effectAllowed = "move";
                                      }}
                                      onClick={() => handleViewVisita(event)}
                                      className={`absolute rounded-lg cursor-pointer ${outcomeStyles} shadow-sm overflow-hidden p-2 hover:scale-[0.98] transition-all flex flex-col justify-start z-10 border border-[#E5E5EA]/20 select-none`}
                                      style={{
                                        top: `${top + 1}px`,
                                        height: `${height - 2}px`,
                                        left: `${left}%`,
                                        width: `calc(${width}% - 2px)`
                                      }}
                                      title={`${event.nome_evento || event.tipo_visita} - ${getImmobileName(event.immobile_di_riferimento_id)} - Partecipanti: ${event.partecipanti || 'Nessuno'}`}
                                    >
                                      <div className="flex items-center gap-1 min-w-0 mb-0.5">
                                        <span className="shrink-0 text-[6.5px] tracking-wider uppercase font-black px-1.5 py-0.25 bg-black/5 text-black/70 rounded-full border border-black/5 leading-none">
                                          {isMyEvent(event) ? 'Tu' : getCreatorTag(event)}
                                        </span>
                                        <div className="font-bold text-[10px] leading-tight truncate flex-1">{event.nome_evento || event.tipo_visita}</div>
                                      </div>
                                      <div className="text-[8px] opacity-80 mt-0.5 truncate leading-none">{event.partecipanti || 'Senza partecipanti'}</div>
                                      {height > 40 && (
                                        <div className="text-[8px] opacity-75 mt-1 truncate leading-none font-medium">
                                          🏢 {getImmobileName(event.immobile_di_riferimento_id)}
                                        </div>
                                      )}

                                      {/* Resize Handle */}
                                      <div 
                                        className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-[#0071E3]/20 bg-transparent flex items-center justify-center select-none z-20"
                                        onMouseDown={(e) => handleResizeMouseDown(e, event)}
                                      >
                                        <div className="w-5 h-0.5 bg-gray-400/30 rounded-full"></div>
                                      </div>
                                    </div>
                                  );
                                })}

                              </div>
                            );
                          })}

                        </div>
                      </div>
                    </div>
                  )}

{/* List / Timeline View */}
                  {calendarView === 'list' && (
                    <div 
                      ref={listScrollRef} 
                      className="space-y-4 max-h-[680px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
                    >
                      {filteredVisite.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border border-[#E5E5EA] text-center text-xs text-[#86868B]">
                          Nessuna visita o appuntamento corrispondente ai filtri impostati.
                        </div>
                      ) : (() => {
                        const sortedList = [...filteredVisite].sort((a, b) => new Date(a.inizio_evento) - new Date(b.inizio_evento));
                        const todayTime = new Date().setHours(0,0,0,0);
                        const firstTodayOrFutureIdx = sortedList.findIndex(item => new Date(item.inizio_evento).getTime() >= todayTime);

                        return sortedList.map((item, idx) => {
                          const isAnchor = idx === firstTodayOrFutureIdx;
                          const startObj = new Date(item.inizio_evento);
                          const endObj = item.fine_evento ? new Date(item.fine_evento) : null;
                          const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });
                          const clienteName = getContactName(item.cliente_id);
                          const immobileName = getImmobileName(item.immobile_di_riferimento_id);
                          const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleViewVisita(item)}
                              data-today-anchor={isAnchor ? "true" : undefined}
                              className="group bg-white border border-[#E5E5EA] rounded-2xl cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
                            >
                              <div className="flex">
                                {/* Date column */}
                                <div className="w-[72px] shrink-0 flex flex-col items-center justify-center bg-[#F5F5F7] border-r border-[#E5E5EA] py-4 gap-0.5">
                                  <span className="text-[11px] font-bold uppercase text-[#86868B] tracking-wider leading-none">
                                    {startObj.toLocaleDateString('it-IT', { month: 'short' })}
                                  </span>
                                  <span className="text-[32px] font-black text-[#1D1D1F] leading-none">
                                    {startObj.toLocaleDateString('it-IT', { day: 'numeric' })}
                                  </span>
                                  <span className="text-[10px] font-semibold text-[#86868B] capitalize leading-none">
                                    {startObj.toLocaleDateString('it-IT', { weekday: 'short' })}
                                  </span>
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col gap-2.5">

                                  {/* Title + time */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <h3 className="text-[14px] font-extrabold text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors truncate">
                                        {item.nome_evento || item.tipo_visita || '—'}
                                      </h3>
                                      <span className="text-[10px] text-[#86868B] font-medium block mt-0.5">
                                        Gestito da: <span className="font-bold text-[#555]">{isMyEvent(item) ? 'Me' : (item.creato_da || 'CRM')}</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] uppercase shadow-sm ${
                                        isMyEvent(item) 
                                          ? 'bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white border border-[#0071E3]/20' 
                                          : 'bg-gradient-to-tr from-[#8E8E93] to-[#D2D2D7] text-white border border-[#8E8E93]/20'
                                      }`} title={item.creato_da || 'MASSIMILIANO BOLDI'}>
                                        {isMyEvent(item) ? 'TU' : getCreatorTag(item)}
                                      </div>
                                      {item.tutto_giorno ? (
                                        <span className="shrink-0 inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FFB74D]/30 whitespace-nowrap">
                                          ☀️ Tutto il giorno
                                        </span>
                                      ) : (
                                        <span className="shrink-0 inline-flex items-center gap-1 bg-[#E8F4FF] text-[#0071E3] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#0071E3]/20 whitespace-nowrap">
                                          🕐 {fmtTime(startObj)}{endObj ? ' → ' + fmtTime(endObj) : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Pills: cliente + partecipanti + immobile */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {/* Cliente */}
                                    <span className="inline-flex items-center gap-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#374151]">
                                      👤 {clienteName || '—'}
                                    </span>
                                    {/* Partecipanti */}
                                    {partecipantiList.length > 0 ? (
                                      partecipantiList.map((p, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8]">
                                          👥 {p}
                                        </span>
                                      ))
                                    ) : null}
                                    {/* Immobile */}
                                    {immobileName && (
                                      <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#15803D]">
                                        🏠 {immobileName}
                                      </span>
                                    )}
                                  </div>

                                  {/* Note */}
                                  {item.esito_e_note && (
                                    <p className="text-[11px] text-[#86868B] leading-relaxed line-clamp-2 border-t border-[#F5F5F7] pt-2">
                                      <span className="font-semibold text-[#6B7280]">Note: </span>
                                      {item.esito_e_note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              );
              })()}
            </div>

            {/* Global FAB (Apple Liquid Style) */}
            {['immobili', 'contatti', 'visite'].includes(activeTab) && (
              <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center group">
                {/* Liquid glow aura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0071E3] to-[#00C7FF] rounded-full blur-xl opacity-40 scale-95 group-hover:scale-125 transition-all duration-700 pointer-events-none animate-pulse" />
                
                <button
                  onClick={() => {
                    if (activeTab === 'immobili') {
                      setIsImmobileModalOpen(true);
                      setCurrentImmobile(null);
                      setActiveFormTab('principale');
                    } else if (activeTab === 'contatti') {
                      handleCreateContatto();
                    } else if (activeTab === 'visite') {
                      handleCreateVisita();
                    }
                  }}
                  className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0071E3] via-[#0077ED] to-[#00C7FF] border border-white/20 text-white shadow-[0_10px_35px_rgba(0,113,227,0.35)] hover:shadow-[0_16px_40px_rgba(0,113,227,0.55)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 hover:-translate-y-1"
                  title={
                    activeTab === 'immobili'
                      ? "Registra Nuovo Immobile"
                      : activeTab === 'contatti'
                      ? "Nuovo Contatto"
                      : "Nuovo Appuntamento"
                  }
                >
                  <svg className="w-6 h-6 transition-transform group-hover:rotate-90 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}

          </main>

          {/* ========================================================= */}
          {/* DETTAGLIO COMPLETO IMMOBILE (CON TUTTI I CAMPI CSV E TRATTINO) */}
          {/* ========================================================= */}
          {isDetailModalOpen && viewingImmobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all">
              <div className="absolute inset-0 -z-10" onClick={handleCloseImmobileDetail}></div>

              <div className="w-full md:max-w-2xl h-full bg-white/70 backdrop-blur-2xl shadow-2xl border-l border-white/30 flex flex-col animate-slide-left overflow-hidden">

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
                        onClick={handleCloseImmobileDetail}
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
                        onClick={handleCloseImmobileDetail}
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
                    { id: 'eventi', label: 'Eventi' },
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
                        <div
                          onClick={() => {
                            if (viewingImmobile.proprietario_id) {
                              const contactObj = contatti.find(c => String(c.id) === String(viewingImmobile.proprietario_id));
                              if (contactObj) {
                                const currentProperty = viewingImmobile;
                                handleCloseImmobileDetail();
                                handleViewContatto(contactObj, { type: 'immobile', item: currentProperty, tab: 'contatti' });
                              }
                            }
                          }}
                          className={`group bg-white p-3.5 rounded-2xl border border-[#E5E5EA] transition-all duration-200 ${
                            viewingImmobile.proprietario_id 
                              ? 'cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg' 
                              : ''
                          }`}
                        >
                          <span className="block text-[9px] uppercase font-bold text-[#86868B]">proprietario_oreferrente_id</span>
                          <span className={`font-bold text-sm block mt-0.5 transition-colors ${viewingImmobile.proprietario_id ? 'group-hover:text-[#0071E3]' : ''}`}>
                            {getContactName(viewingImmobile.proprietario_id)}
                          </span>
                          {viewingImmobile.proprietario_id && (
                            <div className="mt-2 text-xs text-[#86868B] space-y-0.5">
                              <p>📞 {getContactPhone(viewingImmobile.proprietario_id)}</p>
                              <p>✉️ {getContactEmail(viewingImmobile.proprietario_id)}</p>
                            </div>
                          )}
                        </div>

                        <div
                          onClick={() => {
                            if (viewingImmobile.agente_id) {
                              const contactObj = contatti.find(c => String(c.id) === String(viewingImmobile.agente_id));
                              if (contactObj) {
                                const currentProperty = viewingImmobile;
                                handleCloseImmobileDetail();
                                handleViewContatto(contactObj, { type: 'immobile', item: currentProperty, tab: 'contatti' });
                              }
                            }
                          }}
                          className={`group bg-white p-3.5 rounded-2xl border border-[#E5E5EA] transition-all duration-200 ${
                            viewingImmobile.agente_id 
                              ? 'cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg' 
                              : ''
                          }`}
                        >
                          <span className="block text-[9px] uppercase font-bold text-[#86868B]">agente_id</span>
                          <span className={`font-bold text-sm block mt-0.5 transition-colors ${viewingImmobile.agente_id ? 'group-hover:text-[#0071E3]' : ''}`}>
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

                  {/* TAB: EVENTI */}
                  {activeDetailTab === 'eventi' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Eventi a Calendario</h4>
                        {(() => {
                          const propertyEvents = visite.filter(v => Number(v.immobile_di_riferimento_id) === Number(viewingImmobile.id));
                          if (propertyEvents.length > 0) {
                            return (
                              <div className="space-y-2">
                                {propertyEvents.map(item => {
                                  const startObj = new Date(item.inizio_evento);
                                  const endObj = item.fine_evento ? new Date(item.fine_evento) : null;
                                  const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });
                                  const clienteName = getContactName(item.cliente_id);
                                  const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
                                  return (
                                    <div
                                      key={item.id}
                                      onClick={() => {
                                        const currentProperty = viewingImmobile;
                                        handleCloseImmobileDetail();
                                        handleViewVisita(item, { type: 'immobile', item: currentProperty, tab: 'eventi' });
                                      }}
                                      className="group bg-white border border-[#E5E5EA] rounded-2xl cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                    >
                                      <div className="flex">
                                        {/* Date column */}
                                        <div className="w-[68px] shrink-0 flex flex-col items-center justify-center bg-[#F5F5F7] border-r border-[#E5E5EA] py-3 gap-0.5">
                                          <span className="text-[9px] font-bold uppercase text-[#86868B] tracking-wider leading-none">
                                            {startObj.toLocaleDateString('it-IT', { month: 'short' })}
                                          </span>
                                          <span className="text-[24px] font-black text-[#1D1D1F] leading-none">
                                            {startObj.toLocaleDateString('it-IT', { day: 'numeric' })}
                                          </span>
                                          <span className="text-[9px] font-semibold text-[#86868B] capitalize leading-none">
                                            {startObj.toLocaleDateString('it-IT', { weekday: 'short' })}
                                          </span>
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1 min-w-0 px-3.5 py-3 flex flex-col gap-2">
                                          {/* Title + time */}
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                              <h5 className="text-[12px] font-extrabold text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors truncate">
                                                {item.nome_evento || item.tipo_visita || '—'}
                                              </h5>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] uppercase shadow-sm ${
                                                isMyEvent(item) 
                                                  ? 'bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white border border-[#0071E3]/20' 
                                                  : 'bg-gradient-to-tr from-[#8E8E93] to-[#D2D2D7] text-white border border-[#8E8E93]/20'
                                              }`} title={item.creato_da || 'MASSIMILIANO BOLDI'}>
                                                {isMyEvent(item) ? 'TU' : getCreatorTag(item)}
                                              </div>
                                              {item.tutto_giorno ? (
                                                <span className="shrink-0 inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FFB74D]/30 whitespace-nowrap">
                                                  ☀️ Tutto il giorno
                                                </span>
                                              ) : (
                                                <span className="shrink-0 inline-flex items-center gap-1 bg-[#E8F4FF] text-[#0071E3] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#0071E3]/20 whitespace-nowrap">
                                                  🕐 {fmtTime(startObj)}{endObj ? ' → ' + fmtTime(endObj) : ''}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Pills: cliente + partecipanti */}
                                          <div className="flex flex-wrap gap-1">
                                            {/* Cliente */}
                                            {clienteName && (
                                              <span className="inline-flex items-center gap-0.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#374151]">
                                                👤 {clienteName}
                                              </span>
                                            )}
                                            {/* Partecipanti */}
                                            {partecipantiList.length > 0 ? (
                                              partecipantiList.map((p, i) => (
                                                <span key={i} className="inline-flex items-center gap-0.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#1D4ED8]">
                                                  👥 {p}
                                                </span>
                                              ))
                                            ) : null}
                                          </div>

                                          {/* Note */}
                                          {item.esito_e_note && (
                                            <p className="text-[10px] text-[#86868B] leading-relaxed line-clamp-1 border-t border-[#F5F5F7] pt-1.5">
                                              <span className="font-semibold text-[#6B7280]">Note: </span>
                                              {item.esito_e_note}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          } else {
                            return <p className="text-xs text-[#86868B] italic">Nessun evento in calendario per questo immobile.</p>;
                          }
                        })()}
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
                    onClick={handleCloseImmobileDetail}
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
                              handleViewImmobile(imm, { type: 'contatto', item: viewingContatto });
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
                              handleViewImmobile(imm, { type: 'contatto', item: viewingContatto });
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
                        {visite.filter(v => v.cliente_id === viewingContatto.id || (v.partecipanti || '').toLowerCase().includes((viewingContatto.cognome || '').toLowerCase())).map(item => {
                          const startObj = new Date(item.inizio_evento);
                          const endObj = item.fine_evento ? new Date(item.fine_evento) : null;
                          const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });
                          const clienteName = getContactName(item.cliente_id);
                          const immobileName = getImmobileName(item.immobile_di_riferimento_id);
                          const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setIsContactDetailModalOpen(false);
                                handleViewVisita(item);
                              }}
                              className="group bg-white border border-[#E5E5EA] rounded-2xl cursor-pointer hover:border-[#0071E3]/40 hover:shadow-lg transition-all duration-200 overflow-hidden"
                            >
                              <div className="flex">
                                {/* Date column */}
                                <div className="w-[68px] shrink-0 flex flex-col items-center justify-center bg-[#F5F5F7] border-r border-[#E5E5EA] py-3 gap-0.5">
                                  <span className="text-[9px] font-bold uppercase text-[#86868B] tracking-wider leading-none">
                                    {startObj.toLocaleDateString('it-IT', { month: 'short' })}
                                  </span>
                                  <span className="text-[24px] font-black text-[#1D1D1F] leading-none">
                                    {startObj.toLocaleDateString('it-IT', { day: 'numeric' })}
                                  </span>
                                  <span className="text-[9px] font-semibold text-[#86868B] capitalize leading-none">
                                    {startObj.toLocaleDateString('it-IT', { weekday: 'short' })}
                                  </span>
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0 px-3.5 py-3 flex flex-col gap-2">
                                  {/* Title + time */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <h5 className="text-[12px] font-extrabold text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors truncate">
                                        {item.nome_evento || item.tipo_visita || '—'}
                                      </h5>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {item.tutto_giorno ? (
                                        <span className="shrink-0 inline-flex items-center gap-0.5 bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#FFB74D]/30 whitespace-nowrap">
                                          ☀️ Tutto
                                        </span>
                                      ) : (
                                        <span className="shrink-0 inline-flex items-center gap-0.5 bg-[#E8F4FF] text-[#0071E3] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#0071E3]/20 whitespace-nowrap">
                                          🕐 {fmtTime(startObj)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Pills: cliente + partecipanti + immobile */}
                                  <div className="flex flex-wrap gap-1">
                                    {/* Cliente */}
                                    <span className="inline-flex items-center gap-0.5 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#374151]">
                                      👤 {clienteName || '—'}
                                    </span>
                                    {/* Partecipanti */}
                                    {partecipantiList.length > 0 ? (
                                      partecipantiList.map((p, i) => (
                                        <span key={i} className="inline-flex items-center gap-0.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#1D4ED8]">
                                          👥 {p}
                                        </span>
                                      ))
                                    ) : null}
                                    {/* Immobile */}
                                    {immobileName && (
                                      <span className="inline-flex items-center gap-0.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#15803D]">
                                        🏠 {immobileName}
                                      </span>
                                    )}
                                  </div>

                                  {/* Note */}
                                  {item.esito_e_note && (
                                    <p className="text-[10px] text-[#86868B] leading-relaxed line-clamp-1 border-t border-[#F5F5F7] pt-1.5">
                                      <span className="font-semibold text-[#6B7280]">Note: </span>
                                      {item.esito_e_note}
                                    </p>
                                  )}
                                </div>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 lg:p-4">
              <div className="glass-modal w-full lg:max-w-md rounded-none lg:rounded-3xl shadow-2xl overflow-hidden h-full lg:h-auto lg:max-h-[90vh] flex flex-col text-[#1D1D1F]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-[#1D1D1F]">
                      Impostazioni Profilo
                    </h3>
                    <p className="text-[10px] text-[#86868B]">Gestisci i tuoi dettagli anagrafici e la foto profilo</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isProfileEditing && (
                      <button
                        type="button"
                        onClick={() => setIsProfileEditing(true)}
                        className="px-3 py-1 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full transition-all shadow-sm"
                      >
                        Modifica
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setIsUserSettingsModalOpen(false); setTempProfileFotoUrl(null); }}
                      className="w-6 h-6 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-xs text-[#86868B] hover:text-[#1D1D1F] transition-all shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveUserSettings} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Photo Section */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group">
                        {tempProfileFotoUrl || (profile?.foto && profile.foto.trim() !== '') ? (
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
                        {isProfileEditing && (
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
                        )}
                      </div>
                      {isProfileEditing && (tempProfileFotoUrl || (profile?.foto && profile.foto.trim() !== '')) && (
                        <button
                          type="button"
                          onClick={() => {
                            setTempProfileFotoUrl('');
                            triggerToast("Immagine profilo rimossa. Salva per confermare.", "info");
                          }}
                          className="text-xs text-[#FF3B30] hover:underline font-semibold"
                        >
                          Rimuovi foto
                        </button>
                      )}
                      {isProfileEditing && (
                        <span className="text-[10px] text-[#86868B]">Clicca sull'avatar per caricare una nuova foto</span>
                      )}
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
                          disabled={!isProfileEditing}
                          className={`w-full px-3.5 py-2 glass-input rounded-xl text-sm focus:outline-none focus:bg-white text-[#1D1D1F] ${
                            !isProfileEditing ? 'bg-gray-100/50 cursor-not-allowed border-transparent shadow-none text-gray-500' : ''
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#86868B] mb-1">Cognome</label>
                        <input
                          type="text"
                          name="cognome"
                          required
                          defaultValue={profile?.cognome || ''}
                          disabled={!isProfileEditing}
                          className={`w-full px-3.5 py-2 glass-input rounded-xl text-sm focus:outline-none focus:bg-white text-[#1D1D1F] ${
                            !isProfileEditing ? 'bg-gray-100/50 cursor-not-allowed border-transparent shadow-none text-gray-500' : ''
                          }`}
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
                    {!isProfileEditing && (
                      <div className="pt-2 border-t border-[#E5E5EA]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full py-2.5 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center space-x-1 border border-red-100"
                        >
                          <span>Logout Account</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions / Buttons */}
                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    {isProfileEditing ? (
                      <>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 btn-glossy text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                        >
                          Salva Impostazioni
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileEditing(false);
                            setTempProfileFotoUrl(null);
                          }}
                          className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                        >
                          Annulla
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsUserSettingsModalOpen(false)}
                        className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-semibold text-sm transition-all text-center shadow-sm"
                      >
                        Chiudi
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* 1. MODALE IMMOBILI (FORM COMPLETO PER CREAZIONE/MODIFICA) */}
          {isImmobileModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
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
                    {currentImmobile && (
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteImmobile(currentImmobile.id);
                          setIsImmobileModalOpen(false);
                        }}
                        className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-3 rounded-full font-semibold text-sm transition-all text-center"
                      >
                        Elimina Immobile
                      </button>
                    )}
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
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
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

          {/* Dettaglio inspector (Visite/Calendario) */}
          {isVisitaDetailModalOpen && viewingVisita && (() => {
            const dateObj = new Date(viewingVisita.inizio_evento);
            const endDateObj = viewingVisita.fine_evento ? new Date(viewingVisita.fine_evento) : null;
            const dateStr = dateObj.toLocaleDateString('it-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = viewingVisita.tutto_giorno 
              ? 'Tutto il giorno' 
              : `${dateObj.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}${endDateObj ? ` - ${endDateObj.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' })}` : ''}`;

            const clientObj = contatti.find(c => String(c.id) === String(viewingVisita.cliente_id));
            const propertyObj = immobili.find(imm => Number(imm.id) === Number(viewingVisita.immobile_di_riferimento_id));

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all">
                <div className="absolute inset-0 -z-10" onClick={handleCloseVisitaDetail}></div>

                <div className="w-full md:max-w-lg h-full bg-white shadow-2xl border-l border-[#E5E5EA] flex flex-col animate-slide-left overflow-hidden text-[#1D1D1F]">
                  
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868B]">Dettaglio Evento</span>
                      <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mt-0.5">
                        {viewingVisita.nome_evento || viewingVisita.tipo_visita}
                      </h3>
                    </div>
                    <button
                      onClick={handleCloseVisitaDetail}
                      className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F] transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                    
                    {/* Time details */}
                    <div className="flex items-start gap-3 bg-[#F5F5F7] p-4 rounded-2xl border border-transparent">
                      <div className="text-2xl mt-0.5">📅</div>
                      <div>
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Data e Ora</span>
                        <span className="text-sm font-bold text-[#1D1D1F] block mt-0.5">{dateStr}</span>
                        <span className="text-xs text-[#86868B] block mt-0.5">{timeStr}</span>
                      </div>
                    </div>

                    {/* Cliente details */}
                    {clientObj && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Cliente</span>
                        <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5E5EA] rounded-2xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-sm uppercase">
                              {(clientObj.nome || 'C')[0]}{(clientObj.cognome || 'L')[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#1D1D1F]">
                                {clientObj.nome} {clientObj.cognome}
                              </div>
                              {clientObj.societa && (
                                <div className="text-xs text-[#86868B]">{clientObj.societa}</div>
                              )}
                              {(clientObj.telefono || clientObj.mail) && (
                                <div className="text-[11px] text-[#86868B] mt-0.5">
                                  {clientObj.telefono} {clientObj.telefono && clientObj.mail ? ' • ' : ''} {clientObj.mail}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Partecipanti details */}
                    {viewingVisita.partecipanti && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Partecipanti</span>
                        <div className="flex flex-wrap gap-1.5 p-3.5 bg-[#F5F5F7] rounded-2xl">
                          {viewingVisita.partecipanti.split(',').map((p, idx) => (
                            <span key={idx} className="bg-white border border-[#E5E5EA] text-[#1D1D1F] text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                              👤 {p.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Property details */}
                    {propertyObj && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Immobile Collegato</span>
                        <div 
                          onClick={() => {
                            handleViewImmobile(propertyObj, { type: 'visita', item: viewingVisita });
                            setIsVisitaDetailModalOpen(false);
                          }}
                          className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden group shadow-sm flex flex-col cursor-pointer hover:border-[#0071E3]/40 hover:shadow-md transition-all duration-200"
                        >
                          <div 
                            className="h-36 bg-cover bg-center relative flex items-end"
                            style={{
                              backgroundImage: propertyObj.immagine_di_riferimento 
                                ? `url(${propertyObj.immagine_di_riferimento})` 
                                : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                            }}
                          >
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors"></div>
                            <div className="absolute top-2 left-2 flex gap-1 z-10">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase shadow-sm bg-[#0071E3] text-white`}>
                                {propertyObj.stato}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2 text-white text-xs font-bold drop-shadow-md z-10">
                              {propertyObj.comune}{propertyObj.nazione ? `, ${propertyObj.nazione}` : ''}
                            </div>
                          </div>
                          <div className="p-3.5">
                            <h4 className="font-bold text-sm text-[#1D1D1F] line-clamp-1 leading-tight group-hover:text-[#0071E3] transition-colors">
                              {propertyObj.nome_immobile}
                            </h4>
                            <p className="text-[10px] text-[#86868B] mt-0.5 truncate">
                              {propertyObj.codice_immobile} • {propertyObj.categoria}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Esito e Note details */}
                    {viewingVisita.esito_e_note && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Esito e Note Operative</span>
                        <div className="bg-[#F5F5F7] p-4 rounded-2xl text-xs text-gray-700 leading-relaxed whitespace-pre-wrap border border-transparent">
                          {viewingVisita.esito_e_note}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-[#E5E5EA] bg-[#F5F5F7] flex space-x-2">
                    {canModifyEvent(viewingVisita) && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            handleDeleteVisita(viewingVisita.id);
                            handleCloseVisitaDetail();
                          }}
                          className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-3 rounded-full font-semibold text-sm transition-all text-center"
                        >
                          Elimina
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsVisitaDetailModalOpen(false);
                            handleEditVisita(viewingVisita);
                          }}
                          className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white py-3 rounded-full font-bold text-sm transition-all text-center shadow-sm"
                        >
                          Modifica
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleCloseVisitaDetail}
                      className="flex-1 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] py-3 rounded-full font-semibold text-sm transition-all text-center"
                    >
                      Chiudi
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* 3. MODALE VISITE E APPUNTAMENTI (CALENDARIO) */}
          {isVisitaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-0 md:p-4">
              <div className="bg-white w-full max-w-2xl rounded-none md:rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden h-full md:h-[660px] flex flex-col text-[#1D1D1F]">

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
                  <div className="flex-1 overflow-y-auto p-6">
                    {currentVisita && <input type="hidden" name="id" value={currentVisita.id} />}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* COLONNA SINISTRA: Informazioni Base */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868B] pb-1 border-b border-gray-100">Dettagli Attività</h4>
                        
                        {/* Nome Evento */}
                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Evento *</label>
                          <input
                            type="text"
                            name="nome_evento"
                            required
                            placeholder="es. Visita con cliente, Sopralluogo..."
                            defaultValue={currentVisita ? (currentVisita.nome_evento || currentVisita.tipo_visita) : ''}
                            className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all"
                          />
                        </div>

                        {/* Inizio & Fine Evento */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#86868B] mb-1">Inizio Evento *</label>
                            <input
                              key={isCalendarAllDay ? "date-start" : "datetime-start"}
                              type={isCalendarAllDay ? "date" : "datetime-local"}
                              name="inizio_evento"
                              required
                              defaultValue={currentVisita ? new Date(new Date(currentVisita.inizio_evento) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, isCalendarAllDay ? 10 : 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, isCalendarAllDay ? 10 : 16)}
                              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#86868B] mb-1">Fine Evento *</label>
                            <input
                              key={isCalendarAllDay ? "date-end" : "datetime-end"}
                              type={isCalendarAllDay ? "date" : "datetime-local"}
                              name="fine_evento"
                              required
                              defaultValue={currentVisita && currentVisita.fine_evento ? new Date(new Date(currentVisita.fine_evento) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, isCalendarAllDay ? 10 : 16) : (() => {
                                const baseDate = currentVisita ? new Date(currentVisita.inizio_evento) : new Date();
                                const offsetMultiplier = isCalendarAllDay ? 0 : 60 * 60 * 1000;
                                const nextDate = new Date(baseDate.getTime() + offsetMultiplier);
                                return new Date(nextDate - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, isCalendarAllDay ? 10 : 16);
                              })()}
                              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all"
                            />
                          </div>
                        </div>

                        {/* Tutto il giorno checkbox */}
                        <div className="flex items-center space-x-2 bg-[#F5F5F7] p-2.5 rounded-xl border border-transparent">
                          <input
                            type="checkbox"
                            id="tutto_giorno"
                            name="tutto_giorno"
                            checked={isCalendarAllDay}
                            onChange={(e) => setIsCalendarAllDay(e.target.checked)}
                            className="rounded text-[#0071E3] focus:ring-[#0071E3] w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="tutto_giorno" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                            📅 Tutto il giorno (senza orario)
                          </label>
                        </div>

                        {/* Esito (Testo Lungo) */}
                        <div>
                          <label className="block text-xs font-semibold text-[#86868B] mb-1">Esito e Note Operative</label>
                          <textarea
                            name="esito_e_note"
                            rows="4"
                            placeholder="Inserisci l'esito dettagliato, note o feedback dell'evento..."
                            defaultValue={currentVisita ? currentVisita.esito_e_note : ''}
                            className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* COLONNA DESTRA: Relazioni e Target */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868B] pb-1 border-b border-gray-100">Associazioni</h4>

                        {/* Cliente */}
                        <div className="relative">
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-[#86868B]">Cliente</label>
                            {!selectedCalendarClientId && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingContactForVisit('cliente');
                                  handleCreateContatto();
                                }}
                                className="text-[10px] font-bold text-[#0071E3] hover:underline"
                              >
                                + Nuovo Contatto
                              </button>
                            )}
                          </div>
                          
                          {selectedCalendarClientId ? (
                            (() => {
                              const selectedClient = contatti.find(c => String(c.id) === String(selectedCalendarClientId));
                              if (!selectedClient) {
                                return (
                                  <div className="flex items-center justify-between p-3 bg-white border border-dashed border-[#E5E5EA] rounded-xl text-xs text-gray-400">
                                    <span>Cliente non trovato</span>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCalendarClientId('')}
                                      className="text-red-500 font-bold hover:underline"
                                    >
                                      Rimuovi
                                    </button>
                                  </div>
                                );
                              }
                              const rolesStr = Array.isArray(selectedClient.ruolo) ? selectedClient.ruolo.join(', ') : (selectedClient.ruolo || '');
                              return (
                                <div className="flex items-center justify-between p-3 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl hover:border-[#D2D2D7] transition-all">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-xs uppercase">
                                      {(selectedClient.nome || 'C')[0]}{(selectedClient.cognome || 'L')[0]}
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-[#1D1D1F]">
                                        {selectedClient.cognome} {selectedClient.nome}
                                      </div>
                                      {selectedClient.societa && (
                                        <div className="text-[10px] text-[#86868B]">{selectedClient.societa}</div>
                                      )}
                                      {rolesStr && (
                                        <div className="text-[9px] text-[#86868B] bg-white border border-[#E5E5EA] px-1.5 py-0.5 rounded-full inline-block mt-0.5 font-medium">
                                          {rolesStr}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCalendarClientId('');
                                      setSearchVisitClientQuery('');
                                    }}
                                    className="w-6 h-6 rounded-full hover:bg-white border border-[#D2D2D7] flex items-center justify-center text-[#86868B] hover:text-red-500 transition-all text-xs"
                                    title="Rimuovi cliente"
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="🔍 Cerca cliente per nome o ruolo..."
                                value={searchVisitClientQuery}
                                onChange={(e) => setSearchVisitClientQuery(e.target.value)}
                                onFocus={() => setIsClientSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsClientSearchFocused(false), 200)}
                                className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all"
                              />

                              {isClientSearchFocused && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-2xl shadow-xl max-h-60 overflow-y-auto z-[60] p-1.5 space-y-1">
                                  {(() => {
                                    const filtered = contatti.filter(c => {
                                      const qParts = searchVisitClientQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
                                      if (qParts.length === 0) return true;
                                      const nome = (c.nome || '').toLowerCase();
                                      const cognome = (c.cognome || '').toLowerCase();
                                      const societa = (c.societa || '').toLowerCase();
                                      const rolesStr = (Array.isArray(c.ruolo) ? c.ruolo.join(' ') : (c.ruolo || '')).toLowerCase();
                                      return qParts.every(part =>
                                        nome.includes(part) ||
                                        cognome.includes(part) ||
                                        societa.includes(part) ||
                                        rolesStr.includes(part)
                                      );
                                    });

                                    if (filtered.length === 0) {
                                      return (
                                        <div className="p-3 text-center text-xs text-[#86868B]">
                                          Nessun contatto trovato
                                          <button
                                            type="button"
                                            onMouseDown={() => {
                                              setAddingContactForVisit('cliente');
                                              handleCreateContatto();
                                            }}
                                            className="block mx-auto mt-2 text-xs font-bold text-[#0071E3] hover:underline"
                                          >
                                            + Crea come nuovo contatto
                                          </button>
                                        </div>
                                      );
                                    }

                                    return (
                                      <>
                                        {filtered.map(c => {
                                          const rolesStr = Array.isArray(c.ruolo) ? c.ruolo.join(', ') : (c.ruolo || '');
                                          return (
                                            <button
                                              key={c.id}
                                              type="button"
                                              onMouseDown={() => {
                                                setSelectedCalendarClientId(c.id);
                                                setSearchVisitClientQuery('');
                                              }}
                                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#F5F5F7] transition-all flex flex-col gap-0.5"
                                            >
                                              <span className="font-bold text-[#1D1D1F]">{c.cognome} {c.nome}</span>
                                              {(c.societa || rolesStr) && (
                                                <span className="text-[10px] text-[#86868B]">
                                                  {c.societa}{c.societa && rolesStr ? ' - ' : ''}{rolesStr}
                                                </span>
                                              )}
                                            </button>
                                          );
                                        })}
                                        <div className="border-t border-gray-100 pt-1 mt-1">
                                          <button
                                            type="button"
                                            onMouseDown={() => {
                                              setAddingContactForVisit('cliente');
                                              handleCreateContatto();
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0071E3] hover:bg-[#0071E3]/5 transition-all"
                                          >
                                            + Aggiungi Nuovo Contatto...
                                          </button>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Partecipanti */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-[#86868B]">Partecipanti</label>
                            <button
                              type="button"
                              onClick={() => {
                                setAddingContactForVisit('partecipanti');
                                handleCreateContatto();
                              }}
                              className="text-[10px] font-bold text-[#0071E3] hover:underline"
                            >
                              + Nuovo Contatto
                            </button>
                          </div>

                          {/* Pill list of active participants */}
                          <div className="flex flex-wrap gap-1.5 mb-2 max-h-20 overflow-y-auto">
                            {selectedCalendarParticipantIds.length === 0 ? (
                              <span className="text-[10px] text-gray-400 italic">Nessun partecipante aggiunto</span>
                            ) : (
                              selectedCalendarParticipantIds.map(cid => {
                                const match = contatti.find(c => String(c.id) === String(cid));
                                if (!match) return null;
                                return (
                                  <span key={cid} className="inline-flex items-center gap-1 bg-[#0071E3]/10 text-[#0071E3] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                    {match.nome || ''} {match.cognome || ''}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCalendarParticipantIds(prev => prev.filter(id => String(id) !== String(cid)))}
                                      className="hover:text-red-500 font-bold ml-0.5"
                                    >
                                      ✕
                                    </button>
                                  </span>
                                );
                              })
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              placeholder="🔍 Cerca partecipanti da aggiungere..."
                              value={searchVisitParticipantQuery}
                              onChange={(e) => setSearchVisitParticipantQuery(e.target.value)}
                              onFocus={() => setIsParticipantSearchFocused(true)}
                              onBlur={() => setTimeout(() => setIsParticipantSearchFocused(false), 200)}
                              className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none text-[#1D1D1F] hover:bg-[#E5E5EA]/50 focus:bg-white focus:border-[#0071E3] transition-all"
                            />

                            {isParticipantSearchFocused && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-2xl shadow-xl max-h-60 overflow-y-auto z-[60] p-1.5 space-y-1">
                                {(() => {
                                  const filtered = contatti
                                    .filter(c => !selectedCalendarParticipantIds.map(String).includes(String(c.id)))
                                    .filter(c => {
                                      const qParts = searchVisitParticipantQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
                                      if (qParts.length === 0) return true;
                                      const nome = (c.nome || '').toLowerCase();
                                      const cognome = (c.cognome || '').toLowerCase();
                                      const societa = (c.societa || '').toLowerCase();
                                      const rolesStr = (Array.isArray(c.ruolo) ? c.ruolo.join(' ') : (c.ruolo || '')).toLowerCase();
                                      return qParts.every(part =>
                                        nome.includes(part) ||
                                        cognome.includes(part) ||
                                        societa.includes(part) ||
                                        rolesStr.includes(part)
                                      );
                                    });

                                  if (filtered.length === 0) {
                                    return (
                                      <div className="p-3 text-center text-xs text-[#86868B]">
                                        Nessun contatto trovato
                                        <button
                                          type="button"
                                          onMouseDown={() => {
                                            setAddingContactForVisit('partecipanti');
                                            handleCreateContatto();
                                          }}
                                          className="block mx-auto mt-2 text-xs font-bold text-[#0071E3] hover:underline"
                                        >
                                          + Crea come nuovo contatto
                                        </button>
                                      </div>
                                    );
                                  }

                                  return (
                                    <>
                                      {filtered.map(c => {
                                        const rolesStr = Array.isArray(c.ruolo) ? c.ruolo.join(', ') : (c.ruolo || '');
                                        return (
                                          <button
                                            key={c.id}
                                            type="button"
                                            onMouseDown={() => {
                                              const parsedVal = isNaN(Number(c.id)) ? c.id : Number(c.id);
                                              if (!selectedCalendarParticipantIds.map(String).includes(String(parsedVal))) {
                                                setSelectedCalendarParticipantIds(prev => [...prev, parsedVal]);
                                              }
                                              setSearchVisitParticipantQuery('');
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#F5F5F7] transition-all flex flex-col gap-0.5"
                                          >
                                            <span className="font-bold text-[#1D1D1F]">{c.cognome} {c.nome}</span>
                                            {(c.societa || rolesStr) && (
                                              <span className="text-[10px] text-[#86868B]">
                                                {c.societa}{c.societa && rolesStr ? ' - ' : ''}{rolesStr}
                                              </span>
                                            )}
                                          </button>
                                        );
                                      })}
                                      <div className="border-t border-gray-100 pt-1 mt-1">
                                        <button
                                          type="button"
                                          onMouseDown={() => {
                                            setAddingContactForVisit('partecipanti');
                                            handleCreateContatto();
                                          }}
                                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0071E3] hover:bg-[#0071E3]/5 transition-all"
                                        >
                                          + Aggiungi Nuovo Contatto...
                                        </button>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Immobile in Oggetto */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-[#86868B]">Immobile di Riferimento</label>
                            {!selectedVisitaImmobileId && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingPropertyForVisit(true);
                                  setCurrentImmobile(null);
                                  setActiveFormTab('principale');
                                  setIsImmobileModalOpen(true);
                                }}
                                className="text-[10px] font-bold text-[#0071E3] hover:underline"
                              >
                                + Nuovo Immobile
                              </button>
                            )}
                          </div>
                          <input type="hidden" name="immobile_di_riferimento_id" value={selectedVisitaImmobileId} />

                          {selectedVisitaImmobileId ? (
                            (() => {
                              const selectedImm = immobili.find(imm => Number(imm.id) === Number(selectedVisitaImmobileId));
                              if (!selectedImm) return null;
                              return (
                                <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden hover:border-[#0071E3] transition-all group shadow-sm flex flex-col">
                                  {/* Header Image */}
                                  <div 
                                    className="h-32 bg-cover bg-center relative flex items-end"
                                    style={{
                                      backgroundImage: selectedImm.immagine_di_riferimento 
                                        ? `url(${selectedImm.immagine_di_riferimento})` 
                                        : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-black/15"></div>
                                    
                                    {/* Floating ✕ Button to Deselect/Change */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedVisitaImmobileId('');
                                        setSearchVisitaPropertyQuery('');
                                      }}
                                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-sm text-[#1D1D1F] hover:text-red-500 hover:scale-105 transition-all shadow-md z-30 animate-fade-in"
                                      title="Rimuovi immobile"
                                    >
                                      ✕
                                    </button>
                                    
                                    <div className="absolute top-2 left-2 flex gap-1 z-10 flex-wrap">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase shadow-sm ${selectedImm.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                                          selectedImm.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                                            selectedImm.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' : 'bg-[#0071E3] text-white'
                                        }`}>
                                        {selectedImm.stato}
                                      </span>
                                      <span className="bg-black/40 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[8px] font-semibold tracking-wide shadow-sm">
                                        {selectedImm.categoria}
                                      </span>
                                    </div>
                                    
                                    <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold drop-shadow-md z-10">
                                      {selectedImm.comune}{selectedImm.nazione ? `, ${selectedImm.nazione}` : ''}
                                    </div>
                                    
                                    <span className="absolute bottom-2 right-2 bg-[#0071E3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                                      {selectedImm.immobile_in ? selectedImm.immobile_in.join(' / ') : ''}
                                    </span>
                                  </div>

                                  {/* Details */}
                                  <div className="p-3.5 space-y-3">
                                    <div className="min-w-0">
                                      <h4 className="font-bold text-sm text-[#1D1D1F] line-clamp-1 leading-tight group-hover:text-[#0071E3] transition-colors">
                                        {selectedImm.nome_immobile}
                                      </h4>
                                      <p className="text-[10px] text-[#86868B] leading-snug line-clamp-2 mt-0.5">
                                        {selectedImm.descrizione_immobile}
                                      </p>
                                    </div>

                                    {/* Tech Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-1 border-t border-b border-[#F5F5F7] py-1.5 text-center">
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Codice</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{selectedImm.codice_immobile || 'N/D'}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Locali</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">{selectedImm.numero_di_locali}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-medium text-[#86868B] uppercase tracking-wider">Superficie</span>
                                        <span className="text-[9px] font-semibold text-[#1D1D1F]">
                                          {selectedImm.superficie_abitabile ? `${selectedImm.superficie_abitabile} m²` : '—'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-sm font-extrabold text-[#0071E3]">
                                      {Number(selectedImm.prezzo_di_vendita) > 0 
                                        ? `CHF ${Number(selectedImm.prezzo_di_vendita).toLocaleString('it-CH')}` 
                                        : `CHF ${Number(selectedImm.prezzo_di_affitto).toLocaleString('it-CH')}/mese`
                                      }
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="🔍 Cerca immobile per nome, codice o comune..."
                                value={searchVisitaPropertyQuery}
                                onChange={(e) => setSearchVisitaPropertyQuery(e.target.value)}
                                onFocus={() => setIsPropertySearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsPropertySearchFocused(false), 200)}
                                className="w-full px-2.5 py-1.5 bg-[#F5F5F7] border border-transparent rounded-lg text-xs focus:outline-none focus:border-[#0071E3] transition-all text-[#1D1D1F]"
                              />

                              {isPropertySearchFocused && (
                                <div className="max-h-60 overflow-y-auto border border-[#E5E5EA] rounded-2xl p-2 bg-[#F5F5F7] flex flex-col gap-2">
                                  {immobili.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic text-center py-4">Nessun immobile a catalogo</p>
                                  ) : (
                                    (() => {
                                      const filtered = immobili.filter(imm => 
                                        (imm.nome_immobile || '').toLowerCase().includes(searchVisitaPropertyQuery.toLowerCase()) || 
                                        (imm.comune || '').toLowerCase().includes(searchVisitaPropertyQuery.toLowerCase()) ||
                                        (imm.codice_immobile || '').toLowerCase().includes(searchVisitaPropertyQuery.toLowerCase())
                                      );
                                      if (filtered.length === 0) return <p className="text-xs text-gray-400 italic text-center py-4">Nessun risultato</p>;
                                      return filtered.map(imm => (
                                        <div
                                          key={imm.id}
                                          onClick={() => {
                                            setSelectedVisitaImmobileId(imm.id);
                                            setIsPropertySearchFocused(false);
                                          }}
                                          className="bg-white p-2 rounded-xl border border-gray-200 flex items-center gap-3 cursor-pointer hover:border-[#0071E3] hover:shadow-md transition-all group"
                                        >
                                          <div 
                                            className="w-14 h-14 rounded-lg bg-cover bg-center shrink-0 border border-gray-100"
                                            style={{
                                              backgroundImage: imm.immagine_di_riferimento 
                                                ? `url(${imm.immagine_di_riferimento})` 
                                                : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
                                            }}
                                          />
                                          <div className="text-xs leading-tight min-w-0 flex-1">
                                            <span className="font-bold text-[#1D1D1F] block truncate group-hover:text-[#0071E3] transition-colors">
                                              {imm.nome_immobile}
                                            </span>
                                            <span className="block text-[10px] text-[#86868B] mt-0.5">
                                              {imm.comune} • {imm.codice_immobile}
                                            </span>
                                            <span className="block text-[10px] text-[#0071E3] font-semibold mt-0.5">
                                              {Number(imm.prezzo_di_vendita) > 0 
                                                ? `CHF ${Number(imm.prezzo_di_vendita).toLocaleString('it-CH')}` 
                                                : `CHF ${Number(imm.prezzo_di_affitto).toLocaleString('it-CH')}/mese`
                                              }
                                              {Number(imm.numero_di_locali) > 0 && ` • ${imm.numero_di_locali} Locali`}
                                              {Number(imm.superficie_abitabile) > 0 && ` • ${imm.superficie_abitabile} m²`}
                                            </span>
                                          </div>
                                        </div>
                                      ));
                                    })()
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Agent selection (hidden/pre-filled default) */}
                    <input type="hidden" name="creato_da" value={currentVisita ? currentVisita.creato_da : (profile?.nome ? `${profile.nome.toUpperCase()} ${profile.cognome ? profile.cognome.toUpperCase() : ''}`.trim() : 'MASSIMILIANO BOLDI')} />

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

          <nav className="flex md:hidden fixed bottom-4 left-4 right-4 h-16 bg-[#1C1C1E]/65 backdrop-blur-2xl border border-white/15 rounded-full justify-around items-center z-40 px-2 shadow-2xl max-w-lg mx-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
              { id: 'immobili', label: 'Immobili', icon: <IconImmobili /> },
              { id: 'contatti', label: 'Contatti', icon: <IconContatti /> },
              { id: 'visite', label: 'Visite', icon: <IconCalendario /> },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-300 ${
                    isActive ? 'text-white font-bold scale-105 bg-white/10 shadow-sm' : 'text-[#8E8E93] hover:text-white'
                  }`}
                  style={{ minWidth: '70px' }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {tab.icon}
                  </div>
                  <span className="text-[9px] font-medium tracking-tight mt-0.5">{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      )}

    </div>
  );
}