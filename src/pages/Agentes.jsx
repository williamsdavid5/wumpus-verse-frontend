import './styles/agentes.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import { useState } from 'react'

export default function Agentes() {

    const [tipoAgenteSelecionado, setTipoAgenteSelerionado] = useState('');
    const [mostrarFuncionamento, setMostrarFuncionamento] = useState(false);

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
                                    <div className='divControle controlesSalvarAgente'>
                                        <button>Salvar esse agente</button>
                                        <button>Excluir</button>
                                    </div>
                                </> :
                                <>
                                    <h2>Configurações do agente evolutivo</h2>
                                    <p>Nome do seu agente</p>
                                    <input type="text" placeholder='Nome do agente' />
                                    <button
                                        onClick={() => setMostrarFuncionamento(!mostrarFuncionamento)}
                                    >
                                        {mostrarFuncionamento ?
                                            'Já sei como funciona :)' : 'Não sei como funciona :('
                                        }
                                    </button>
                                    {mostrarFuncionamento && (
                                        <>
                                            <h3>Esse agente funciona da seguinte maneira:</h3>
                                            <p className='paragrafoExplicacao'>
                                                Um indivíduo é criado com as suas ações já predefinidas, os caminhos que ele vai tomar, as ações que ele vai executar e etc. Esse conjunto de características são o que chamamos de <span className='destaqueGold'>gene</span>. <br /><br />
                                                Um número específico de indivíduos é gerado aleatoriamente, esses indivíduos são enviados para o mundo e, de acordo com as ações executadas no mundo, esses agentes ganham cada um a sua pontuação. Esse conjunto de indivíduos é o que chamamos de <span className='destaqueGold'>população</span>.<br /><br />
                                                Uma parte dos agentes é escolhida, geralmente os melhores, mas com um certo nível de aleatoriedade. Esses agentes são reproduzidos, ou seja, são gerados novos agentes se baseando nas características desses escolhidos e adicionando algumas características aleatórias para manter a individualidade, isso é o que chamamos de <span className='destaqueGold'>mutação</span>, e serve para que os agentes tenham a oportunidade de desenvolver novas estratégias. <br /><br />
                                                O novo conjunto de agentes criado é chamado de <span className='destaqueGold'>geração</span>, esses agentes são testados e pontuações também são atribuídas, e o processo se repete. <br /><br />
                                                Um número específico de gerações são criadas e reproduzidas, e o melhor agente resultante é escolhido, tudo isso é feito em segundos (ou menos de um segundo) no servidor, e você recebe o melhor agente desse processo!
                                            </p>
                                            <hr />
                                        </>
                                    )}
                                    <p>
                                        Se você realmente leu e sabe como funciona (eu vou confiar em você), então deve ter percebido o quanto a pontuação é importante! A pontuação define o nível de <span className='destaqueGold'>premiação</span> ou <span className='destaqueRed'>punição</span> para cada ação daquele agente. É muito importante que isso seja bem definido para que o agente evolua corretamente para se comportar da maneira que você quer! Então, <b>esteja atento às pontuações</b> que você vai atribuir.
                                    </p>
                                    <br />
                                    <h2>Configurações</h2>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input type="number" />
                                        <p>População <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantos agentes terão em cada ciclo (isso garante variedade genética)
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input type="number" />
                                        <p>Gerações <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantas vezes os agentes irão se reproduzir 😏
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input type="number" min={0} max={100} />
                                        <p>Taxa de mutação (%) <br />
                                            <span className='paragrafoInformativo'>
                                                O quanto os agentes irão mudar em cada nascimento?
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input type="number" min={0} max={100} />
                                        <p>Taxa de mutação (%) <br />
                                            <span className='paragrafoInformativo'>
                                                O quanto os agentes irão mudar em cada nascimento?
                                            </span>
                                        </p>
                                    </div>
                                </>
                        }

                    </div>
                </section>
            </main>
        </>
    )
}