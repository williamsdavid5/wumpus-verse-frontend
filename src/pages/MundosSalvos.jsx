import './styles/mundosSalvos.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

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

    const { getMundosSalvos } = useAuth();
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        if (!carregado) {
            getMundosSalvos();
            setCarregado(true);
        }

    })

    const navigate = useNavigate();

    const mundosExemplo = [
        {
            nome: "Mundo Deserto",
            data: "05/10/2025",
            salas: 60,
            buracos: 10,
            ouros: 5,
            wumpus: 1
        },
        {
            nome: "Caverna",
            data: "12/09/2025",
            salas: 120,
            buracos: 25,
            ouros: 8,
            wumpus: 3
        },
        {
            nome: "Labirinto Simples",
            data: "20/11/2025",
            salas: 16,
            buracos: 3,
            ouros: 2,
            wumpus: 1
        },
        {
            nome: "Abismo Mortal",
            data: "03/12/2025",
            salas: 80,
            buracos: 35,
            ouros: 12,
            wumpus: 5
        },
        {
            nome: "Mina Dourada",
            data: "15/08/2025",
            salas: 100,
            buracos: 15,
            ouros: 20,
            wumpus: 2
        }
    ];


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
                            <input type="text" name="" id="" className='barraPesquisaMundosSalvos' placeholder='Pesquise qualquer coisa' />
                        </div>
                        <div className='topoMundosAuxiliar'>
                            <button className='botaoNovoMundo' onClick={() => navigate('/mapa')}>Novo</button>
                        </div>
                    </div>

                    <div className='divListaMundos'>
                        {mundosExemplo.map((mundo, index) => (
                            <div key={index} className='itemListaMundos'>
                                <div className='esquerda'>
                                    <h2>{mundo.nome}</h2>
                                    <p className='paragrafoInformativo'>Data de criação: {mundo.data}</p>
                                    <p className='paragrafoInformativo'>
                                        <b>Salas:</b> {mundo.salas} <br />
                                        <b>Buracos:</b> {mundo.buracos} <br />
                                        <b>Ouros:</b> {mundo.ouros} <br />
                                        <b>Wumpus:</b> {mundo.wumpus}
                                    </p>
                                </div>
                                <div className='direita'>
                                    <button className='botaoEditar'>Editar</button>
                                    <button className='botaoExcluir'>Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </aside>
                <section className='mundosVisualizador'>
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
                            {/* Linha 1 */}
                            <Bloco selecionado />
                            <Bloco />
                            <Bloco buraco />
                            <Bloco />
                            <Bloco ouro />
                            <Bloco />

                            {/* Linha 2 */}
                            <Bloco />
                            <Bloco selecionado />
                            <Bloco />
                            <Bloco wumpus />
                            <Bloco />
                            <Bloco />

                            {/* Linha 3 */}
                            <Bloco />
                            <Bloco />
                            <Bloco selecionado buraco />
                            <Bloco />
                            <Bloco />
                            <Bloco />

                            {/* Linha 4 */}
                            <Bloco ouro />
                            <Bloco />
                            <Bloco />
                            <Bloco selecionado />
                            <Bloco buraco />
                            <Bloco />

                            {/* Linha 5 */}
                            <Bloco />
                            <Bloco />
                            <Bloco wumpus />
                            <Bloco />
                            <Bloco />
                            <Bloco selecionado />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}