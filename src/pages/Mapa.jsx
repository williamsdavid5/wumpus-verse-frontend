import './styles/mapa.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useConfirm } from '../contexts/ConfirmContext';
import { useNavigate, useLocation } from 'react-router-dom'

import LoadingPage from './LoadingPage';

function Bloco({ selecionado, wumpus, buraco, ouro, onMouseEnter, onMouseDown, onClick, x, y, destacado }) {
    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''} ${destacado ? 'blocoDestacado' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            {/* <p>{x},{y}</p> */}
            {wumpus && <div className='elemento wumpus'></div>}
            {buraco && <div className='elemento buraco'></div>}
            {ouro && <div className='elemento ouro'></div>}
        </div>
    )
}

export default function Mapa() {

    const TAMANHO_INICIAL_LARGURA = 8;
    const TAMANHO_INICIAL_ALTURA = 8;

    const [largura, setLargura] = useState(TAMANHO_INICIAL_LARGURA)
    const [altura, setAltura] = useState(TAMANHO_INICIAL_ALTURA)
    const [modo, setModo] = useState('desenhar');
    const [ctrlPressionado, setCtrlPressionado] = useState(false)
    const mousePosition = useRef(null);
    const [modoInsercao, setModoInsercao] = useState(null);
    const [nomeMundo, setNomeMundo] = useState('');
    const [estatisticas, setEstatisticas] = useState({
        totalSalas: TAMANHO_INICIAL_LARGURA * TAMANHO_INICIAL_ALTURA,
        salasAtivas: 0,
        salasInativas: TAMANHO_INICIAL_LARGURA * TAMANHO_INICIAL_ALTURA,
        quantidadeEntidades: {
            wumpus: 0,
            buracos: 0,
            ouros: 0
        },
        densidadeEntidades: {
            wumpus: '0%',
            buracos: '0%',
            ouros: '0%'
        }
    });


    const [grid, setGrid] = useState(() =>
        Array.from({ length: TAMANHO_INICIAL_ALTURA }, () => Array.from({ length: TAMANHO_INICIAL_LARGURA }, () => ({
            ativa: false,
            wumpus: false,
            buraco: false,
            ouro: false
        })))
    )

    const containerRef = useRef(null)
    const [cellSize, setCellSize] = useState(20)
    const [mapSize, setMapSize] = useState({ w: largura * 20, h: altura * 20 })

    const [carregado, setCarregado] = useState(false);
    const { salvarMundo, atualizarMundo, getMundoById } = useAuth();
    const { confirm } = useConfirm();
    const navigate = useNavigate();

    const valoresInput = [1, 2, 3, 4];
    const [indiceInput, setIndiceInput] = useState(0);
    const [tamanhoPincel, setTamanhoPincel] = useState(1);
    const [previewPosicao, setPreviewPosicao] = useState({ x: null, y: null });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mundoIdParaEditar = searchParams.get('edit');
    const [modoEdicao, setModoEdicao] = useState(false);
    const [mundoEditando, setMundoEditando] = useState(null);

    /// caso haja mundo para edição
    const carregarMundoParaEdicao = async (id) => {
        setCarregado(true);
        try {
            const mundo = await getMundoById(id);
            if (mundo) {
                setModoEdicao(true);
                setMundoEditando(mundo);

                setNomeMundo(mundo.nome);
                setLargura(mundo.largura);
                setAltura(mundo.altura);

                const novoGrid = Array.from({ length: mundo.altura }, (_, y) =>
                    Array.from({ length: mundo.largura }, (_, x) => {
                        const sala = mundo.salas.find(s => s.x === x && s.y === y);

                        if (sala) {
                            return {
                                ativa: true,
                                wumpus: sala.wumpus || false,
                                buraco: sala.buraco || false,
                                ouro: sala.ouro || false
                            };
                        } else {
                            return {
                                ativa: false,
                                wumpus: false,
                                buraco: false,
                                ouro: false
                            };
                        }
                    })
                );

                setGrid(novoGrid);

                if (mundo.estatisticas) {
                    setEstatisticas(mundo.estatisticas);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar mundo:', error);
            await confirm({
                title: "Erro",
                message: "Não foi possível carregar o mundo para edição.",
                type: "alert",
                botao1: "OK"
            });
        } finally {
            setCarregado(false);
        }
    };

    useEffect(() => {
        if (mundoIdParaEditar) {
            carregarMundoParaEdicao(mundoIdParaEditar);
        }
    }, [mundoIdParaEditar]);

    useEffect(() => {
        setGrid(prev => {
            const nova = Array.from({ length: altura }, (_, y) =>
                Array.from({ length: largura }, (_, x) =>
                    (prev[y] && prev[y][x]) || { ativa: false, wumpus: false, buraco: false, ouro: false }
                )
            )
            return nova
        })
    }, [largura, altura])

    useEffect(() => {
        if (ctrlPressionado && mousePosition.current) {
            const { x, y } = mousePosition.current;
            const valor = modo === 'desenhar';
            alternarNoGrid(x, y, valor);
        }
    }, [tamanhoPincel, ctrlPressionado, modo]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Control') {
                setCtrlPressionado(true);

                // Altera imediatamente a área do pincel quando Control é pressionado
                if (mousePosition.current) {
                    const { x, y } = mousePosition.current;
                    const valor = modo === 'desenhar';
                    alternarNoGrid(x, y, valor);
                }
            }

            if (e.key === 'Escape') {
                setModoInsercao(null);
            }
        }


        const handleKeyUp = (e) => {
            if (e.key === 'Control') {
                setCtrlPressionado(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [modo, modoInsercao]);

    const recalculaCellSize = useCallback(() => {
        const cont = containerRef.current
        if (!cont) return

        let availableWidth = cont.clientWidth
        let availableHeight = cont.clientHeight

        const style = window.getComputedStyle(cont)
        const padLeft = parseFloat(style.paddingLeft || '0')
        const padRight = parseFloat(style.paddingRight || '0')
        const padTop = parseFloat(style.paddingTop || '0')
        const padBottom = parseFloat(style.paddingBottom || '0')

        availableWidth -= padLeft + padRight
        availableHeight -= padTop + padBottom

        const sizeW = Math.floor(availableWidth / Math.max(1, largura))
        const sizeH = Math.floor(availableHeight / Math.max(1, altura))

        const MIN_CELL = 6
        const MAX_CELL = 64

        let newCell = Math.min(sizeW, sizeH)
        newCell = Math.max(MIN_CELL, Math.min(MAX_CELL, newCell))

        const adjustedCell = Math.min(sizeW, sizeH, newCell)
        const cellToUse = Math.max(MIN_CELL, adjustedCell)

        setCellSize(cellToUse)
        setMapSize({ w: cellToUse * largura, h: cellToUse * altura })
    }, [largura, altura])

    useEffect(() => {
        recalculaCellSize()
        window.addEventListener('resize', recalculaCellSize)
        return () => window.removeEventListener('resize', recalculaCellSize)
    }, [recalculaCellSize])


    // const alternarNoGrid = (x, y, valor) => {
    //     setGrid(prev => {
    //         const copia = prev.map(row => row.slice())
    //         if (copia[y] && typeof copia[y][x] !== 'undefined') {
    //             copia[y][x] = {
    //                 ativa: valor,
    //                 wumpus: valor ? copia[y][x].wumpus : false,
    //                 buraco: valor ? copia[y][x].buraco : false,
    //                 ouro: valor ? copia[y][x].ouro : false,
    //             }
    //         }
    //         return copia
    //     })
    // }

    const alternarNoGrid = (x, y, valor) => {
        // console.log(`Aplicando pincel ${tamanhoPincel}x${tamanhoPincel} em (${x}, ${y})`);

        setGrid(prev => {
            const copia = prev.map(row => row.slice())

            for (let dy = 0; dy < tamanhoPincel; dy++) {
                for (let dx = 0; dx < tamanhoPincel; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (copia[ny] && typeof copia[ny][nx] !== 'undefined') {
                        copia[ny][nx] = {
                            ativa: valor,
                            wumpus: valor ? (copia[ny][nx]?.wumpus || false) : false,
                            buraco: valor ? (copia[ny][nx]?.buraco || false) : false,
                            ouro: valor ? (copia[ny][nx]?.ouro || false) : false,
                        }
                    }
                }
            }

            return copia
        })
    }

    const handleCellMouseEnter = (x, y) => {
        mousePosition.current = { x, y };
        setPreviewPosicao({ x, y });

        if (ctrlPressionado) {
            const valor = modo === 'desenhar';
            alternarNoGrid(x, y, valor);
        }
    }

    const handleCellMouseDown = (x, y) => {
        mousePosition.current = { x, y };
        if (ctrlPressionado) {
            const valor = modo === 'desenhar';
            alternarNoGrid(x, y, valor);
        }
    }

    const handleMouseLeave = () => {
        mousePosition.current = null;
        setPreviewPosicao({ x: null, y: null });
    }

    const deveDestacar = (x, y) => {
        if (previewPosicao.x === null || previewPosicao.y === null) return false;

        const dx = x - previewPosicao.x;
        const dy = y - previewPosicao.y;

        return dx >= 0 && dx < tamanhoPincel && dy >= 0 && dy < tamanhoPincel;
    }

    // const exportarJSON = async () => {
    //     if (!nomeMundo.trim()) {
    //         await confirm({
    //             title: "Calma parceiro",
    //             message: "Dê um nome ao mundo antes de exportar",
    //             type: "alert",
    //             botao1: "Tá bom, chato"
    //         })

    //         return;
    //     }

    //     const salasAtivas = grid.flat().filter(celula => celula.ativa).length;
    //     const totalWumpus = grid.flat().filter(celula => celula.wumpus).length;
    //     const totalBuracos = grid.flat().filter(celula => celula.buraco).length;
    //     const totalOuros = grid.flat().filter(celula => celula.ouro).length;

    //     const payload = {
    //         nome: nomeMundo.trim(),
    //         largura,
    //         altura,

    //         estatisticas: {
    //             totalSalas: largura * altura,
    //             salasAtivas: salasAtivas,
    //             salasInativas: (largura * altura) - salasAtivas,
    //             quantidadeEntidades: {
    //                 wumpus: totalWumpus,
    //                 buracos: totalBuracos,
    //                 ouros: totalOuros
    //             },
    //             densidadeEntidades: {
    //                 wumpus: salasAtivas > 0 ? ((totalWumpus / salasAtivas) * 100).toFixed(2) + '%' : '0%',
    //                 buracos: salasAtivas > 0 ? ((totalBuracos / salasAtivas) * 100).toFixed(2) + '%' : '0%',
    //                 ouros: salasAtivas > 0 ? ((totalOuros / salasAtivas) * 100).toFixed(2) + '%' : '0%'
    //             }
    //         },
    //         salas: grid.flatMap((row, y) =>
    //             row.map((celula, x) => celula.ativa ? {
    //                 x, y,
    //                 wumpus: celula.wumpus,
    //                 buraco: celula.buraco,
    //                 ouro: celula.ouro
    //             } : null)
    //         ).filter(sala => sala !== null)
    //     }

    //     const jsonString = JSON.stringify(payload, null, 2)
    //     const blob = new Blob([jsonString], { type: 'application/json' })
    //     const url = URL.createObjectURL(blob)

    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = `mapa_${nomeMundo.trim().replace(/\s+/g, '_')}.json`
    //     document.body.appendChild(a)
    //     a.click()
    //     document.body.removeChild(a)
    //     URL.revokeObjectURL(url)
    // }

    // const importarJSON = async () => {
    //     const input = document.createElement('input');
    //     input.type = 'file';
    //     input.accept = '.json';

    //     input.onchange = (e) => {
    //         const file = e.target.files[0];
    //         if (!file) return;

    //         const reader = new FileReader();
    //         reader.onload = async (event) => {
    //             try {
    //                 const data = JSON.parse(event.target.result);

    //                 if (!data.nome || !data.largura || !data.altura || !Array.isArray(data.salas)) {
    //                     await confirm({
    //                         title: "Opa!",
    //                         message: "JSON inválido amigo!",
    //                         type: "alert",
    //                         botao1: "Aff"
    //                     })
    //                     return;
    //                 }

    //                 setNomeMundo(data.nome);
    //                 setLargura(data.largura);
    //                 setAltura(data.altura);

    //                 const novoGrid = Array.from({ length: data.altura }, (_, y) =>
    //                     Array.from({ length: data.largura }, (_, x) => {
    //                         const sala = data.salas.find(s => s.x === x && s.y === y);

    //                         if (sala) {
    //                             return {
    //                                 ativa: true,
    //                                 wumpus: sala.wumpus || false,
    //                                 buraco: sala.buraco || false,
    //                                 ouro: sala.ouro || false
    //                             };
    //                         } else {
    //                             return {
    //                                 ativa: false,
    //                                 wumpus: false,
    //                                 buraco: false,
    //                                 ouro: false
    //                             };
    //                         }
    //                     })
    //                 );

    //                 setGrid(novoGrid);

    //                 if (data.estatisticas) {
    //                     console.log('Estatísticas do mundo importado:', data.estatisticas);
    //                 }

    //             } catch (error) {
    //                 await confirm({
    //                     title: "Droga!",
    //                     message: `Erro ao ler o JSON: ${error.message}`,
    //                     type: "alert",
    //                     botao1: "Aff"
    //                 })
    //             }
    //         };

    //         reader.readAsText(file);
    //     };

    //     input.click();
    // }

    const exportarJSON = async () => {
        if (!nomeMundo.trim()) {
            await confirm({
                title: "Calma parceiro",
                message: "Dê um nome ao mundo antes de exportar",
                type: "alert",
                botao1: "Tá bom, chato"
            })

            return;
        }

        const salasAtivas = grid.flat().filter(celula => celula.ativa).length;
        const totalWumpus = grid.flat().filter(celula => celula.wumpus).length;
        const totalBuracos = grid.flat().filter(celula => celula.buraco).length;
        const totalOuros = grid.flat().filter(celula => celula.ouro).length;

        const payload = {
            id: modoEdicao ? mundoEditando.id : 0,
            nome: nomeMundo.trim(),
            largura,
            altura,
            data_criacao: modoEdicao ? mundoEditando.data_criacao : new Date().toISOString(),
            estatisticas: {
                totalSalas: largura * altura,
                salasAtivas: salasAtivas,
                salasInativas: (largura * altura) - salasAtivas,
                quantidadeEntidades: {
                    wumpus: totalWumpus,
                    buracos: totalBuracos,
                    ouros: totalOuros
                },
                densidadeEntidades: {
                    wumpus: salasAtivas > 0 ? ((totalWumpus / salasAtivas) * 100).toFixed(2) + '%' : '0%',
                    buracos: salasAtivas > 0 ? ((totalBuracos / salasAtivas) * 100).toFixed(2) + '%' : '0%',
                    ouros: salasAtivas > 0 ? ((totalOuros / salasAtivas) * 100).toFixed(2) + '%' : '0%'
                }
            },
            salas: grid.flatMap((row, y) =>
                row.map((celula, x) => celula.ativa ? {
                    x, y,
                    wumpus: celula.wumpus,
                    buraco: celula.buraco,
                    ouro: celula.ouro
                } : null)
            ).filter(sala => sala !== null)
        }

        const jsonString = JSON.stringify(payload, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `mapa_${nomeMundo.trim().replace(/\s+/g, '_')}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const importarJSON = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (!data.nome || !data.largura || !data.altura || !Array.isArray(data.salas)) {
                        await confirm({
                            title: "Opa!",
                            message: "JSON inválido amigo!",
                            type: "alert",
                            botao1: "Aff"
                        })
                        return;
                    }

                    setNomeMundo(data.nome);
                    setLargura(data.largura);
                    setAltura(data.altura);

                    const novoGrid = Array.from({ length: data.altura }, (_, y) =>
                        Array.from({ length: data.largura }, (_, x) => {
                            const sala = data.salas.find(s => s.x === x && s.y === y);

                            if (sala) {
                                return {
                                    ativa: true,
                                    wumpus: sala.wumpus || false,
                                    buraco: sala.buraco || false,
                                    ouro: sala.ouro || false
                                };
                            } else {
                                return {
                                    ativa: false,
                                    wumpus: false,
                                    buraco: false,
                                    ouro: false
                                };
                            }
                        })
                    );

                    setGrid(novoGrid);

                    if (data.estatisticas) {
                        console.log('Estatísticas do mundo importado:', data.estatisticas);
                    }

                    if (data.id) {
                        console.log('ID do mundo importado:', data.id);
                    }

                } catch (error) {
                    await confirm({
                        title: "Droga!",
                        message: `Erro ao ler o JSON: ${error.message}`,
                        type: "alert",
                        botao1: "Aff"
                    })
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    useEffect(() => {
        const salasAtivas = grid.flat().filter(celula => celula.ativa).length;
        const totalWumpus = grid.flat().filter(celula => celula.wumpus).length;
        const totalBuracos = grid.flat().filter(celula => celula.buraco).length;
        const totalOuros = grid.flat().filter(celula => celula.ouro).length;

        setEstatisticas({
            totalSalas: largura * altura,
            salasAtivas: salasAtivas,
            salasInativas: (largura * altura) - salasAtivas,
            quantidadeEntidades: {
                wumpus: totalWumpus,
                buracos: totalBuracos,
                ouros: totalOuros
            },
            densidadeEntidades: {
                wumpus: salasAtivas > 0 ? ((totalWumpus / salasAtivas) * 100).toFixed(2) + '%' : '0%',
                buracos: salasAtivas > 0 ? ((totalBuracos / salasAtivas) * 100).toFixed(2) + '%' : '0%',
                ouros: salasAtivas > 0 ? ((totalOuros / salasAtivas) * 100).toFixed(2) + '%' : '0%'
            }
        });
    }, [grid, largura, altura]);

    const toggleModoInsercao = (elemento) => {
        setTamanhoPincel(1);
        setIndiceInput(0);

        if (modoInsercao === elemento) {
            setModoInsercao(null);
        } else {
            setModoInsercao(elemento);
        }
    }

    const handleCellClick = (x, y) => {
        if (modoInsercao && grid[y][x].ativa) {
            setGrid(prev => {
                const novaGrid = prev.map(row => row.slice())
                // Alterna o estado do elemento específico
                novaGrid[y][x] = {
                    ...novaGrid[y][x],
                    [modoInsercao]: !novaGrid[y][x][modoInsercao]
                }
                return novaGrid
            })
        }
    }

    const limpar = async () => {

        const resposta = await confirm({
            title: "Tem certeza",
            message: "Quer mesmo limpar todos os blocos?",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não"
        })

        if (resposta === "yes") {
            setGrid(Array.from({ length: altura }, () =>
                Array.from({ length: largura }, () => ({
                    ativa: false,
                    wumpus: false,
                    buraco: false,
                    ouro: false
                }))
            ))
        }
    }

    const preencherTodos = async () => {
        const resposta = await confirm({
            title: "Tem certeza",
            message: "Quer mesmo preencher todos os blocos?",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não"
        })

        if (resposta === "yes") {
            setGrid(Array.from({ length: altura }, () =>
                Array.from({ length: largura }, () => ({
                    ativa: true,
                    wumpus: false,
                    buraco: false,
                    ouro: false
                }))
            ))
        }
    }

    const limparEntidades = async (aleatorio = false) => {
        let resposta = "yes";

        if (!aleatorio) {
            resposta = await confirm({
                title: "Tem certeza",
                message: "Quer mesmo apagar todas as entidades?",
                type: "confirm",
                botao1: "Sim",
                botao2: "Não"
            })
        }

        if (resposta === "yes") {
            setGrid(prev =>
                prev.map(linha =>
                    linha.map(celula => ({
                        ...celula,
                        wumpus: false,
                        buraco: false,
                        ouro: false
                    }))
                )
            );
        }
    }

    const gerarEntidadesAleatorias = async () => {
        await limparEntidades(true);
        const porcentagemInput = document.querySelector('input[placeholder="% prenchimento"]');
        const porcentagem = porcentagemInput.value ? Math.min(95, Math.max(0, parseInt(porcentagemInput.value))) : null;

        setGrid(prev => {
            const novaGrid = prev.map(row => row.slice());

            const salasAtivas = novaGrid.flat().filter(celula => celula.ativa).length;
            if (salasAtivas === 0) return novaGrid;

            const entidades = ['wumpus', 'buraco', 'ouro'];

            entidades.forEach(entidade => {
                let porcentagemEntidade = porcentagem;
                if (!porcentagemEntidade) {
                    porcentagemEntidade = Math.floor(Math.random() * 15) + 1;
                }

                const quantidade = Math.max(1, Math.floor((salasAtivas * porcentagemEntidade) / 100));

                const salasDisponiveis = [];
                novaGrid.forEach((linha, y) => {
                    linha.forEach((celula, x) => {
                        if (celula.ativa && !celula[entidade]) {
                            salasDisponiveis.push({ x, y });
                        }
                    });
                });

                const salasEmbaralhadas = [...salasDisponiveis].sort(() => Math.random() - 0.5);

                salasEmbaralhadas.slice(0, quantidade).forEach(({ x, y }) => {
                    novaGrid[y][x] = {
                        ...novaGrid[y][x],
                        [entidade]: true
                    };
                });
            });

            return novaGrid;
        });
    };

    async function salvar() {
        if (!nomeMundo.trim()) {
            await confirm({
                title: "Calma aí",
                message: "Dê um nome ao mundo antes de salvar.",
                type: "alert",
                botao1: "Tá ok",
            });
            return;
        }

        if (estatisticas.salasAtivas === 0) {
            await confirm({
                title: "Opa opa",
                message: "Adicione uma sala antes de salvar, ou a API irá explodir!",
                type: "alert",
                botao1: "Sinistro",
            });
            return;
        }

        setCarregado(true);

        const salasAtivas = grid.flat().filter(celula => celula.ativa).length;
        const totalWumpus = grid.flat().filter(celula => celula.wumpus).length;
        const totalBuracos = grid.flat().filter(celula => celula.buraco).length;
        const totalOuros = grid.flat().filter(celula => celula.ouro).length;

        const payload = {
            id: modoEdicao ? mundoEditando.id : 0,
            nome: nomeMundo.trim(),
            largura,
            altura,
            data_criacao: modoEdicao ? mundoEditando.data_criacao : new Date().toISOString(),
            estatisticas: {
                totalSalas: largura * altura,
                salasAtivas: salasAtivas,
                salasInativas: (largura * altura) - salasAtivas,
                quantidadeEntidades: {
                    wumpus: totalWumpus,
                    buracos: totalBuracos,
                    ouros: totalOuros
                },
                densidadeEntidades: {
                    wumpus: salasAtivas > 0
                        ? ((totalWumpus / salasAtivas) * 100).toFixed(2)
                        : "0",
                    buracos: salasAtivas > 0
                        ? ((totalBuracos / salasAtivas) * 100).toFixed(2)
                        : "0",
                    ouros: salasAtivas > 0
                        ? ((totalOuros / salasAtivas) * 100).toFixed(2)
                        : "0"
                }
            },
            salas: grid.flatMap((row, y) =>
                row.map((celula, x) => celula.ativa ? {
                    x, y,
                    wumpus: celula.wumpus,
                    buraco: celula.buraco,
                    ouro: celula.ouro
                } : null)
            ).filter(sala => sala !== null)
        };

        let salvou = false;

        if (modoEdicao) {
            salvou = await atualizarMundo(mundoEditando.id, payload);
        } else {
            salvou = await salvarMundo(payload);
        }

        setCarregado(false);
        if (salvou) {
            await confirm({
                title: "Sucesso!",
                message: modoEdicao ? "Seu mundo foi atualizado." : "Seu mundo foi salvo.",
                type: "alert",
                botao1: "Tá bom"
            });

            navigate('/mundos-salvos');
        } else {
            await confirm({
                title: "Ops!",
                message: "Algo deu errado ao salvar seu mundo.",
                type: "alert",
                botao1: "Aff"
            });
        }
    }

    return (
        <>
            <main>
                <aside className='janelaConfigMapa'>
                    <div className='divControle' style={{ border: 'none' }}>
                        <h1>EDITOR DE MUNDOS</h1>
                        <p className='paragrafoInformativo'>Preencha os blocos para definir o formato do seu mundo.</p>
                        <button
                            className='botaoInicio telaEditor'
                            onClick={() => {
                                navigate('/', { replace: true });
                            }}
                        >
                            Ir para o início
                        </button>
                    </div>
                    <div className='divControle'>
                        <div className='div-controles-auxiliar'>
                            <p>Largura:</p><br />
                            <input
                                type='number'
                                value={largura}
                                min={1}
                                max={200}
                                className='inputDimensao'
                                onChange={(e) => setLargura(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
                            />
                        </div>
                        <div className='div-controles-auxiliar'>
                            <p>Altura:</p><br />
                            <input
                                type='number'
                                value={altura}
                                min={1}
                                max={200}
                                className='inputDimensao'
                                onChange={(e) => setAltura(Math.max(1, Math.min(200, Number(e.target.value) || 1)))}
                            />
                        </div>
                    </div>

                    <div className='divControle'>
                        <div className='div-controles-auxiliar'>
                            <label>
                                <input
                                    type="radio"
                                    name='modo'
                                    value="desenhar"
                                    checked={modo === 'desenhar'}
                                    onChange={(e) => setModo(e.target.value)}
                                />
                                Desenhar
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name='modo'
                                    value="apagar"
                                    checked={modo === 'apagar'}
                                    onChange={(e) => setModo(e.target.value)}
                                />
                                Apagar
                            </label>
                        </div>
                        <p className='paragrafoInformativo'>Pressione <span style={{ fontWeight: 'bold' }}>'Ctrl'</span> para usar os controles sobre os blocos.</p>
                        <p className='paragrafoInformativo' style={{ width: "100%", textAlign: "center", marginTop: "5px" }}>Tamanho do pincel</p>
                        <input
                            type="range"
                            min={0}
                            max={valoresInput.length - 1}
                            step={1}
                            value={indiceInput}
                            onChange={(e) => {
                                const novoIndice = Number(e.target.value);
                                setIndiceInput(novoIndice);
                                setTamanhoPincel(valoresInput[novoIndice]);
                            }}
                        />
                        <div className='valoresInputPincel'>
                            {valoresInput.map((valor, index) => {
                                return <p
                                    key={index}
                                    className='paragrafoInformativo'
                                    style={{
                                        fontWeight: indiceInput === index ? 'bold' : 'normal',
                                        color: indiceInput === index ? '#ff4444' : 'inherit'
                                    }}
                                >
                                    {valor}
                                </p>
                            })}
                        </div>
                        <div className='div-controles-auxiliar'>
                            <button title='Preencha todos os blocos do mapa com salas ativas' className='botaoPreencher-apagar' onClick={preencherTodos}>Preencher todos</button>
                            <button title='Remova todas as salas e entidades do mapa' className='botaoPreencher-apagar' onClick={limpar}>Limpar blocos</button>
                        </div>
                    </div>
                    <div className='divControle'>
                        <p className='paragrafoInformativo'>
                            <b>Salas:</b> {estatisticas.salasAtivas}/{estatisticas.totalSalas} ({((estatisticas.salasAtivas / estatisticas.totalSalas) * 100).toFixed(1)}%)<br />
                            <b>Wumpus:</b> {estatisticas.quantidadeEntidades.wumpus} ({estatisticas.densidadeEntidades.wumpus})<br />
                            <b>Buracos:</b> {estatisticas.quantidadeEntidades.buracos} ({estatisticas.densidadeEntidades.buracos})<br />
                            <b>Ouros:</b> {estatisticas.quantidadeEntidades.ouros} ({estatisticas.densidadeEntidades.ouros})
                        </p>
                    </div>
                    <div className='divControle'>
                        <h2>Salvar</h2>
                        <input
                            type="text"
                            value={nomeMundo}
                            onChange={(e) => setNomeMundo(e.target.value)}
                            placeholder='Nome do mundo'
                            className='nomeDoMundo'
                        />
                        <button title='Baixe o arquivo deste mundo no seu computador' onClick={exportarJSON}>Exportar/Baixar JSON</button>
                        <p className='paragrafoInformativo' style={{ width: '100%', textAlign: 'center', color: 'gold' }}><b>Atenção!</b> Para obter o ID corretamente no JSON, salve o mundo, depois clique em <b>Editar</b> para retorntar a esta tela, só então faça a exportação.</p>
                        <button title='Importe o arquivo de um mundo do seu computador' onClick={importarJSON}>Importar JSON</button>
                        <button title='Salve este mundo na sua conta' onClick={salvar} className='botaoSalvar'>Salvar na minha conta</button>
                    </div>
                </aside>
                <section className='janelaCentralizada'>
                    <div
                        ref={containerRef}
                        className='div-mapa'
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className='mapa-blocos'
                            style={{
                                gridTemplateColumns: `repeat(${largura}, ${cellSize}px)`,
                                gridTemplateRows: `repeat(${altura}, ${cellSize}px)`,
                                width: `${mapSize.w}px`,
                                height: `${mapSize.h}px`,
                            }}
                        >
                            {grid.map((linha, y) =>
                                linha.map((sel, x) => (
                                    <Bloco
                                        key={`${x}-${y}`}
                                        selecionado={sel.ativa}
                                        wumpus={sel.wumpus}
                                        buraco={sel.buraco}
                                        ouro={sel.ouro}
                                        destacado={deveDestacar(x, y)}
                                        onMouseEnter={() => handleCellMouseEnter(x, y)}
                                        onMouseDown={() => handleCellMouseDown(x, y)}
                                        onClick={() => handleCellClick(x, y)}
                                        x={x}
                                        y={y}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>
                <aside className='janelaEntidades'>
                    <h2>Entidades</h2>
                    <p className='paragrafoInformativo' style={{ textAlign: 'left', marginLeft: '10px' }}>Escolha como será o mundo que seu agente irá explorar.</p>
                    <p></p>
                    <div className='divControle'>
                        <div className='div-entidades-informacao'>
                            <h3 style={{ color: 'red' }}>Wumpus</h3>
                            <p>Mata seu agente instantâneamente, mas seu agente pode matá-lo.</p>
                            <h3 style={{ color: 'blueviolet', marginTop: '10px' }}>Buraco</h3>
                            <p>Não há saída, se o agente cair, perde a partida.</p>
                            <h3 style={{ color: 'orange', marginTop: '10px' }}>Ouro</h3>
                            <p>Seu agente vence a partida se encontrar e fugir do mundo.</p>
                        </div>
                    </div>
                    <div className='divControle'>
                        <p className='paragrafoInformativo'>
                            Adicione entidades aos blocos.
                            Clique nos botões para ativar ou <span className='destaqueRed'>desativar</span> a inserção de entidades,
                            clique nos blocos ativos para inserir ou <span className='destaqueRed'>remover</span>.</p>
                        <button
                            className={`botaoWumpus ${modoInsercao === 'wumpus' ? 'ativo' : ''}`}
                            onClick={() => toggleModoInsercao('wumpus')}
                            title='Clique para inserir wumpus no mapa. Clique novamente para desativar o modo de inserção'
                        >
                            Wumpus
                        </button>
                        <button
                            title='Clique para inserir buracos no mapa. Clique novamente para desativar o modo de inserção'

                            className={`botaoBuraco ${modoInsercao === 'buraco' ? 'ativo' : ''}`}
                            onClick={() => toggleModoInsercao('buraco')}
                        >
                            Buraco
                        </button>
                        <button
                            title='Clique para inserir ouro no mapa. Clique novamente para desativar o modo de inserção'
                            className={`botaoOuro ${modoInsercao === 'ouro' ? 'ativo' : ''}`}
                            onClick={() => toggleModoInsercao('ouro')}
                        >
                            Ouro
                        </button>
                        <button title='Apague todas as entidades inseridas no mapa (wumpus, ouro, buraco)' onClick={() => limparEntidades()} style={{ backgroundColor: 'red', border: 'none' }}>Limpar Todas as Entidades</button>
                        <div className='div-entidades-aleatorio'>
                            <input type="number" min={0} max={95} name="" id="" placeholder='% prenchimento' />
                            <button onClick={gerarEntidadesAleatorias} title='Gere todos esses elementos aleatoriamente no mapa. Você pode definir uma porcentagem de densidade'>Aleatório</button>
                        </div>
                        <p className='paragrafoInformativo'>
                            Gere entidades de forma aleatória no ambiente, você pode ou não definir
                            a <span className='destaqueRed'>porcentagem de densidade</span> em relação
                            à quantidade de salas ativas.
                        </p>
                    </div>
                </aside>
            </main>
            {
                carregado && (<LoadingPage></LoadingPage>)
            }

        </>
    )
}
