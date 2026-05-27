import './styles/historico.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import Buraco from '../assets/skins/buraco.png'
import LoadingGig from '../assets/loadingGif.gif'

import { useEffect, useState, useRef, useTransition } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Historico() {
    const { getMundosSalvos } = useAuth();

    const [carregandoMundos, setCarregandoMundos] = useState(false);
    const [temMaisMundos, setTemMaisMundos] = useState(false)
    const [mundos, setMundos] = useState([]);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [carregandoMaisMundos, setCarregandoMaisMundos] = useState(false);
    const [carregandoAgentes, setCarregandoAgentes] = useState(false);
    const [carregadoHistorico, setCarregandoHistorico] = useState(false);
    const [paginaAtualMundos, setPaginaAtualMundos] = useState(1);

    function formatarData(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }

    async function carregarMundosSalvos(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregandoMundos(true);
        } else {
            setCarregandoMaisMundos(true);
        }
        try {
            const resposta = await getMundosSalvos(pagina, 6);

            if (!resposta || !Array.isArray(resposta) || resposta.length === 0) {
                if (pagina === 1) {
                    setMundos([]);
                }
                setCarregandoMundos(false);
                return;
            }

            const temMais = !resposta[resposta.length - 1];
            const itensMundos = resposta.slice(0, resposta.length - 1);
            console.log(resposta);

            if (itensMundos.length > 0) {
                if (limparLista || pagina === 1) {
                    setMundos(itensMundos);
                } else {
                    setMundos(prev => [...prev, ...itensMundos]);
                }
            } else if (pagina === 1) {
                setMundos([]);
            }

            setTemMaisMundos(temMais);
            // console.log("Tem mais itens?", temMais);

            setPaginaAtualMundos(pagina);

        } catch (error) {
            console.error('Erro ao carregar mundos:', error);
            await confirm({})
            setTemMaisMundos(false);
        } finally {
            if (pagina === 1) {
                setCarregandoMundos(false);
            }

            if (mundos.length > 0) {
                setCarregandoMaisMundos(false);
            }
        }
    }

    function carregarMaisMundos() {
        if (!carregandoMaisMundos && temMaisMundos) {
            carregarMundosSalvos(paginaAtualMundos + 1, false);
        }
    }

    useEffect(() => {
        carregarMundosSalvos(1, true);
    }, [])

    return (
        <>
            <main className="historicoMain mundosMain">
                <aside className='listasHistorico'>
                    <section className='listaMundosHistorico'>
                        <div className='topoListaMundosHistorico'>
                            <h3>Selecione um mundo</h3>
                            <p className='paragrafoInformativo'>Abaixo tem todos os mundos que você criou, isso não
                                significa que todos eles vão ter um histórico!</p>
                        </div>
                        <div className='itensMundosHistorico'>
                            {
                                carregandoMundos ?
                                    <>
                                        <span className='loadingPequeno'>
                                            <img src={LoadingGig} alt="" />
                                        </span>
                                    </>
                                    :
                                    <>
                                        {mundos.map((mundo, index) => {
                                            const ativo = mundoSelecionado === mundo.id;
                                            return (
                                                <div
                                                    key={mundo.id}
                                                    className={`itemMundoHistorico ${ativo ? 'ativo' : ''}`}
                                                    onClick={() => {
                                                        setMundoSelecionado(mundo.id);
                                                        carregarMinimapa(mundo.id);
                                                    }}
                                                >

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <h3>{mundo.nome}</h3><p><span className='destaqueGold'>ID: {mundo.id}</span></p>
                                                    </div>
                                                    <p className='paragrafoInformativo'>Data de criação: {formatarData(mundo.data_criacao)}</p>
                                                    <p className='paragrafoInformativo'>
                                                        <b>Salas ativas:</b> {mundo.estatisticas.salasAtivas} <br />
                                                        <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                                        <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                                        <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                                    </p>

                                                </div>
                                            )
                                        })}

                                        {!carregandoMundos && mundos.length > 0 && (
                                            carregandoMaisMundos ? (
                                                <div className='loadingPequeno'>
                                                    <img src={LoadingGig} alt="" />
                                                </div>
                                            ) : temMaisMundos ? (
                                                <div className='loadingPequeno'>
                                                    <button
                                                        onClick={carregarMaisMundos}
                                                        disabled={carregandoMaisMundos}
                                                        style={{ padding: '10px' }}
                                                    >
                                                        Carregar mais
                                                    </button>
                                                </div>
                                            ) : null
                                        )}
                                    </>
                            }


                        </div>
                    </section>
                    <section className='listaAgentesHistorico'>
                        <div className='topoListaMundosHistorico'>
                            <h3>Selecione um agente</h3>
                            <p className='paragrafoInformativo'>Você pode ou não selecionar um agente. Se não selecionar,
                                a lista exibirá o histórico de todos os agentes para aquele ambiente!</p>
                        </div>
                        <div className='itensMundosHistorico'>
                            <div className='itensMundosHistorico'>
                                {
                                    carregandoAgentes ?
                                        <>
                                            <span className='loadingPequeno'>
                                                <img src={LoadingGig} alt="" />
                                            </span>
                                        </>
                                        :
                                        <>
                                            <div className='itemListaMundos'>
                                                <h3>Mundo A</h3>
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    </section>
                </aside>
                <section className='secaoHistoricoMundo'>
                    <div className='topoSecaoHistoricoMundo'>
                        <h1>Histórico</h1>
                        <p className='paragrafoInformativo'>
                            Histórico de execução para esse mundo
                        </p>
                    </div>
                    <div className='itensListaHistorico itensMundosHistorico'>
                        {
                            carregadoHistorico ?
                                <>
                                    <span className='loadingPequeno'>
                                        <img src={LoadingGig} alt="" />
                                    </span>
                                </>
                                :
                                <>
                                    <div className='itemListaMundos'>
                                        <h3>Mundo A</h3>
                                    </div>
                                </>
                        }
                    </div>
                </section>
            </main>
        </>
    )
}