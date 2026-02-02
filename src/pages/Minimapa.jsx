import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingGif from '../assets/loadingGif.gif';
import './styles/minimapa.css'; // Vamos criar este arquivo

function Bloco({ selecionado, wumpus, buraco, ouro, salaInicial, onClick, clicavel, agente, agentePosicao }) {
    const temAgenteAqui = agentePosicao && agentePosicao.x === agente.x && agentePosicao.y === agente.y;

    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''} ${salaInicial ? 'salaInicialExecucao' : ''} ${clicavel ? 'clicavel' : ''}`}
            onClick={onClick}
            style={{ cursor: clicavel ? 'pointer' : 'default' }}
        >
            {wumpus && <div className='elemento wumpus'></div>}
            {temAgenteAqui && <div className='elemento agente'></div>}
            {buraco && <div className='elemento buraco'></div>}
            {ouro && <div className='elemento ouro'></div>}
        </div>
    );
}

export default function Minimapa({
    mundoId,
    salaInicial = [],
    onSalaSelecionada,
    modoEdicao = false,
    passosExecucao = []
}) {
    const { getMiniMapa } = useAuth();
    const [carregando, setCarregando] = useState(false);
    const [miniGrid, setMiniGrid] = useState([]);
    const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
    const containerRef = useRef(null);
    const mapaRef = useRef(null);
    const [cellSize, setCellSize] = useState(30); // Reduzido para 30px
    const [salaInvalida, setSalaInvalida] = useState(false);

    // Estados para zoom e pan
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    // Estados para animação
    const [executando, setExecutando] = useState(false);
    const [passoAtual, setPassoAtual] = useState(0);
    const [agentePosicao, setAgentePosicao] = useState(null);
    const intervaloRef = useRef(null);

    const [modoManual, setModoManual] = useState(false);

    // Ajustar tamanho das células baseado no zoom e no tamanho do container
    useEffect(() => {
        if (!containerRef.current || dimensoes.largura === 0 || dimensoes.altura === 0) return;

        const { clientWidth, clientHeight } = containerRef.current;

        // Calcula o tamanho máximo baseado no espaço disponível
        const maxWidth = clientWidth * 0.9; // 90% da largura do container
        const maxHeight = clientHeight * 0.8; // 80% da altura do container

        const sizeBasedOnWidth = Math.floor(maxWidth / dimensoes.largura);
        const sizeBasedOnHeight = Math.floor(maxHeight / dimensoes.altura);

        // Usa o menor valor, mas com limites mínimos e máximos
        const calculatedSize = Math.min(sizeBasedOnWidth, sizeBasedOnHeight);
        const finalSize = Math.max(15, Math.min(calculatedSize, 40)) * zoom; // Limites: 15px-40px * zoom

        setCellSize(finalSize);

        // Centralizar o mapa se for a primeira vez
        if (pan.x === 0 && pan.y === 0) {
            const mapaWidth = dimensoes.largura * finalSize;
            const mapaHeight = dimensoes.altura * finalSize;

            if (mapaWidth > clientWidth || mapaHeight > clientHeight) {
                // Se o mapa for maior que o container, centralizar
                setPan({
                    x: (clientWidth - mapaWidth) / 2,
                    y: (clientHeight - mapaHeight) / 2
                });
            }
        }
    }, [dimensoes, zoom, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

    // Carregar minimapa quando o mundoId mudar
    useEffect(() => {
        if (mundoId && mundoId !== -1) {
            carregarMinimapa(mundoId);
        } else {
            setMiniGrid([]);
            setDimensoes({ largura: 0, altura: 0 });
        }
    }, [mundoId]);

    // Efeito para animação dos passos
    useEffect(() => {
        if (passosExecucao.length > 0 && executando) {
            setModoManual(false);

            if (passoAtual === 0 && passosExecucao[0]) {
                const primeiroPasso = passosExecucao[0];
                setAgentePosicao({
                    x: primeiroPasso.posicao_x,
                    y: primeiroPasso.posicao_y
                });
            }

            intervaloRef.current = setInterval(() => {
                setPassoAtual(prev => {
                    const proximoPasso = prev + 1;

                    if (proximoPasso >= passosExecucao.length) {
                        clearInterval(intervaloRef.current);
                        setExecutando(false);
                        return prev;
                    }

                    const passo = passosExecucao[proximoPasso];
                    setAgentePosicao({
                        x: passo.posicao_x,
                        y: passo.posicao_y
                    });

                    return proximoPasso;
                });
            }, 500);

            return () => {
                if (intervaloRef.current) {
                    clearInterval(intervaloRef.current);
                }
            };
        }
    }, [passosExecucao, executando, passoAtual]);

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.2, 3)); // Zoom máximo 3x
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.2, 0.5)); // Zoom mínimo 0.5x
    }, []);

    const handleResetZoom = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleMouseDown = useCallback((e) => {
        if (e.button !== 0) return;
        setIsPanning(true);

        const rect = containerRef.current.getBoundingClientRect();
        panStartRef.current = {
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        };

        e.preventDefault();
    }, [pan]);

    const handleMouseMove = useCallback((e) => {
        if (!isPanning) return;
        setPan({
            x: e.clientX - panStartRef.current.x,
            y: e.clientY - panStartRef.current.y
        });
    }, [isPanning]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp]);

    const toggleExecucao = useCallback(() => {
        if (passosExecucao.length === 0) return;

        if (modoManual) {
            setModoManual(false);
            setExecutando(true);
        } else if (executando) {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
            }
            setExecutando(false);
            setModoManual(true);
        } else {
            setModoManual(false);
            setExecutando(true);
        }
    }, [executando, passosExecucao, modoManual]);

    const irParaPasso = useCallback((novoPasso) => {
        if (passosExecucao.length === 0) return;

        const passoLimitado = Math.max(0, Math.min(novoPasso, passosExecucao.length - 1));

        setPassoAtual(passoLimitado);

        const passo = passosExecucao[passoLimitado];
        if (passo) {
            setAgentePosicao({
                x: passo.posicao_x,
                y: passo.posicao_y
            });
        }

        if (executando) {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
            }
            setExecutando(false);
            setModoManual(true);
        }
    }, [passosExecucao, executando]);

    const passoAnterior = useCallback(() => {
        if (passoAtual > 0) {
            irParaPasso(passoAtual - 1);
        }
    }, [passoAtual, irParaPasso]);

    const proximoPasso = useCallback(() => {
        if (passoAtual < passosExecucao.length - 1) {
            irParaPasso(passoAtual + 1);
        }
    }, [passoAtual, passosExecucao.length, irParaPasso]);

    const resetarExecucao = useCallback(() => {
        if (intervaloRef.current) {
            clearInterval(intervaloRef.current);
        }
        setExecutando(false);
        setPassoAtual(0);
        if (passosExecucao.length > 0 && passosExecucao[0]) {
            const primeiroPasso = passosExecucao[0];
            setAgentePosicao({
                x: primeiroPasso.posicao_x,
                y: primeiroPasso.posicao_y
            });
        }
    }, [passosExecucao]);

    useEffect(() => {
        resetarExecucao();
    }, [passosExecucao]);

    async function carregarMinimapa(id) {
        setCarregando(true);

        const salasAtivas = await getMiniMapa(id);

        if (!salasAtivas.length) {
            setMiniGrid([]);
            setDimensoes({ largura: 0, altura: 0 });
            setCarregando(false);
            return;
        }

        const xs = salasAtivas.map(s => s.x);
        const ys = salasAtivas.map(s => s.y);

        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        const largura = maxX + 2;
        const altura = maxY + 2;

        const grid = Array.from({ length: altura }, () =>
            Array.from({ length: largura }, () => ({
                ativa: false,
                wumpus: false,
                buraco: false,
                ouro: false
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
                    ouro: sala.ouro
                };
            }
        });

        setMiniGrid(grid);
        setDimensoes({ largura, altura });
        setCarregando(false);
    }

    function handleSalaClick(x, y, sala) {
        if (!modoEdicao || !onSalaSelecionada) return;

        if (sala.wumpus || sala.buraco || sala.ouro || !sala.ativa) {
            setSalaInvalida(true);
            onSalaSelecionada([], true);
        } else {
            setSalaInvalida(false);
            onSalaSelecionada([x, y], false, true);
        }
    }

    useEffect(() => {
        if (!containerRef.current || dimensoes.largura === 0 || dimensoes.altura === 0) return;

        const { clientWidth, clientHeight } = containerRef.current;

        const maxWidth = clientWidth * 0.9;
        const maxHeight = clientHeight * 0.8;

        const sizeBasedOnWidth = Math.floor(maxWidth / dimensoes.largura);
        const sizeBasedOnHeight = Math.floor(maxHeight / dimensoes.altura);

        const calculatedSize = Math.min(sizeBasedOnWidth, sizeBasedOnHeight);
        const finalSize = Math.max(15, Math.min(calculatedSize, 40)) * zoom;

        setCellSize(finalSize);

        const mapaWidth = dimensoes.largura * finalSize;
        const mapaHeight = dimensoes.altura * finalSize;

        if (mapaWidth < clientWidth && mapaHeight < clientHeight) {
            setPan({
                x: (clientWidth - mapaWidth) / 2,
                y: (clientHeight - mapaHeight) / 2
            });
        }
    }, [dimensoes, zoom, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

    const progresso = passosExecucao.length > 0
        ? Math.round((passoAtual / (passosExecucao.length - 1)) * 100)
        : 0;

    return (
        <div className="minimapaContainer">
            <div
                ref={containerRef}
                className="mapaContainer"
                style={{ cursor: isPanning ? 'grabbing' : 'grab', overflow: 'auto' }}
            >
                {carregando ? (
                    <div className='loadingPequeno'>
                        <img src={LoadingGif} alt="Carregando..." style={{ width: '100px' }} />
                        <p>Carregando mapa...</p>
                    </div>
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
                                const ehSalaInicial = salaInicial.length > 0 &&
                                    salaInicial[0] === x &&
                                    salaInicial[1] === y;

                                return (
                                    <Bloco
                                        key={`${x}-${y}`}
                                        selecionado={sala.ativa}
                                        wumpus={sala.wumpus}
                                        buraco={sala.buraco}
                                        ouro={sala.ouro}
                                        salaInicial={ehSalaInicial}
                                        onClick={() => handleSalaClick(x, y, sala)}
                                        clicavel={modoEdicao}
                                        agente={{ x, y }}
                                        agentePosicao={agentePosicao}
                                    />
                                );
                            })
                        )}
                    </div>

                )}
            </div>

            <footer className='rodapeControlesExecucao'>

                {passosExecucao.length > 0 && (
                    <>
                        <div className="secaoNoRodape botoesExecucao">
                            <button
                                className={`botaoControle ${passosExecucao.length > 0 ? 'botaoExecutarRoxo' : 'botaoExecutarBlack'}`}
                                onClick={toggleExecucao}
                                disabled={passosExecucao.length === 0}
                                title={modoManual ? "Continuar execução automática" : executando ? "Pausar execução" : "Iniciar execução"}
                            >
                                {modoManual ? 'Continuar' : executando ? '▐▐' : 'Executar'}
                            </button>
                            {/* <button
                        className="botaoControle botaoResetar"
                        onClick={resetarExecucao}
                        disabled={passosExecucao.length === 0}
                        title="Voltar ao início"
                    >
                        Resetar
                    </button> */}
                            <button
                                className="botaoControle botaoPasso"
                                onClick={passoAnterior}
                                disabled={passosExecucao.length === 0 || passoAtual === 0}
                                title="Passo anterior"
                            >
                                {/* &lt;&lt; */}
                                ⏮ Anterior
                            </button>
                            <button
                                className="botaoControle botaoPasso"
                                onClick={proximoPasso}
                                disabled={passosExecucao.length === 0 || passoAtual >= passosExecucao.length - 1}
                                title="Próximo passo"
                            >
                                Próximo ⏭
                                {/* &gt;&gt; */}
                            </button>
                        </div>

                        <div className="secaoNoRodape secaoProgresso">
                            <div className="infoPasso">
                                <span>Passo {passoAtual + 1} de {passosExecucao.length}</span>
                            </div>

                            <div className="sliderProgresso">
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.max(0, passosExecucao.length - 1)}
                                    value={passoAtual}
                                    onChange={(e) => irParaPasso(parseInt(e.target.value))}
                                    disabled={passosExecucao.length === 0}
                                    className="sliderPassos"
                                />
                                <div className="sliderLabels">
                                    <span>Progresso: {progresso}%</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="secaoNoRodape secaoZoom">
                    <p className='pZoom'>
                        Zoom: {(zoom * 100).toFixed(0)}% <br />
                        <span className='paragrafoInformativo'>
                            Tente não aumentar demais...
                        </span>
                    </p>
                    <div className='osBotoesDeZoom'>
                        <button
                            className="botaoZoom"
                            onClick={handleZoomIn}
                            title="Aumentar zoom"
                        >
                            +
                        </button>
                        <button
                            className="botaoZoom"
                            onClick={handleZoomOut}
                            title="Diminuir zoom"
                        >
                            -
                        </button>
                        <button
                            className="botaoZoom reset"
                            onClick={handleResetZoom}
                            title="Resetar zoom"
                        >
                            ⎌
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}