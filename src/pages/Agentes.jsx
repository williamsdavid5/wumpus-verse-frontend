import './styles/agentes.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';

import LoadingPage from './LoadingPage';
import LinoDormindo from '../assets/linoDormindo.png'
import LoadingGif from '../assets/loadingGif.gif'

export default function Agentes() {

    const { criarAgente, getAgentes, excluirAgente, getAgenteById, atualizarAgente } = useAuth();
    const { confirm } = useConfirm();

    const [carregando, setCarregando] = useState(false);
    const [carregandoLista, setCarregandoLista] = useState(false);
    const [mostrarLinoDormindo, setMostrarLinoDormindo] = useState(false);

    const [tipoAgenteSelecionado, setTipoAgenteSelerionado] = useState('');
    const [tipoIntAgenteSelecionado, setTipoIntAgenteSelecionado] = useState(0);
    const [mostrarFuncionamento, setMostrarFuncionamento] = useState(false);
    const [tipoConfigPontos, setTipoConfigPontos] = useState('simples');
    const [nomeAgente, setNomeAgente] = useState('');

    // agente logico
    const [garimpeiro, setGarimpeiro] = useState(false);
    const [explorador, setExplorador] = useState(false);
    const [coragem, setCoragem] = useState(false);
    const [odio, setOdio] = useState(false);
    const [formaDeBusca, setFormaDeBusca] = useState(1);

    //agente evloutivo
    const [nomeAgenteEvolutivo, setNomeAgenteEvolutivo] = useState('');
    const [populacao, setPopulacao] = useState(1);
    const [geracoes, setGeracoes] = useState(1);
    const [taxaMutacao, setTaxaMutacao] = useState(1);
    const [taxaCruzamento, setTaxaCruzamento] = useState(1);
    const [fitness, setFitness] = useState('');

    //evolutivo pontuacao
    const [passoValido, setPassoValido] = useState(0);
    const [passoInvalido, setPassoInvalido] = useState(0);
    const [tiroValido, setTiroValido] = useState(0);
    const [tiroInvalido, setTiroInvalido] = useState(0);
    const [entradaBuraco, setEntradaBuraco] = useState(0);
    const [entradaWumpus, setEntradaWumpus] = useState(0);
    const [pegouOuro, setPegouOuro] = useState(0);
    const [ouroVoltouOrigem, setOuroVoltouOrigem] = useState(0);

    //lista de agentes
    const [agentes, setAgentes] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);

    //para a função de edição
    // const [idSelecaoLista, setIdSelecaoLista] = useState(0);
    const [agenteEdicao, setAgenteEdicao] = useState({ id: 0 });
    const [carregandoAgenteIndividual, setCarregandoAgenteIndividual] = useState(false);

    const [criarNovo, setCriarNovo] = useState(false);

    async function handleSalvarAgente() {
        let agentData = {};
        let nomeParaSalvar = '';
        let tipoAgente = 0;

        // Validação baseada no tipo de agente
        if (tipoAgenteSelecionado === 'logico') {
            if (!nomeAgente.trim()) {
                await confirm({
                    title: "Não tá esquecendo de nada?",
                    message: "Cadê o nome do agente?",
                    type: "alert",
                    botao1: "Realmente",
                });
                return;
            }
            nomeParaSalvar = nomeAgente;
            tipoAgente = 2;

            console.log('Valores atuais:', {
                coragem,
                explorador,
                odio,
                garimpeiro,
                formaDeBusca
            });

            agentData = {
                second_agent_schemas: {
                    corajoso: coragem,
                    explorador: explorador,
                    cacador: odio,
                    garimpeiro: garimpeiro,
                    forma_de_busca: formaDeBusca
                }
            };

        } else if (tipoAgenteSelecionado === 'evolutivo') {
            if (!nomeAgenteEvolutivo.trim()) {
                await confirm({
                    title: "Não tá esquecendo de nada?",
                    message: "Cadê o nome do agente?",
                    type: "alert",
                    botao1: "Realmente",
                });
                return;
            }
            nomeParaSalvar = nomeAgenteEvolutivo;
            tipoAgente = 3;

            if (tipoConfigPontos === 'simples') {
                const fitnessEquation = `((PV * ${passoValido}) + (PI * ${passoInvalido}) + (TI * ${tiroInvalido}) + (TV * ${tiroValido}) + (SW * ${entradaWumpus}) + (SP * ${entradaBuraco}) + (SO * ${pegouOuro}) + (V * ${ouroVoltouOrigem}))`;

                agentData = {
                    third_agent_schemas: {
                        populacao: populacao,
                        geracoes: geracoes,
                        taxa_de_cruzamento: taxaCruzamento,
                        taxa_de_mutacao: taxaMutacao,
                        fitness: fitnessEquation
                    }
                };
            } else {
                agentData = {
                    third_agent_schemas: {
                        populacao: populacao,
                        geracoes: geracoes,
                        taxa_de_cruzamento: taxaCruzamento,
                        taxa_de_mutacao: taxaMutacao,
                        fitness: fitness
                    }
                };
            }
        } else {
            return;
        }

        const modoEdicao = agenteEdicao.id !== 0;
        const tituloConfirmacao = modoEdicao ? "Quer mesmo atualizar esse agente?" : "Quer mesmo salvar esse agente?";
        const mensagemConfirmacao = modoEdicao ? "As alterações serão salvas permanentemente!" : "Ele ficará muito feliz por viver!";

        const respostaConfirmacao = await confirm({
            title: tituloConfirmacao,
            message: mensagemConfirmacao,
            type: "confirm",
            botao1: "Sim",
            botao2: "Me enganei"
        });

        if (respostaConfirmacao === 'yes') {
            setCarregando(true);

            try {
                let resultado;
                if (modoEdicao) {
                    resultado = await atualizarAgente(agenteEdicao.id, nomeParaSalvar, agentData);
                    await confirm({
                        title: "Sucesso!",
                        message: `Agente ${tipoAgente === 2 ? 'Lógico' : 'Evolutivo'} atualizado com sucesso!`,
                        type: "alert",
                        botao1: "Legal!",
                    });
                } else {
                    // Criar novo agente
                    resultado = await criarAgente(tipoAgente, nomeParaSalvar, agentData);
                    await confirm({
                        title: "Sucesso!",
                        message: `Agente ${tipoAgente === 2 ? 'Lógico' : 'Evolutivo'} criado com sucesso!`,
                        type: "alert",
                        botao1: "Legal!",
                    });
                }

                await carregarAgentes(true);

                // Limpar formulário e sair do modo edição
                setNomeAgente('');
                setNomeAgenteEvolutivo('');
                setTipoAgenteSelerionado('');
                setAgenteEdicao({ id: 0 });

                console.log('Resultado:', resultado);
            } catch (error) {
                await confirm({
                    title: "Ah não",
                    message: "Alguma coisa deu errado ao " + (modoEdicao ? "atualizar" : "salvar") + " o seu agente",
                    type: "alert",
                    botao1: "Vou tentar de novo",
                });
            }

            setCarregando(false);
            setCriarNovo(false);
        }
    }

    useEffect(() => {
        carregarAgentes();
    }, []);

    async function carregarAgentes(reset = true) {
        if (reset) {
            setCarregandoLista(true);
            setPaginaAtual(1);
        } else {
            setCarregandoMais(true);
        }

        const data = await getAgentes(reset ? 1 : paginaAtual + 1, 5);

        if (reset) {
            setAgentes(data.agentes);
            setPaginaAtual(1);
        } else {
            setAgentes(prev => [...prev, ...data.agentes]);
            setPaginaAtual(prev => prev + 1);
        }

        setHasMore(data.hasMore);

        if (reset) {
            setCarregandoLista(false);
        } else {
            setCarregandoMais(false);
        }
    }

    async function handleCarregarMais() {
        if (!hasMore || carregandoMais) return;
        await carregarAgentes(false);
    }

    async function handleExcluirAgente(agentId, agentName) {

        const resposta = await confirm({
            title: "Quer mesmo excluir esse agente?",
            message: "Ele só quer viver 😭😭",
            type: "confirm",
            botao1: "Sim, eu sou mal",
            botao2: "Tadinho 🥺"
        })

        if (resposta === "no") {
            return;
        }

        if (resposta === "yes") {
            setCarregandoLista(true);

            const sucesso = await excluirAgente(agentId);

            if (sucesso) {
                await carregarAgentes();
            } else {
                const resposta2 = await confirm({
                    title: "Putz",
                    message: "Infelizmente o seu agente não pôde ser excluído...",
                    type: "alert",
                    botao1: "Maldito programador backend",
                })
            }

            setCarregandoLista(false);
        }
    }

    useEffect(() => {
        if (!carregandoLista) {
            setMostrarLinoDormindo(false);
            return;
        }

        const timer = setTimeout(() => {
            setMostrarLinoDormindo(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, [carregandoLista]);

    // async function carregarAgenteParaEdicao(agente) {
    //     setAgenteEdicao(agente);
    //     setCarregandoAgenteIndividual(true);

    //     setPopulacao(1);
    //     setGeracoes(1);
    //     setTaxaMutacao(1);
    //     setTaxaCruzamento(1);
    //     setPassoValido(0);
    //     setPassoInvalido(0);

    //     try {
    //         const dados = await getAgenteById(agente.id);
    //         if (!dados) {
    //             await confirm({
    //                 title: "Erro",
    //                 message: "Não foi possível carregar os dados do agente",
    //                 type: "alert",
    //                 botao1: "OK"
    //             });
    //             setAgenteEdicao({ id: 0 });
    //             return;
    //         }

    //         setAgenteEdicao(dados);

    //         if (dados.tipo === 2) {
    //             // Agente Lógico
    //             setTipoAgenteSelerionado('logico');
    //             setTipoIntAgenteSelecionado(2);
    //             setNomeAgente(dados.nome || dados.name || '');

    //             if (dados.properties) {
    //                 setCoragem(dados.properties.corajoso ?? false);
    //                 setExplorador(dados.properties.explorador ?? false);
    //                 setGarimpeiro(dados.properties.garimpeiro ?? false);
    //                 setOdio(dados.properties.cacador ?? false);
    //                 setFormaDeBusca(dados.properties.forma_de_busca ?? 1);
    //             }
    //         } else if (dados.tipo === 3) {
    //             // Agente Evolutivo
    //             setTipoAgenteSelerionado('evolutivo');
    //             setTipoIntAgenteSelecionado(3);
    //             setNomeAgenteEvolutivo(dados.nome || dados.name || '');

    //             if (dados.properties) {
    //                 setPopulacao(dados.properties.populacao || 1);
    //                 setGeracoes(dados.properties.geracoes || 1);
    //                 setTaxaCruzamento(dados.properties.taxa_de_cruzamento || 1);
    //                 setTaxaMutacao(dados.properties.taxa_de_mutacao || 1);

    //                 const fitnessStr = dados.properties.fitness || '';
    //                 setFitness(fitnessStr);

    //                 // Tentar extrair valores da equação fitness
    //                 if (fitnessStr && fitnessStr.includes('PV *')) {
    //                     const pvMatch = fitnessStr.match(/PV\s*\*\s*([-\d]+)/);
    //                     const piMatch = fitnessStr.match(/PI\s*\*\s*([-\d]+)/);
    //                     const tvMatch = fitnessStr.match(/TV\s*\*\s*([-\d]+)/);
    //                     const tiMatch = fitnessStr.match(/TI\s*\*\s*([-\d]+)/);
    //                     const swMatch = fitnessStr.match(/SW\s*\*\s*([-\d]+)/);
    //                     const spMatch = fitnessStr.match(/SP\s*\*\s*([-\d]+)/);
    //                     const soMatch = fitnessStr.match(/SO\s*\*\s*([-\d]+)/);
    //                     const vMatch = fitnessStr.match(/V\s*\*\s*([-\d]+)/);

    //                     setPassoValido(pvMatch ? parseInt(pvMatch[1]) : 0);
    //                     setPassoInvalido(piMatch ? parseInt(piMatch[1]) : 0);
    //                     setTiroValido(tvMatch ? parseInt(tvMatch[1]) : 0);
    //                     setTiroInvalido(tiMatch ? parseInt(tiMatch[1]) : 0);
    //                     setEntradaWumpus(swMatch ? parseInt(swMatch[1]) : 0);
    //                     setEntradaBuraco(spMatch ? parseInt(spMatch[1]) : 0);
    //                     setPegouOuro(soMatch ? parseInt(soMatch[1]) : 0);
    //                     setOuroVoltouOrigem(vMatch ? parseInt(vMatch[1]) : 0);
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Erro ao carregar agente:', error);
    //         await confirm({
    //             title: "Erro",
    //             message: "Erro ao carregar dados do agente",
    //             type: "alert",
    //             botao1: "OK"
    //         });
    //     } finally {
    //         setCarregandoAgenteIndividual(false);
    //     }
    // }

    async function carregarAgenteParaEdicao(agente) {
        setAgenteEdicao(agente);
        setCarregandoAgenteIndividual(true);

        setPopulacao(1);
        setGeracoes(1);
        setTaxaMutacao(1);
        setTaxaCruzamento(1);
        setPassoValido(0);
        setPassoInvalido(0);
        setTiroValido(0);
        setTiroInvalido(0);
        setEntradaBuraco(0);
        setEntradaWumpus(0);
        setPegouOuro(0);
        setOuroVoltouOrigem(0);

        try {
            if (!agente) {
                await confirm({
                    title: "Erro",
                    message: "Não foi possível carregar os dados do agente",
                    type: "alert",
                    botao1: "OK"
                });
                setAgenteEdicao({ id: 0 });
                return;
            }

            setAgenteEdicao(agente);

            if (agente.tipo === 2) {
                setTipoAgenteSelerionado('logico');
                setTipoIntAgenteSelecionado(2);
                setNomeAgente(agente.nome || agente.name || '');

                if (agente.properties) {
                    setCoragem(agente.properties.corajoso ?? false);
                    setExplorador(agente.properties.explorador ?? false);
                    setGarimpeiro(agente.properties.garimpeiro ?? false);
                    setOdio(agente.properties.cacador ?? false);
                    setFormaDeBusca(agente.properties.forma_de_busca ?? 1);
                }
            } else if (agente.tipo === 3) {
                setTipoAgenteSelerionado('evolutivo');
                setTipoIntAgenteSelecionado(3);
                setNomeAgenteEvolutivo(agente.nome || agente.name || '');

                if (agente.properties) {
                    setPopulacao(agente.properties.populacao || 1);
                    setGeracoes(agente.properties.geracoes || 1);
                    setTaxaCruzamento(agente.properties.taxa_de_cruzamento || 1);
                    setTaxaMutacao(agente.properties.taxa_de_mutacao || 1);

                    const fitnessStr = agente.properties.fitness || '';
                    setFitness(fitnessStr);

                    if (fitnessStr && typeof fitnessStr === 'string') {
                        const pvMatch = fitnessStr.match(/PV\s*\*\s*([-\d]+)/);
                        const piMatch = fitnessStr.match(/PI\s*\*\s*([-\d]+)/);
                        const tvMatch = fitnessStr.match(/TV\s*\*\s*([-\d]+)/);
                        const tiMatch = fitnessStr.match(/TI\s*\*\s*([-\d]+)/);
                        const swMatch = fitnessStr.match(/SW\s*\*\s*([-\d]+)/);
                        const spMatch = fitnessStr.match(/SP\s*\*\s*([-\d]+)/);
                        const soMatch = fitnessStr.match(/SO\s*\*\s*([-\d]+)/);
                        const vMatch = fitnessStr.match(/V\s*\*\s*([-\d]+)/);

                        setPassoValido(pvMatch ? parseInt(pvMatch[1]) : 0);
                        setPassoInvalido(piMatch ? parseInt(piMatch[1]) : 0);
                        setTiroValido(tvMatch ? parseInt(tvMatch[1]) : 0);
                        setTiroInvalido(tiMatch ? parseInt(tiMatch[1]) : 0);
                        setEntradaWumpus(swMatch ? parseInt(swMatch[1]) : 0);
                        setEntradaBuraco(spMatch ? parseInt(spMatch[1]) : 0);
                        setPegouOuro(soMatch ? parseInt(soMatch[1]) : 0);
                        setOuroVoltouOrigem(vMatch ? parseInt(vMatch[1]) : 0);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar agente:', error);
            await confirm({
                title: "Erro",
                message: "Erro ao carregar dados do agente",
                type: "alert",
                botao1: "OK"
            });
        } finally {
            setCarregandoAgenteIndividual(false);
        }
    }

    const handleNumberInput = (setter) => (e) => {
        let value = e.target.value;

        // Permite: vazio, - , números, - seguido de números
        if (value === '' || value === '-') {
            setter(value);
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue)) {
            setter(numValue);
        }
    };

    return (
        <>
            <main className="mundosMain agentesMain">
                <aside className="mundosLista esquerdaAgentes">
                    <div className='topoAgentes'>
                        <h1>Agentes</h1>
                        <p className='paragrafoInformativo'>Todos os agentes que você criou e salvou. Clique em um para editar as configurações.</p>
                    </div>
                    <div className='divListaMundos'>
                        {agentes.length === 0 && !carregandoLista ? (
                            <p className='paragrafoInformativo' style={{ textAlign: 'center', padding: '20px' }}>
                                Nenhum agente salvo ainda. Crie seu primeiro agente!
                            </p>
                        ) : (
                            agentes.map((agente) => {
                                // Mantendo a lógica de ativação da primeira tela
                                const estaAtivo = agenteEdicao.id == agente.id;

                                return (
                                    <div
                                        key={agente.id}
                                        className={`itemListaMundos itemListaAgentesCustomizados ${estaAtivo ? 'ativo' : ''}`}
                                    >
                                        <div className='esquerda'>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h2>{agente.nome}</h2>
                                                <p><span className='destaqueGold'>ID: {agente.id}</span></p>
                                            </div>

                                            {/* Início da lógica detalhada da segunda tela */}
                                            {agente.tipo === 2 ? (
                                                <>
                                                    <p className="destaqueRed paragrafoInformativo">✎ Agente lógico personalizado</p>
                                                    <p className="paragrafoInformativo">
                                                        {[
                                                            agente.properties.corajoso && "◬ Corajoso",
                                                            agente.properties.explorador && "◈ Explorador",
                                                            agente.properties.garimpeiro && "✦ Garimpeiro",
                                                            agente.properties.cacador && "✕ Caçador"
                                                        ]
                                                            .filter(Boolean)
                                                            .map((texto, index, arr) => (
                                                                <span key={index}>
                                                                    {texto} <br />
                                                                    {/* {index < arr.length - 1 && " • "} */}
                                                                </span>
                                                            ))}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="destaqueGold paragrafoInformativo">✎ Agente evolutivo personalizado</p>
                                                    <p className="paragrafoInformativo">
                                                        ⟳ Gerações: {agente.properties.geracoes} <br />
                                                        ≡ População: {agente.properties.populacao} <br />
                                                        ⌬ Cruzamento: {agente.properties.taxa_de_cruzamento}% <br />
                                                        ⚯ Mutação: {agente.properties.taxa_de_mutacao}% <br />
                                                    </p>
                                                </>
                                            )}

                                            <p className='paragrafoInformativo' style={{ marginTop: '5px' }}>
                                                <b>Criado em: </b> {new Date(agente.data).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className='direita'>
                                            <button
                                                onClick={async () => {
                                                    await carregarAgenteParaEdicao(agente);
                                                    setCriarNovo(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className='botaoExcluir'
                                                onClick={() => handleExcluirAgente(agente.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {carregandoLista &&
                            <div className='loadingPequeno'>
                                <img src={LoadingGif} alt="" />
                                <p className='paragrafoInformativo'>Se demorar, provavelmente a API está dormindo...</p>

                                {mostrarLinoDormindo && (
                                    <img src={LinoDormindo} alt="" className='fade-in linoDormindoImg' />
                                )}
                            </div>
                        }

                        {hasMore && !carregandoLista && (
                            <div className='loadingPequeno'>
                                {carregandoMais ?
                                    <>
                                        <img src={LoadingGif}></img>
                                    </>
                                    :
                                    <>
                                        <button
                                            style={{ padding: '10px' }}
                                            onClick={handleCarregarMais}
                                            disabled={carregandoMais}
                                        >
                                            Carregar mais
                                        </button>
                                    </>
                                }
                            </div>
                        )}
                    </div>
                </aside>
                <section className="direitaAgentes">
                    <div className='divControle'>
                        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                <h2>Customização</h2>
                                <p className='paragrafoInformativo' style={{ textAlign: 'left' }}>
                                    Customize e salve um agente personalizado para testar nos ambientes que você criou!
                                </p>
                            </span>
                        </span>
                    </div>
                    {/* {criarNovo && (
                        <div className='divControle'>
                            <h2 style={{ width: '100%', textAlign: 'center' }}>Tipo de agente</h2>
                            <div className={`auxiliarSelecaoTipoAgente`}>
                                <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'logico' ? 'blocoTipoSelecionado' : ''}`}
                                    onClick={() => {
                                        setTipoAgenteSelerionado('logico');
                                        setTipoIntAgenteSelecionado(2);
                                    }}>
                                    <img src={LinoLogico} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'logico' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                    <h3>Lógico</h3>
                                    <p className='paragrafoInformativo'>
                                        Esse agente não tem sentimentos, apenas segue um conjunto de regras definidas em sua programação
                                    </p>
                                </div>
                                <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'blocoTipoSelecionado' : ''}`}
                                    onClick={() => {
                                        setTipoAgenteSelerionado('evolutivo');
                                        setTipoIntAgenteSelecionado(3);
                                    }}>
                                    <img src={LinoEvolutivo} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                    <h3>Evolutivo</h3>
                                    <p className='paragrafoInformativo'>
                                        Esse agente evolui aprendendo com os seus erros (diferente de certas pessoas)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {criarNovo && (
                        <div className='divControle'>
                            <h2 style={{ width: '100%', textAlign: 'center' }}>Tipo de agente</h2>
                            <div className={`auxiliarSelecaoTipoAgente`}>
                                {(agenteEdicao.id === 0 || agenteEdicao.tipo === 2) && (
                                    <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'logico' ? 'blocoTipoSelecionado' : ''}`}
                                        onClick={() => {
                                            if (agenteEdicao.id === 0) {
                                                setTipoAgenteSelerionado('logico');
                                                setTipoIntAgenteSelecionado(2);
                                            }
                                        }}
                                        style={{ opacity: agenteEdicao.id !== 0 && agenteEdicao.tipo !== 2 ? 0.5 : 1, cursor: agenteEdicao.id !== 0 && agenteEdicao.tipo !== 2 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <img src={LinoLogico} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'logico' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                        <h3>Lógico</h3>
                                        <p className='paragrafoInformativo'>
                                            Esse agente não tem sentimentos, apenas segue um conjunto de regras definidas em sua programação
                                        </p>
                                    </div>
                                )}

                                {(agenteEdicao.id === 0 || agenteEdicao.tipo === 3) && (
                                    <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'blocoTipoSelecionado' : ''}`}
                                        onClick={() => {
                                            if (agenteEdicao.id === 0) {
                                                setTipoAgenteSelerionado('evolutivo');
                                                setTipoIntAgenteSelecionado(3);
                                            }
                                        }}
                                        style={{ opacity: agenteEdicao.id !== 0 && agenteEdicao.tipo !== 3 ? 0.5 : 1, cursor: agenteEdicao.id !== 0 && agenteEdicao.tipo !== 3 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <img src={LinoEvolutivo} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                        <h3>Evolutivo</h3>
                                        <p className='paragrafoInformativo'>
                                            Esse agente evolui aprendendo com os seus erros (diferente de certas pessoas)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {agenteEdicao.id != 0 && (
                        <div className='divControle divModoEdicao'>

                            {carregandoAgenteIndividual ?
                                <>
                                    <div className='loadingPequeno'>
                                        <img src={LoadingGif} alt="" />
                                    </div>
                                </>
                                :
                                <>
                                    <p><b>Você ativou o modo de edição de agente</b></p>
                                    <p className='paragrafoExplicacao'>Qualquer modificação feita e salva enquanto esse modo estiver ativado, será salva permanentemente no agente selecionado, então preste atenção!</p>
                                    <p className='indicadorAgenteEditado'>
                                        Você está editando o agente: <br />
                                        Nome: {agenteEdicao.nome} <br />
                                        ID: {agenteEdicao.id}
                                    </p>
                                    <button
                                        className='botaoCancelarEdicao'
                                        onClick={async () => {
                                            const respostaConfirmacao = await confirm({
                                                title: "Cancelar edição?",
                                                message: "Esse aviso é para evitar que você perca uma edição complexa tão facilmente",
                                                type: "confirm",
                                                botao1: "Sim",
                                                botao2: "Me enganei"
                                            });

                                            if (respostaConfirmacao === 'yes') {
                                                setAgenteEdicao({ id: 0 });
                                                setTipoAgenteSelerionado('');
                                                setTipoIntAgenteSelecionado(0);
                                                setCriarNovo(false);
                                            }
                                        }}
                                    >
                                        Cancelar edição
                                    </button>
                                </>
                            }
                        </div>
                    )}
                    <div className='divControle divConfigsAgente'>
                        {tipoAgenteSelecionado == '' ?
                            <>
                                <h2>Crie um <span className='destaqueRoxo'>novo agente</span>, selecione um tipo!</h2>
                                <p>Ou escolha um dos seus agentes para editar</p>
                                {!criarNovo && (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <button
                                            className='botaoNovoAgente'
                                            onClick={() => setCriarNovo(true)}
                                        >Novo agente</button>
                                    </span>
                                )}
                            </> :
                            tipoAgenteSelecionado == 'logico' ?
                                <>
                                    <h2>Configurações do agente lógico</h2>
                                    <p>Nome do seu agente</p>
                                    <input
                                        type="text"
                                        placeholder='Nome do agente lógico'
                                        value={nomeAgente}
                                        onChange={(e) => setNomeAgente(e.target.value)}
                                    />
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={explorador}  // <-- ADICIONE ESTA LINHA
                                                    onChange={e => setExplorador(e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Explorador</b><br />
                                            <span className='paragrafoInformativo'>
                                                O agente irá explorar ao máximo aquele ambiente em vez de simplesmente encerrar a sua busca ao coletar um ouro.
                                            </span>
                                        </p>
                                    </div>

                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={coragem}
                                                    onChange={e => setCoragem(e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Corajoso</b><br />
                                            <span className='paragrafoInformativo'>
                                                Quando desativado, o agente irá explorar as células marcadas como suspeitas apenas se não vencer a partida. Quando ativado, o agente irá entrar nas células suspeitas mais cedo buscando pegar o ouro antes de explorar o restante do ambiente.
                                            </span>
                                        </p>
                                    </div>

                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={garimpeiro}
                                                    onChange={e => setGarimpeiro(e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Garimpeiro</b><br />
                                            <span className='paragrafoInformativo'>
                                                Se ativado, o agente fará a coleta do ouro sempre que encontrar, se desativado, ele não fará a coleta.
                                            </span>
                                        </p>
                                    </div>

                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={odio}  // <-- ADICIONE ESTA LINHA
                                                    onChange={(e) => { setOdio(e.target.checked); }}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Caçador</b><br />
                                            <span className='paragrafoInformativo'>
                                                Quando ativado, o agente irá tentar matar o Wumpus sempre que detectar o cheiro, quando desativado, o agente irá atrás do Wumpus em último caso, ou irá decidir na hora.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='divControle controlesSalvarAgente'>
                                        <button onClick={handleSalvarAgente} className='botaoSalvarAgente'>Salvar esse agente</button>
                                        <button
                                            onClick={async () => {
                                                const respostaConfirmacao = await confirm({
                                                    title: "Cancelar?",
                                                    message: "Esse aviso é para evitar que você perca uma edição complexa tão facilmente",
                                                    type: "confirm",
                                                    botao1: "Sim",
                                                    botao2: "Me enganei"
                                                });

                                                if (respostaConfirmacao === 'yes') {
                                                    setAgenteEdicao({ id: 0 });
                                                    setTipoAgenteSelerionado('');
                                                    setTipoIntAgenteSelecionado(0);
                                                    setCriarNovo(false);
                                                }
                                            }}
                                        >Cancelar</button>
                                        {/* <button>Excluir</button> */}
                                    </div>
                                </> :
                                // -----------------------------------------------------------------------
                                <>
                                    <h2>Configurações do agente evolutivo</h2>
                                    <p>Nome do seu agente</p>
                                    <input
                                        type="text"
                                        placeholder='Nome do agente evolutivo'
                                        value={nomeAgenteEvolutivo}
                                        onChange={(e) => setNomeAgenteEvolutivo(e.target.value)}
                                    />
                                    <button
                                        onClick={() => setMostrarFuncionamento(!mostrarFuncionamento)}
                                    >
                                        {mostrarFuncionamento ?
                                            'Já sei como funciona :)' : 'Não sei como funciona :('
                                        }
                                    </button>
                                    {mostrarFuncionamento && (
                                        <>
                                            <h3>Esse agente funciona da seguinte maneira:</h3>
                                            <p className='paragrafoExplicacao'>
                                                Um indivíduo é criado com as suas ações já predefinidas, os caminhos que ele vai tomar, as ações que ele vai executar e etc. Esse conjunto de características são o que chamamos de <span className='destaqueGold'>gene</span>. <br /><br />
                                                Um número específico de indivíduos é gerado aleatoriamente, esses indivíduos são enviados para o mundo e, de acordo com as ações executadas no mundo, esses agentes ganham cada um a sua pontuação. Esse conjunto de indivíduos é o que chamamos de <span className='destaqueGold'>população</span>.<br /><br />
                                                Uma parte dos agentes é escolhida, geralmente os melhores, mas com um certo nível de aleatoriedade. Esses agentes são reproduzidos, ou seja, são gerados novos agentes se baseando nas características desses escolhidos e adicionando algumas características aleatórias para manter a individualidade, isso é o que chamamos de <span className='destaqueGold'>mutação</span>, e serve para que os agentes tenham a oportunidade de desenvolver novas estratégias. <br /><br />
                                                O novo conjunto de agentes criado é chamado de <span className='destaqueGold'>geração</span>, esses agentes são testados e pontuações também são atribuídas, e o processo se repete. <br /><br />
                                                Um número específico de gerações são criadas e reproduzidas, e o melhor agente resultante é escolhido, tudo isso é feito em segundos (ou menos de um segundo) no servidor, e você recebe o melhor agente desse processo!
                                            </p>
                                            <hr />
                                        </>
                                    )}
                                    <p className='paragrafoInformativo'>
                                        Se você realmente leu e sabe como funciona (eu vou confiar em você), então deve ter percebido o quanto a pontuação é importante! A pontuação define o nível de <span className='destaqueGold'>premiação</span> ou <span className='destaqueRed'>punição</span> para cada ação daquele agente. É muito importante que isso seja bem definido para que o agente evolua corretamente para se comportar da maneira que você quer! Então, <b>esteja atento às pontuações</b> que você vai atribuir.
                                    </p>
                                    <br />
                                    <h2>Geração</h2>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input
                                            type="number"
                                            value={populacao}
                                            onChange={(e) => setPopulacao(Number(e.target.value))}
                                        />
                                        <p>População <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantos agentes terão em cada ciclo (isso garante variedade genética)
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input
                                            type="number"
                                            value={geracoes}
                                            onChange={(e) => setGeracoes(Number(e.target.value))}
                                        />
                                        <p>Gerações <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantas vezes os agentes irão se reproduzir 😏
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder='0 a 100'
                                            value={taxaMutacao}
                                            onChange={(e) => setTaxaMutacao(Number(e.target.value))}
                                        />
                                        <p>Taxa de mutação (%) <br />
                                            <span className='paragrafoInformativo'>
                                                O quanto os agentes irão mudar em cada nascimento?
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder='0 a 100'
                                            value={taxaCruzamento}
                                            onChange={(e) => setTaxaCruzamento(Number(e.target.value))}
                                        />
                                        <p>Taxa de cruzamento (%) <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantos indivíduos irão cruzar 😏 (Note: a prioridade é dada aos indivíduos com pontuações maiores)
                                            </span>
                                        </p>
                                    </div>
                                    <hr />
                                    <h2>Pontuação</h2>
                                    <p>Podem ser <span className='destaqueGold'>positivas para premiação</span> ou <span className='destaqueRed'>negativas para punição</span>, os valores definem a intensidade.</p>
                                    <span>
                                        Tipo:
                                        <select name="tipoDeConfigAgenteEvolutivo" id=""
                                            className='selectTipoConfiAgenteEvolutivo'
                                            onChange={(e) => setTipoConfigPontos(e.target.value)}
                                        >
                                            <option value="simples">
                                                Configuração simples
                                            </option>
                                            <option value="equacao">
                                                Equação fitness (avançado)
                                            </option>
                                        </select>
                                    </span>
                                    {tipoConfigPontos === 'simples' ?
                                        <>
                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={passoValido}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setPassoValido(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setPassoValido(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (passoValido === '' || passoValido === '-') {
                                                                setPassoValido(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>A cada passo válido<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={passoInvalido}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setPassoInvalido(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setPassoInvalido(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (passoInvalido === '' || passoInvalido === '-') {
                                                                setPassoInvalido(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>A cada passo inválido<br /></p>
                                                </div>
                                            </div>

                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={tiroValido}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setTiroValido(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setTiroValido(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (tiroValido === '' || tiroValido === '-') {
                                                                setTiroValido(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>A cada tiro válido<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={tiroInvalido}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setTiroInvalido(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setTiroInvalido(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (tiroInvalido === '' || tiroInvalido === '-') {
                                                                setTiroInvalido(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>A cada tiro inválido<br /></p>
                                                </div>
                                            </div>

                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={entradaBuraco}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setEntradaBuraco(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setEntradaBuraco(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (entradaBuraco === '' || entradaBuraco === '-') {
                                                                setEntradaBuraco(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>Entrou em sala com buraco<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={entradaWumpus}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setEntradaWumpus(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setEntradaWumpus(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (entradaWumpus === '' || entradaWumpus === '-') {
                                                                setEntradaWumpus(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>Entrou em sala com wumpus<br /></p>
                                                </div>
                                            </div>

                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={pegouOuro}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setPegouOuro(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setPegouOuro(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (pegouOuro === '' || pegouOuro === '-') {
                                                                setPegouOuro(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>Pegou um ouro<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input
                                                        type="text"
                                                        value={ouroVoltouOrigem}
                                                        onChange={e => {
                                                            let value = e.target.value;
                                                            if (value === '' || value === '-') {
                                                                setOuroVoltouOrigem(value);
                                                                return;
                                                            }
                                                            const numValue = Number(value);
                                                            if (!isNaN(numValue)) {
                                                                setOuroVoltouOrigem(numValue);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (ouroVoltouOrigem === '' || ouroVoltouOrigem === '-') {
                                                                setOuroVoltouOrigem(0);
                                                            }
                                                        }}
                                                    />
                                                    <p>Entrou em sala com ouro voltou para a origem<br /></p>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <hr />
                                            <h3>Equação fitness</h3>
                                            <p>Se você está aqui, imagino que saiba o que está fazendo, então escreva a sua equação abaixo</p>
                                            <input
                                                type="text"
                                                value={fitness}
                                                placeholder='((PV * -1) +  (PI * -100) + (TI * -100) (TV * 100) + (SW * -100) + (SP * -100) (SO * 100) + (V * 1000)) / '
                                                onChange={(e) => {
                                                    setFitness(e.target.value);
                                                }}
                                            />
                                        </>
                                    }
                                    <div className='divControle controlesSalvarAgente'>
                                        <button onClick={handleSalvarAgente} className='botaoSalvarAgente'>Salvar esse agente</button>
                                        <button
                                            onClick={async () => {
                                                const respostaConfirmacao = await confirm({
                                                    title: "Cancelar?",
                                                    message: "Esse aviso é para evitar que você perca uma edição complexa tão facilmente",
                                                    type: "confirm",
                                                    botao1: "Sim",
                                                    botao2: "Me enganei"
                                                });

                                                if (respostaConfirmacao === 'yes') {
                                                    setAgenteEdicao({ id: 0 });
                                                    setTipoAgenteSelerionado('');
                                                    setTipoIntAgenteSelecionado(0);
                                                    setCriarNovo(false);
                                                }
                                            }}
                                        >Cancelar</button>
                                        {/* <button>Excluir</button> */}
                                    </div>
                                </>
                        }
                    </div>
                </section>
            </main>
            {carregando &&
                <>
                    <LoadingPage></LoadingPage>
                </>
            }
        </>
    )
}