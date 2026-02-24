import "./styles/novaPartida.css"
import { useAuth } from '../contexts/AuthContext';
import LoadingGif from '../assets/loadingGif.gif'
import { useState, useEffect, useRef } from "react";
import { useConfirm } from '../contexts/ConfirmContext';
import { useNavigate } from 'react-router-dom'
import { useExecution } from "../contexts/ExecutionContext";

function Bloco({ selecionado, wumpus, buraco, ouro, onMouseEnter, onMouseDown, onClick, salaInicial }) {
    return (
        <div
            className={`bloco 
                ${selecionado ? 'selecionado' : ''} 
                ${salaInicial ? 'salaInicial' : ''}
            `}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            {wumpus && <div className='elemento wumpus'></div>}
            {buraco && <div className='elemento buraco'></div>}
            {ouro && <div className='elemento ouro'></div>}
        </div>
    )
}

export default function () {
    const { getMundosSalvos, getMiniMapa } = useAuth();
    const navigate = useNavigate();
    const [mundos, setMundos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const { confirm } = useConfirm();
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [temMaisItens, setTemMaisItens] = useState(true);

    const [mundoSelecionado, setMundoSelecionado] = useState();
    const [agenteSelecionado, setAgenteSelecionado] = useState(0);
    const [salaSelecionada, setSalaSelecionada] = useState([]);
    const [ativarDiagonal, setAtivarDiagonal] = useState(false);
    const [offsets, setOffsets] = useState({ offsetX: 0, offsetY: 0 });
    const { setExecutionConfig } = useExecution();

    const [carregadoMinimapa, setCarregandoMinimapa] = useState(false);
    const [miniGrid, setMiniGrid] = useState([]);
    const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
    const [salaInvalida, setSalaInvalida] = useState(false);
    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(40);


    useEffect(() => {
        if (!containerRef.current || dimensoes.largura === 0 || dimensoes.altura === 0) return;

        const { clientWidth, clientHeight } = containerRef.current;

        // Calcula o tamanho máximo que cada célula pode ter
        const sizeX = Math.floor(clientWidth / dimensoes.largura);
        const sizeY = Math.floor(clientHeight / dimensoes.altura);

        // Usa o menor dos dois valores, mas com um limite máximo (ex: 40px)
        setCellSize(Math.min(sizeX, sizeY, 40));
    }, [dimensoes]);

    async function iniciar() {
        if (!mundoSelecionado) {
            const resposta = await confirm({
                title: "Vai fazer o que?",
                message: "Como você vai executar uma partida sem selecionar um mundo?",
                type: "confirm",
                botao1: "ops kkk",
                botao2: 'Eu tenho um arquivo JSON'
            })
            console.log(resposta);
            if (resposta == 'no') {
                setExecutionConfig(null);
                navigate('/execucao');
            }
            return;
        }

        if (salaSelecionada.length === 0) {
            await confirm({
                title: "Espera um pouco",
                message: "Por favor, não me diga que você queria iniciar uma partida sem selecionar uma sala inicial.",
                type: "alert",
                botao1: "Não digo"
            })
            return;
        }

        try {
            const sala = miniGrid[salaSelecionada[1]]?.[salaSelecionada[0]];

            if (!sala || !sala.ativa) {
                alert('Sala inválida!');
                return;
            }

            setExecutionConfig({
                mundoSelecionado,
                ativarDiagonal,
                agenteSelecionado,
                salaSelecionada
            })

            navigate('/execucao');
        } catch (err) {
            console.log("Erro completo ao iniciar partida: ", err);
        }
    }

    async function carregarMinimapa(id) {
        setCarregandoMinimapa(true);

        const salasAtivas = await getMiniMapa(id);

        if (!salasAtivas.length) {
            setMiniGrid([]);
            setDimensoes({ largura: 0, altura: 0 });
            setCarregandoMinimapa(false);
            return;
        }

        const xs = salasAtivas.map(s => s.x);
        const ys = salasAtivas.map(s => s.y);

        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        const largura = maxX + 1;
        const altura = maxY + 1;

        setOffsets({ offsetX: 0, offsetY: 0 });

        const grid = Array.from({ length: altura }, () =>
            Array.from({ length: largura }, () => ({
                ativa: false,
                wumpus: false,
                buraco: false,
                ouro: false,
                xReal: 0,
                yReal: 0
            }))
        );

        salasAtivas.forEach(sala => {
            const x = sala.x;
            const y = sala.y;

            if (y < altura && x < largura) {
                grid[y][x] = {
                    ativa: true,
                    wumpus: sala.wumpus,
                    buraco: sala.buraco,
                    ouro: sala.ouro,
                    xReal: sala.x,
                    yReal: sala.y
                };
            }
        });

        for (let y = 0; y < altura; y++) {
            for (let x = 0; x < largura; x++) {
                grid[y][x].xReal = x;
                grid[y][x].yReal = y;
            }
        }

        setMiniGrid(grid);
        setDimensoes({ largura, altura });
        setCarregandoMinimapa(false);
    }

    async function carregarMundosSalvos(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregando(true);
        } else {
            setCarregandoMais(true);
        }
        try {
            const resposta = await getMundosSalvos(pagina, 6);

            // Se a resposta não for um array ou estiver vazia
            if (!resposta || !Array.isArray(resposta) || resposta.length === 0) {
                if (pagina === 1) {
                    setMundos([]);
                }
                setTemMaisItens(false);
                return;
            }

            // O último item é o booleano que indica se tem mais itens
            const temMais = !resposta[resposta.length - 1];
            const itensMundos = resposta.slice(0, resposta.length - 1); // Remove o último item (booleano)

            if (itensMundos.length > 0) {
                if (limparLista || pagina === 1) {
                    setMundos(itensMundos);
                } else {
                    setMundos(prev => [...prev, ...itensMundos]);
                }
            } else if (pagina === 1) {
                setMundos([]);
            }

            setTemMaisItens(temMais);
            // console.log("Tem mais itens?", temMais);

            setPaginaAtual(pagina);

        } catch (error) {
            console.error('Erro ao carregar mundos:', error);
            setTemMaisItens(false);
        } finally {
            if (pagina === 1) {
                setCarregando(false);
            }

            if (mundos.length > 0) {
                setCarregandoMais(false);
            }
        }
    }

    function carregarMais() {
        if (!carregandoMais && temMaisItens) {
            carregarMundosSalvos(paginaAtual + 1, false);
        }
    }

    function formatarData(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    useEffect(() => {
        carregarMundosSalvos(1, true);
    }, [])

    return (
        <>
            <main className="mainNovaPartida">
                <aside className="esquerdaNovaPartida">
                    <div className="divControle">
                        <h1>Nova partida</h1>
                        <p className="paragrafoInformativo">
                            Selecione um mundo e um agente para continuar. Claro, você precisa ter criado um mundo antes de iniciar uma partida!
                            <br />
                        </p>
                        <button
                            className='botaoInicio telaNovaPartida'
                            onClick={() => {
                                navigate('/', { replace: true });
                            }}
                        >
                            Ir para o início
                        </button>
                    </div>
                    <div className="divControle">
                        <p>Mundos que você criou:</p>
                    </div>
                    <div className="listaMundos">
                        {carregando &&
                            <div className="loadingPequeno">
                                <img src={LoadingGif} alt="" />
                            </div>
                        }
                        {!carregando && mundos.length > 0 && (
                            mundos.map((mundo) => {

                                const ativo = mundo.id == mundoSelecionado;

                                return (
                                    <div
                                        key={mundo.id}
                                        className={`itemListaMundos ${ativo ? 'ativo' : ''}`}
                                        onClick={() => {
                                            setMundoSelecionado(mundo.id);
                                            setSalaSelecionada([]);
                                            setSalaInvalida(false);
                                            carregarMinimapa(mundo.id);
                                        }}
                                    >
                                        <h2>{mundo.nome}</h2>
                                        <p className='paragrafoInformativo'>Data de criação: {formatarData(mundo.data_criacao)}</p>
                                        <p className='paragrafoInformativo'>
                                            <b>Salas ativas:</b> {mundo.estatisticas.salasAtivas} <br />
                                            <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                            <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                            <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                        </p>
                                    </div>
                                )
                            })
                        )}

                        {!carregando && mundos.length === 0 && (
                            <div className='loadingPequeno'>
                                <p>Não tem nada aqui!</p>
                                <button
                                    className="botaoIniciarPartida botaoCriarNovoMundo"
                                    onClick={() => {
                                        navigate('/mapa')
                                    }}
                                >Clique aqui para criar um novo mundo</button>
                            </div>
                        )}

                        {!carregando && mundos.length > 0 && (
                            carregandoMais ? (
                                <div className='loadingPequeno'>
                                    <img src={LoadingGif} alt="" />
                                </div>
                            ) : temMaisItens ? (
                                <div className='loadingPequeno'>
                                    <button
                                        onClick={carregarMais}
                                        disabled={carregandoMais}
                                        style={{ padding: '10px' }}
                                    >
                                        Carregar mais
                                    </button>
                                </div>
                            ) : null
                        )}
                    </div>
                </aside>
                <section className="centroNovaPartida">
                    <div className="div-mapa" ref={containerRef}>
                        {carregadoMinimapa ? (
                            <img src={LoadingGif} alt="" style={{ width: '100px' }} />
                        ) : (
                            <div
                                className='mapa-blocos'
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${dimensoes.largura}, ${cellSize}px)`,
                                    gridTemplateRows: `repeat(${dimensoes.altura}, ${cellSize}px)`,
                                    width: `${dimensoes.largura * cellSize}px`,
                                    height: `${dimensoes.altura * cellSize}px`,
                                }}
                            >
                                {miniGrid.map((linha, y) =>
                                    linha.map((sala, x) => {
                                        const salaInicial = salaSelecionada.length > 0 &&
                                            salaSelecionada[0] === x &&
                                            salaSelecionada[1] === y;

                                        return (
                                            <Bloco
                                                key={`${x}-${y}`}
                                                selecionado={sala.ativa}
                                                wumpus={sala.wumpus}
                                                buraco={sala.buraco}
                                                ouro={sala.ouro}
                                                onClick={() => {
                                                    if (sala.wumpus || sala.buraco || sala.ouro || !sala.ativa) {
                                                        setSalaInvalida(true);
                                                        setSalaSelecionada([]);
                                                    } else {
                                                        setSalaSelecionada([x, y]);
                                                        setSalaInvalida(false);
                                                    }
                                                }}
                                                salaInicial={salaInicial}
                                            />
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                    <div className="divInformacoes">
                        {miniGrid.length >= 0 &&
                            <>
                                <p className="paragrafoInformativo">
                                    Selecione onde seu agente será posicionado no início da partida, essa posição também será a saída do mundo, o que indica o fim da partida. <b style={{ color: 'red' }}>Salas com buraco, wumpus, ouro, ou salas fora do mundo, não serão aceitas!</b>
                                </p>
                                <p className={`pSalaSelecionada`}>
                                    <b>A sala selecionada é marcada na cor branca!</b><br />
                                    {
                                        !salaInvalida &&
                                        (salaSelecionada.length > 0 ?
                                            `Atual: ${salaSelecionada[0]}, ${salaSelecionada[1]}` : 'Selecione!')
                                    }

                                    {salaInvalida && <span style={{ color: 'red' }}>Sala inválida! Selecione outra.</span>}
                                </p>
                            </>
                        }
                    </div>
                </section>
                <aside className="direitaNovaPartida">
                    <div className="divControle">
                        <h2>Configurações da partida</h2>
                        <p className="paragrafoInformativo">
                            Tenha certeza que configurou corretamente antes de iniciar a partida.
                        </p>
                    </div>
                    <div className="divSelecioneAgente">
                        <p style={{ margin: '5px' }}>Selecione o agente:</p>
                        <div className="listaAgentes">
                            <div className="itemAgente">
                                <h3>Agente 0</h3>
                                <p className="paragrafoInformativo">
                                    Agente totalmente aleatório, apenas dá passos pelo ambiente sem se importar, ou seja, um agente burro.
                                </p>
                            </div>
                        </div>
                        {/* <label htmlFor="" className="checkMovimento">
                            <input
                                type="checkbox"
                                name="" id=""
                                onChange={(e) => {
                                    setAtivarDiagonal(e.target.checked);
                                    // console.log(e.target.checked);
                                }} />
                            Permitir movimentos na diagonal
                        </label> */}
                    </div>
                    <div className="divControle">
                        <p>{mundoSelecionado ? '✅' : '❌'} Selecionou um mundo</p>
                        <p>✅ Selecionou um agente</p>
                        <p>{salaSelecionada.length > 0 ? '✅' : '❌'} Selecionou uma posição inicial</p>
                        <button
                            className="botaoIniciarPartida"
                            onClick={iniciar}
                        >Iniciar partida</button>
                    </div>
                </aside>
            </main>
            {/* <footer className="rodapeNovaPartida">
                rodapé
            </footer> */}
        </>
    )
}