import React, { useMemo } from 'react';
import { IconSearch, IconEdit, IconTrash } from './Icons';

export const ContattiTab = React.memo(({
  activeTab,
  isOffline,
  isCRMLoading,
  contatti,
  searchContact,
  setSearchContact,
  filterContactRuolo,
  setFilterContactRuolo,
  sortContactOrder,
  setSortContactOrder,
  handleViewContatto,
  handleEditContatto,
  handleDeleteContatto
}) => {
  if (activeTab !== 'contatti') return null;

  // Localized memoized sorting and filtering logic
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
              <option value="Acquirente">Acquirente</option>
              <option value="Affittuario">Affittuario</option>
              <option value="Intermediario">Intermediario</option>
              <option value="Fotografo">Fotografo</option>
              <option value="Servizi">Servizi</option>
              <option value="Manutenzione">Manutenzione</option>
              <option value="Amministratore">Amministratore</option>
              <option value="Custode">Custode</option>
              <option value="Tecnico / Perito">Tecnico / Perito</option>
              <option value="Artigiano / Impresa">Artigiano / Impresa</option>
              <option value="Notaio / Avvocato">Notaio / Avvocato</option>
              <option value="Cliente">Cliente</option>
              <option value="Altro">Altro</option>
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
                  </tr>
                ))
              ) : contatti.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-[#86868B]">
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
                          <span className="font-bold text-sm block text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                            {sortContactOrder === 'nome-cognome' ? `${item.nome || ''} ${item.cognome || ''}` : `${item.cognome || ''} ${item.nome || ''}`}
                          </span>
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
            <div key={n} className="glass-card p-4 rounded-3xl border border-[#E5E5EA] bg-white flex flex-col space-y-3 animate-pulse">
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
        ) : filteredContatti.length === 0 ? (
          <p className="text-center text-xs text-[#86868B] py-8">Nessun risultato per la ricerca.</p>
        ) : (
          filteredContatti.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleViewContatto(item)}
              className="glass-card p-4 rounded-3xl border border-[#E5E5EA] bg-white flex flex-col space-y-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                    {(item.nome || 'U').charAt(0)}{(item.cognome || '').charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#1D1D1F] block group-hover:text-[#0071E3] transition-colors">
                      {sortContactOrder === 'nome-cognome' ? `${item.nome || ''} ${item.cognome || ''}` : `${item.cognome || ''} ${item.nome || ''}`}
                    </span>
                    {item.societa && (
                      <span className="text-xs text-[#86868B] block font-medium mt-0.5">{item.societa}</span>
                    )}
                  </div>
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
        )}
      </div>
    </div>
  );
});
