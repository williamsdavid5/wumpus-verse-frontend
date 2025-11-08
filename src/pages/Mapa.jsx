import './styles/mapa.css'
import { useState, useEffect, useRef, useCallback } from 'react'

function Bloco({ selecionado, onMouseEnter, onMouseDown }) {
    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
        >
            {/* <div className='elemento wumpus'></div>
            <div className='elemento buraco'></div>
            <div className='elemento ouro'></div> */}
        </div>
    )
}

export default function Mapa() {
    const [largura, setLargura] = useState(4)
    const [altura, setAltura] = useState(4)
    const [modo, setModo] = useState('desenhar');
    const [ctrlPressionado, setCtrlPressionado] = useState(false)
    const mousePosition = useRef(null);


    const [grid, setGrid] = useState(() =>
        Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => false))
    )

    const containerRef = useRef(null)
    const [cellSize, setCellSize] = useState(20)
    const [mapSize, setMapSize] = useState({ w: largura * 20, h: altura * 20 })

    useEffect(() => {
        setGrid(prev => {
            const nova = Array.from({ length: altura }, (_, y) =>
                Array.from({ length: largura }, (_, x) => (prev[y] && prev[y][x]) || false)
            )
            return nova
        })
    }, [largura, altura])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Control') {
                setCtrlPressionado(true);

                // Altera imediatamente a célula sob o mouse quando Control é pressionado
                if (mousePosition.current) {
                    const { x, y } = mousePosition.current;
                    const valor = modo === 'desenhar';
                    alternarNoGrid(x, y, valor);
                }
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
    }, [modo])

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

    const alternarNoGrid = (x, y, valor) => {
        setGrid(prev => {
            const copia = prev.map(row => row.slice())
            if (copia[y] && typeof copia[y][x] !== 'undefined') {
                copia[y][x] = valor
            }
            return copia
        })
    }



    const handleCellMouseEnter = (x, y) => {
        mousePosition.current = { x, y };
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
    }

    const exportarJSON = () => {
        const payload = {
            largura,
            altura,
            salas: grid.flatMap((row, y) =>
                row.map((v, x) => v ? { x, y, entidade: "" } : null)
            ).filter(sala => sala !== null)
        }

        const jsonString = JSON.stringify(payload, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `mapa_${largura}x${altura}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const limpar = () => setGrid(Array.from({ length: altura }, () => Array.from({ length: largura }, () => false)))
    const preencherTodos = () => {
        setGrid(Array.from({ length: altura }, () => Array.from({ length: largura }, () => true)))
    }

    return (
        <>
            <main>
                <aside className='janelaConfigMapa'>
                    <div className='divControle' style={{ border: 'none' }}>
                        <h1>GERADOR DE MUNDOS</h1>
                        <p className='paragrafoInformativo'>Preencha os blocos para definir o formato do seu mundo.</p>
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

                        <p className='paragrafoInformativo'>Pressione 'Ctrl' para usar os controles sobre os blocos.</p>
                    </div>

                    <div className='divControle'>
                        <div className='div-controles-auxiliar'>
                            <button className='botaoPreencher-apagar' onClick={preencherTodos}>Preencher todos</button>
                            <button className='botaoPreencher-apagar' onClick={limpar}>Limpar blocos</button>
                        </div>

                        <button onClick={exportarJSON}>Exportar JSON</button>
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
                                        selecionado={sel}
                                        onMouseEnter={() => handleCellMouseEnter(x, y)}
                                        onMouseDown={() => handleCellMouseDown(x, y)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>
                <aside className='janelaEntidades'>
                    <p>asdsdadasdasd</p>
                </aside>
            </main>
        </>
    )
}
