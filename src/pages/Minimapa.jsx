import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingGif from '../assets/loadingGif.gif';
import './styles/minimapa.css';

import ouroSkin from '../assets/skins/ouro.png';
import buracoSkin from '../assets/skins/buraco.png';
import wumpusVivo from '../assets/skins/wumpus_vivo.png';
import agenteSkin from '../assets/skins/lino_Armado.png';
import agenteSemMunicao from '../assets/skins/lino_semBalas.png'
import wumpusMortoSkin from '../assets/skins/wumpus_morto.png'

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
    ouroColetado,
    noTop,
    noLeft,
    noRight,
    noBottom,
    flechas,
    wumpusMorto
}) {
    const temAgenteAqui = agentePosicao && agentePosicao.x === agente.x && agentePosicao.y === agente.y;
    const temOuro = ouro && !ouroColetado;

    return (
        <div
            className={`blocoExecucao ${selecionado ? 'selecionado' : ''} ${salaInicial ? 'salaInicialExecucao' : ''} ${clicavel ? 'clicavel' : ''}
                       ${noTop ? 'noTop' : ''} ${noLeft ? 'noLeft' : ''} ${noRight ? 'noRight' : ''} ${noBottom ? 'noBottom' : ''}`}
            onClick={onClick}
            style={{ cursor: clicavel ? 'pointer' : 'default' }}
        >
            {/* {wumpus
                &&
                // <div className='elemento wumpus'></div>
                <img src={wumpusVivo} className='skin wumpusVivo' alt="" />
            } */}

            {wumpus && !wumpusMorto && (
                <img src={wumpusVivo} className='skin wumpusVivo' alt="Wumpus Vivo" />
            )}
            {wumpus && wumpusMorto && (
                <img src={wumpusMortoSkin} className='skin wumpusMorto' alt="Wumpus Morto" />
            )}

            {temAgenteAqui && !buraco && (
                <>
                    {flechas > 0 &&
                        <img src={agenteSkin} className='skin skinAgenteArmado' alt="" />
                    }

                    {flechas == 0 &&
                        <img src={agenteSemMunicao} className='skin skinAgenteDesarmado' alt="" />
                    }
                </>
            )
            }
            {buraco &&
                // <div className='elemento buraco'></div>
                <img src={buracoSkin} className='skin skiBuraco' alt="" />
            }
            {temOuro &&
                <img src={ouroSkin} className='skin skinOuro' alt="" />
                // <div className='elemento ouro'></div>
            }
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
    const [tiroPosicao, setTiroPosicao] = useState([]);
    const [wumpusMortos, setWumpusMortos] = useState([]);

    const [dadosAgente, setDadosAgente] = useState({
        ouros: 0,
        flechas: 0,
        pontos: 0,
        wumpusMortosQTD: 0
    });

    const [inverterCoordenadas, setInverterCoordenadas] = useState(true);

    const coordenada = (x, y) => {
        if (!inverterCoordenadas) return { x, y };
        return { x: y, y: x };
    };

    const [modoManual, setModoManual] = useState(false);

    useEffect(() => {
        console.log(passosExecucao);
    }, []);

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

            if (passoAtual === 0 && passosExecucao[0]) {
                const passo = passosExecucao[0];

                let agenteX = passo.posicao_x;
                let agenteY = passo.posicao_y;

                if (inverterCoordenadas) {
                    [agenteX, agenteY] = [passo.posicao_y, passo.posicao_x];
                }

                setAgentePosicao({
                    x: agenteX,
                    y: agenteY
                });

                setDadosAgente({
                    ouros: passo.ouros || 0,
                    flechas: passo.flechas || 0,
                    pontos: passo.pontos || 0
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

                    let agenteX = passo.posicao_x;
                    let agenteY = passo.posicao_y;

                    if (inverterCoordenadas) {
                        [agenteX, agenteY] = [passo.posicao_y, passo.posicao_x];
                    }

                    setAgentePosicao({
                        x: agenteX,
                        y: agenteY
                    });

                    if (passo.acao === 'coletar_ouro' || passo.acao === 'x' || passo.ouro_coletado) {
                        setSalasComOuro(prevSalas => {
                            const novasSalas = [...prevSalas];

                            let salaX = passo.posicao_x;
                            let salaY = passo.posicao_y;

                            if (inverterCoordenadas) {

                                [salaX, salaY] = [passo.posicao_y, passo.posicao_x];
                            }

                            const indice = novasSalas.findIndex(
                                sala => sala.x === salaX && sala.y === salaY
                            );

                            if (indice !== -1) {
                                novasSalas.splice(indice, 1);
                            }
                            return novasSalas;
                        });
                    }

                    const wumpusMortosAteAgora = [];

                    for (let i = 0; i <= proximoPasso; i++) {
                        const p = passosExecucao[i];

                        if (p.tiro_position &&
                            p.tiro_position[0] !== -1 &&
                            p.tiro_position[1] !== -1) {

                            let tiroX = p.tiro_position[0];
                            let tiroY = p.tiro_position[1];

                            if (inverterCoordenadas) {
                                [tiroX, tiroY] = [p.tiro_position[1], p.tiro_position[0]];
                            }

                            if (miniGrid[tiroY] &&
                                miniGrid[tiroY][tiroX] &&
                                miniGrid[tiroY][tiroX].wumpus) {

                                const jaEstaMorto = wumpusMortosAteAgora.some(
                                    w => w.x === tiroX && w.y === tiroY
                                );

                                if (!jaEstaMorto) {
                                    wumpusMortosAteAgora.push({ x: tiroX, y: tiroY });
                                }
                            }
                        }
                    }

                    setWumpusMortos(wumpusMortosAteAgora);

                    setDadosAgente({
                        ouros: passo.ouros || 0,
                        flechas: passo.flechas || 0,
                        pontos: passo.pontos || 0,
                        wumpusMortosQTD: wumpusMortosAteAgora.length
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
    }, [passosExecucao, executando, passoAtual, miniGrid, salasComOuro]);

    useEffect(() => {
        if (passosExecucao.length > 0) {
            console.log("tem passos!");
            const primeiroPasso = passosExecucao[0];

            if (primeiroPasso) {
                let agenteX = primeiroPasso.posicao_x;
                let agenteY = primeiroPasso.posicao_y;

                if (inverterCoordenadas) {
                    [agenteX, agenteY] = [primeiroPasso.posicao_y, primeiroPasso.posicao_x];
                }

                setAgentePosicao({
                    x: agenteX,
                    y: agenteY
                });

                setPassoAtual(0);

                const wumpusMortosIniciais = [];

                if (primeiroPasso.tiro_position &&
                    primeiroPasso.tiro_position[0] !== -1 &&
                    primeiroPasso.tiro_position[1] !== -1) {

                    let tiroX = primeiroPasso.tiro_position[0];
                    let tiroY = primeiroPasso.tiro_position[1];

                    if (inverterCoordenadas) {
                        [tiroX, tiroY] = [primeiroPasso.tiro_position[1], primeiroPasso.tiro_position[0]];
                    }

                    if (miniGrid[tiroY] &&
                        miniGrid[tiroY][tiroX] &&
                        miniGrid[tiroY][tiroX].wumpus) {
                        wumpusMortosIniciais.push({ x: tiroX, y: tiroY });
                    }
                }

                setWumpusMortos(wumpusMortosIniciais);

                setDadosAgente({
                    ouros: primeiroPasso.ouros || 0,
                    flechas: primeiroPasso.flechas || 0,
                    pontos: primeiroPasso.pontos || 0,
                    wumpusMortosQTD: wumpusMortosIniciais.length
                });
            }
        } else {
            setAgentePosicao(null);
            setDadosAgente({
                ouros: 0,
                flechas: 1,
                pontos: 0,
                wumpusMortosQTD: 0
            });
            setPassoAtual(0);
        }
    }, [passosExecucao]);

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
            let agenteX = passo.posicao_x;
            let agenteY = passo.posicao_y;

            if (inverterCoordenadas) {
                [agenteX, agenteY] = [passo.posicao_y, passo.posicao_x];
            }

            setAgentePosicao({
                x: agenteX,
                y: agenteY
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

                if (p.acao === 'coletar_ouro' || p.acao === 'x' || p.ouro_coletado) {
                    let salaX = p.posicao_x;
                    let salaY = p.posicao_y;

                    if (inverterCoordenadas) {
                        [salaX, salaY] = [p.posicao_y, p.posicao_x];
                    }

                    const indice = salasComOuroAteAgora.findIndex(
                        sala => sala.x === salaX && sala.y === salaY
                    );
                    if (indice !== -1) {
                        salasComOuroAteAgora.splice(indice, 1);
                    }
                }
            }

            setSalasComOuro(salasComOuroAteAgora);

            const wumpusMortosAteAgora = [];

            for (let i = 0; i <= passoLimitado; i++) {
                const p = passosExecucao[i];

                if (p.tiro_position &&
                    p.tiro_position[0] !== -1 &&
                    p.tiro_position[1] !== -1) {

                    let tiroX = p.tiro_position[0];
                    let tiroY = p.tiro_position[1];

                    if (inverterCoordenadas) {
                        [tiroX, tiroY] = [p.tiro_position[1], p.tiro_position[0]];
                    }

                    if (miniGrid[tiroY] &&
                        miniGrid[tiroY][tiroX] &&
                        miniGrid[tiroY][tiroX].wumpus) {

                        const jaEstaMorto = wumpusMortosAteAgora.some(
                            w => w.x === tiroX && w.y === tiroY
                        );

                        if (!jaEstaMorto) {
                            wumpusMortosAteAgora.push({ x: tiroX, y: tiroY });
                        }
                    }
                }
            }

            setWumpusMortos(wumpusMortosAteAgora);

            setDadosAgente({
                ouros: passo.ouros || 0,
                flechas: passo.flechas || 0,
                pontos: passo.pontos || 0,
                wumpusMortosQTD: wumpusMortosAteAgora.length
            });
        }

        if (executando) {
            if (intervaloRef.current) {
                clearInterval(intervaloRef.current);
            }
            setExecutando(false);
            setModoManual(true);
        }
    }, [passosExecucao, executando, miniGrid, inverterCoordenadas]);

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
        setModoManual(false);
        setWumpusMortos([]);

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
            const passo = passosExecucao[0];

            let agenteX = passo.posicao_x;
            let agenteY = passo.posicao_y;

            if (inverterCoordenadas) {
                [agenteX, agenteY] = [passo.posicao_y, passo.posicao_x];
            }

            setAgentePosicao({
                x: agenteX,
                y: agenteY
            });

            setDadosAgente({
                ouros: passo.ouros || 0,
                flechas: passo.flechas || 0,
                pontos: passo.pontos || 0,
                wumpusMortosQTD: 0
            });
        } else {
            setDadosAgente({
                ouros: 0,
                flechas: 1,
                pontos: 0,
                wumpusMortosQTD: 0
            });
        }
    }, [passosExecucao, miniGrid, inverterCoordenadas]);

    useEffect(() => {
        if (passosExecucao.length > 0) {
            resetarExecucao();
        } else {
            // Resetar para estado vazio
            setAgentePosicao(null);
            setDadosAgente({
                ouros: 0,
                flechas: 0,
                pontos: 0
            });
            setPassoAtual(0);
            setExecutando(false);
            setModoManual(false);
        }
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

        // salasAtivas.forEach(sala => {
        //     let x = sala.x;
        //     let y = sala.y;

        //     if (inverterCoordenadas) {
        //         [x, y] = [sala.y, sala.x];
        //     }

        //     if (y < altura && x < largura) {
        //         grid[y][x] = {
        //             ativa: true,
        //             wumpus: sala.wumpus,
        //             buraco: sala.buraco,
        //             ouro: sala.ouro
        //         };
        //     }
        // });

        setMiniGrid(grid);
        setDimensoes({ largura, altura });
        setCarregando(false);
    }

    // function handleSalaClick(x, y, sala) {
    //     if (!modoEdicao || !onSalaSelecionada) return;

    //     let coordX = x;
    //     let coordY = y;

    //     if (inverterCoordenadas) {
    //         [coordX, coordY] = [y, x];
    //     }

    //     if (sala.wumpus || sala.buraco || sala.ouro || !sala.ativa) {
    //         setSalaInvalida(true);
    //         onSalaSelecionada([], true);
    //     } else {
    //         setSalaInvalida(false);
    //         onSalaSelecionada([coordX, coordY], false, true);
    //     }
    // }

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

    const verificarAdjacencias = (x, y) => {
        const temSalaAcima = y > 0 && miniGrid[y - 1] && miniGrid[y - 1][x] && miniGrid[y - 1][x].ativa;
        const temSalaEsquerda = x > 0 && miniGrid[y] && miniGrid[y][x - 1] && miniGrid[y][x - 1].ativa;
        const temSalaDireita = x < dimensoes.largura - 1 && miniGrid[y] && miniGrid[y][x + 1] && miniGrid[y][x + 1].ativa;
        const temSalaAbaixo = y < dimensoes.altura - 1 && miniGrid[y + 1] && miniGrid[y + 1][x] && miniGrid[y + 1][x].ativa;

        return {
            noTop: !temSalaAcima,
            noLeft: !temSalaEsquerda,
            noRight: !temSalaDireita,
            noBottom: !temSalaAbaixo
        };
    };

    return (
        <div className="minimapaContainerExecucao">
            {passosExecucao.length > 0 && (
                <>
                    <div className='janelaTempoReal'>
                        <div className='auxiliarTempoReal'>
                            <h3>Inventário</h3>
                            <p>Munição disponível: {dadosAgente.flechas}</p>
                            <p>Barras de ouro coletadas: {dadosAgente.ouros}</p>
                            <p>Wumpus mortos: {dadosAgente.wumpusMortosQTD}</p>
                        </div>
                        <div className='auxiliarTempoReal direita'>
                            <h3>Pontuação<br />{dadosAgente.pontos}</h3>
                        </div>
                    </div>
                    <p className='paragrafoInformativo pArrastarMapa'>Você pode arrastar o mapa!</p>
                </>
            )}
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
                    <>
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

                                    const adjacencias = sala.ativa ? verificarAdjacencias(x, y) : {
                                        noTop: false,
                                        noLeft: false,
                                        noRight: false,
                                        noBottom: false
                                    };

                                    const wumpusMortoo = wumpusMortos.some(w => w.x === x && w.y === y);

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
                                            noTop={adjacencias.noTop}
                                            noLeft={adjacencias.noLeft}
                                            noRight={adjacencias.noRight}
                                            noBottom={adjacencias.noBottom}
                                            flechas={dadosAgente.flechas}
                                            wumpusMorto={wumpusMortoo}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </>
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