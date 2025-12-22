import './styles/mundosSalvos.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';

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

    const { getMundosSalvos, getMiniMapa } = useAuth();
    const [mundos, setMundos] = useState([]);
    const [carregado, setCarregado] = useState(false);
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

    useEffect(() => {
        if (!containerRef.current) return;

        const { clientWidth, clientHeight } = containerRef.current;

        const sizeX = Math.floor(clientWidth / dimensoes.largura);
        const sizeY = Math.floor(clientHeight / dimensoes.altura);

        setCellSize(Math.min(sizeX, sizeY, 40));
    }, [dimensoes]);

    useEffect(() => {
        const tempo = setTimeout(() => {
            setMostrarLinoDormindo(true);
        }, 7000);

        return () => clearTimeout(tempo);
    }, []);

    async function carregarMundosSalvos() {
        setCarregado(true);
        const resposta = await getMundosSalvos();
        setMundos(resposta);
        setCarregado(false);
    }

    useEffect(() => {
        carregarMundosSalvos();
    }, [])

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

                        {!carregado && mundos.length > 0 &&
                            (mundosFiltrados.map((mundo, index) => {
                                const ativo = mundoSelecionado === mundo.id;
                                return (
                                    <div
                                        key={index}
                                        className={`itemListaMundos ${ativo ? 'ativo' : ''}`}
                                        onClick={() => {
                                            setMundoSelecionado(mundo.id);
                                            carregarMinimapa(mundo.id);
                                        }}
                                    >
                                        <div className='esquerda'>
                                            <h2>{mundo.nome}</h2>
                                            <p className='paragrafoInformativo'>Data de criação: {mundo.data}</p>
                                            <p className='paragrafoInformativo'>
                                                <b>Salas:</b> {mundo.estatisticas.totalSalas} <br />
                                                <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                                <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                                <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                            </p>
                                        </div>
                                        <div className='direita'>
                                            <button className='botaoEditar'>Editar</button>
                                            <button className='botaoExcluir'>Excluir</button>
                                        </div>
                                    </div>
                                )
                            }))
                        }

                        {!carregado && mundos.length == 0 && (
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
        </>
    )
}