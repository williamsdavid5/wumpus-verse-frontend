import './styles/benchmark.css'

import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useState, useEffect } from 'react';

import LoadingGig from '../assets/loadingGif.gif'

function ItemEstatistica({ dadoEstatistica }) {
    return (
        <>
            <div className='estItem'>
                <div className='topoEstItem'>
                    <h2>Nome do agente</h2>
                    <p style={{ fontSize: '12px' }}>
                        <b className='destaqueRed'>Agente lógico personalizado</b> <br />
                        <b>Data de criação:</b> 10/05/2026
                    </p>
                </div>
                <div className='blocosEstItem'>
                    <p>corpo</p>
                </div>
            </div>
        </>
    )
}

export default function Benchmark() {
    const {
        getExecucoesUsuario,
        getEnvironmentsWithExecutions,
        getAgentsWithExecutionsInEnvironment,
        getStaticsAgentsExecutionsInEnvironment,
        getAgenteById,
        getMundoById
    } = useAuth();

    const { confirm } = useConfirm();

    const [carregandoMundos, setCarregandoMundos] = useState(true);
    const [temMaisMundos, setTemMaisMundos] = useState(false)
    const [mundos, setMundos] = useState([]);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [carregandoMaisMundos, setCarregandoMaisMundos] = useState(false)
    const [paginaAtualMundos, setPaginaAtualMundos] = useState(1);

    const [carregandoAgentes, setCarregandoAgentes] = useState(false);
    const [agentesDoDB, setAgentesDoDB] = useState([]);
    const [agentesSelecionados, setAgentesSelecionados] = useState([]);
    const [paginaAgentesAtual, setPaginaAgentesAtual] = useState(1);
    const [temMaisAgentes, setTemMaisAgentes] = useState(true);
    const [carregandoMaisAgentes, setCarregandoMaisAgentes] = useState(false);

    const [estatisticas, setEstatisticas] = useState(null);
    const [carregandoEstatisticas, setCarregandoEstatisticas] = useState(false);
    const [mundoCompleto, setMundoCompleto] = useState(null);

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
        carregarAmbientes(1, true);
    }, [])

    useEffect(() => {
        carregarAgentes(1, true);
    }, [mundoSelecionado])

    const toggleAgenteSelecionado = (idAgente) => {
        setAgentesSelecionados((prevSelecionados) => {
            const jaEstaSelecionado = prevSelecionados.includes(idAgente);

            if (jaEstaSelecionado) {
                return prevSelecionados.filter(id => id !== idAgente);
            } else {
                return [...prevSelecionados, idAgente];
            }
        });
    };

    async function buscarEstatisticas() {
        if (mundoSelecionado == null || mundoSelecionado == 0) {
            await confirm({
                title: "Não tá esquecendo de nada?",
                message: `Precisa selecionar um mundo e um ou mais agentes para buscar as estatísticas!`,
                type: "alert",
                botao1: "Ops, entendi!",
            });
            return;
        }

        if (agentesSelecionados.length <= 0) {
            await confirm({
                title: "Como assim?",
                message: `Selecionou um agente? Deveria...`,
                type: "alert",
                botao1: "Verdade!",
            });
            return;
        }

        setCarregandoEstatisticas(true);

        const result = await getStaticsAgentsExecutionsInEnvironment(
            mundoSelecionado,
            agentesSelecionados,
            30
        );

        if (result.success) {
            const listaAgentesEst = result.data.agentes;
            console.log("Estatísticas brutas recebidas:", listaAgentesEst);

            try {
                const promisesMesclagem = listaAgentesEst.map(async (estatisticaAgante) => {
                    const dadosCadastrais = await getAgenteById(estatisticaAgante.agent_id);

                    return {
                        ...estatisticaAgante,
                        dadosAgente: dadosCadastrais || { id: estatisticaAgante.agent_id, name: "Agente Desconhecido" }
                    };
                });

                const dadosMesclados = await Promise.all(promisesMesclagem);

                setEstatisticas(dadosMesclados);
                console.log("Dados unificados e salvos em estatisticas:", dadosMesclados);

            } catch (error) {
                console.error("Erro ao mesclar dados dos agentes com as estatísticas:", error);
                setEstatisticas(listaAgentesEst);
            }

            await handleCarregarMundo(result.data.environment_id);
        } else {
            console.error('Erro:', result.message);
        }

        setCarregandoEstatisticas(false);
    }

    const handleCarregarMundo = async (environment_id) => {
        try {
            const dadosMundo = await getMundoById(environment_id);
            console.log("mundo: ", dadosMundo);
            setMundoCompleto(dadosMundo);

        } catch (error) {
            console.error("Erro no fluxo de carregamento do mundo:", error);
            setMundoCompleto(null);
        }
    };

    return (
        <>
            <main className="estatisticasMain">
                <aside className='estListas'>
                    <div className='estTopo'>
                        <h1>Estatísticas</h1>
                        <p className='paragrafoInformativo'>Acompanhe as estatísticas dos seus agentes
                            baseado nas execuções que você salvou.</p>
                        <p className='paragrafoInformativo'>
                            <span className='destaqueGold'>Selecione um mundo e um ou mais agentes abaixo.</span> São listados apenas mundos e agentes que
                            possuem execuções salvas!
                        </p>
                    </div>
                    <div className='intermediarioEst'>
                        <p>Mundos</p>
                        <p>Agentes{agentesSelecionados.length > 0 && (`: [${agentesSelecionados}]`)}</p>
                    </div>
                    <section className='estListasContainer'>
                        <div className='estListaMundos'>
                            {carregandoMundos ?
                                <>
                                    <div className='loadingPequeno'>
                                        <img src={LoadingGig} alt="" />
                                    </div>
                                </>
                                :
                                <>
                                    {mundos.map((mundo) => {
                                        return (
                                            <>
                                                <div
                                                    className={`itemMundoEstatistica ${mundoSelecionado == mundo.id && 'ativo'}`}
                                                    key={mundo.id}
                                                    onClick={() => {
                                                        setMundoSelecionado(mundo.id);
                                                    }}
                                                >
                                                    <p className='destaqueGold idMundoListaEst'><b>ID {mundo.id}</b></p>
                                                    <span className='infoMundoListaEst'>
                                                        <p>
                                                            <b>{mundo.nome}</b> <br />
                                                            <span style={{ fontSize: '12px' }}>
                                                                <b>LxA: </b> {mundo.largura}x{mundo.altura} -
                                                                <b>Salas: </b> {mundo.estatisticas.salasAtivas}
                                                            </span>
                                                        </p>
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    })}

                                    {!carregandoMundos && mundos.length > 0 && (
                                        carregandoMaisMundos ? (
                                            <div className='loadingPequeno'>
                                                <img src={LoadingGig} alt="" />
                                            </div>
                                        ) : !temMaisMundos ? (
                                            <div className='itemMundoEstatistica'>
                                                <button
                                                    onClick={carregarMaisMundos}
                                                    disabled={carregandoMaisMundos}
                                                    style={{ padding: '10px' }}
                                                    className='carregarMaisMundosEst'
                                                >
                                                    Carregar mais
                                                </button>
                                            </div>
                                        ) : null
                                    )}
                                </>
                            }
                        </div>
                        <div className='estListaAgentes'>
                            <>
                                {!mundoSelecionado && (
                                    <>
                                        <p className='paragrafoInformativo'>Selecione um mundo</p>
                                    </>
                                )}
                                {carregandoAgentes ?
                                    <>
                                        <div className='loadingPequeno'>
                                            <img src={LoadingGig} alt="" />
                                        </div>
                                    </>
                                    :
                                    <>
                                        {agentesDoDB.map((agente) => {
                                            return (
                                                <>
                                                    <div
                                                        className={`itemMundoEstatistica ${agentesSelecionados.includes(agente.id) ? 'agenteAtivo' : ''}`}
                                                        key={agente.id}
                                                        onClick={() => {
                                                            toggleAgenteSelecionado(agente.id);
                                                        }}
                                                    >
                                                        <p className=' idMundoListaEst'>
                                                            <b>ID {agente.id}</b>
                                                        </p>
                                                        <span className='infoMundoListaEst'>
                                                            <p>
                                                                <b>{agente.nome}</b> <br />
                                                                <span style={{ fontSize: '12px' }}>
                                                                    <b>Execuções salvas: </b> {agente.number_of_executions} <br />

                                                                    {
                                                                        agente.id == 1 ? (
                                                                            <><span className='destaqueRoxo'>Agente aleatório padrão</span></>
                                                                        ) :
                                                                            agente.id == 2 ? (
                                                                                <><span className='destaqueRoxo'>Agente lógico padrão</span></>
                                                                            ) :
                                                                                agente.id == 3 ? (
                                                                                    <><span className='destaqueRoxo'>Agente evolutivo padrão</span></>
                                                                                ) :
                                                                                    agente.tipo == 2 ?
                                                                                        (
                                                                                            <><span className='destaqueRed'>Agente lógico personalizado</span></>
                                                                                        ) :
                                                                                        agente.tipo == 3 ?
                                                                                            (
                                                                                                <><span className='destaqueGold'>Agente evolutivo personalizado</span></>
                                                                                            ) : <></>
                                                                    }
                                                                </span>
                                                            </p>
                                                        </span>
                                                    </div>
                                                </>
                                            )
                                        })}

                                        {!carregandoAgentes && agentesDoDB.length > 0 && (
                                            carregandoMaisAgentes ? (
                                                <div className='loadingPequeno'>
                                                    <img src={LoadingGig} alt="" />
                                                </div>
                                            ) : !temMaisAgentes ? (
                                                <div className='itemMundoEstatistica'>
                                                    <button
                                                        onClick={carregarMaisAgentes}
                                                        disabled={carregandoMaisAgentes}
                                                        style={{ padding: '10px' }}
                                                        className='carregarMaisMundosEst'
                                                    >
                                                        Carregar mais
                                                    </button>
                                                </div>
                                            ) : null
                                        )}
                                    </>
                                }
                            </>

                        </div>
                    </section>
                    <section className='botaoBuscarEstatisticasContainer'>
                        <button
                            className='botaoBuscarEstatisticas'
                            onClick={() => {
                                buscarEstatisticas();
                            }}
                            disabled={carregandoEstatisticas}
                        >
                            {carregandoEstatisticas ?
                                <>
                                    ⧖ Buscando estatísticas...
                                </>
                                :
                                <>Buscar estatísticas</>
                            }
                        </button>
                    </section>
                </aside>
                <section className='estMain'>
                    {estatisticas == null && !carregandoEstatisticas && (
                        <><p><b>Sem dados carregados</b></p></>
                    )}
                    {carregandoEstatisticas ?
                        <><p><b>Aguarde enquanto as estatísticas são carregadas...</b></p></>
                        :
                        estatisticas != null && (
                            <>
                                {estatisticas.map((dadoEstatistica) => {
                                    return (
                                        <>
                                            <ItemEstatistica></ItemEstatistica>
                                        </>
                                    )
                                })}
                            </>
                        )
                    }
                </section>

            </main>
        </>
    )
}