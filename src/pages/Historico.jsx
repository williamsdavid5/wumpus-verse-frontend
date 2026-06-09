import './styles/historico.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import Buraco from '../assets/skins/buraco.png'
import LoadingGig from '../assets/loadingGif.gif'
import LoadingPage from './LoadingPage'
import Minimapa from './Minimapa'

import { useEffect, useState, useRef, useTransition } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';

function MapaExecucao({ setMostrarMiniMapa, dadoHistorico }) {
    const {
        reexecutarPartida
    } = useAuth();

    const [carregandoPassos, setCarregandoPassos] = useState(false);
    const [passosExecucao, setPassosExecucao] = useState([]);

    async function handleReexecutar(executionId) {
        setCarregandoPassos(true);
        try {
            const resultado = await reexecutarPartida(executionId);
            setPassosExecucao(resultado);
        } catch (error) {
            console.error('Falha na reexecução:', error);
        }
        setCarregandoPassos(false);
    };

    useEffect(() => {
        handleReexecutar(dadoHistorico.id);
    }, [])

    function formatarData(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    return (
        <>
            <div className='mapaReconstrucaoExecucaoContainer'>
                <div className='janelaMapaReconstrucao'>
                    {carregandoPassos ?
                        <>
                            <img src={LoadingGig} alt="" style={{ objectFit: 'contain', width: '60px' }} />
                        </>
                        :
                        <>
                            <div className='topoJanelaReconstrucao'>
                                <span className='informacoesBasicasReconstrucao'>
                                    <h2>ID: {dadoHistorico.id}</h2>
                                    <p><b>Pontuação na partida:</b> {dadoHistorico.pontos}</p>
                                    <p style={{ fontSize: '12px' }}>
                                        <span className='destaqueGold'>
                                            <b>Mundo ID:</b> {dadoHistorico.ambiente_id}, <b>Agente ID:</b> {dadoHistorico.agente_id}<br />
                                        </span>
                                        <b>Data de criação:</b> {formatarData(dadoHistorico.data)} <br />
                                    </p>
                                </span>
                                <button
                                    onClick={() => setMostrarMiniMapa(false)}
                                    className='botaoFecharjanelaMiniMapaReconstrucao'
                                >Fechar</button>
                            </div>
                            <div className='mainJanelaReconstrucao'>
                                <Minimapa
                                    mundoId={dadoHistorico.ambiente_id}
                                    salaInicial={[dadoHistorico.posicao_x, dadoHistorico.posicao_y]}
                                    onSalaSelecionada={false}
                                    modoEdicao={false}
                                    tipoAgente={2}
                                    passosExecucao={passosExecucao}
                                ></Minimapa>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default function Historico() {
    const { getMundosSalvos,
        getAgentes,
        getExecucoesUsuario,
        getEnvironmentsWithExecutions,
        getAgentsWithExecutionsInEnvironment,
        excluirExecution,
        getStaticsAgentsExecutionsInEnvironment,
        reexecutarPartida
    } = useAuth();

    const { confirm } = useConfirm();

    const [carregandoPagina, setCarregandoPagina] = useState(false);
    const [mostrarMinimapa, setMostrarMiniMapa] = useState(false);

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

    const [historicoSelecionado, setHistoricoSelecionado] = useState(null);

    function formatarData(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    const carregarAmbientes = async (paginaAtual = 1, limparLista = true) => {
        if (paginaAtual === 1) {
            setCarregandoMundos(true);
        } else {
            setCarregandoMaisMundos(true);
        }

        try {
            const resposta = await getEnvironmentsWithExecutions(paginaAtual, 5);

            if (limparLista || paginaAtual === 1) {
                setMundos(resposta.environments);
            } else {
                setMundos(prev => [...prev, ...resposta.environments]);
            }

            setTemMaisMundos(resposta.hasMore);
            setPaginaAtualMundos(paginaAtual);

        } catch (error) {
            console.error('Erro ao carregar ambientes:', error);
        } finally {
            if (paginaAtual === 1) {
                setCarregandoMundos(false);
            }
            setCarregandoMaisMundos(false);
        }
    };

    const carregarMaisMundos = () => {
        if (!carregandoMaisMundos && !temMaisMundos) {
            carregarAmbientes(paginaAtualMundos + 1, false);
        }
    };

    const carregarAgentes = async (paginaAtual = 1, limparLista = true) => {
        if (!mundoSelecionado) return;

        if (paginaAtual === 1) {
            setCarregandoAgentes(true);
        } else {
            setCarregandoMaisAgentes(true);
        }

        try {
            const resposta = await getAgentsWithExecutionsInEnvironment(
                mundoSelecionado,
                paginaAtual,
                10
            );

            if (limparLista || paginaAtual === 1) {
                setAgentesDoDB(resposta.agents);
            } else {
                setAgentesDoDB(prev => [...prev, ...resposta.agents]);
            }

            setTemMaisAgentes(resposta.hasMore);
            setPaginaAgentesAtual(paginaAtual);

        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
        } finally {
            if (paginaAtual === 1) {
                setCarregandoAgentes(false);
            }
            setCarregandoMaisAgentes(false);
        }
    };

    const carregarMaisAgentes = () => {
        if (!carregandoMaisAgentes && !temMaisAgentes) {
            carregarAgentes(paginaAgentesAtual + 1, false);
        }
    };

    useEffect(() => {
        if (mundoSelecionado) {
            setPaginaAgentesAtual(1);
            carregarAgentes(1, true);
        }
    }, [mundoSelecionado]);

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
                5,
                agentId,
                mundoSelecionado
            );

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
        if (!carregandoMaisHistorico && !temMaisHistorico) {
            carregarHistorico(paginaAtualHistorico + 1, false);
        }
    }

    useEffect(() => {
        carregarAmbientes(1, true);
        carregarAgentes(1, true);
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


    const handleExcluirExecution = async (executionId, event) => {

        const confirmacao = await confirm({
            title: "Tem certeza?",
            message: `Tem certeza que deseja excluir a execução #${executionId}? Ela irá sumir para sempre...`,
            type: "confirm",
            botao1: "Sim, excluir",
            botao2: "Melhor não"
        });

        if (confirmacao === 'yes') {
            setCarregandoPagina(true);
            const sucesso = await excluirExecution(executionId);

            if (sucesso) {
                setPaginaAtualHistorico(1);
                // await carregarHistorico(1, true);
                await confirm({
                    title: "Sucesso!",
                    message: "Execução excluída com sucesso!",
                    type: "alert",
                    botao1: "OK"
                });
            } else {
                await confirm({
                    title: "Erro!",
                    message: "Não foi possível excluir a execução. Você pode tentar novamente ou culpar o dev backend.",
                    type: "alert",
                    botao1: "OK"
                });
            }

            setMundoSelecionado(null);
            setMundos([]);
            setAgentesDoDB([]);
            setHistorico([]);
            await carregarAmbientes(1, true);
            setCarregandoPagina(false);
        }
    };

    async function buscarEstatisticas(mundoId, agenteId) {
        const result = await getStaticsAgentsExecutionsInEnvironment(
            mundoId,
            [agenteId],
            30
        );

        if (result.success) {
            console.log('Estatísticas:', result.data);
        } else {
            console.error('Erro:', result.message);
        }
    }

    const handleReexecutar = async (executionId) => {
        try {
            const resultado = await reexecutarPartida(executionId);
            console.log('Partida reexecutada:', resultado);
        } catch (error) {
            console.error('Falha na reexecução:', error);
        }
    };

    return (
        <>
            <main className="historicoMain mundosMain">
                <aside className='listasHistorico'>
                    <section className='listaMundosHistorico'>
                        <div className='topoListaMundosHistorico'>
                            <div className='topoMundos'>
                                <h3>Selecione um mundo</h3>
                                <p className='paragrafoInformativo'>Abaixo tem todos os mundos que você criou, isso não
                                    significa que todos eles vão ter um histórico!</p>
                            </div>
                            <h1 style={{ fontSize: '60px', margin: '0px 10px' }}>+</h1>
                            <div className='topoAgentesHistorico'>
                                <h3>Selecione um agente</h3>
                                <p className='paragrafoInformativo'>Você pode ou não selecionar um agente. Se não selecionar,
                                    a lista exibirá o histórico de todos os agentes para aquele ambiente!</p>
                            </div>
                        </div>
                    </section>
                    <section className='secaoListas'>
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
                                            ) : !temMaisMundos ? (
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
                                                    {agente.id == 1 && (
                                                        <>
                                                            <p className="paragrafoInformativo destaqueRoxo"><b>☛ Agente padrão ☚</b></p>
                                                            <p className='paragrafoInformativo'>Simplesmente faz tudo o que quer, quando quer, sem se preocupar com as consequências, praticamente um adolescente, mas fortemente armado.</p>
                                                        </>
                                                    )}
                                                    {agente.id == 2 && (
                                                        <>
                                                            <p className="paragrafoInformativo destaqueRoxo"><b>☛ Agente padrão ☚</b></p>
                                                            <p className='paragrafoInformativo'>Segue um conjunto de regras gravadas em sua programação. Seu objetivo é pegar o ouro gastando o mínimo possível de sua energia e munição (e eliminar todos os Wumpus do caminho).</p>
                                                        </>
                                                    )}
                                                    {agente.id == 3 && (
                                                        <>
                                                            <p className="paragrafoInformativo destaqueRoxo"><b>☛ Agente padrão ☚</b></p>
                                                            <p className='paragrafoInformativo'>Descendente de uma geração de caçadores, este agente recebeu as melhores características dos ancestrais de sua tribo. Ele nasceu com seus objetivos gravados em seu DNA.</p>
                                                        </>
                                                    )}
                                                    {(agente.properties && agente.id != 2 && agente.id != 1 && agente.id != 3) ?
                                                        <>
                                                            {(agente.tipo == 2) ?
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
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                    }
                                                </div>
                                            )
                                        })}

                                        {!temMaisAgentes && !carregandoAgentes && (
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
                        <span>
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
                        </span>
                        <img src={Buraco} alt="" />
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
                                                    <div
                                                        className='itemAgente'
                                                        key={dadoHistorico.id}
                                                        onClick={() => {
                                                            buscarEstatisticas(dadoHistorico.ambiente_id, dadoHistorico.agente_id);
                                                        }}
                                                    >
                                                        <span className='topoItemHistorico'>
                                                            <span>
                                                                <h2>ID: {dadoHistorico.id}</h2>
                                                                <p><b>Pontuação na partida:</b> {dadoHistorico.pontos}</p>
                                                                <p className='paragrafoInformativo'>
                                                                    <span className='destaqueGold'>
                                                                        <b>Mundo ID:</b> {dadoHistorico.ambiente_id}, <b>Agente ID:</b> {dadoHistorico.agente_id}<br />
                                                                    </span>
                                                                    <b>Data de criação:</b> {formatarData(dadoHistorico.data)} <br />
                                                                </p>
                                                            </span>
                                                            <span className='botoesControleHistorico'>
                                                                <button className='botaoReconstruir'
                                                                    onClick={() => {
                                                                        setHistoricoSelecionado(dadoHistorico);
                                                                        setMostrarMiniMapa(!mostrarMinimapa)
                                                                    }}
                                                                >Reconstruir execução</button>
                                                                <button
                                                                    onClick={() => handleExcluirExecution(dadoHistorico.id)}
                                                                    className='botaoExcluirExecucao'
                                                                >Apagar histórico</button>
                                                            </span>
                                                        </span>
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

                                            {!temMaisHistorico && !carregadoHistorico && (
                                                <div className='loadingPequeno'>
                                                    {carregandoMaisHistorico ? (
                                                        <img src={LoadingGig} alt="Carregando..." />
                                                    ) : (
                                                        <button
                                                            style={{ padding: '10px', marginTop: '10px' }}
                                                            onClick={carregarMaisHistorico}
                                                            disabled={carregandoMaisHistorico}
                                                        >
                                                            Carregar mais
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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
            {carregandoPagina && (
                <LoadingPage></LoadingPage>
            )}
            {mostrarMinimapa && (
                <MapaExecucao
                    setMostrarMiniMapa={setMostrarMiniMapa}
                    dadoHistorico={historicoSelecionado}
                ></MapaExecucao>
            )}
        </>
    )
}