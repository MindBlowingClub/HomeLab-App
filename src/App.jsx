import { supabase, isRealSupabase } from './supabaseClient';
import { useState, useEffect } from 'react';

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

const getStatoColor = (stato) => {
  switch (stato) {
    case 'Disponibile': return 'bg-[#34C759] text-white';
    case 'In Trattativa': return 'bg-[#FF9500] text-white';
    case 'Venduto': return 'bg-[#FF3B30] text-white';
    case 'Affittato': return 'bg-[#0071E3] text-white';
    default: return 'bg-[#86868B] text-white';
  }
};

const getMandatoColor = (mandato) => {
  switch (mandato) {
    case 'Si': return 'bg-[#34C759] text-white';
    case 'Stand By': return 'bg-[#FF9500] text-white';
    case 'No': return 'bg-[#FF3B30] text-white';
    default: return 'bg-[#86868B] text-white';
  }
};

// --- INITIAL MOCK DATA FROM REAL CSVs ---
const INITIAL_CONTATTI = [
  {
    id: 1,
    cognome: "Honchar",
    nome: "Olga",
    societa: "HOME LAB Real Estate Sagl",
    ruolo: "Agente Immobiliare",
    telefono: "+41 79 533 74 19",
    mail: "o.honchar@homelabrealestate.ch",
    note: "Agente principale di riferimento per le proprietà di alto standing a Lugano."
  },
  {
    id: 2,
    cognome: "Iannone",
    nome: "Andrea",
    societa: "",
    ruolo: "Proprietario, Locatore",
    telefono: "+41 76 458 29 29",
    mail: "a.iannone@exclusive-properties.ch",
    note: "Proprietario dell'appartamento esclusivo con piscina a Bissone."
  },
  {
    id: 3,
    cognome: "Boldi",
    nome: "Massimiliano",
    societa: "HOME LAB Real Estate Sagl",
    ruolo: "Intermediario",
    telefono: "+41 79 457 95 58",
    mail: "m.boldi@homelabrealestate.ch",
    note: "Gestore delle relazioni con i clienti e procacciatore d'affari."
  },
  {
    id: 4,
    cognome: "Cau",
    nome: "Stefano",
    societa: "Design Addict",
    ruolo: "Fotografo",
    telefono: "+41 76 526 28 82",
    mail: "studio@designaddict.ch",
    note: "Fotografo professionista specializzato in architettura d'interni e video droni."
  },
  {
    id: 5,
    cognome: "Kogan Amaro",
    nome: "Julio",
    societa: "",
    ruolo: "Cliente",
    telefono: "+41 78 991 12 23",
    mail: "j.kogan@vip-invest.ch",
    note: "Potenziale acquirente interessato ad attici di lusso con vista lago."
  }
];

