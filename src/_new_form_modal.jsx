          {/* 1. MODALE IMMOBILI (FORM COMPLETO PER CREAZIONE/MODIFICA) */}
          {isImmobileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden my-8 max-h-[90vh] flex flex-col text-[#1D1D1F]">

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

                  {/* ========= SEZIONE 1: INFORMAZIONI PRINCIPALI ========= */}
                  <div className="space-y-4">
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
                  <div className="space-y-4">
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
                            type="month"
                            name="ultimo_rinnovo_input"
                            defaultValue={currentImmobile ? (() => {
                              if (!currentImmobile.ultimo_rinnovo) return "";
                              const year = Math.floor(currentImmobile.ultimo_rinnovo / 100);
                              const month = currentImmobile.ultimo_rinnovo % 100;
                              if (year && month) {
                                return `${year}-${String(month).padStart(2, '0')}`;
                              }
                              return "";
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
                    </div>
                  </div>

                  {/* ========= SEZIONE 3: CONTATTI ========= */}
                  <div className="space-y-4">
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
                  <div className="space-y-4">
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
                  <div className="space-y-4">
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

                  {/* ========= SEZIONE 6: LOG ========= */}
                  {currentImmobile && (
                    <div className="space-y-4">
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
                            value={currentImmobile.ultima_modifica_il || '-'}
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

                  {/* Buttons */}
                  <div className="pt-4 border-t border-[#E5E5EA] flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsImmobileModalOpen(false)}
                      className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full text-sm font-semibold transition-all"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-semibold transition-all shadow-sm"
                    >
                      Salva Scheda
                    </button>
                  </div>
