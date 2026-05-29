<aside className='listasHistorico'>
    <section className='listaMundosHistorico'>
        <div className='topoListaMundosHistorico'>
            <h3>Selecione um mundo</h3>
            <p className='paragrafoInformativo'>Abaixo tem todos os mundos que você criou, isso não
                significa que todos eles vão ter um histórico!</p>
        </div>
        <div className='itensMundosHistorico'>
            {
                carregandoMundos ?
                    <>
                        <span className='loadingPequeno'>
                            <img src={LoadingGig} alt="" />
                        </span>
                    </>
                    :
                    <>
                        {mundos.map((mundo, index) => {
                            const ativo = mundoSelecionado === mundo.id;
                            return (
                                <div
                                    key={mundo.id}
                                    className={`itemMundoHistorico ${ativo ? 'ativo' : ''}`}
                                    onClick={() => {
                                        setMundoSelecionado(mundo.id);
                                        setAgenteSelecionado(-1);
                                    }}
                                >

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3>{mundo.nome}</h3><p><span className='destaqueGold'>ID: {mundo.id}</span></p>
                                    </div>
                                    <p className='paragrafoInformativo'>Data de criação: {formatarData(mundo.data_criacao)}</p>
                                    <p className='paragrafoInformativo'>
                                        <b>Salas ativas:</b> {mundo.estatisticas.salasAtivas} <br />
                                        <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                        <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                        <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                    </p>

                                </div>
                            )
                        })}

                        {!carregandoMundos && mundos.length > 0 && (
                            carregandoMaisMundos ? (
                                <div className='loadingPequeno'>
                                    <img src={LoadingGig} alt="" />
                                </div>
                            ) : temMaisMundos ? (
                                <div className='loadingPequeno'>
                                    <button
                                        onClick={carregarMaisMundos}
                                        disabled={carregandoMaisMundos}
                                        style={{ padding: '10px' }}
                                    >
                                        Carregar mais
                                    </button>
                                </div>
                            ) : null
                        )}
                    </>
            }


        </div>
    </section>
    <section className='listaAgentesHistorico listaMundosHistorico'>
        <div className='topoListaMundosHistorico'>
            <h3>Selecione um agente</h3>
            <p className='paragrafoInformativo'>Você pode ou não selecionar um agente. Se não selecionar,
                a lista exibirá o histórico de todos os agentes para aquele ambiente!</p>
        </div>
        <div className='itensMundosHistorico'>
            {
                carregandoAgentes ?
                    <>
                        <span className='loadingPequeno'>
                            <img src={LoadingGig} alt="" />
                        </span>
                    </>
                    :
                    <>
                        {agentesDoDB.map((agente) => {
                            const ativo = agenteSelecionado == agente.id;

                            return (
                                <div
                                    key={agente.id}
                                    className={`itemAgente ${agente.id == agenteSelecionado ? 'agenteAtivo' : ''}`}
                                    onClick={() => {
                                        if (agenteSelecionado == agente.id) {
                                            setAgenteSelecionado(-1);
                                        } else {
                                            setAgenteSelecionado(agente.id);
                                        }

                                    }}
                                >
                                    <h3>{agente.nome}</h3>
                                    <p className='paragrafoInformativo destaqueGold'>ID: {agente.id}</p>
                                    {agente.tipo == 2 ?
                                        <>
                                            <p className="destaqueRed paragrafoInformativo">✎ Agente lógico personalizado</p>
                                            <p className="paragrafoInformativo">
                                                {[
                                                    agente.properties.corajoso && "🛡 Corajoso",
                                                    agente.properties.explorador && "◈ Explorador",
                                                    agente.properties.garimpeiro && "✦ Garimpeiro",
                                                    agente.properties.cacador && "⚔ Caçador"
                                                ]
                                                    .filter(Boolean)
                                                    .map((texto, index, arr) => (
                                                        <span key={index}>
                                                            {texto}
                                                            {index < arr.length - 1 && <br />}
                                                        </span>
                                                    ))}
                                            </p>
                                        </> :
                                        <>
                                            <p className="destaqueGold paragrafoInformativo">✎ Agente evolutivo personalizado</p>
                                            <p className="paragrafoInformativo">
                                                ⟳ Gerações: {agente.properties.geracoes} <br />
                                                ≡ População: {agente.properties.populacao} <br />
                                                ❤ Taxa de cruzamento: {agente.properties.taxa_de_cruzamento}% <br />
                                                ⚯ Taxa de mutação: {agente.properties.taxa_de_mutacao}% <br />
                                            </p>
                                        </>
                                    }
                                </div>
                            )
                        })}

                        {temMaisAgentes && !carregandoAgentes && (
                            <div className='loadingPequeno'>
                                {carregandoMaisAgentes ? (
                                    <img src={LoadingGig} alt="Carregando..." />
                                ) : (
                                    <button
                                        style={{ padding: '10px', marginTop: '10px' }}
                                        onClick={carregarMaisAgentes}
                                        disabled={carregandoMaisAgentes}
                                    >
                                        Carregar mais agentes
                                    </button>
                                )}
                            </div>
                        )}
                    </>
            }

        </div>
    </section>
</aside>