const INITIAL_IMMOBILI = [
  {
    id: 101,
    nome_immobile: "#0001-ESCLUSIVA PROPRIETÀ VISTA LAGO A CADEMARIO",
    codice_immobile: "#1",
    stato: "Disponibile",
    immobile_in: "Vendita",
    mandato_firmato: "Si",
    tipo_di_mandato: "In Esclusiva",
    prezzo_vendita: 3450000,
    prezzo_affitto: 0,
    indirizzo: "Via Cantonale 45",
    comune: "Cademario",
    npa: "6936",
    nazione: "Svizzera",
    categoria: "Villa",
    tipo: "Moderno",
    superficie_abitabile: 320,
    superficie_sul: 380,
    locali: "6.5",
    bagni: "4",
    anno: 2018,
    rinnovo: 2024,
    garage: true,
    parcheggio: true,
    mappale: "1024",
    lafe: true, // Vendibile a stranieri
    rasi: true,
    radon: false,
    descrizione: "Stupenda villa minimalista con piscina a sfioro riscaldata, esposizione solare ottimale e vista mozzafiato a 180 gradi sul Lago di Lugano.",
    proprietario_id: 2,
    agente_id: 1,
    // Nuovi campi dal CSV
    tipo_residenza: "Secondaria",
    estratto_registro_fondiario: "RF-Cademario-1024.pdf",
    descrittivo_tecnico: "DT-Cademario-Completo.pdf",
    regolamento_condominiale: "", // Campo vuoto per testare il trattino (-)
    spese_condominiali: 0,
    assicurazione_stabile: "ECA Ticino - CHF 1'200/anno",
    verbale_ultima_assemblea: "",
    fondo_rinnovamento: 0,
    valore_di_stima: 3100000,
    piano_assegnazioni: "Piano_Posteggi_Cademario.pdf",
    fotografie: "https://homelab.ch/foto-cademario",
    link_cartella_doc: "https://dropbox.com/homelab/cademario",
    note_interne: "Trattativa riservata. Verificare disponibilità LAFE prima di procedere.",
    creato_da: "OLGA HONCHAR",
    ultima_modifica_il: "2026-05-26",
    ultima_modifica_fatta_da: "MASSIMILIANO BOLDI",
    immagine_di_riferimento: null,
    mandato: null
  },
  {
    id: 102,
    nome_immobile: "#0006-PRESTIGIOSO 3.5 LOCALI CON FINITURE DI ALTO STANDING",
    codice_immobile: "#6",
    stato: "Disponibile",
    immobile_in: "Affitto",
    mandato_firmato: "Si",
    tipo_di_mandato: "Non in Esclusiva",
    prezzo_vendita: 0,
    prezzo_affitto: 3100,
    indirizzo: "Via San Salvatore 12",
    comune: "Paradiso",
    npa: "6900",
    nazione: "Svizzera",
    categoria: "Appartamento",
    tipo: "Moderno",
    superficie_abitabile: 110,
    superficie_sul: 125,
    locali: "3.5",
    bagni: "2",
    anno: 2021,
    rinnovo: 0,
    garage: true,
    parcheggio: false,
    mappale: "411",
    lafe: true,
    rasi: true,
    radon: true,
    descrizione: "Elegante appartamento situato a pochi passi dal lungolago. Dotato di domotica integrata, riscaldamento a pavimento e cantina vinicola privata.",
    proprietario_id: 2,
    agente_id: 1,
    // Nuovi campi dal CSV
    tipo_residenza: "Primaria",
    estratto_registro_fondiario: "RF-Paradiso-411.pdf",
    descrittivo_tecnico: "",
    regolamento_condominiale: "Regolamento_Condo_Paradiso_2021.pdf",
    spese_condominiali: 450,
    assicurazione_stabile: "Assicurazione Stabile Allianz",
    verbale_ultima_assemblea: "Verbale_Assemblea_Paradiso_2025.pdf",
    fondo_rinnovamento: 15000,
    valore_di_stima: 0,
    piano_assegnazioni: "",
    fotografie: "https://homelab.ch/foto-paradiso",
    link_cartella_doc: "https://dropbox.com/homelab/paradiso",
    note_interne: "Inquilino attuale lascia a fine settembre 2026. Preavviso visite 48h.",
    creato_da: "OLGA HONCHAR",
    ultima_modifica_il: "2026-05-12",
    ultima_modifica_fatta_da: "OLGA HONCHAR",
    immagine_di_riferimento: null,
    mandato: null
  },
  {
    id: 103,
    nome_immobile: "#0007-ESCLUSIVO APPARTAMENTO CON PISCINA E GIARDINO VISTA LAGO",
    codice_immobile: "#7",
    stato: "In Trattativa",
    immobile_in: "Vendita",
    mandato_firmato: "Si",
    tipo_di_mandato: "In Esclusiva",
    prezzo_vendita: 2850000,
    prezzo_affitto: 0,
    indirizzo: "Via Riviera 8",
    comune: "Bissone",
    npa: "6816",
    nazione: "Svizzera",
    categoria: "Appartamento",
    tipo: "Duplex",
    superficie_abitabile: 240,
    superficie_sul: 325,
    locali: "5.5",
    bagni: "4",
    anno: 2015,
    rinnovo: 2023,
    garage: true,
    parcheggio: true,
    mappale: "902",
    lafe: false,
    rasi: true,
    radon: false,
    descrizione: "Meravigliosa proprietà bilivello con giardino privato pianeggiante, terrazza panoramica e accesso directo alla darsena condominiale.",
    proprietario_id: 2,
    agente_id: 1,
    // Nuovi campi dal CSV
    tipo_residenza: "Secondaria",
    estratto_registro_fondiario: "RF-Bissone-902.pdf",
    descrittivo_tecnico: "Descrittivo_Bissone_2015.pdf",
    regolamento_condominiale: "Regolamento_Bissone.pdf",
    spese_condominiali: 800,
    assicurazione_stabile: "Generali Stabili",
    verbale_ultima_assemblea: "Verbale_2025_Bissone.pdf",
    fondo_rinnovamento: 45000,
    valore_di_stima: 2600000,
    piano_assegnazioni: "Assegnazione_Posti_Auto_Darsena.pdf",
    fotografie: "https://homelab.ch/foto-bissone",
    link_cartella_doc: "https://dropbox.com/homelab/bissone",
    note_interne: "Offerta in corso a CHF 2'700'000 da parte di cliente estero.",
    creato_da: "MASSIMILIANO BOLDI",
    ultima_modifica_il: "2026-05-20",
    ultima_modifica_fatta_da: "OLGA HONCHAR",
    immagine_di_riferimento: null,
    mandato: null
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
    cliente_id: 4, // Stefano Cau (Fotografo)
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States representing database tables
  const [immobili, setImmobili] = useState(INITIAL_IMMOBILI);
  const [contatti, setContatti] = useState(INITIAL_CONTATTI);
  const [visite, setVisite] = useState(INITIAL_VISITE);

  // States for form multi-select fields
  const [formImmobileIn, setFormImmobileIn] = useState([]);
  const [formTipi, setFormTipi] = useState([]);
  const [formResidenze, setFormResidenze] = useState([]);

  // States for file uploads and previews
  const [selectedImmagineFile, setSelectedImmagineFile] = useState(null);
  const [selectedMandatoFile, setSelectedMandatoFile] = useState(null);
  const [immaginePreviewUrl, setImmaginePreviewUrl] = useState(null);
  const [mandatoPreviewUrl, setMandatoPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  async function fetchData() {
    try {
      const { data: contattiData, error: contattiError } = await supabase
        .from('contatti')
        .select('*')
        .order('id', { ascending: true });
      if (contattiError) throw contattiError;
      if (contattiData) setContatti(contattiData);

      const { data: immobiliData, error: immobiliError } = await supabase
        .from('immobili')
        .select('*')
        .order('id', { ascending: true });
      if (immobiliError) throw immobiliError;
      if (immobiliData) setImmobili(immobiliData);

      const { data: visiteData, error: visiteError } = await supabase
        .from('visite')
        .select('*')
        .order('id', { ascending: true });
      if (visiteError) throw visiteError;
      if (visiteData) setVisite(visiteData);

      triggerToast("Dati sincronizzati con Supabase", "success");
    } catch (error) {
      console.error("Errore di sincronizzazione Supabase:", error);
      triggerToast("Errore di connessione Supabase. Uso dati locali.", "error");
    }
  }

  useEffect(() => {
    if (isRealSupabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, []);

  // Search & Filter states
  const [searchProperty, setSearchProperty] = useState('');
  const [filterPropertyType, setFilterPropertyType] = useState('Tutti');
  const [searchContact, setSearchContact] = useState('');
  const [filterContactRuolo, setFilterContactRuolo] = useState('Tutti');
  const [searchVisit, setSearchVisit] = useState('');

  // Editing modal states
  const [currentImmobile, setCurrentImmobile] = useState(null);
  const [isImmobileModalOpen, setIsImmobileModalOpen] = useState(false);

  // Viewing Detail modal state (Immobili)
  const [viewingImmobile, setViewingImmobile] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Active Tab within the Immobile Detail Inspector (macOS-style)
  const [activeDetailTab, setActiveDetailTab] = useState('generale');

  // Viewing Contact Detail modal state (Contatti)
  const [viewingContatto, setViewingContatto] = useState(null);
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false);

  const [currentContatto, setCurrentContatto] = useState(null);
  const [isContattoModalOpen, setIsContattoModalOpen] = useState(false);

  const [currentVisita, setCurrentVisita] = useState(null);
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);

  // Toast State for User feedback (Apple Notification style)
  const [toast, setToast] = useState(null);



  function triggerToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  // --- MOCKUP VALUE RENDERER WITH TRATTINO (-) FALLBACK ---
  const formatField = (value, unit = "", isCurrency = false) => {
    if (value === undefined || value === null || value === "" || value === 0 || value === "0" || value === false) {
      return <span className="text-gray-400 font-normal italic">-</span>;
    }
    if (typeof value === 'boolean') {
      return value ? "Sì" : "No";
    }
    if (isCurrency) {
      return `CHF ${Number(value).toLocaleString('it-CH')}`;
    }
    return `${value.toLocaleString('it-CH')} ${unit}`.trim();
  };

  // --- HANDLERS FOR IMMOBILI ---
  const handleSaveImmobile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const idVal = formData.get('id');
    const id = idVal ? parseInt(idVal) : null;
    
    let rawCodice = formData.get('codice_immobile') || '';
    if (rawCodice && !rawCodice.toString().startsWith('#')) {
      rawCodice = '#' + rawCodice;
    }
    const codice_immobile = rawCodice || (id ? `#${String(id).slice(-3)}` : `#${String(Date.now()).slice(-3)}`);

    setIsUploading(true);

    try {
      let finalImmagineUrl = currentImmobile ? currentImmobile.immagine_di_riferimento : null;
      let finalMandatoUrl = currentImmobile ? currentImmobile.mandato : null;

      // 1. Upload immagine_di_riferimento if selected
      if (selectedImmagineFile) {
        if (isRealSupabase) {
          const fileName = `${Date.now()}_img_${selectedImmagineFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          finalImmagineUrl = await uploadFileToSupabase(selectedImmagineFile, 'immobili-files', fileName);
        } else {
          // Local simulate
          finalImmagineUrl = URL.createObjectURL(selectedImmagineFile);
        }
      } else if (immaginePreviewUrl === null) {
        finalImmagineUrl = null;
      }

      // 2. Upload mandato if selected
      if (selectedMandatoFile) {
        if (isRealSupabase) {
          const fileName = `${Date.now()}_doc_${selectedMandatoFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          finalMandatoUrl = await uploadFileToSupabase(selectedMandatoFile, 'immobili-files', fileName);
        } else {
          // Local simulate
          finalMandatoUrl = URL.createObjectURL(selectedMandatoFile);
        }
      } else if (mandatoPreviewUrl === null) {
        finalMandatoUrl = null;
      }

      const fields = {
        nome_immobile: formData.get('nome_immobile'),
        codice_immobile,
        stato: formData.get('stato'),
        immobile_in: formImmobileIn.join(', '),
        mandato_firmato: formData.get('mandato_firmato') || 'No',
        tipo_di_mandato: formData.get('tipo_di_mandato') || "Non in Esclusiva",
        prezzo_vendita: Number(formData.get('prezzo_vendita')) || 0,
        prezzo_affitto: Number(formData.get('prezzo_affitto')) || 0,
        indirizzo: formData.get('indirizzo'),
        comune: formData.get('comune'),
        npa: formData.get('npa'),
        nazione: formData.get('nazione') || "Svizzera",
        categoria: formData.get('categoria'),
        tipo: formTipi.join(', '),
        superficie_abitabile: Number(formData.get('superficie_abitabile')) || 0,
        superficie_sul: Number(formData.get('superficie_sul')) || 0,
        locali: formData.get('locali') || "",
        bagni: formData.get('bagni') || "",
        anno: Number(formData.get('anno')) || 0,
        rinnovo: Number(formData.get('rinnovo')) || 0,
        garage: formData.get('garage') === 'on',
        parcheggio: formData.get('parcheggio') === 'on',
        mappale: formData.get('mappale') || "",
        lafe: formData.get('lafe') === 'on',
        rasi: formData.get('rasi') === 'on',
        radon: formData.get('radon') === 'on',
        descrizione: formData.get('descrizione') || "",
        proprietario_id: formData.get('proprietario_id') ? Number(formData.get('proprietario_id')) : null,
        agente_id: formData.get('agente_id') ? Number(formData.get('agente_id')) : null,
        
        tipo_residenza: formResidenze.join(', '),
        estratto_registro_fondiario: formData.get('estratto_registro_fondiario') || "",
        descrittivo_tecnico: formData.get('descrittivo_tecnico') || "",
        regolamento_condominiale: formData.get('regolamento_condominiale') || "",
        spese_condominiali: Number(formData.get('spese_condominiali')) || 0,
        assicurazione_stabile: formData.get('assicurazione_stabile') || "",
        verbale_ultima_assemblea: formData.get('verbale_ultima_assemblea') || "",
        fondo_rinnovamento: Number(formData.get('fondo_rinnovamento')) || 0,
        valore_di_stima: Number(formData.get('valore_di_stima')) || 0,
        piano_assegnazioni: formData.get('piano_assegnazioni') || "",
        fotografie: formData.get('fotografie') || "",
        link_cartella_doc: formData.get('link_cartella_doc') || "",
        note_interne: formData.get('note_interne') || "",
        planimetria: formData.get('planimetria') || "",
        creato_da: formData.get('creato_da') || "OLGA HONCHAR",
        ultima_modifica_il: new Date().toISOString().split('T')[0],
        ultima_modifica_fatta_da: "UTENTE CRM",
        immagine_di_riferimento: finalImmagineUrl,
        mandato: finalMandatoUrl
      };

      if (isRealSupabase) {
        if (id) {
          const { data, error } = await supabase
            .from('immobili')
            .update(fields)
            .eq('id', id)
            .select();
          if (error) throw error;
          const updatedRecord = data[0] || { id, ...fields };
          setImmobili(immobili.map(item => item.id === id ? updatedRecord : item));
          triggerToast("Immobile aggiornato con successo");
          if (viewingImmobile && viewingImmobile.id === id) {
            setViewingImmobile(updatedRecord);
          }
        } else {
          const { data, error } = await supabase
            .from('immobili')
            .insert([fields])
            .select();
          if (error) throw error;
          setImmobili([...immobili, data[0]]);
          triggerToast("Nuovo immobile registrato correttamente");
        }
      } else {
        const finalId = id || Date.now();
        const localFields = { id: finalId, ...fields };
        if (id) {
          setImmobili(immobili.map(item => item.id === id ? localFields : item));
          triggerToast("Immobile aggiornato (Locali)");
          if (viewingImmobile && viewingImmobile.id === id) {
            setViewingImmobile(localFields);
          }
        } else {
          setImmobili([...immobili, localFields]);
          triggerToast("Nuovo immobile registrato (Locali)");
        }
      }
      setIsImmobileModalOpen(false);
      setCurrentImmobile(null);
    } catch (error) {
      console.error(error);
      triggerToast(error.message || "Errore di salvataggio su Supabase", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFileToSupabase = async (file, bucketName, pathName) => {
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(pathName, file, { cacheControl: '3600', upsert: true });
    
    if (error) {
      console.error(`Errore di upload per ${file.name}:`, error);
      throw new Error(`Errore durante l'upload del file: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(pathName);

    return publicUrl;
  };

  const handleOpenImmobileModal = (item = null) => {
    setCurrentImmobile(item);
    setFormImmobileIn(item ? (item.immobile_in ? item.immobile_in.split(', ') : []) : ['Vendita']);
    setFormTipi(item ? (item.tipo ? item.tipo.split(', ') : []) : []);
    setFormResidenze(item ? (item.tipo_residenza ? item.tipo_residenza.split(', ') : []) : []);
    
    // Reset file states
    setSelectedImmagineFile(null);
    setSelectedMandatoFile(null);
    setImmaginePreviewUrl(item ? item.immagine_di_riferimento : null);
    setMandatoPreviewUrl(item ? item.mandato : null);
    setIsUploading(false);
    
    setIsImmobileModalOpen(true);
  };

  const handleEditImmobile = (item) => {
    handleOpenImmobileModal(item);
  };

  const handleViewImmobile = (item) => {
    setViewingImmobile(item);
    setActiveDetailTab('generale'); // Reset dell'inspector sulla prima tab
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
        } catch (error) {
          console.error(error);
          triggerToast("Errore durante l'eliminazione", "error");
        }
      } else {
        setImmobili(immobili.filter(item => item.id !== id));
        triggerToast("Immobile rimosso (Locali)", "info");
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

    const fields = {
      cognome: formData.get('cognome'),
      nome: formData.get('nome'),
      societa: formData.get('societa'),
      ruolo: formData.get('ruolo'),
      telefono: formData.get('telefono'),
      mail: formData.get('mail'),
      note: formData.get('note')
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
          const updatedRecord = data[0] || { id, ...fields };
          setContatti(contatti.map(item => item.id === id ? updatedRecord : item));
          triggerToast("Contatto aggiornato");
          if (viewingContatto && viewingContatto.id === id) {
            setViewingContatto(updatedRecord);
          }
        } else {
          const { data, error } = await supabase
            .from('contatti')
            .insert([fields])
            .select();
          if (error) throw error;
          setContatti([...contatti, data[0]]);
          triggerToast("Nuovo contatto aggiunto");
        }
      } catch (error) {
        console.error(error);
        triggerToast("Errore di salvataggio contatto", "error");
      }
    } else {
      const finalId = id || Date.now();
      const localFields = { id: finalId, ...fields };
      if (id) {
        setContatti(contatti.map(item => item.id === id ? localFields : item));
        triggerToast("Contatto aggiornato (Locali)");
        if (viewingContatto && viewingContatto.id === id) {
          setViewingContatto(localFields);
        }
      } else {
        setContatti([...contatti, localFields]);
        triggerToast("Nuovo contatto aggiunto (Locali)");
      }
    }
    setIsContattoModalOpen(false);
    setCurrentContatto(null);
  };

  const handleEditContatto = (item) => {
    setCurrentContatto(item);
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
          triggerToast("Contatto rimosso dal database");
          if (viewingContatto && viewingContatto.id === id) {
            setIsContactDetailModalOpen(false);
            setViewingContatto(null);
          }
        } catch (error) {
          console.error(error);
          triggerToast("Errore durante l'eliminazione", "error");
        }
      } else {
        setContatti(contatti.filter(item => item.id !== id));
        triggerToast("Contatto eliminato (Locali)", "info");
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
      cliente_id: formData.get('cliente_id') ? Number(formData.get('cliente_id')) : null,
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
          const updatedRecord = data[0] || { id, ...fields };
          setVisite(visite.map(item => item.id === id ? updatedRecord : item));
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
      } catch (error) {
        console.error(error);
        triggerToast("Errore di salvataggio evento", "error");
      }
    } else {
      const finalId = id || Date.now();
      const localFields = { id: finalId, ...fields };
      if (id) {
        setVisite(visite.map(item => item.id === id ? localFields : item));
        triggerToast("Appuntamento aggiornato (Locali)");
      } else {
        setVisite([...visite, localFields]);
        triggerToast("Nuovo evento aggiunto a calendario (Locali)");
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
        } catch (error) {
          console.error(error);
          triggerToast("Errore durante l'eliminazione", "error");
        }
      } else {
        setVisite(visite.filter(item => item.id !== id));
        triggerToast("Visita rimossa (Locali)", "info");
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
    return imm ? imm.nome_immobile : 'Immobile sconosciuto';
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased overflow-hidden">
      
      {/* APPLE NOTIFICATION TOAST */}
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-white/90 backdrop-blur-lg border border-[#D2D2D7] py-3 px-5 rounded-2xl shadow-xl transition-all duration-300 animate-bounce">
          <div className={`w-2.5 h-2.5 rounded-full mr-3 ${toast.type === 'success' ? 'bg-[#34C759]' : 'bg-[#0071E3]'}`} />
          <span className="text-sm font-medium tracking-tight text-[#1D1D1F]">{toast.message}</span>
        </div>
      )}

      {/* LATERAL SIDEBAR (macOS / iPadOS style) */}
      <aside className="w-64 bg-[#F5F5F7]/80 backdrop-blur-md border-r border-[#E5E5EA] flex flex-col justify-between py-6 px-4 shrink-0">
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

          {/* Nav Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                  : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
              }`}
            >
              <IconDashboard />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('immobili')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'immobili'
                  ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                  : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
              }`}
            >
              <IconImmobili />
              <span>Immobili / Oggetti</span>
              <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full">
                {immobili.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contatti')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'contatti'
                  ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                  : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
              }`}
            >
              <IconContatti />
              <span>Contatti</span>
              <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full">
                {contatti.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('visite'); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'visite'
                  ? 'bg-white text-[#0071E3] shadow-sm font-semibold'
                  : 'text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]'
              }`}
            >
              <IconCalendario />
              <span>Calendario</span>
              <span className="ml-auto text-xs bg-[#E5E5EA] text-[#86868B] px-2 py-0.5 rounded-full">
                {visite.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Panel (Supabase Status) */}
        <div className="bg-white/60 p-3.5 rounded-2xl border border-[#E5E5EA]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wide text-[#86868B] uppercase">Supabase Status</span>
            <IconCloud connected={isRealSupabase} />
          </div>
          <p className="text-[11px] text-[#86868B] leading-tight">
            {isRealSupabase 
              ? 'Connessione Postgres Cloud attiva. Sincronizzazione in tempo reale abilitata.'
              : 'Esecuzione in modalità demo locale. Dati salvati in memoria.'
            }
          </p>
          {!isRealSupabase && (
            <div className="mt-2.5 text-[10px] text-[#86868B] bg-blue-50/50 p-2 rounded-lg border border-blue-100/50 leading-normal">
              <span className="font-semibold text-blue-600 block mb-0.5">Configurazione database:</span>
              1. Copia <code className="bg-white/80 px-1 rounded border">.env.example</code> come <code className="bg-white/80 px-1 rounded border">.env</code><br />
              2. Configura le credenziali di Supabase<br />
              3. Applica <code className="bg-white/80 px-1 rounded border">schema.sql</code> su Supabase
            </div>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F7] p-8">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* Elegant Top Header with Welcome Message */}
            <div className="flex justify-between items-end border-b border-[#E5E5EA] pb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Panoramica Globale</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Bentornato in HomeLab Real Estate</h2>
              </div>
              <div className="text-right text-xs text-[#86868B]">
                <p className="font-medium text-[#1D1D1F]">Ufficio Lugano</p>
                <p>Status: <span className="text-[#34C759] font-medium">Attivo (Giugno 2026)</span></p>
              </div>
            </div>

            {/* macOS Widget Style Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm flex flex-col justify-between h-36">
                <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Attivi</span>
                <div className="my-2">
                  <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{immobili.length}</span>
                </div>
                <button onClick={() => setActiveTab('immobili')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                  Vedi archivio →
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm flex flex-col justify-between h-36">
                <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Portafoglio Stimato</span>
                <div className="my-2">
                  <span className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                    CHF {(immobili.reduce((acc, curr) => acc + curr.prezzo_vendita, 0) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <span className="text-xs text-[#86868B]">Valore degli immobili in vendita</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm flex flex-col justify-between h-36">
                <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Contatti in CRM</span>
                <div className="my-2">
                  <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{contatti.length}</span>
                </div>
                <button onClick={() => setActiveTab('contatti')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                  Gestisci contatti →
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-sm flex flex-col justify-between h-36">
                <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Eventi a Calendario</span>
                <div className="my-2">
                  <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{visite.length}</span>
                </div>
                <button onClick={() => setActiveTab('visite')} className="text-xs text-[#0071E3] hover:underline flex items-center">
                  Apri calendario →
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5E5EA] shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F] mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleOpenImmobileModal()}
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white p-4 rounded-2xl font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <IconPlus /> <span>Registra Nuovo Immobile / Oggetto</span>
                </button>
                <button
                  onClick={() => { setIsContattoModalOpen(true); setCurrentContatto(null); }}
                  className="bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] p-4 rounded-2xl font-medium text-sm border border-[#D2D2D7] transition-all flex items-center justify-center space-x-2"
                >
                  <IconPlus /> <span>Aggiungi Contatto</span>
                </button>
                <button
                  onClick={() => { setIsVisitaModalOpen(true); setCurrentVisita(null); }}
                  className="bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] p-4 rounded-2xl font-medium text-sm border border-[#D2D2D7] transition-all flex items-center justify-center space-x-2"
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
                {visite.slice(0, 3).map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3.5 bg-[#F5F5F7] rounded-xl border border-transparent hover:border-[#D2D2D7] transition-all">
                    <div className="flex items-center space-x-4">
                      {/* Event badge depending on type */}
                      <div className={`p-2.5 rounded-xl ${
                        v.tipo_visita === 'Shooting Fotografico' ? 'bg-[#5AC8FA]/15 text-[#0071E3]' : 'bg-[#AF52DE]/15 text-[#AF52DE]'
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
                ))}
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
                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Immobili / Oggetti</h2>
              </div>
              <button
                onClick={() => handleOpenImmobileModal()}
                className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center self-start"
              >
                <IconPlus /> Nuovo Immobile / Oggetto
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Cerca per nome, comune..."
                  value={searchProperty}
                  onChange={(e) => setSearchProperty(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                />
              </div>

              {/* Segmented control style filter */}
              <div className="flex bg-[#F5F5F7] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                {['Tutti', 'Vendita', 'Affitto'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterPropertyType(type)}
                    className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                      filterPropertyType === type
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {immobili
                .filter(item => {
                  const matchSearch = (item.nome_immobile || '').toLowerCase().includes(searchProperty.toLowerCase()) || (item.comune || '').toLowerCase().includes(searchProperty.toLowerCase());
                  const matchType = filterPropertyType === 'Tutti' || (item.immobile_in && item.immobile_in.split(', ').includes(filterPropertyType));
                  return matchSearch && matchType;
                })
                .map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleViewImmobile(item)}
                    className="bg-white rounded-2xl border border-[#E5E5EA] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                  >
                    
                    {/* Header Card Photo / PlaceHolder */}
                    <div className="h-44 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E5E5EA] to-[#D2D2D7]">
                      {item.immagine_di_riferimento ? (
                        <img 
                          src={item.immagine_di_riferimento} 
                          alt={item.nome_immobile} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center text-[#86868B] select-none p-4">
                          <svg className="w-12 h-12 mx-auto text-[#86868B]/60 mb-1 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-xs font-semibold block">{item.comune}, {item.nazione}</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex space-x-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${getStatoColor(item.stato)}`}>
                          {item.stato}
                        </span>
                        <span className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide shadow-sm">
                          {item.categoria}
                        </span>
                      </div>
                      
                      {/* Pill indicating Sale / Rent */}
                      <span className="absolute bottom-3 right-3 bg-[#0071E3] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                        In {item.immobile_in}
                      </span>
                    </div>

                    {/* Property details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-base tracking-tight text-[#1D1D1F] line-clamp-2 leading-tight group-hover:text-[#0071E3] transition-colors">
                          {item.nome_immobile}
                        </h3>
                        <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed line-clamp-3">
                          {item.descrizione}
                        </p>
                      </div>

                      {/* Technical Spec Metrics */}
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-[#F5F5F7] py-3 text-center">
                        <div>
                          <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Locali</span>
                          <span className="text-xs font-semibold text-[#1D1D1F]">{item.locali}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Sup. SUL</span>
                          <span className="text-xs font-semibold text-[#1D1D1F]">{item.superficie_sul} $m^2$</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-medium text-[#86868B] uppercase tracking-wider">Mappale</span>
                          <span className="text-xs font-semibold text-[#1D1D1F]">{item.mappale || 'N/D'}</span>
                        </div>
                      </div>

                      {/* Price and Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="block text-[10px] text-[#86868B] uppercase font-semibold">Prezzo</span>
                          <span className="text-lg font-extrabold tracking-tight text-[#1D1D1F] block leading-tight">
                            {item.immobile_in?.includes('Vendita') && item.prezzo_vendita > 0 && (
                              <div className="text-sm font-extrabold text-[#1D1D1F]">
                                Vendita: CHF {item.prezzo_vendita.toLocaleString('it-CH')}
                              </div>
                            )}
                            {item.immobile_in?.includes('Affitto') && item.prezzo_affitto > 0 && (
                              <div className="text-[11px] font-semibold text-[#86868B]">
                                Affitto: CHF {item.prezzo_affitto.toLocaleString('it-CH')}/mese
                              </div>
                            )}
                            {(!item.immobile_in || (!item.immobile_in.includes('Vendita') && !item.immobile_in.includes('Affitto'))) && (
                              <span className="text-[#86868B] text-sm font-semibold">-</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents opening the detail modal
                              handleEditImmobile(item);
                            }}
                            className="p-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-gray-700 transition-all"
                            title="Modifica"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents opening the detail modal
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

          </div>
        )}

        {/* TAB 3: CONTATTI */}
        {activeTab === 'contatti' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5EA] pb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">Anagrafiche</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Contatti</h2>
              </div>
              <button
                onClick={() => { setIsContattoModalOpen(true); setCurrentContatto(null); }}
                className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center self-start"
              >
                <IconPlus /> Nuovo Contatto
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
              <div className="relative w-full sm:w-80">
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

              <div className="flex bg-[#F5F5F7] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                {['Tutti', 'Agente Immobiliare', 'Proprietario', 'Locatore', 'Intermediario', 'Fotografo', 'Cliente'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterContactRuolo(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all shrink-0 ${
                      filterContactRuolo === r
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Contacts Table View */}
            <div className="bg-white rounded-3xl border border-[#E5E5EA] overflow-hidden shadow-sm">
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
                    {contatti
                      .filter(item => {
                        const fullName = `${item.nome} ${item.cognome}`.toLowerCase();
                        const matchSearch = fullName.includes(searchContact.toLowerCase()) || item.mail.toLowerCase().includes(searchContact.toLowerCase());
                        const matchRuolo = filterContactRuolo === 'Tutti' || item.ruolo.includes(filterContactRuolo);
                        return matchSearch && matchRuolo;
                      })
                      .map((item) => (
                        <tr 
                          key={item.id} 
                          onClick={() => handleViewContatto(item)}
                          className="hover:bg-[#F5F5F7] transition-all cursor-pointer group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {/* Apple Style Avatar */}
                              <div className="w-9 h-9 rounded-full bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                                {item.nome.charAt(0)}{item.cognome.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-sm block text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{item.cognome} {item.nome}</span>
                                <span className="text-[11px] text-[#86868B] block truncate max-w-[200px]">{item.note}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-[#1D1D1F]">
                            {item.societa || <span className="text-xs text-gray-400">—</span>}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-1 rounded-full text-xs font-semibold">
                              {item.ruolo}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs space-y-1">
                            <div className="flex items-center text-[#1D1D1F]">
                              <span className="w-4 h-4 mr-1.5 text-gray-400">􀌏</span>
                              {item.telefono}
                            </div>
                            <div className="flex items-center text-[#86868B]">
                              <span className="w-4 h-4 mr-1.5 text-gray-400">􀍡</span>
                              {item.mail}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents opening contact detail
                                  handleEditContatto(item);
                                }}
                                className="p-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-xl text-gray-700 transition-all"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents opening contact detail
                                  handleDeleteContatto(item.id);
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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
                <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">Attività e Visite</h2>
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

            {/* Timeline List (Apple Reminders / Calendar mix) */}
            <div className="space-y-4">
              {visite
                .filter(item => {
                  const immName = getImmobileName(item.immobile_id).toLowerCase();
                  const matchSearch = immName.includes(searchVisit.toLowerCase()) || item.esito.toLowerCase().includes(searchVisit.toLowerCase()) || item.tipo_visita.toLowerCase().includes(searchVisit.toLowerCase());
                  return matchSearch;
                })
                .map((item) => {
                  const dateObj = new Date(item.data_ora);
                  return (
                    <div key={item.id} className="bg-white rounded-3xl p-5 border border-[#E5E5EA] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                      
                      {/* Left: Time Block */}
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

                      {/* Center: Main details with relation visualizer */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5E5EA] text-[#86868B]">
                            Codice ID: {item.id}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                            item.esito === 'POSITIVO' ? 'bg-[#34C759]/10 text-[#34C759]' : item.esito === 'NEGATIVO' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-gray-100 text-gray-500'
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

                      {/* Right: Actions */}
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
                })}
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
          
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl border-l border-[#E5E5EA] flex flex-col animate-slide-left overflow-hidden">
            
            {/* Header Banner */}
            <div className="bg-[#F5F5F7] p-6 border-b border-[#E5E5EA] flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#86868B]">
                  ID Prodotto #{formatField(viewingImmobile.id)} • Number: {formatField(viewingImmobile.codice_immobile)}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] leading-snug">
                  {viewingImmobile.nome_immobile}
                </h3>
                <p className="text-xs text-[#86868B] flex items-center">
                  <span className="mr-1">🗺️</span> {formatField(viewingImmobile.indirizzo)}, {formatField(viewingImmobile.comune)} ({formatField(viewingImmobile.npa)}) • {formatField(viewingImmobile.nazione)}
                </p>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-7 h-7 bg-white/80 hover:bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] transition-colors shadow-sm ml-4"
              >
                ✕
              </button>
            </div>

            {viewingImmobile.immagine_di_riferimento && (
              <div className="w-full h-56 relative overflow-hidden bg-gray-100 border-b border-[#E5E5EA]">
                <img 
                  src={viewingImmobile.immagine_di_riferimento} 
                  alt={viewingImmobile.nome_immobile} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Apple-Style Segmented Tab Bar inside Inspector */}
            <div className="px-6 py-2 bg-white border-b border-[#E5E5EA] flex space-x-1 overflow-x-auto">
              {[
                { id: 'generale', label: 'Generale' },
                { id: 'specifiche', label: 'Specifiche' },
                { id: 'amministrazione', label: 'Amministrazione' },
                { id: 'conformita', label: 'Conformità CH' },
                { id: 'media', label: 'Media & Doc' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight whitespace-nowrap transition-all ${
                    activeDetailTab === tab.id
                      ? 'bg-[#0071E3] text-white shadow-sm'
                      : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Drawer Scrollable with dynamic tabs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              
              {/* TAB 1: GENERALE */}
              {activeDetailTab === 'generale' && (
                <div className="space-y-6">
                  {/* Status, Contract & Price */}
                  <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">Stato Prodotto</span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${getStatoColor(viewingImmobile.stato)}`}>
                        {formatField(viewingImmobile.stato)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">Tipo di Contratto</span>
                      <span className="text-sm font-bold text-[#1D1D1F]">
                        In {formatField(viewingImmobile.immobile_in)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200/60 pt-3">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">Prezzo Vendita</span>
                      <span className="text-base font-extrabold text-[#1D1D1F]">
                        {formatField(viewingImmobile.prezzo_vendita, "", true)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200/60 pt-3">
                      <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">Prezzo Affitto</span>
                      <span className="text-base font-extrabold text-[#1D1D1F]">
                        {formatField(viewingImmobile.prezzo_affitto, "/mese", true)}
                      </span>
                    </div>
                  </div>

                  {/* Descrizione */}
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Descrizione Commerciale</span>
                    <p className="text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-[#E5E5EA]">
                      {viewingImmobile.descrizione || <span className="text-gray-400 italic">- Nessuna descrizione inserita</span>}
                    </p>
                  </div>

                  {/* Referenti */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Anagrafiche Collegate</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Proprietario */}
                      <div className="bg-white p-3.5 rounded-xl border border-[#E5E5EA]">
                        <span className="block text-[9px] uppercase font-bold text-[#86868B]">Proprietario</span>
                        <span className="font-bold text-sm text-[#1D1D1F] block mt-0.5">
                          {getContactName(viewingImmobile.proprietario_id)}
                        </span>
                        {viewingImmobile.proprietario_id && (
                          <div className="mt-2 text-xs text-[#86868B] space-y-0.5">
                            <p>📞 {getContactPhone(viewingImmobile.proprietario_id)}</p>
                            <p>✉️ {getContactEmail(viewingImmobile.proprietario_id)}</p>
                          </div>
                        )}
                      </div>

                      {/* Agente */}
                      <div className="bg-white p-3.5 rounded-xl border border-[#E5E5EA]">
                        <span className="block text-[9px] uppercase font-bold text-[#86868B]">Agente Responsabile</span>
                        <span className="font-bold text-sm text-[#1D1D1F] block mt-0.5">
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
                </div>
              )}

              {/* TAB 2: SPECIFICHE TECNICHE */}
              {activeDetailTab === 'specifiche' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Categoria Catasto:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.categoria)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Tipologia Struttura:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.tipo)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Numero di Locali:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.locali)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Numero Bagni:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.bagni)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Superficie Abitabile:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.superficie_abitabile, " $m^2$")}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Superficie SUL (S. Utile Lorda):</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.superficie_sul, " $m^2$")}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Anno di Costruzione:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.anno)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Ultimo Rinnovo:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.rinnovo)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Tipo di Residenza:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.tipo_residenza)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Autorimessa / Garage:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.garage)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Parcheggio Esterno:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.parcheggio)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AMMINISTRAZIONE E COSTI */}
              {activeDetailTab === 'amministrazione' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Numero di Mappale:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.mappale)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Spese Condominiali Annuali:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.spese_condominiali, "", true)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Assicurazione Stabile:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.assicurazione_stabile)}</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="block text-xs text-[#86868B]">Fondo Rinnovamento Condominiale:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.fondo_rinnovamento, "", true)}</span>
                    </div>
                    <div className="border-b pb-2 md:col-span-2">
                      <span className="block text-xs text-[#86868B]">Valore di Stima Ufficiale:</span>
                      <span className="font-semibold text-[#1D1D1F]">{formatField(viewingImmobile.valore_di_stima, "", true)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONFORMITÀ SVIZZERA */}
              {activeDetailTab === 'conformita' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    
                    {/* RaSi Block */}
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-[#E5E5EA]">
                      <div className={`p-1.5 rounded-lg text-white ${viewingImmobile.rasi ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`}>
                        {viewingImmobile.rasi ? '✓' : '✕'}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#1D1D1F]">Controllo Sicurezza Impianti Elettrici (RaSi)</h5>
                        <p className="text-[11px] text-[#86868B] mt-0.5">Certificazione svizzera obbligatoria per legge.</p>
                        <span className="text-xs font-semibold block mt-1">Stato: {formatField(viewingImmobile.rasi)}</span>
                      </div>
                    </div>

                    {/* Certificato Radon Block */}
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-[#E5E5EA]">
                      <div className={`p-1.5 rounded-lg text-white ${viewingImmobile.radon ? 'bg-[#FF9500]' : 'bg-[#34C759]'}`}>
                        {viewingImmobile.radon ? '⚠️' : '✓'}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#1D1D1F]">Certificato di Concentrazione Gas Radon</h5>
                        <p className="text-[11px] text-[#86868B] mt-0.5">Misurazione dei livelli di sicurezza sanitaria nei locali.</p>
                        <span className="text-xs font-semibold block mt-1">Stato: {formatField(viewingImmobile.radon)}</span>
                      </div>
                    </div>

                    {/* LAFE Block */}
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-[#E5E5EA]">
                      <div className={`p-1.5 rounded-lg text-white ${viewingImmobile.lafe ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`}>
                        📬
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#1D1D1F]">Acquisto da parte di Persone all'Estero (LAFE)</h5>
                        <p className="text-[11px] text-[#86868B] mt-0.5">Conformità con la legislazione svizzera per l'acquisto di immobili.</p>
                        <span className="text-xs font-semibold block mt-1">Vendibile a stranieri: {formatField(viewingImmobile.lafe)}</span>
                      </div>
                    </div>

                    {/* Mandato di Vendita Block */}
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-[#E5E5EA]">
                      <div className={`p-1.5 rounded-lg text-white ${getMandatoColor(viewingImmobile.mandato_firmato)}`}>
                        ✍️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[#1D1D1F]">Mandato Firmato & Tipo Mandato</h5>
                        <p className="text-[11px] text-[#86868B] mt-0.5">Accordo scritto per l'attività di intermediazione.</p>
                        <div className="grid grid-cols-2 gap-x-4 mt-2 text-xs">
                          <div>
                            <span className="text-[#86868B]">Firmato:</span> <span className="font-semibold">{viewingImmobile.mandato_firmato === 'Si' ? 'Sì' : formatField(viewingImmobile.mandato_firmato)}</span>
                          </div>
                          <div>
                            <span className="text-[#86868B]">Tipo:</span> <span className="font-semibold">{formatField(viewingImmobile.tipo_di_mandato)}</span>
                          </div>
                        </div>
                        {viewingImmobile.mandato && (
                          <div className="mt-2.5 pt-2 border-t border-gray-200/60">
                            <a 
                              href={viewingImmobile.mandato} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0071E3] hover:underline"
                            >
                              <span>📄</span> <span>Visualizza / Scarica documento Mandato</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA E DOCUMENTAZIONE (PLANIMETRIA, FOTO, CARTELLA) */}
              {activeDetailTab === 'media' && (
                <div className="space-y-6">
                  
                  {/* Digital Files Registry */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Documenti di Archivio</span>
                    
                    <div className="space-y-2 text-xs">
                      {[
                        { label: 'Planimetria Immobile', val: viewingImmobile.planimetria },
                        { label: 'Estratto Registro Fondiario', val: viewingImmobile.estratto_registro_fondiario },
                        { label: 'Descrittivo Tecnico', val: viewingImmobile.descrittivo_tecnico },
                        { label: 'Regolamento Condominiale', val: viewingImmobile.regolamento_condominiale },
                        { label: 'Verbale Ultima Assemblea', val: viewingImmobile.verbale_ultima_assemblea },
                        { label: 'Piano Assegnazioni Parti Comuni', val: viewingImmobile.piano_assegnazioni },
                      ].map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-[#E5E5EA]">
                          <span className="font-semibold text-gray-700">{doc.label}</span>
                          <span className="text-right text-[#1D1D1F]">
                            {doc.val ? (
                              <span className="text-[#0071E3] font-medium underline cursor-pointer">{doc.val}</span>
                            ) : (
                              formatField(null)
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links & Cloud Storage folders */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-bold text-[#86868B] uppercase tracking-wider">Link Esterni & Servizi Cloud</span>
                    
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#0071E3]/5 rounded-xl border border-[#0071E3]/15">
                        <span className="font-bold text-[#0071E3] block mb-1">📁 Cartella Documentazione Cloud</span>
                        <div className="flex justify-between items-center">
                          <span className="text-[#86868B] truncate max-w-[320px]">{formatField(viewingImmobile.link_cartella_doc)}</span>
                          {viewingImmobile.link_cartella_doc && (
                            <a href={viewingImmobile.link_cartella_doc} target="_blank" rel="noreferrer" className="text-xs bg-[#0071E3] text-white px-3 py-1 rounded-full font-semibold">Apri Dropbox</a>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-[#34C759]/5 rounded-xl border border-[#34C759]/15">
                        <span className="font-bold text-[#34C759] block mb-1">📸 Archivio Fotografico (Fotografie)</span>
                        <div className="flex justify-between items-center">
                          <span className="text-[#86868B] truncate max-w-[320px]">{formatField(viewingImmobile.fotografie)}</span>
                          {viewingImmobile.fotografie && (
                            <a href={viewingImmobile.fotografie} target="_blank" rel="noreferrer" className="text-xs bg-[#34C759] text-white px-3 py-1 rounded-full font-semibold">Apri Foto</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata and history logs */}
                  <div className="bg-gray-100 p-3.5 rounded-xl text-[11px] text-[#86868B] space-y-1">
                    <span className="block font-bold text-gray-500 uppercase tracking-wide text-[9px] mb-1">Log Sincronizzazione CRM</span>
                    <p>Creato da: <span className="font-semibold text-gray-700">{formatField(viewingImmobile.creato_da)}</span></p>
                    <p>Ultimo aggiornamento il: <span className="font-semibold text-gray-700">{formatField(viewingImmobile.ultima_modifica_il)}</span></p>
                    <p>Modificato da: <span className="font-semibold text-gray-700">{formatField(viewingImmobile.ultima_modifica_fatta_da)}</span></p>
                    <p className="mt-2 text-[10px] text-gray-400">Note Interne Segrete: <span className="font-semibold text-gray-600 block bg-white p-2 rounded border border-gray-200 mt-1">{formatField(viewingImmobile.note_interne)}</span></p>
                  </div>

                </div>
              )}

            </div>

            {/* Footer Actions */}
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

      {/* ========================================================= */}
      {/* DETTAGLIO SCHEDA COMPLETA CONTATTO (Apple Drawer) */}
      {/* ========================================================= */}
      {isContactDetailModalOpen && viewingContatto && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm transition-all">
          <div className="absolute inset-0 -z-10" onClick={() => setIsContactDetailModalOpen(false)}></div>
          
          <div className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-[#E5E5EA] flex flex-col animate-slide-left overflow-hidden">
            
            {/* Header / Avatar Section */}
            <div className="bg-[#F5F5F7] p-6 border-b border-[#E5E5EA] flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-bold text-xl border border-white shadow-inner">
                  {viewingContatto.nome.charAt(0)}{viewingContatto.cognome.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] leading-snug">
                    {viewingContatto.cognome} {viewingContatto.nome}
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-[#0071E3]/10 text-[#0071E3] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {viewingContatto.ruolo}
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

            {/* Content Drawer Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="bg-[#F5F5F7] p-5 rounded-2xl border border-[#E5E5EA] space-y-4">
                <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Recapiti Diretti</h4>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="block text-xs text-[#86868B]">Telefono:</span>
                    <span className="font-semibold text-[#1D1D1F]">{viewingContatto.telefono}</span>
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
                    <span className="font-semibold text-[#1D1D1F] break-all">{viewingContatto.mail}</span>
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
                <p className="text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap">
                  {viewingContatto.note || "Nessuna nota aggiuntiva registrata per questo contatto."}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Immobili Collegati</h4>
                {immobili.filter(imm => imm.proprietario_id === viewingContatto.id || imm.agente_id === viewingContatto.id).length > 0 ? (
                  <div className="space-y-2">
                    {immobili.filter(imm => imm.proprietario_id === viewingContatto.id || imm.agente_id === viewingContatto.id).map(imm => (
                      <div 
                        key={imm.id} 
                        onClick={() => {
                          setIsContactDetailModalOpen(false);
                          handleViewImmobile(imm);
                        }}
                        className="bg-white p-3.5 rounded-xl border border-[#E5E5EA] flex justify-between items-center hover:border-[#0071E3] cursor-pointer transition-all group"
                      >
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-[#86868B]">
                            {imm.proprietario_id === viewingContatto.id ? 'Proprietà' : 'Assegnato come Agente'}
                          </span>
                          <span className="font-bold text-sm text-[#1D1D1F] group-hover:text-[#0071E3] transition-all">
                            {imm.nome_immobile}
                          </span>
                          <p className="text-xs text-[#86868B]">{imm.comune} • CHF {imm.prezzo_vendita > 0 ? imm.prezzo_vendita.toLocaleString('it-CH') : imm.prezzo_affitto.toLocaleString('it-CH')}</p>
                        </div>
                        <span className="text-xs text-[#86868B] group-hover:text-[#0071E3] transition-all">􀄧</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#86868B]">Nessun immobile collegato a questo nominativo.</p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider border-b pb-1">Attività e Visite Relazionate</h4>
                {visite.filter(v => v.cliente_id === viewingContatto.id || v.partecipanti.toLowerCase().includes(viewingContatto.cognome.toLowerCase())).length > 0 ? (
                  <div className="space-y-2">
                    {visite.filter(v => v.cliente_id === viewingContatto.id || v.partecipanti.toLowerCase().includes(viewingContatto.cognome.toLowerCase())).map(v => {
                      const dateObj = new Date(v.data_ora);
                      return (
                        <div key={v.id} className="bg-white p-3.5 rounded-xl border border-[#E5E5EA] flex items-center justify-between">
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-[#86868B]">
                              {v.tipo_visita} • Esito: {v.esito}
                            </span>
                            <span className="font-bold text-sm text-[#1D1D1F]">
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

            {/* Footer Actions */}
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

      {/* ========================================================= */}
      {/* 1. MODALE IMMOBILI (FORM COMPLETO AGGIORNATO PER EDITING) */}
      {/* ========================================================= */}
      {isImmobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
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

            <form onSubmit={handleSaveImmobile} className="flex-1 overflow-y-auto p-6 space-y-6">
              {currentImmobile && <input type="hidden" name="id" value={currentImmobile.id} />}

              {/* GENERALE & PREZZI */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">1. Dati Identificativi & Commerciali</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Immobile Completo *</label>
                    <input 
                      type="text" 
                      name="nome_immobile" 
                      required
                      placeholder="es. Proprietà Vista Lago a Bissone"
                      defaultValue={currentImmobile ? currentImmobile.nome_immobile : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Codice *</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-sm font-semibold text-[#86868B]">#</span>
                      <input 
                        type="number" 
                        name="codice_immobile" 
                        required
                        placeholder="0001"
                        defaultValue={currentImmobile ? currentImmobile.codice_immobile?.replace('#', '') : ''}
                        className="w-full pl-7 pr-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Immobile in (Selezione Multipla) *</label>
                    <div className="flex space-x-6 py-2">
                      <label className="flex items-center space-x-2 text-sm text-[#1D1D1F] cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formImmobileIn.includes('Vendita')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormImmobileIn([...formImmobileIn, 'Vendita']);
                            } else {
                              setFormImmobileIn(formImmobileIn.filter(x => x !== 'Vendita'));
                            }
                          }}
                          className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                        />
                        <span>Vendita</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm text-[#1D1D1F] cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formImmobileIn.includes('Affitto')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormImmobileIn([...formImmobileIn, 'Affitto']);
                            } else {
                              setFormImmobileIn(formImmobileIn.filter(x => x !== 'Affitto'));
                            }
                          }}
                          className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                        />
                        <span>Affitto</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Stato Operativo *</label>
                    <select 
                      name="stato" 
                      defaultValue={currentImmobile ? currentImmobile.stato : 'Disponibile'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    >
                      <option value="Disponibile">Disponibile</option>
                      <option value="In Trattativa">In Trattativa</option>
                      <option value="Venduto">Venduto</option>
                      <option value="Affittato">Affittato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Prezzo di Vendita (CHF)</label>
                    <input 
                      type="number" 
                      name="prezzo_vendita" 
                      placeholder="es. 3450000"
                      defaultValue={currentImmobile ? currentImmobile.prezzo_vendita : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Prezzo Affitto Mensile (CHF)</label>
                    <input 
                      type="number" 
                      name="prezzo_affitto" 
                      placeholder="es. 3100"
                      defaultValue={currentImmobile ? currentImmobile.prezzo_affitto : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Mandato Firmato *</label>
                    <select 
                      name="mandato_firmato" 
                      defaultValue={currentImmobile ? currentImmobile.mandato_firmato : 'No'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    >
                      <option value="No">No</option>
                      <option value="Stand By">Stand By</option>
                      <option value="Si">Sì</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Tipo di Mandato *</label>
                    <select 
                      name="tipo_di_mandato" 
                      defaultValue={currentImmobile ? currentImmobile.tipo_di_mandato : 'Non in Esclusiva'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    >
                      <option value="Non in Esclusiva">Non in Esclusiva</option>
                      <option value="In Esclusiva">In Esclusiva</option>
                    </select>
                  </div>

                  {/* File Uploads for Immagine di Riferimento and Mandato Document */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Immagine di Riferimento (Upload)</label>
                      <div className="flex flex-col space-y-2">
                        {immaginePreviewUrl && (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#E5E5EA]">
                            <img src={immaginePreviewUrl} alt="Anteprima immagine" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => {
                                setImmaginePreviewUrl(null);
                                setSelectedImmagineFile(null);
                              }}
                              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedImmagineFile(file);
                              setImmaginePreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#86868B] mb-1">Documento Mandato (PDF o Foto)</label>
                      <div className="flex flex-col space-y-2">
                        {mandatoPreviewUrl && (
                          <div className="flex items-center justify-between p-2 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA]">
                            <span className="text-xs truncate text-[#1D1D1F] max-w-[180px]">
                              {selectedMandatoFile ? selectedMandatoFile.name : (mandatoPreviewUrl.startsWith('blob:') ? 'Nuovo File' : 'Mandato Caricato')}
                            </span>
                            <div className="flex space-x-2">
                              {!mandatoPreviewUrl.startsWith('blob:') && (
                                <a href={mandatoPreviewUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#0071E3] hover:underline">
                                  Vedi
                                </a>
                              )}
                              <button 
                                type="button" 
                                onClick={() => {
                                  setMandatoPreviewUrl(null);
                                  setSelectedMandatoFile(null);
                                }}
                                className="text-red-500 text-xs font-semibold hover:underline"
                              >
                                Rimuovi
                              </button>
                            </div>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedMandatoFile(file);
                              setMandatoPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                          className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0071E3]/10 file:text-[#0071E3] hover:file:bg-[#0071E3]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIFICHE FISICHE & LOCALIZZAZIONE */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">2. Localizzazione & Caratteristiche</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Indirizzo *</label>
                    <input 
                      type="text" 
                      name="indirizzo" 
                      required
                      placeholder="Via Cantonale 1"
                      defaultValue={currentImmobile ? currentImmobile.indirizzo : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Comune *</label>
                    <input 
                      type="text" 
                      name="comune" 
                      required
                      placeholder="Lugano"
                      defaultValue={currentImmobile ? currentImmobile.comune : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">NPA *</label>
                    <input 
                      type="number" 
                      name="npa" 
                      required
                      placeholder="6900"
                      defaultValue={currentImmobile ? currentImmobile.npa : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nazione</label>
                    <input 
                      type="text" 
                      name="nazione" 
                      defaultValue={currentImmobile ? currentImmobile.nazione : 'Svizzera'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Categoria *</label>
                    <select 
                      name="categoria" 
                      defaultValue={currentImmobile ? currentImmobile.categoria : 'Appartamento'}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F]"
                    >
                      <option value="Appartamento">Appartamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Locali di Servizio">Locali di Servizio</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Parcheggio">Parcheggio</option>
                      <option value="Box">Box</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Numero di Locali</label>
                    <input 
                      type="text" 
                      name="locali" 
                      placeholder="es. 3.5, 4.5"
                      defaultValue={currentImmobile ? currentImmobile.locali : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Numero Bagni</label>
                    <input 
                      type="text" 
                      name="bagni" 
                      placeholder="es. 2, 3.5"
                      defaultValue={currentImmobile ? currentImmobile.bagni : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Superficie Abitabile (m²)</label>
                    <input 
                      type="number" 
                      name="superficie_abitabile" 
                      defaultValue={currentImmobile ? currentImmobile.superficie_abitabile : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Superficie SUL (m²)</label>
                    <input 
                      type="number" 
                      name="superficie_sul" 
                      defaultValue={currentImmobile ? currentImmobile.superficie_sul : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#86868B] mb-2">Tipo di Residenza (Selezione Multipla)</label>
                    <div className="flex gap-2">
                      {['Primaria', 'Secondaria'].map(r => {
                        const selected = formResidenze.includes(r);
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                setFormResidenze(formResidenze.filter(x => x !== r));
                              } else {
                                setFormResidenze([...formResidenze, r]);
                              }
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                              selected 
                                ? 'bg-[#0071E3] text-white border-transparent shadow-sm' 
                                : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7] hover:bg-[#E5E5EA]'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-[#86868B] mb-2">Tipo (Selezione Multipla)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Appartamento', 'Attico', 'Villa', 'Duplex', 'Loft', 'Casa a Schiera', 
                        'Casa Unifamiliare', 'Ufficio', 'Rustico', "Parcheggio all'Aperto", 
                        'Parcheggio al Coperto', 'Garage', 'Terreno Commerciale', 'Terreno per Costruire'
                      ].map(t => {
                        const selected = formTipi.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                setFormTipi(formTipi.filter(x => x !== t));
                              } else {
                                setFormTipi([...formTipi, t]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                              selected 
                                ? 'bg-[#0071E3] text-white border-transparent shadow-sm' 
                                : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7] hover:bg-[#E5E5EA]'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* AMMINISTRAZIONE SVIZZERA */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">3. Amministrazione & Costi condominiali</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Mappale</label>
                    <input 
                      type="text" 
                      name="mappale" 
                      placeholder="N. Mappale"
                      defaultValue={currentImmobile ? currentImmobile.mappale : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Spese Condominiali (CHF/anno)</label>
                    <input 
                      type="number" 
                      name="spese_condominiali" 
                      defaultValue={currentImmobile ? currentImmobile.spese_condominiali : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Assicurazione Stabile</label>
                    <input 
                      type="text" 
                      name="assicurazione_stabile" 
                      defaultValue={currentImmobile ? currentImmobile.assicurazione_stabile : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Fondo di Rinnovamento</label>
                    <input 
                      type="number" 
                      name="fondo_rinnovamento" 
                      defaultValue={currentImmobile ? currentImmobile.fondo_rinnovamento : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Valore di Stima (CHF)</label>
                    <input 
                      type="number" 
                      name="valore_di_stima" 
                      defaultValue={currentImmobile ? currentImmobile.valore_di_stima : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CONFORMITÀ SVIZZERA & DOCUMENTAZIONE */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">4. Verifiche Tecniche, Legali & Documenti (CH)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="lafe" 
                      id="lafe"
                      defaultChecked={currentImmobile ? currentImmobile.lafe : false}
                      className="rounded text-[#0071E3]"
                    />
                    <label htmlFor="lafe" className="text-xs font-medium text-[#1D1D1F]">Vendibile LAFE</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="rasi" 
                      id="rasi"
                      defaultChecked={currentImmobile ? currentImmobile.rasi : false}
                      className="rounded text-[#0071E3]"
                    />
                    <label htmlFor="rasi" className="text-xs font-medium text-[#1D1D1F]">RaSi Ok</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="radon" 
                      id="radon"
                      defaultChecked={currentImmobile ? currentImmobile.radon : false}
                      className="rounded text-[#0071E3]"
                    />
                    <label htmlFor="radon" className="text-xs font-medium text-[#1D1D1F]">Radon Testato</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="garage" 
                      id="garage"
                      defaultChecked={currentImmobile ? currentImmobile.garage : false}
                      className="rounded text-[#0071E3]"
                    />
                    <label htmlFor="garage" className="text-xs font-medium text-[#1D1D1F]">Garage</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Planimetria PDF</label>
                    <input 
                      type="text" 
                      name="planimetria" 
                      defaultValue={currentImmobile ? currentImmobile.planimetria : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Estratto Registro Fondiario</label>
                    <input 
                      type="text" 
                      name="estratto_registro_fondiario" 
                      defaultValue={currentImmobile ? currentImmobile.estratto_registro_fondiario : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Descrittivo Tecnico</label>
                    <input 
                      type="text" 
                      name="descrittivo_tecnico" 
                      defaultValue={currentImmobile ? currentImmobile.descrittivo_tecnico : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Regolamento Condominiale</label>
                    <input 
                      type="text" 
                      name="regolamento_condominiale" 
                      defaultValue={currentImmobile ? currentImmobile.regolamento_condominiale : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Verbale Ultima Assemblea</label>
                    <input 
                      type="text" 
                      name="verbale_ultima_assemblea" 
                      defaultValue={currentImmobile ? currentImmobile.verbale_ultima_assemblea : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome Piano Assegnazioni</label>
                    <input 
                      type="text" 
                      name="piano_assegnazioni" 
                      defaultValue={currentImmobile ? currentImmobile.piano_assegnazioni : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ASSEGNAZIONE & LINK ESTERNI */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0071E3] border-b pb-1">5. Link, Relazioni & Note Segrete</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Proprietario *</label>
                    <select 
                      name="proprietario_id"
                      defaultValue={currentImmobile ? currentImmobile.proprietario_id : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    >
                      <option value="">Nessuno (Seleziona contatto)</option>
                      {contatti
                        .filter(c => c.ruolo.includes('Proprietario') || c.ruolo.includes('Locatore'))
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.cognome} {c.nome} ({c.ruolo})</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Agente Responsabile</label>
                    <select 
                      name="agente_id"
                      defaultValue={currentImmobile ? currentImmobile.agente_id : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    >
                      <option value="">Nessuno</option>
                      {contatti
                        .filter(c => c.ruolo.includes('Agente'))
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.cognome} {c.nome}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Cartella Cloud URL (Dropbox/Drive)</label>
                    <input 
                      type="text" 
                      name="link_cartella_doc" 
                      defaultValue={currentImmobile ? currentImmobile.link_cartella_doc : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Cartella Fotografica URL</label>
                    <input 
                      type="text" 
                      name="fotografie" 
                      defaultValue={currentImmobile ? currentImmobile.fotografie : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Descrittivo dell'immobile (Pubblico)</label>
                    <textarea 
                      name="descrizione" 
                      rows="3"
                      defaultValue={currentImmobile ? currentImmobile.descrizione : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868B] mb-1">Note Interne Operative (Segrete)</label>
                    <textarea 
                      name="note_interne" 
                      rows="3"
                      defaultValue={currentImmobile ? currentImmobile.note_interne : ''}
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E5E5EA] flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsImmobileModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full text-sm font-semibold text-[#1D1D1F] transition-all"
                >
                  Annulla
                </button>
                 <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-[#0071E3]/50 text-white rounded-full text-sm font-semibold transition-all shadow-sm flex items-center space-x-1.5"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Salvataggio in corso...</span>
                    </>
                  ) : (
                    <span>Salva Scheda</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODALE CONTATTI (CREAZIONE E MODIFICA) */}
      {/* ========================================================= */}
      {isContattoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden">
            
            <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
                {currentContatto ? 'Aggiorna Dati Contatto' : 'Registra Nuovo Contatto CRM'}
              </h3>
              <button 
                onClick={() => setIsContattoModalOpen(false)}
                className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContatto} className="p-6 space-y-4">
              {currentContatto && <input type="hidden" name="id" value={currentContatto.id} />}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">Cognome *</label>
                  <input 
                    type="text" 
                    name="cognome" 
                    required 
                    placeholder="es. Boldi"
                    defaultValue={currentContatto ? currentContatto.cognome : ''}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">Nome *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    required 
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
                <label className="block text-xs font-semibold text-[#86868B] mb-1">Ruolo Principale *</label>
                <select 
                  name="ruolo"
                  defaultValue={currentContatto ? currentContatto.ruolo : 'Cliente'}
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                >
                  <option value="Cliente">Cliente (Acquirente/Inquilino)</option>
                  <option value="Proprietario">Proprietario</option>
                  <option value="Locatore">Locatore</option>
                  <option value="Proprietario, Locatore">Proprietario, Locatore</option>
                  <option value="Agente Immobiliare">Agente Immobiliare</option>
                  <option value="Intermediario">Intermediario</option>
                  <option value="Fotografo">Fotografo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">Telefono *</label>
                  <input 
                    type="tel" 
                    name="telefono" 
                    required
                    placeholder="+41 79 000 00 00"
                    defaultValue={currentContatto ? currentContatto.telefono : ''}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">E-mail *</label>
                  <input 
                    type="email" 
                    name="mail" 
                    required
                    placeholder="nome@dominio.ch"
                    defaultValue={currentContatto ? currentContatto.mail : ''}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#86868B] mb-1">Note Libere Contatto</label>
                <textarea 
                  name="note" 
                  rows="3"
                  placeholder="Note operative, referenze e preferenze immobili..."
                  defaultValue={currentContatto ? currentContatto.note : ''}
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5EA] flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsContattoModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full text-sm font-semibold text-[#1D1D1F]"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-semibold shadow-sm"
                >
                  Salva Contatto
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODALE VISITE E APPUNTAMENTI (CALENDARIO) */}
      {/* ========================================================= */}
      {isVisitaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden">
            
            <div className="px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F5F5F7]">
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
                {currentVisita ? 'Modifica Appuntamento' : 'Pianifica Attività / Visita'}
              </h3>
              <button 
                onClick={() => setIsVisitaModalOpen(false)}
                className="w-7 h-7 bg-white rounded-full border border-[#D2D2D7] flex items-center justify-center font-bold text-sm text-[#86868B] hover:text-[#1D1D1F]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVisita} className="p-6 space-y-4">
              {currentVisita && <input type="hidden" name="id" value={currentVisita.id} />}

              {/* Relazione Immobile */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] mb-1">Immobile Visitato / Target *</label>
                <select 
                  name="immobile_id" 
                  required
                  defaultValue={currentVisita ? currentVisita.immobile_id : ''}
                  className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                >
                  <option value="">Seleziona l'immobile...</option>
                  {immobili.map(i => (
                    <option key={i.id} value={i.id}>{i.nome_immobile}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data e Ora */}
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">Data e Ora *</label>
                  <input 
                    type="datetime-local" 
                    name="data_ora" 
                    required
                    defaultValue={currentVisita ? currentVisita.data_ora : '2026-05-12T10:00'}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-gray-700"
                  />
                </div>

                {/* Tipo Visita */}
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] mb-1">Tipologia Attività *</label>
                  <select 
                    name="tipo_visita"
                    defaultValue={currentVisita ? currentVisita.tipo_visita : 'Shooting Fotografico'}
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-sm focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                  >
                    <option value="Shooting Fotografico">Shooting Fotografico</option>
                    <option value="Visita Cliente">Visita Cliente</option>
                    <option value="Primo Incontro">Primo Incontro</option>
                    <option value="Sopralluogo Tecnico">Sopralluogo Tecnico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Esito (Segmented style helper) */}
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

                {/* Cliente / Fotografo collegato */}
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

              {/* Partecipanti (string list) */}
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

              {/* Autore dell'attività */}
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

              {/* Feedback */}
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

              <div className="pt-4 border-t border-[#E5E5EA] flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsVisitaModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full text-sm font-semibold text-[#1D1D1F]"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-semibold shadow-sm"
                >
                  Salva Appuntamento
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}