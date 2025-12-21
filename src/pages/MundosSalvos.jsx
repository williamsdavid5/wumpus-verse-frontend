import './styles/mundosSalvos.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

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

    const { getMundosSalvos } = useAuth();
    const [mundos, setMundos] = useState([]);
    const [carregado, setCarregado] = useState(false);

    async function carregarMundosSalvos() {
        setCarregado(true);
        const resposta = await getMundosSalvos();
        setMundos(resposta);
        // console.log(resposta);
        setCarregado(false);
    }

    useEffect(() => {
        carregarMundosSalvos();
    }, [])

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
                            <input type="text" name="" id="" className='barraPesquisaMundosSalvos' placeholder='Pesquise qualquer coisa' />
                        </div>
                        <div className='topoMundosAuxiliar'>
                            <button className='botaoNovoMundo' onClick={() => navigate('/mapa')}>Novo</button>
                        </div>
                    </div>

                    <div className='divListaMundos'>
                        {carregado &&
                            <div className='loadingPequeno'>
                                <img src={LoadingGif} alt="" />
                            </div>
                        }

                        {!carregado &&
                            (mundos.map((mundo, index) => {
                                // console.log(mundo);
                                return (
                                    <div key={index} className='itemListaMundos'>
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

                        {/* {mundosExemplo.map((mundo, index) => (
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
                        ))} */}
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