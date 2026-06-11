import './styles/benchmark.css'

import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useState, useEffect } from 'react';

import LoadingGig from '../assets/loadingGif.gif'

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';

const GraficoEstatisticas = ({
    data,
    corLinha = "red",
    corGrade = "var(--bordaCor)",
    alturaFixa = 200,
    margemY = 0.15,
    nomeGrafico
}) => {
    const dadosFormatados = React.useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        if (typeof data[0] !== 'object') {
            return data.map((ponto, index) => ({
                name: `${nomeGrafico[1]} ${index + 1}`,
                valor: ponto
            }));
        }

        return data;
    }, [data]);

    const dominioY = React.useMemo(() => {
        if (!dadosFormatados.length) return [0, 100];

        const valores = dadosFormatados.map(item => item.valor);
        const min = Math.min(...valores);
        const max = Math.max(...valores);

        if (min === max) {
            const offset = min === 0 ? 1 : Math.abs(min) * 0.1;
            return [min - offset, max + offset];
        }

        const range = max - min;
        const margin = range * margemY;

        let yMin = min - margin;
        let yMax = max + margin;

        if (min >= 0 && yMin < 0) {
            yMin = 0;
        }

        if (max <= 0 && yMax > 0) {
            yMax = 0;
        }

        return [Math.floor(yMin), Math.ceil(yMax)];
    }, [dadosFormatados, margemY]);

    return (
        <ResponsiveContainer width="100%" height={alturaFixa}>
            <LineChart
                data={dadosFormatados}
                margin={{
                    top: 10,
                    right: 30,
                    left: 10,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={corGrade} />

                <XAxis
                    dataKey="name"
                    stroke="var(--textoCor, #888888)"
                    fontSize={12}
                />

                <YAxis
                    stroke="var(--textoCor, #888888)"
                    fontSize={12}
                    domain={dominioY}
                    tickFormatter={(value) => {
                        return typeof value === 'number' ? value.toFixed(1) : value;
                    }}
                />

                <Tooltip
                    contentStyle={{ backgroundColor: '#1a252f', borderRadius: '8px', border: 'none' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, `${nomeGrafico[0]}`]}
                />

                <Legend />

                <Line
                    name={nomeGrafico[0]}
                    type="linear"
                    dataKey="valor"
                    stroke={corLinha}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                >
                    <LabelList
                        dataKey="valor"
                        position="top"
                        offset={10}
                        fill="var(--textoCor, #ffffff)"
                        fontSize={11}
                        formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
                    />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
};

function ItemEstatistica({ dadoEstatistica }) {
    const [mostrarGraficos, setMostrarGraficos] = useState(false);

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
            <div className='estItem' key={dadoEstatistica.id}
                onClick={() => console.log(dadoEstatistica)}
            >
                <div className='topoEstItem'>
                    <p style={{ fontSize: '12px' }}>Estatísticas do agente</p>
                    <h2>{dadoEstatistica.dadosAgente.nome} - <span className='destaqueGold'>ID - {dadoEstatistica.dadosAgente.id}</span></h2>
                    <p style={{ fontSize: '12px' }}>
                        <b>Data de criação:</b> {formatarData(dadoEstatistica.dadosAgente.data)} <br />
                    </p>
                    {dadoEstatistica.dadosAgente.id == 1 && (
                        <p className='destaqueRoxo'>Agente aleatório padrão</p>
                    )}
                    {dadoEstatistica.dadosAgente.id == 2 && (
                        <p className='destaqueRoxo'>Agente lógico padrão</p>
                    )}
                    {dadoEstatistica.dadosAgente.id == 3 && (
                        <p className='destaqueRoxo'>Agente evolutivo padrão</p>
                    )}
                    {(dadoEstatistica.dadosAgente.id != 1 && dadoEstatistica.dadosAgente.id != 2 && dadoEstatistica.dadosAgente.id != 3) && (
                        <>
                            {dadoEstatistica.dadosAgente?.tipo == 2 ? (
                                <>
                                    <p className="destaqueRed" style={{ fontSize: '12px' }}>✎ Agente lógico personalizado</p>
                                    <p style={{ fontSize: '12px' }}>
                                        {[
                                            dadoEstatistica.dadosAgente.properties?.corajoso && "🛡 Corajoso - ",
                                            dadoEstatistica.dadosAgente.properties?.explorador && "◈ Explorador - ",
                                            dadoEstatistica.dadosAgente.properties?.garimpeiro && "✦ Garimpeiro - ",
                                            dadoEstatistica.dadosAgente.properties?.cacador && "⚔ Caçador  "
                                        ]
                                            .filter(Boolean)
                                            .map((texto, index, arr) => (
                                                <span key={index}>
                                                    {texto}
                                                    {index < arr.length - 1}
                                                </span>
                                            ))}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="destaqueGold" style={{ fontSize: '12px' }}>✎ Agente evolutivo personalizado</p>
                                    <p style={{ fontSize: '12px' }}>
                                        ⟳ Gerações: {dadoEstatistica.dadosAgente?.properties?.geracoes} -
                                        ≡ População: {dadoEstatistica.dadosAgente?.properties?.populacao} -
                                        ❤ Taxa de cruzamento: {dadoEstatistica.dadosAgente?.properties?.taxa_de_cruzamento}% -
                                        ⚯ Taxa de mutação: {dadoEstatistica.dadosAgente?.properties?.taxa_de_mutacao}%
                                    </p>
                                </>
                            )}
                        </>
                    )}
                    <p><br /><b>Execuções consideradas:</b> {dadoEstatistica.qtdExecucoes}</p>
                </div>
                <div className='blocosEstItem'>
                    <div className='blocoEstItem'>
                        <p>Pontuação média</p>
                        <h1>{dadoEstatistica.pontos_med}</h1>
                    </div>
                    <div className='blocoEstItem'>
                        <p>Média de passos</p>
                        <h1>{dadoEstatistica.passos_med}</h1>
                    </div>
                    <div className='blocoEstItem'>
                        <p>Média ouro coletado</p>
                        <h1>{dadoEstatistica.qtd_ouros_med}</h1>
                    </div>
                    <div className='blocoEstItem'>
                        <p>Média de flechas disparadas</p>
                        <h1>{dadoEstatistica.qtd_flechas_med}</h1>
                    </div>
                    <div className='blocoEstItem'>
                        <p>Média Wumpus mortos</p>
                        <h1>{dadoEstatistica.wumpus_med}</h1>
                    </div>
                </div>
                <span className='spanBotaoMostrarGraficos'>
                    <button
                        className='botaoMostrarGraficos'
                        onClick={() => setMostrarGraficos(!mostrarGraficos)}
                    >
                        {mostrarGraficos ?
                            <>
                                🠕 Ocultar gráficos
                            </>
                            :
                            <>
                                🠗 Mostrar gráficos
                            </>
                        }
                    </button>
                </span>
                {mostrarGraficos && (
                    <>
                        <div className='graficosEstatisticas'>
                            <p style={{ marginTop: '15px' }}>Pontuações registradas</p>
                            <GraficoEstatisticas
                                data={dadoEstatistica.pontos}
                                nomeGrafico={["Pontuação", "Exec."]}
                            ></GraficoEstatisticas>

                            <p style={{ marginTop: '15px' }}>Passos por execução</p>
                            <GraficoEstatisticas
                                data={dadoEstatistica.passos}
                                nomeGrafico={["Passos", "Exec."]}
                                corLinha='var(--roxoDestaque)'
                            ></GraficoEstatisticas>

                            <p style={{ marginTop: '15px' }}>Ouro coletado</p>
                            <GraficoEstatisticas
                                data={dadoEstatistica.qtd_ouros}
                                nomeGrafico={["Ouro", "Exec."]}
                                corLinha='gold'
                            ></GraficoEstatisticas>

                            <p style={{ marginTop: '15px' }}>Tiros disparados</p>
                            <GraficoEstatisticas
                                data={dadoEstatistica.qtd_flechas}
                                nomeGrafico={["Tiro", "Exec."]}
                                corLinha='white'
                            ></GraficoEstatisticas>

                            <p style={{ marginTop: '15px' }}>Wumpus mortos</p>
                            <GraficoEstatisticas
                                data={dadoEstatistica.wumpus}
                                nomeGrafico={["Wumpus", "Exec."]}
                                corLinha='red'
                            ></GraficoEstatisticas>
                        </div>
                    </>
                )}
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

    const [mostrarTutorial, setMostrarTutorial] = useState(false);

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
            const qtdExecucoes = result.data.qtd;
            console.log(result.data);

            try {
                const promisesMesclagem = listaAgentesEst.map(async (estatisticaAgante) => {
                    const dadosCadastrais = await getAgenteById(estatisticaAgante.agent_id);

                    return {
                        ...estatisticaAgante,
                        qtdExecucoes: qtdExecucoes,
                        dadosAgente: dadosCadastrais || { id: estatisticaAgante.agent_id, name: "Agente Desconhecido" }
                    };
                });

                const dadosMesclados = await Promise.all(promisesMesclagem);
                setEstatisticas(dadosMesclados);

            } catch (error) {
                console.error("Erro ao mesclar dados dos agentes com as estatísticas:", error);

                const dadosBrutosComQtd = listaAgentesEst.map(est => ({
                    ...est,
                    qtdExecucoes: qtdExecucoes
                }));
                setEstatisticas(dadosBrutosComQtd);
            }
        } else {
            console.error('Erro:', result.message);
        }

        setCarregandoEstatisticas(false);
    }

    return (
        <>
            <main className="estatisticasMain">
                <aside className='estListas'>
                    <div className='estTopo'>
                        <h1>Estatísticas</h1>
                        <p className='paragrafoInformativo'>Acompanhe as estatísticas dos seus agentes
                            baseado nas execuções que você salvou.</p>
                        {mostrarTutorial ?
                            <>
                                <p className='paragrafoInformativo'>
                                    <b>Funcionamento:</b> <br />
                                    Abaixo são exibidos os mundos com execuções salvas, e os agentes que possuem execuções naquele mundo,
                                    você deve selecionar um agente para ver as suas estatísticas gerais, ou selecionar mais de um agente para fazer uma comparação. <br />
                                    <span className='destaqueGold'>Atenção: </span> para a comparação, o menor número de execuções é considerado! Exemplo: você selecionou um agente com
                                    3 execuções e um agente com 7, desse último, apenas 3 execuções são consideradas para que a comparação seja justa. Por isso é importante que você
                                    tenha um bom número de execuções salvas para cada agente que você quer analizar, umas 30 execuções é um bom número...
                                </p>
                                <button
                                    onClick={() => setMostrarTutorial(false)}
                                    className='botaoTutorial'
                                >Já sei!</button>
                            </>
                            :
                            <>
                                <button
                                    onClick={() => setMostrarTutorial(true)}
                                    className='botaoTutorial'
                                >Como funciona?</button>
                            </>
                        }
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
                                                        setMundoCompleto(mundo);
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
                        <>
                            <div className='carregandoEst'>
                                <img src={LoadingGig} alt="" />
                                <p><b>Carregando estatísticas...</b></p>
                            </div>
                        </>
                        :
                        estatisticas != null && (
                            <>
                                <div className='estItem'>
                                    <div className='topoEstItem'>
                                        <p style={{ fontSize: '12px' }}>Mundo selecionado</p>
                                        <h2>{mundoCompleto.nome} - <span className='destaqueGold'>ID {mundoCompleto.id}</span></h2>
                                        <hr />
                                        <p style={{ fontSize: '12px' }}>
                                            <b>Data de criação: </b> {formatarData(mundoCompleto.data_criacao)} <br />
                                            <b>Largura x Altura : </b> {mundoCompleto.largura}x{mundoCompleto.altura} <br />
                                            <b>Salas ativas: </b> {mundoCompleto.estatisticas.salasAtivas} de {mundoCompleto.estatisticas.totalSalas} <br />
                                            <b>Quantidades: </b> {mundoCompleto.estatisticas.quantidadeEntidades.wumpus} Wumpus; {mundoCompleto.estatisticas.quantidadeEntidades.buracos} Buracos; {mundoCompleto.estatisticas.quantidadeEntidades.ouros} Ouros<br />
                                            <b>Densidade: </b> {mundoCompleto.estatisticas.densidadeEntidades.wumpus} Wumpus; {mundoCompleto.estatisticas.densidadeEntidades.buracos} Buracos; {mundoCompleto.estatisticas.densidadeEntidades.ouros} Ouros

                                        </p>
                                    </div>
                                </div>
                                {estatisticas.map((dadoEstatistica) => {
                                    return (
                                        <>
                                            <ItemEstatistica
                                                dadoEstatistica={dadoEstatistica}
                                            ></ItemEstatistica>
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