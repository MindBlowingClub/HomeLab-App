import React, { useMemo } from 'react';
import { IconSearch } from './Icons';
import { SecureImageBackground } from './SecureImage';

export const ImmobiliTab = React.memo(({
  activeTab,
  isOffline,
  isCRMLoading,
  isRealSupabase,
  immobili,
  contatti,
  searchProperty,
  setSearchProperty,
  showAdvancedFilters,
  setShowAdvancedFilters,
  hasActiveFilters,
  resetAllFilters,
  filterPropertyType,
  setFilterPropertyType,
  filterTipo,
  setFilterTipo,
  filterStato,
  setFilterStato,
  filterComune,
  setFilterComune,
  filterAgenteId,
  setFilterAgenteId,
  filterVendibileStranieri,
  setFilterVendibileStranieri,
  filterResidenza,
  setFilterResidenza,
  filterMandatoFirmato,
  setFilterMandatoFirmato,
  filterLocaliMin,
  setFilterLocaliMin,
  filterBagniMin,
  setFilterBagniMin,
  filterPrezzoMin,
  setFilterPrezzoMin,
  filterPrezzoMax,
  setFilterPrezzoMax,
  filterSuperficieMin,
  setFilterSuperficieMin,
  filterSuperficieMax,
  setFilterSuperficieMax,
  filterGarageMin,
  setFilterGarageMin,
  filterPostiAutoMin,
  setFilterPostiAutoMin,
  sortProperty,
  setSortProperty,
  handleViewImmobile
}) => {
  if (activeTab !== 'immobili') return null;

  // Localized calculations to optimize state updates
  const uniqueComuni = useMemo(() => {
    return Array.from(
      new Set(immobili.map(item => item.comune).filter(Boolean))
    ).sort();
  }, [immobili]);

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
        
        const surfaceVal = Number(item.superficie_abitabile || item.superficie_utile || 0);
        const matchSuperficieMin = !filterSuperficieMin || surfaceVal >= Number(filterSuperficieMin);
        const matchSuperficieMax = !filterSuperficieMax || surfaceVal <= Number(filterSuperficieMax);
        const matchSuperficie = matchSuperficieMin && matchSuperficieMax;
        
        const matchGarage = !filterGarageMin || Number(item.garage || 0) >= Number(filterGarageMin);
        const matchPostiAuto = !filterPostiAutoMin || Number(item.parcheggio || 0) >= Number(filterPostiAutoMin);
        
        return matchSearch && matchType && matchTipo && matchStato && matchComune && 
               matchVendibileStranieri && matchResidenza && matchMandatoFirmato && matchAgenteId &&
               matchPrezzoMin && matchPrezzoMax && matchLocali && matchBagni && matchSuperficie &&
               matchGarage && matchPostiAuto;
      })
      .sort((a, b) => {
        if (sortProperty === 'prezzo-asc') {
          const aPrice = Number(a.prezzo_di_vendita || 0);
          const bPrice = Number(b.prezzo_di_vendita || 0);
          return aPrice - bPrice;
        }
        if (sortProperty === 'prezzo-desc') {
          const aPrice = Number(a.prezzo_di_vendita || 0);
          const bPrice = Number(b.prezzo_di_vendita || 0);
          return bPrice - aPrice;
        }
        if (sortProperty === 'superficie-asc') {
          const aSup = Number(a.superficie_abitabile || a.superficie_utile || 0);
          const bSup = Number(b.superficie_abitabile || b.superficie_utile || 0);
          return aSup - bSup;
        }
        if (sortProperty === 'superficie-desc') {
          const aSup = Number(a.superficie_abitabile || a.superficie_utile || 0);
          const bSup = Number(b.superficie_abitabile || b.superficie_utile || 0);
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
    filterSuperficieMin, filterSuperficieMax, filterGarageMin, filterPostiAutoMin, sortProperty
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
            {/* Row 1: Dati Principali */}
            {/* Tipo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Tipo Immobile</label>
              <div className="relative">
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti i tipi</option>
                  {[
                    "Abitazione ammobiliata", "App. a terrazza", "App. ultimo piano", "Appartamento",
                    "Appartamento annesso", "Arcade", "Atelier", "Attico", "Bar", "Caffè", "Camera",
                    "Cantina", "Casa a schiera", "Casa a terrazza", "Casa bifamiliare",
                    "Casa plurifamiliare", "Casa unifamiliare", "Castello", "Centro commerciale",
                    "Chalet", "Chiosco", "Club / Discoteca", "Commerci", "Commercio", "Dépendance",
                    "Duplex/maisonette", "Edificio commerciale", "Fabbrica", "Fattoria", "Garage doppio",
                    "Garage singolo", "Hotel", "Immob. residenziale/commerciale", "Industria/Commercio",
                    "Locale per hobby", "Loft", "Magazzino", "Officina", "Parcheggio aperto",
                    "Parcheggio coperto", "Parcheggio sotterraneo", "Posteggio", "Posteggio moto in garage",
                    "Pub", "Ristorante", "Rustico", "Salona da parrucchiere", "Sfruttamento agricolo",
                    "Soffitta", "Studio", "Studio medico", "Terreno commerciale", "Terreno per costruire",
                    "Ufficio", "Villa"
                  ].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Stato */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Stato</label>
              <div className="relative">
                <select
                  value={filterStato}
                  onChange={(e) => setFilterStato(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti gli stati</option>
                  <option value="Disponibile">Disponibile (incl. in Trattativa)</option>
                  <option value="Lead">Lead</option>
                  <option value="In Trattativa">In Trattativa</option>
                  <option value="Venduto">Venduto</option>
                  <option value="Affittato">Affittato</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Comune */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Comune</label>
              <div className="relative">
                <select
                  value={filterComune}
                  onChange={(e) => setFilterComune(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti i comuni</option>
                  {uniqueComuni.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Responsabile Oggetto */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Responsabile Oggetto</label>
              <div className="relative">
                <select
                  value={filterAgenteId}
                  onChange={(e) => setFilterAgenteId(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti i responsabili</option>
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
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 2: Caratteristiche Interne/Esterne */}
            {/* Locali Minimo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Locali (minimo)</label>
              <div className="relative">
                <select
                  value={filterLocaliMin}
                  onChange={(e) => setFilterLocaliMin(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Qualsiasi</option>
                  <option value="1">1+ locali</option>
                  <option value="2">2+ locali</option>
                  <option value="3">3+ locali</option>
                  <option value="4">4+ locali</option>
                  <option value="5">5+ locali</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
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
                className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
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
                className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
              />
            </div>

            {/* Bagni Minimo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Bagni (minimo)</label>
              <div className="relative">
                <select
                  value={filterBagniMin}
                  onChange={(e) => setFilterBagniMin(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Qualsiasi</option>
                  <option value="1">1+ bagni</option>
                  <option value="2">2+ bagni</option>
                  <option value="3">3+ bagni</option>
                  <option value="4">4+ bagni</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 3: Prezzo e Superficie (Affiancati su 2 colonne ciascuno) */}
            {/* Prezzo Range */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Prezzo (Min - Max)</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterPrezzoMin}
                    onChange={(e) => setFilterPrezzoMin(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                  />
                  <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 text-[10px] pointer-events-none font-semibold">CHF</span>
                </div>
                <span className="text-[#86868B] text-xs font-semibold">—</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterPrezzoMax}
                    onChange={(e) => setFilterPrezzoMax(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                  />
                  <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 text-[10px] pointer-events-none font-semibold">CHF</span>
                </div>
              </div>
            </div>

            {/* Superficie Range */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Superficie (Min - Max mq)</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterSuperficieMin}
                    onChange={(e) => setFilterSuperficieMin(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                  />
                  <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 text-[10px] pointer-events-none font-semibold">m²</span>
                </div>
                <span className="text-[#86868B] text-xs font-semibold">—</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterSuperficieMax}
                    onChange={(e) => setFilterSuperficieMax(e.target.value)}
                    className="w-full pl-3 pr-7 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all"
                  />
                  <span className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 text-[10px] pointer-events-none font-semibold">m²</span>
                </div>
              </div>
            </div>

            {/* Row 4: Aspetti Contrattuali e Bottoni */}
            {/* Mandato Firmato */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Mandato Firmato</label>
              <div className="relative">
                <select
                  value={filterMandatoFirmato}
                  onChange={(e) => setFilterMandatoFirmato(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti</option>
                  <option value="Si">Sì</option>
                  <option value="No">No</option>
                  <option value="Stand By">Stand By</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Tipo di Residenza */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Tipo Residenza</label>
              <div className="relative">
                <select
                  value={filterResidenza}
                  onChange={(e) => setFilterResidenza(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutte</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Secondaria">Secondaria</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Vendibile a stranieri */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#86868B] mb-1">Vendibile a Stranieri</label>
              <div className="relative">
                <select
                  value={filterVendibileStranieri}
                  onChange={(e) => setFilterVendibileStranieri(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white text-[#1D1D1F] transition-all appearance-none cursor-pointer"
                >
                  <option value="Tutti">Tutti</option>
                  <option value="Si">Sì</option>
                  <option value="No">No</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Actions / Reset / Apply */}
            <div className="flex items-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="flex-1 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full transition-all text-center flex items-center justify-center shadow-sm"
              >
                Applica
              </button>
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2 bg-white hover:bg-gray-100 border border-[#D2D2D7] text-[#1D1D1F] text-xs font-semibold rounded-full transition-all text-center flex items-center justify-center"
              >
                Azzera
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
              <SecureImageBackground
                url={item.immagine_di_riferimento}
                className="h-44 relative overflow-hidden flex items-center justify-center bg-cover bg-center"
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-3 left-3 flex space-x-2 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm ${item.stato === 'Disponibile' ? 'bg-[#34C759] text-white' :
                      item.stato === 'In Trattativa' ? 'bg-[#FF9500] text-white' :
                        item.stato === 'Venduto' ? 'bg-[#8E8E93] text-white' :
                          item.stato === 'Lead' ? 'bg-[#AF52DE] text-white' : 'bg-[#0071E3] text-white'
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

                {item.immobile_in && item.immobile_in.some(v => v === 'Vendita' || v === 'Affitto') && (
                  <span className="absolute bottom-3 right-3 bg-[#0071E3] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
                    In {item.immobile_in.filter(v => v === 'Vendita' || v === 'Affitto').join(' / ')}
                  </span>
                )}
              </SecureImageBackground>

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
  );
});
