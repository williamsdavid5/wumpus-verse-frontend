import './styles/historico.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import Buraco from '../assets/skins/buraco.png'
import LoadingGig from '../assets/loadingGif.gif'

import { useEffect, useState, useRef, useTransition } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Historico() {
    const { getMundosSalvos, getAgentes, getExecucoesUsuario } = useAuth();

    const [carregandoMundos, setCarregandoMundos] = useState(false);
    const [temMaisMundos, setTemMaisMundos] = useState(false)
    const [mundos, setMundos] = useState([]);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [carregandoMaisMundos, setCarregandoMaisMundos] = useState(false);
    const [carregandoAgentes, setCarregandoAgentes] = useState(false);
    const [carregadoHistorico, setCarregandoHistorico] = useState(false);
    const [paginaAtualMundos, setPaginaAtualMundos] = useState(1);

    const [agentesDoDB, setAgentesDoDB] = useState([]);
    const [agenteSelecionado, setAgenteSelecionado] = useState(-1);
    const [paginaAgentesAtual, setPaginaAgentesAtual] = useState(1);
    const [temMaisAgentes, setTemMaisAgentes] = useState(true);
    const [carregandoMaisAgentes, setCarregandoMaisAgentes] = useState(false);

    const [historico, setHistorico] = useState([]);
    const [carregandoMaisHistorico, setCarregandoMaisHistorico] = useState(false);
    const [paginaAtualHistorico, setPaginaAtualHistorico] = useState(1);
    const [temMaisHistorico, setTemMaisHistorico] = useState(false);

    function formatarData(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    async function carregarMundosSalvos(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregandoMundos(true);
        } else {
            setCarregandoMaisMundos(true);
        }
        try {
            const resposta = await getMundosSalvos(pagina, 6);

            if (!resposta || !Array.isArray(resposta) || resposta.length === 0) {
                if (pagina === 1) {
                    setMundos([]);
                }
                setCarregandoMundos(false);
                return;
            }

            const temMais = !resposta[resposta.length - 1];
            const itensMundos = resposta.slice(0, resposta.length - 1);

            if (itensMundos.length > 0) {
                if (limparLista || pagina === 1) {
                    setMundos(itensMundos);
                } else {
                    setMundos(prev => [...prev, ...itensMundos]);
                }
            } else if (pagina === 1) {
                setMundos([]);
            }

            setTemMaisMundos(temMais);

            setPaginaAtualMundos(pagina);

        } catch (error) {
            console.error('Erro ao carregar mundos:', error);
            await confirm({})
            setTemMaisMundos(false);
        } finally {
            if (pagina === 1) {
                setCarregandoMundos(false);
            }

            if (mundos.length > 0) {
                setCarregandoMaisMundos(false);
            }
        }
    }

    function carregarMaisMundos() {
        if (!carregandoMaisMundos && temMaisMundos) {
            carregarMundosSalvos(paginaAtualMundos + 1, false);
        }
    }

    async function carregarAgentesDoDB(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregandoAgentes(true);
        } else {
            setCarregandoMaisAgentes(true);
        }

        try {
            const data = await getAgentes(pagina, 5);
            const agentesRecebidos = data.agentes || [];
            const temMais = data.hasMore || (agentesRecebidos.length === 5); // Ajuste conforme sua API retorna

            if (agentesRecebidos.length > 0) {
                if (limparLista || pagina === 1) {
                    setAgentesDoDB(agentesRecebidos);
                } else {
                    setAgentesDoDB(prev => [...prev, ...agentesRecebidos]);
                }
            } else if (pagina === 1) {
                setAgentesDoDB([]);
            }

            setTemMaisAgentes(temMais);
            setPaginaAgentesAtual(pagina);

        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
            await confirm({
                title: "Erro",
                message: "Não foi possível carregar os agentes salvos",
                type: "alert",
                botao1: "OK"
            });
        } finally {
            if (pagina === 1) {
                setCarregandoAgentes(false);
            }
            setCarregandoMaisAgentes(false);
        }
    }

    function carregarMaisAgentes() {
        if (!carregandoMaisAgentes && temMaisAgentes) {
            carregarAgentesDoDB(paginaAgentesAtual + 1, false);
        }
    }

    async function carregarHistorico(pagina = 1, limparLista = true) {
        if (!mundoSelecionado) {
            setHistorico([]);
            setTemMaisHistorico(false);
            return;
        }

        if (pagina === 1) {
            setCarregandoHistorico(true);
        } else {
            setCarregandoMaisHistorico(true);
        }

        try {
            const agentId = agenteSelecionado > -1 ? agenteSelecionado : 0;
            const resposta = await getExecucoesUsuario(
                pagina,
                10,
                agentId,
                mundoSelecionado
            );

            console.log("Resposta completa:", resposta);

            let historicoItens = [];
            let temMais = false;

            if (resposta && resposta.execucoes && Array.isArray(resposta.execucoes)) {
                historicoItens = resposta.execucoes;
                temMais = resposta.hasMore || false;
            } else if (Array.isArray(resposta)) {
                const ultimoItem = resposta[resposta.length - 1];
                if (typeof ultimoItem === 'boolean') {
                    temMais = ultimoItem;
                    historicoItens = resposta.slice(0, -1);
                } else {
                    historicoItens = resposta;
                    temMais = resposta.length === 10;
                }
            } else if (resposta && resposta.data && Array.isArray(resposta.data)) {
                historicoItens = resposta.data;
                temMais = resposta.hasMore || false;
            } else {
                historicoItens = [];
                temMais = false;
            }

            console.log("Itens do histórico extraídos:", historicoItens);
            console.log("Tem mais páginas:", temMais);

            if (limparLista || pagina === 1) {
                setHistorico(historicoItens);
            } else {
                setHistorico(prev => [...prev, ...historicoItens]);
            }

            setTemMaisHistorico(temMais);
            setPaginaAtualHistorico(pagina);

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            setHistorico([]);
            setTemMaisHistorico(false);
        } finally {
            if (pagina === 1) {
                setCarregandoHistorico(false);
            }
            setCarregandoMaisHistorico(false);
        }
    }

    function carregarMaisHistorico() {
        if (!carregandoMaisHistorico && temMaisHistorico) {
            carregarHistorico(paginaAtualHistorico + 1, false);
        }
    }

    useEffect(() => {
        carregarMundosSalvos(1, true);
        carregarAgentesDoDB(1, true);
    }, [])

    useEffect(() => {
        if (mundoSelecionado) {
            setPaginaAtualHistorico(1);
            carregarHistorico(1, true);
        } else {
            setHistorico([]);
            setTemMaisHistorico(false);
        }
    }, [mundoSelecionado]);

    useEffect(() => {
        if (mundoSelecionado) {
            setPaginaAtualHistorico(1);
            carregarHistorico(1, true);
        }
    }, [agenteSelecionado]);

    useEffect(() => {
        console.log(historico);
    }, [historico]);

    return (
        <>
            <main className="historicoMain mundosMain">
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
                <section className='secaoHistoricoMundo'>
                    <div className='topoSecaoHistoricoMundo'>
                        <h1>Histórico</h1>
                        <p className='paragrafoInformativo'>
                            Histórico de execução para o mundo selecionado
                        </p>
                        <p style={{ color: mundoSelecionado ? 'inherit' : 'red' }}>
                            {mundoSelecionado ? '✔ ' : '✖ '} Selecionou um mundo
                        </p>

                        <p style={{ color: agenteSelecionado > -1 ? 'inherit' : 'red' }}>
                            {agenteSelecionado > -1 ? '✔ ' : '✖ '} Selecionou um agente
                        </p>
                    </div>
                    <div className='itensListaHistorico itensMundosHistorico'>
                        {
                            carregadoHistorico ?
                                <>
                                    <span className='loadingPequeno'>
                                        <img src={LoadingGig} alt="" />
                                    </span>
                                </>
                                :
                                <>
                                    {historico.length > 0 ?
                                        <>
                                            {historico.map((dadoHistorico) => {
                                                return (
                                                    <div className='itemAgente' key={dadoHistorico.id}>
                                                        <h2>ID: {dadoHistorico.id}</h2>
                                                        <p><b>Pontuação na partida:</b> {dadoHistorico.pontos}</p>
                                                        <p className='paragrafoInformativo'>
                                                            <span className='destaqueGold'>
                                                                <b>Mundo ID:</b> {dadoHistorico.ambiente_id}, <b>Agente ID:</b> {dadoHistorico.agente_id}<br />
                                                            </span>
                                                            <b>Data de criação:</b> {formatarData(dadoHistorico.data)} <br />
                                                        </p>
                                                        <p className='paragrafoInformativo pDadosHistorico'>
                                                            <b>Dados da partida:</b> <br />
                                                            - <b>Posição inicial:</b> [{dadoHistorico.posicao_x},{dadoHistorico.posicao_y}] <br />
                                                            - <b>Munição inicial:</b> {dadoHistorico.qtd_flechas} <br />
                                                            - <b>Ouro no ambiente:</b> {dadoHistorico.qtd_ouro} <br />
                                                            - <b>Wumpus:</b> {dadoHistorico.qtd_wumpus}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </>
                                        :
                                        <>
                                            <div className='loadingPequeno'>
                                                <p>Sem histórico</p>
                                            </div>
                                        </>
                                    }
                                </>
                        }
                    </div>
                </section>
            </main>
        </>
    )
}