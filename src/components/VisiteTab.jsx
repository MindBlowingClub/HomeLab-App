import React, { useMemo } from 'react';
import { IconSearch } from './Icons';

export const VisiteTab = React.memo(({
  activeTab,
  calendarView,
  setCalendarView,
  currentCalendarDate,
  setCurrentCalendarDate,
  visite,
  contatti,
  immobili,
  searchVisit,
  setSearchVisit,
  filterVisitAgent,
  setFilterVisitAgent,
  filterVisitClient,
  setFilterVisitClient,
  filterVisitProperty,
  setFilterVisitProperty,
  filterVisitType,
  setFilterVisitType,
  filterVisitOutcome,
  setFilterVisitOutcome,
  showAdvancedCalendarFilters,
  setShowAdvancedCalendarFilters,
  profile,
  isOffline,
  isCRMLoading,
  listScrollRef,
  calendarScrollRef,
  canAddEvent,
  canModifyEvent,
  isMyEvent,
  getCreatorTag,
  handleScrollToListToday,
  handleDropEvent,
  handleResizeMouseDown,
  handleViewVisita,
  setCurrentVisita,
  setSelectedVisitaImmobileId,
  setSearchVisitaPropertyQuery,
  setIsVisitaModalOpen,
  triggerToast
}) => {
  if (activeTab !== 'visite') return null;

  // Local helpers
  const getContactName = (id) => {
    const contact = contatti.find(c => c.id === id);
    return contact ? `${contact.nome} ${contact.cognome}` : 'Non assegnato';
  };

  const getImmobileName = (id) => {
    if (!id) return 'Nessun immobile';
    const imm = immobili.find(i => Number(i.id) === Number(id));
    return imm ? (imm.nome || imm.nome_immobile) : 'Immobile sconosciuto';
  };

  // Memoized stats and filtered list
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

  const fmtTime = (d) => d.toLocaleTimeString('it-CH', { hour: '2-digit', minute: '2-digit' });

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

          {/* All Day Events Row */}
          <div className={`grid border-b border-[#E5E5EA] bg-gray-50/70 text-center shrink-0 divide-x divide-[#E5E5EA] ${calendarView === 'day' ? 'grid-cols-2' : 'grid-cols-8'}`}>
            <div className="py-2 text-[9px] font-bold text-gray-400 flex items-center justify-center bg-gray-100/50 select-none">
              tutto il giorno
            </div>
            {displayDays.map((wDay, dayIdx) => {
              const isToday = new Date().toDateString() === wDay.date.toDateString();
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

                const currentHour = new Date().getHours();
                const currentMinute = new Date().getMinutes();
                const lineTop = (currentHour * 60 + currentMinute);

                return (
                  <div key={dayIdx} className={`relative min-h-[1440px] divide-y divide-[#E5E5EA]/40 ${isToday ? 'bg-[#0071E3]/2' : ''}`}>
                    {/* Background click grid */}
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
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 -ml-1"></span>
                      </div>
                    )}

                    {/* Positioned Events */}
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
                          title={`${event.nome_evento || event.tipo_visita} - ${getImmobileName(event.immobile_di_riferimento_id)}`}
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
              const clienteName = getContactName(item.cliente_id);
              const immobileName = getImmobileName(item.immobile_di_riferimento_id);
              const partecipantiList = item.partecipanti ? item.partecipanti.split(',').map(p => p.trim()).filter(Boolean) : [];
              const isMyEv = isMyEvent(item);
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
            });
          })()}
        </div>
      )}
    </div>
  );
});
