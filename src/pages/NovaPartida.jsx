import "./styles/novaPartida.css"
import { useAuth } from '../contexts/AuthContext';
import LoadingGif from '../assets/loadingGif.gif'
import { useState, useEffect } from "react";
import { useConfirm } from '../contexts/ConfirmContext';
import { useNavigate } from 'react-router-dom'

export default function () {
    const { getMundosSalvos, getMiniMapa } = useAuth();
    const navigate = useNavigate();
    const [mundos, setMundos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const { confirm } = useConfirm();
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [temMaisItens, setTemMaisItens] = useState(true);

    const [mundoSelecionado, setMundoSelecionado] = useState();
    const [agenteSelecionado, setAgenteSelecionado] = useState(0);

    async function carregarMundosSalvos(pagina = 1, limparLista = true) {
        if (pagina === 1) {
            setCarregando(true);
        } else {
            setCarregandoMais(true);
        }
        try {
            const resposta = await getMundosSalvos(pagina, 6);

            if (resposta && resposta.length > 0) {
                // console.log(resposta);
                const itensParaMostrar = resposta.slice(0, 5);

                if (limparLista || pagina === 1) {
                    setMundos(itensParaMostrar);
                } else {
                    setMundos(prev => [...prev, ...itensParaMostrar]);
                }

                setTemMaisItens(resposta.length === 6);
            } else {
                if (pagina === 1) {
                    setMundos([]);
                }
                setTemMaisItens(false);
            }

            setPaginaAtual(pagina);

        } catch (error) {
            console.error('Erro ao carregar mundos:', error);
            await confirm({})
            setTemMaisItens(false);
        } finally {
            if (pagina === 1) {
                setCarregando(false);
            }

            if (mundos.length > 0) {
                setCarregandoMais(false);
            }
        }
    }

    function carregarMais() {
        if (!carregandoMais && temMaisItens) {
            carregarMundosSalvos(paginaAtual + 1, false);
        }
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

    useEffect(() => {
        carregarMundosSalvos(1, true);
    }, [])

    return (
        <>
            <main className="mainNovaPartida">
                <aside className="esquerdaNovaPartida">
                    <div className="divControle">
                        <h1>Nova partida</h1>
                        <p className="paragrafoInformativo">Selecione um mundo e um agente para continuar. Claro, você precisa ter criado um mundo antes de iniciar uma partida!</p>
                    </div>
                    <div className="divControle">
                        <p>Mundos que você criou:</p>
                    </div>
                    <div className="listaMundos">
                        {carregando &&
                            <div className="loadingPequeno">
                                <img src={LoadingGif} alt="" />
                            </div>
                        }
                        {!carregando && mundos.length > 0 && (
                            mundos.map((mundo) => {

                                const ativo = mundo.id == mundoSelecionado;

                                return (
                                    <div
                                        key={mundo.id}
                                        className={`itemListaMundos ${ativo ? 'ativo' : ''}`}
                                        onClick={() => {
                                            setMundoSelecionado(mundo.id);
                                        }}
                                    >
                                        <h2>{mundo.nome}</h2>
                                        <p className='paragrafoInformativo'>Data de criação: {formatarData(mundo.data_criacao)}</p>
                                        <p className='paragrafoInformativo'>
                                            <b>Salas ativas:</b> {mundo.estatisticas.salasAtivas} <br />
                                            <b>Buracos:</b> {mundo.estatisticas.quantidadeEntidades.buracos} <br />
                                            <b>Ouros:</b> {mundo.estatisticas.quantidadeEntidades.ouros} <br />
                                            <b>Wumpus:</b> {mundo.estatisticas.quantidadeEntidades.wumpus}
                                        </p>
                                    </div>
                                )
                            })
                        )}

                        {!carregando && mundos.length === 0 && (
                            <div className='loadingPequeno'>
                                <p>Não tem nada aqui!</p>
                                <button
                                    className="botaoIniciarPartida"
                                    onClick={() => {
                                        navigate('/mapa')
                                    }}
                                >Clique aqui para criar um novo mundo</button>
                            </div>
                        )}

                        {!carregando && mundos.length > 0 && (
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
                    </div>
                </aside>
                <section className="centroNovaPartida">
                    <div className="divMapa">
                        mapa aqui
                    </div>
                    <div className="divInformacoes">
                        <p className="paragrafoInformativo">Selecione onde seu agente será posicionado no início da partida, essa posição também será a saída do mundo, o que indica o fim da partida.</p>
                    </div>
                </section>
                <aside className="direitaNovaPartida">
                    <div className="divControle">
                        <h2>Configurações da partida</h2>
                        <p className="paragrafoInformativo">
                            Tenha certeza que configurou corretamente antes de iniciar a partida.
                        </p>
                    </div>
                    <div className="divSelecioneAgente">
                        <p style={{ margin: '5px' }}>Selecione o agente:</p>
                        <div className="listaAgentes">
                            <div className="itemAgente">
                                <h3>Agente 0</h3>
                                <p className="paragrafoInformativo">
                                    Agente totalmente aleatório, apenas dá passos pelo ambiente sem se importar, ou seja, um agente burro.
                                </p>
                            </div>
                        </div>
                        <label htmlFor="" className="checkMovimento">
                            <input type="checkbox" name="" id="" />
                            Permitir movimentos na diagonal
                        </label>
                    </div>
                    <div className="divControle">
                        <p>✓ Selecionou um mundo</p>
                        <p>✓ Selecionou um agente</p>
                        <p>✓ Selecionou uma posição inicial</p>
                        <button className="botaoIniciarPartida">Iniciar partida</button>
                    </div>
                </aside>
            </main>
            {/* <footer className="rodapeNovaPartida">
                rodapé
            </footer> */}
        </>
    )
}