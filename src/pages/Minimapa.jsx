import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingGif from '../assets/loadingGif.gif';
import './styles/minimapa.css';

function Bloco({
    selecionado,
    wumpus,
    buraco,
    ouro,
    salaInicial,
    onClick,
    clicavel,
    agente,
    agentePosicao,
    ouroColetado
}) {
    const temAgenteAqui = agentePosicao && agentePosicao.x === agente.x && agentePosicao.y === agente.y;
    const temOuro = ouro && !ouroColetado;

    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''} ${salaInicial ? 'salaInicialExecucao' : ''} ${clicavel ? 'clicavel' : ''}`}
            onClick={onClick}
            style={{ cursor: clicavel ? 'pointer' : 'default' }}
        >
            {wumpus && <div className='elemento wumpus'></div>}
            {temAgenteAqui && <div className='elemento agente'></div>}
            {buraco && <div className='elemento buraco'></div>}
            {temOuro && <div className='elemento ouro'></div>}
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
    const [cellSize, setCellSize] = useState(40);
    const [salaInvalida, setSalaInvalida] = useState(false);

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    const [executando, setExecutando] = useState(false);
    const [passoAtual, setPassoAtual] = useState(0);
    const [agentePosicao, setAgentePosicao] = useState(null);
    const intervaloRef = useRef(null);
    const [salasComOuro, setSalasComOuro] = useState([]);

    const [modoManual, setModoManual] = useState(false);

    useEffect(() => {
        if (mundoId && mundoId !== -1) {
            carregarMinimapa(mundoId);
        } else {
            setMiniGrid([]);
            setDimensoes({ largura: 0, altura: 0 });
        }
    }, [mundoId]);

    useEffect(() => {
        const ajustarTamanhoMinimapa = () => {
            if (!containerRef.current || dimensoes.largura === 0 || dimensoes.altura === 0) return;

            const container = containerRef.current;
            const { clientWidth, clientHeight } = container;

            const padding = 20;
            const larguraDisponivel = clientWidth - padding * 2;
            const alturaDisponivel = clientHeight - padding * 2;

            const tamanhoPorLargura = Math.floor(larguraDisponivel / dimensoes.largura);
            const tamanhoPorAltura = Math.floor(alturaDisponivel / dimensoes.altura);

            let novoCellSize = Math.min(tamanhoPorLargura, tamanhoPorAltura);

            const MIN_CELL_SIZE = 15;
            const MAX_CELL_SIZE = 60;

            novoCellSize = Math.max(MIN_CELL_SIZE, Math.min(novoCellSize, MAX_CELL_SIZE));

            const tamanhoFinal = novoCellSize * zoom;
            setCellSize(tamanhoFinal);

            const mapaWidth = dimensoes.largura * tamanhoFinal;
            const mapaHeight = dimensoes.altura * tamanhoFinal;

            if (mapaWidth < larguraDisponivel && mapaHeight < alturaDisponivel) {
                setPan({
                    x: (larguraDisponivel - mapaWidth) / 2 + padding,
                    y: (alturaDisponivel - mapaHeight) / 2 + padding
                });
            } else {
                setPan(prev => ({
                    x: Math.max(padding - mapaWidth + larguraDisponivel, Math.min(prev.x, padding)),
                    y: Math.max(padding - mapaHeight + alturaDisponivel, Math.min(prev.y, padding))
                }));
            }
        };

        ajustarTamanhoMinimapa();

        window.addEventListener('resize', ajustarTamanhoMinimapa);

        return () => {
            window.removeEventListener('resize', ajustarTamanhoMinimapa);
        };
    }, [dimensoes, zoom]);

    useEffect(() => {
        if (miniGrid.length > 0) {
            const salasIniciaisComOuro = [];
            miniGrid.forEach((linha, y) => {
                linha.forEach((sala, x) => {
                    if (sala.ouro) {
                        salasIniciaisComOuro.push({ x, y });
                    }
                });
            });
            setSalasComOuro(salasIniciaisComOuro);
        }
    }, [miniGrid]);

    useEffect(() => {
        if (passosExecucao.length > 0 && executando) {
            setModoManual(false);

            const salasIniciaisComOuro = [];
            miniGrid.forEach((linha, y) => {
                linha.forEach((sala, x) => {
                    if (sala.ouro) {
                        salasIniciaisComOuro.push({ x, y });
                    }
                });
            });
            setSalasComOuro(salasIniciaisComOuro);

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

                    setSalasComOuro(prevSalas => {
                        const novasSalas = [...prevSalas];
                        if (passo.acao === 'PEGAR') {
                            const indice = novasSalas.findIndex(
                                sala => sala.x === passo.posicao_x && sala.y === passo.posicao_y
                            );
                            if (indice !== -1) {
                                novasSalas.splice(indice, 1);
                            }
                        }
                        return novasSalas;
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
    }, [passosExecucao, executando, passoAtual, miniGrid]);

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.2, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.2, 0.5));
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

            const salasComOuroAteAgora = [];
            miniGrid.forEach((linha, y) => {
                linha.forEach((sala, x) => {
                    if (sala.ouro) {
                        salasComOuroAteAgora.push({ x, y });
                    }
                });
            });

            for (let i = 0; i <= passoLimitado; i++) {
                const p = passosExecucao[i];
                if (p.acao === 'x') {
                    const indice = salasComOuroAteAgora.findIndex(
                        sala => sala.x === p.posicao_x && sala.y === p.posicao_y
                    );
                    if (indice !== -1) {
                        salasComOuroAteAgora.splice(indice, 1);
                    }
                }
            }

            setSalasComOuro(salasComOuroAteAgora);
        }

        if (executando) {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
            }
            setExecutando(false);
            setModoManual(true);
        }
    }, [passosExecucao, executando, miniGrid]);

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

        const salasIniciaisComOuro = [];
        miniGrid.forEach((linha, y) => {
            linha.forEach((sala, x) => {
                if (sala.ouro) {
                    salasIniciaisComOuro.push({ x, y });
                }
            });
        });
        setSalasComOuro(salasIniciaisComOuro);

        if (passosExecucao.length > 0 && passosExecucao[0]) {
            const primeiroPasso = passosExecucao[0];
            setAgentePosicao({
                x: primeiroPasso.posicao_x,
                y: primeiroPasso.posicao_y
            });
        }
    }, [passosExecucao, miniGrid]);

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

    const progresso = passosExecucao.length > 0
        ? Math.round((passoAtual / (passosExecucao.length - 1)) * 100)
        : 0;

    return (
        <div className="minimapaContainerExecucao">
            <div
                ref={containerRef}
                className="mapaContainerExecucao"
                style={{ cursor: isPanning ? 'grabbing' : 'grab', overflow: 'auto' }}
            >
                {carregando ? (
                    <div className='loadingPequeno carregandoMinimapaExecucao'>
                        <img src={LoadingGif} alt="Carregando..." style={{ width: '100px' }} />
                        <p>Carregando mapa...</p>
                    </div>
                ) : (
                    <div
                        className='mapa-blocos-execucao'
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${dimensoes.largura}, ${cellSize}px)`,
                            gridTemplateRows: `repeat(${dimensoes.altura}, ${cellSize}px)`,
                            width: `${dimensoes.largura * cellSize}px`,
                            height: `${dimensoes.altura * cellSize}px`,
                            transform: `translate(${pan.x}px, ${pan.y}px)`,
                        }}
                        ref={mapaRef}
                    >
                        {miniGrid.map((linha, y) =>
                            linha.map((sala, x) => {
                                const ehSalaInicial = salaInicial.length > 0 &&
                                    salaInicial[0] === x &&
                                    salaInicial[1] === y;

                                const ouroColetado = sala.ouro && !salasComOuro.some(s => s.x === x && s.y === y);

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
                                        ouroColetado={ouroColetado}
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