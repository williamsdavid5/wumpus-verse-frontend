import './styles/agentes.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import { useState } from 'react'

export default function Agentes() {

    const [tipoAgenteSelecionado, setTipoAgenteSelerionado] = useState('');

    return (
        <>
            <main className="mundosMain agentesMain">
                <aside className="mundosLista esquerdaAgentes">
                    <div className='topoAgentes'>
                        <h1>Agentes</h1>
                        <p className='paragrafoInformativo'>Todos os agentes que você criou</p>
                    </div>
                    <div className='divListaMundos'>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>Lino maluco</h2><p><span className='destaqueGold'>ID: 23</span></p>
                                </div>
                                <p className='destaqueGold'>Agente evolutivo</p>
                                <p className='paragrafoInformativo'>Configurações de evolutivo</p>
                            </div>
                        </div>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>R2DLino</h2><p><span className='destaqueGold'>ID: 25</span></p>
                                </div>
                                <p className='destaqueRed'>Agente lógico</p>
                                <p className='paragrafoInformativo'>
                                    - Estado interno <br />
                                    - Coragem <br />
                                    - Um ouro <br />
                                    - Todos os canvas
                                </p>
                            </div>
                        </div>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>O Exterminador de Canvas</h2>
                                    <p><span className='destaqueGold'>ID: 27</span></p>
                                </div>
                                <p className='destaqueRed'>Agente lógico</p>
                                <p className='paragrafoInformativo'>
                                    - Estado interno <br />
                                    - Ódio ao Canva <br />
                                    - Um ouro <br />
                                    - Todos os canvas
                                </p>
                            </div>
                        </div>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>Uga Uga</h2>
                                    <p><span className='destaqueGold'>ID: 23</span></p>
                                </div>
                                <p className='destaqueGold'>Agente evolutivo</p>
                                <p className='paragrafoInformativo'>
                                    Configurações de agente evolutivo
                                </p>
                            </div>
                        </div>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>O Exterminador de Canvas 2</h2>
                                    <p><span className='destaqueGold'>ID: 27</span></p>
                                </div>
                                <p className='destaqueRed'>Agente lógico</p>
                                <p className='paragrafoInformativo'>
                                    - Estado interno <br />
                                    - Ódio ao Canva <br />
                                    - Um ouro <br />
                                    - Todos os canvas
                                </p>
                            </div>
                        </div>
                        <div className='itemListaMundos'>
                            <div className='esquerda'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h2>Lino, apenas</h2>
                                    <p><span className='destaqueGold'>ID: 27</span></p>
                                </div>
                                <p className='destaqueRed'>Agente lógico</p>
                                <p className='paragrafoInformativo'>
                                    - Estado interno <br />
                                    - Ódio ao Canva <br />
                                    - Um ouro <br />
                                    - Todos os canvas
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
                <section className="direitaAgentes">
                    <div className='divControle'>
                        <h2>Customização</h2>
                        <p className='paragrafoInformativo' style={{ textAlign: 'left' }}>
                            Customize e salve um agente personalizado para testar nos ambientes que você criou!
                        </p>
                    </div>
                    <div className='divControle'>
                        <h2 style={{ width: '100%', textAlign: 'center' }}>Tipo de agente</h2>
                        <div className={`auxiliarSelecaoTipoAgente`}>
                            <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'logico' ? 'blocoTipoSelecionado' : ''}`} onClick={() => setTipoAgenteSelerionado('logico')}>
                                <img src={LinoLogico} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'logico' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                <h3>Lógico</h3>
                                <p className='paragrafoInformativo'>
                                    Esse agente não sem sentimentos, apenas segue um conjunto de regras definidas em sua programação
                                </p>
                            </div>
                            <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'blocoTipoSelecionado' : ''}`} onClick={() => setTipoAgenteSelerionado('evolutivo')}>
                                <img src={LinoEvolutivo} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                <h3>Evolutivo</h3>
                                <p className='paragrafoInformativo'>
                                    Esse agente evolui aprendendo com os seus erros (diferente de certas pessoas)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='divControle divConfigsAgente'>
                        {tipoAgenteSelecionado == '' ?
                            <>
                                <h2>Selecione um agente</h2>
                            </> :
                            tipoAgenteSelecionado == 'logico' ?
                                <>
                                    <h2>Configurações do agente lógico</h2>
                                    <p>Nome do seu agente</p>
                                    <input type="text" placeholder='Nome do agente' />
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label class="switch">
                                                <input type="checkbox" />
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Estado interno</b><br />
                                            <span className='paragrafoInformativo'>
                                                Se ativado, o agente irá armazenar um modelo do mundo na sua memória, que é constabtemente atualizado conforme o agente explora o ambiente.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label class="switch">
                                                <input type="checkbox" />
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Reencarnação</b><br />
                                            <span className='paragrafoInformativo'>
                                                O agente irá renascer após a morte, com as mesmas memórias, para continuar a partida. Observação: ele irá renascer apenas 10 vezes.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label class="switch">
                                                <input type="checkbox" />
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Coragem</b><br />
                                            <span className='paragrafoInformativo'>
                                                Quando desativado, o agente irá explorar as células marcadas como suspeitas apenas se não vencer a partida. Quando ativado, o agente irá entrar nas células suspeitas mais cedo buscando pegar o ouro antes de explorar o restante do ambiente.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label class="switch">
                                                <input type="checkbox" />
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Ódio ao Canva</b><br />
                                            <span className='paragrafoInformativo'>
                                                Quando ativado, o agente irá tentar matar o Canva sempre que detectar o cheiro, quando desativado, o agente irá atrás do Canva em último caso.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxInterruptores interruptoresVencerAPartida'>
                                        <p>
                                            <b>Como vencer a partida?</b><br />
                                            <span className='paragrafoInformativo'>
                                                <input type="radio" name='comoVencer' /> O agente vence se pegar um ouro e voltar para a origem. <br />
                                                <input type="radio" name='comoVencer' /> O agente vence apenas se pegar todo o ouro e voltar para a origem. <br />
                                            </span>
                                        </p>
                                        <hr />
                                        <p>
                                            <b>Sobre o Canva</b><br />
                                            <span className='paragrafoInformativo'>
                                                <input type="radio" name='comoVencerCanva' /> Não é necessário matar um Canva para vencer o jogo.<br />
                                                <input type="radio" name='comoVencerCanva' /> O agente precisa matar pelo menos um Canva. <br />
                                                <input type="radio" name='comoVencerCanva' /> O agente precisa matar todos os Canvas da face da terra! <br />
                                            </span>
                                        </p>
                                    </div>
                                    <div className='divControle controlesSalvarAgente'>
                                        <button>Salvar esse agente</button>
                                        <button>Excluir</button>
                                    </div>
                                </> :
                                <>
                                    <h2>Configurações do agente evolutivo</h2>
                                </>
                        }

                    </div>
                </section>
            </main>
        </>
    )
}