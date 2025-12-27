import './styles/mundosSalvos.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef, useTransition } from 'react';
import { useConfirm } from '../contexts/ConfirmContext';

import LoadingPage from './LoadingPage';

import LinoDormindo from '../assets/linoDormindo.png'
import LoadingGif from '../assets/loadingGif.gif'

function Bloco({ selecionado, wumpus, buraco, ouro, onMouseEnter, onMouseDown, onClick }) {
    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''}`}
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

export default function MundosSalvos() {

    const { getMundosSalvos, getMiniMapa, excluirmundo } = useAuth();
    const [mundos, setMundos] = useState([]);
    const [carregado, setCarregado] = useState(false);
    const [carregandoLoading, setCarregandoLoading] = useState(false);
    const [carregadoMinimapa, setCarregandoMinimapa] = useState(false);
    const [mostrarLinoDormindo, setMostrarLinoDormindo] = useState(false);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [miniGrid, setMiniGrid] = useState([]);
    const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
    const [pesquisa, setPesquisa] = useState('');
    const mundosFiltrados = mundos.filter(mundo =>
        mundo.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );
    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(40);
    const { confirm } = useConfirm();

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [temMaisItens, setTemMaisItens] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!containerRef.current) return;

        const { clientWidth, clientHeight } = containerRef.current;

        const sizeX = Math.floor(clientWidth / dimensoes.largura);
        const sizeY = Math.floor(clientHeight / dimensoes.altura);

        setCellSize(Math.min(sizeX, sizeY, 40));
    }, [dimensoes]);

    useEffect(() => {
        if (!carregado) {
            setMostrarLinoDormindo(false);
            return;
        }

        const timer = setTimeout(() => {
            setMostrarLinoDormindo(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, [carregado]);


    function carregarMais() {
        if (!carregandoMais && temMaisItens && !pesquisa) {
            startTransition(() => {
                carregarMundosSalvos(paginaAtual + 1, false);
            });
        }
    }

    async function carregarMundosSalvos(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregado(true);
        } else {
            setCarregandoMais(true);
        }
        try {
            const resposta = await getMundosSalvos(pagina, 5);

            if (resposta && resposta.length > 0) {
                if (limparLista || pagina === 1) {
                    setMundos(resposta);
                } else {
                    setMundos(prev => [...prev, ...resposta]);
                }
                setTemMaisItens(resposta.length === 5);
            } else {
                if (pagina === 1) {
                    setMundos([]);
                }
                setTemMaisItens(false);
            }

            setPaginaAtual(pagina);

        } catch (error) {
            console.error('Erro ao carregar mundos:', error);
            await confirm({

            })
            setTemMaisItens(false);
        } finally {
            // console.log("Os mundos agora: ", mundos);
            if (pagina === 1) {
                setCarregado(false);
            }

            if (mundos.length > 0) {
                setCarregandoMais(false);
            }
        }
    }

    function carregarMais() {
        if (!carregandoMais && temMaisItens && !pesquisa) {
            carregarMundosSalvos(paginaAtual + 1, false);
        }
    }

    // useEffect(() => {
    //     if (pesquisa) {
    //         setTemMaisItens(false);
    //     } else {
    //         setTemMaisItens(mundos.length === paginaAtual * 5);
    //     }
    // }, [pesquisa]);

    useEffect(() => {
        carregarMundosSalvos(1, true);
    }, [])

    async function excluirMundoSalvo(id) {
        const confirmar = await confirm({
            title: "Tem certeza?",
            message: "Deseja mesmo excluir este mundo?",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não"
        });

        if (confirmar === "yes") {
            setCarregandoLoading(true);
            const resposta = await excluirmundo(id);
            //vefificação de resposta da API
            if (!resposta) {
                console.log('algo deu errado');
                await confirm({
                    title: "Droga",
                    message: "Algo deu errado, provavlemente foi culpa do programador backend.",
                    type: "alert",
                    botao1: "Aff"
                })
            } else {
                setMundos(prev => prev.filter(mundo => mundo.id !== id));
                setMiniGrid([]);
                setDimensoes({ largura: 0, altura: 0 });
                setPesquisa('');
                setMundoSelecionado(null);
                setCarregandoMinimapa(false);
                setCellSize(0);
                await confirm({
                    title: "Absoluta?",
                    message: "Brincadeira, seu mundo já foi excluído.",
                    type: "alert",
                    botao1: "Palhaço",
                });
            }
        }
        setCarregandoLoading(false);
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

        const largura = maxX - minX + 1;
        const altura = maxY - minY + 1;

        const grid = Array.from({ length: altura }, () =>
            Array.from({ length: largura }, () => ({
                ativa: false,
                wumpus: false,
                buraco: false,
                ouro: false
            }))
        );

        salasAtivas.forEach(sala => {
            const x = sala.x - minX;
            const y = sala.y - minY;

            grid[y][x] = {
                ativa: true,
                wumpus: sala.wumpus,
                buraco: sala.buraco,
                ouro: sala.ouro
            };
        });

        setMiniGrid(grid);
        setDimensoes({ largura, altura });
        setCarregandoMinimapa(false);
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

    const navigate = useNavigate();

    return (
        <>
            <main className='mundosMain'>
                <aside className='mundosLista'>

                    <div className='topoMundosSalvos'>
                        <div className='topoMundosAuxiliar'>
                            <h1>
                                Mundos salvos
                            </h1>
                            <p className='paragrafoInformativo'>
                                Todos os mundos que você criou e salvou
                            </p>
                            <input
                                type="text"
                                name="barraPesquisaMundosSalvos"
                                id=""
                                className='barraPesquisaMundosSalvos'
                                placeholder='Pesquise qualquer coisa'
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                            />
                        </div>
                        <div className='topoMundosAuxiliar'>
                            <button className='botaoNovoMundo' onClick={() => navigate('/mapa')}>Novo</button>
                        </div>
                    </div>

                    <div className='divListaMundos'>
                        {carregado &&
                            <div className='loadingPequeno'>
                                <img src={LoadingGif} alt="" />
                                <p className='paragrafoInformativo'>Se demorar, provavelmente a API está dormindo...</p>

                                {mostrarLinoDormindo && (
                                    <img src={LinoDormindo} alt="" className='fade-in linoDormindoImg' />
                                )}
                            </div>
                        }

                        {mundosFiltrados.length > 0 &&
                            (mundosFiltrados.map((mundo, index) => {
                                const ativo = mundoSelecionado === mundo.id;
                                // console.log(mundo);
                                return (
                                    <div
                                        key={mundo.id}
                                        className={`itemListaMundos ${ativo ? 'ativo' : ''}`}
                                        onClick={() => {
                                            setMundoSelecionado(mundo.id);
                                            carregarMinimapa(mundo.id);
                                        }}
                                    >
                                        <div className='esquerda'>
                                            <h2>{mundo.nome}</h2>
                                            <p className='paragrafoInformativo'>Data de criação: {formatarData(mundo.data_criacao)}</p>
                                            <p className='paragrafoInformativo'>
                                                <b>Salas ativas:</b> {mundo.estatisticas.salasAtivas} <br />
                                                <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                                <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                                <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                            </p>
                                        </div>
                                        <div className='direita'>
                                            <button className='botaoEditar'>Editar</button>
                                            <button
                                                className='botaoExcluir'
                                                onClick={() => excluirMundoSalvo(mundo.id)}
                                            >Excluir</button>
                                        </div>
                                    </div>
                                )
                            }))}

                        {/* {!carregado && mundosFiltrados.length > 0 && temMaisItens && !pesquisa && (
                            <div className='carregarMaisContainer'>
                                <button
                                    className='botaoCarregarMais'
                                    onClick={carregarMais}
                                    disabled={carregandoMais}
                                >
                                    {carregandoMais ? 'Carregando...' : 'Carregar mais'}
                                </button>
                            </div>
                        )} */}

                        {/* caso tenha mais itens a serem carregados */}
                        {!carregado && mundosFiltrados.length > 0 && !pesquisa && (
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


                        {!carregado && mundosFiltrados.length === 0 && (
                            <div className='loadingPequeno'>
                                <p>Não sobrou nada 😞</p>
                            </div>
                        )}
                    </div>

                </aside>
                <section className='mundosVisualizador'>
                    <div ref={containerRef} className='div-mapa'>

                        {!carregadoMinimapa && (
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
                                    linha.map((sala, x) => (
                                        <Bloco
                                            key={`${x}-${y}`}
                                            selecionado={sala.ativa}
                                            wumpus={sala.wumpus}
                                            buraco={sala.buraco}
                                            ouro={sala.ouro}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {carregadoMinimapa &&
                            <>
                                <img src={LoadingGif} alt="" style={{ width: '100px' }} />
                            </>
                        }
                    </div>
                </section>

                {/* <section className='mundosVisualizador'>
                    <div className='div-mapa'>
                        <div
                            className='mapa-blocos'
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(6, 50px)',
                                gridTemplateRows: 'repeat(5, 50px)',
                                width: '300px',
                                height: '250px',
                                gap: '2px'
                            }}
                        >

                        </div>
                    </div>
                </section> */}
            </main>

            {carregandoLoading && <LoadingPage></LoadingPage>}
        </>
    )
}