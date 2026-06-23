import React from 'react';
import { IconPlus } from './Icons';

export const DashboardTab = React.memo(({
  activeTab,
  setActiveTab,
  isOffline,
  isCRMLoading,
  immobili,
  visite,
  contatti,
  profile,
  setFilterPropertyType,
  setFilterStato,
  setIsImmobileModalOpen,
  setCurrentImmobile,
  setActiveFormTab,
  handleCreateContatto,
  handleCreateVisita,
  handleViewVisita
}) => {
  if (activeTab !== 'dashboard') return null;

  // Helpers localized to avoid unnecessary global scopes
  const getContactName = (id) => {
    const contact = contatti.find(c => c.id === id);
    return contact ? `${contact.nome} ${contact.cognome}` : 'Non assegnato';
  };

  const getImmobileName = (id) => {
    if (!id) return 'Nessun immobile';
    const imm = immobili.find(i => Number(i.id) === Number(id));
    return imm ? (imm.nome || imm.nome_immobile) : 'Immobile sconosciuto';
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

  const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });

  // Filtered lists and stats
  const activeVenditaCount = immobili.filter(imm => imm.immobile_in && imm.immobile_in.includes('Vendita') && imm.stato !== 'Venduto' && imm.stato !== 'Lead').length;
  const activeAffittoCount = immobili.filter(imm => imm.immobile_in && imm.immobile_in.includes('Affitto') && imm.stato !== 'Affittato' && imm.stato !== 'Lead').length;
  const activeTrattativaCount = immobili.filter(imm => imm.stato === 'In Trattativa').length;
  const vendutoCount = immobili.filter(imm => imm.stato === 'Venduto').length;
  const affittatoCount = immobili.filter(imm => imm.stato === 'Affittato').length;

  const portafoglioValore = (immobili
    .filter(imm => imm.immobile_in && imm.immobile_in.includes('Vendita') && imm.stato !== 'Venduto' && imm.stato !== 'Lead')
    .reduce((acc, curr) => acc + (Number(curr.prezzo_di_vendita) || 0), 0) / 1000000
  ).toFixed(2);

  const upcomingEvents = [...visite]
    .filter(v => new Date(v.inizio_evento) >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.inizio_evento) - new Date(b.inizio_evento));

  const totalEvents = upcomingEvents.length > 0
    ? upcomingEvents
    : [...visite].sort((a, b) => new Date(a.inizio_evento) - new Date(b.inizio_evento));

  const eventsToShow = totalEvents.slice(0, 5);
  const extraCount = totalEvents.length - 5;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
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
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{activeVenditaCount}</span>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Vendita'); setFilterStato('Disponibile'); }}
              className="text-xs text-[#0071E3] hover:underline flex items-center self-start"
            >
              Vedi archivio →
            </button>
          </div>

          {/* Immobili in Affitto */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili in Affitto</span>
              <span className="p-1.5 rounded-lg bg-green-50 text-green-600 text-xs">🔑 In Affitto</span>
            </div>
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{activeAffittoCount}</span>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Affitto'); setFilterStato('Disponibile'); }}
              className="text-xs text-[#0071E3] hover:underline flex items-center self-start"
            >
              Vedi archivio →
            </button>
          </div>

          {/* Portafoglio Stimato */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 border border-blue-500/10 bg-gradient-to-br from-white to-blue-50/20">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Portafoglio Stimato</span>
              <span className="p-1.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] text-xs font-semibold">💰 Valore</span>
            </div>
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-28 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="inline-block text-2xl font-bold text-[#0071E3] whitespace-nowrap overflow-visible">
                  CHF {portafoglioValore}M
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
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{activeTrattativaCount}</span>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Tutti'); setFilterStato('In Trattativa'); }}
              className="text-xs text-[#0071E3] hover:underline flex items-center self-start"
            >
              Vedi trattative →
            </button>
          </div>

          {/* Immobili Venduti */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Venduti</span>
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs">✨ Venduti</span>
            </div>
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{vendutoCount}</span>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Vendita'); setFilterStato('Venduto'); }}
              className="text-xs text-[#0071E3] hover:underline flex items-center self-start"
            >
              Vedi venduti →
            </button>
          </div>

          {/* Immobili Affittati */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-36 hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">Immobili Affittati</span>
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 text-xs">🏡 Affittati</span>
            </div>
            <div className="my-1">
              {isCRMLoading ? (
                <div className="h-9 w-16 bg-gradient-to-r from-[#F5F5F7] via-[#EBEBEB] to-[#F5F5F7] rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold tracking-tight text-[#1D1D1F]">{affittatoCount}</span>
              )}
            </div>
            <button
              onClick={() => { setActiveTab('immobili'); setFilterPropertyType('Affitto'); setFilterStato('Affittato'); }}
              className="text-xs text-[#0071E3] hover:underline flex items-center self-start"
            >
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
            if (eventsToShow.length === 0) {
              return <p className="text-xs text-[#86868B] py-2 text-center">Nessun appuntamento in programma.</p>;
            }

            return (
              <div className="space-y-4">
                <div className="space-y-4">
                  {eventsToShow.map((item) => {
                    const startObj = new Date(item.inizio_evento);
                    const endObj = item.fine_evento ? new Date(item.fine_evento) : null;
                    const clienteName = getContactName(item.cliente_id);
                    const immobileName = getImmobileName(item.immobile_di_riferimento_id);
                    const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
                    const isMyEv = isMyEvent(item);
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
                                  Gestito da: <span className="font-bold text-[#555]">{isMyEv ? 'Me' : (item.creato_da || 'CRM')}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] uppercase shadow-sm ${
                                  isMyEv
                                    ? 'bg-gradient-to-tr from-[#0071E3] to-[#5AC8FA] text-white border border-[#0071E3]/20'
                                    : 'bg-gradient-to-tr from-[#8E8E93] to-[#D2D2D7] text-white border border-[#8E8E93]/20'
                                }`} title={item.creato_da || 'MASSIMILIANO BOLDI'}>
                                  {isMyEv ? 'TU' : getCreatorTag(item)}
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
  );
});
