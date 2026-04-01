import './styles/agentes.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import { useState } from 'react'

export default function Agentes() {

    const [tipoAgenteSelecionado, setTipoAgenteSelerionado] = useState('');
    const [mostrarFuncionamento, setMostrarFuncionamento] = useState(false);
    const [tipoConfigPontos, setTipoConfigPontos] = useState('simples');

    const agentes = [
        {
            id: 23,
            nome: "Lino maluco",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "02/03/2026"
        },
        {
            id: 25,
            nome: "R2DLino",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "07/03/2026"
        },
        {
            id: 31,
            nome: "Lino Caçador",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "15/03/2026"
        },
        {
            id: 42,
            nome: "Lino das Sombras",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "21/03/2026"
        },
        {
            id: 18,
            nome: "Lino Veloz",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "28/03/2026"
        },
        {
            id: 37,
            nome: "Lino Estrategista",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "05/04/2026"
        },
        {
            id: 52,
            nome: "Lino Explosivo",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "12/04/2026"
        },
        {
            id: 44,
            nome: "Lino Silencioso",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "18/04/2026"
        },
        {
            id: 61,
            nome: "Lino Mestre",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "25/04/2026"
        },
        {
            id: 29,
            nome: "Lino Caótico",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "30/04/2026"
        },
        {
            id: 73,
            nome: "Lino Implacável",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "07/05/2026"
        },
        {
            id: 56,
            nome: "Lino Analítico",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "14/05/2026"
        },
        {
            id: 84,
            nome: "Lino Supremo",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "21/05/2026"
        },
        {
            id: 68,
            nome: "Lino Metódico",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "28/05/2026"
        },
        {
            id: 92,
            nome: "Lino Destemido",
            tipo: "evolutivo",
            tipoClass: "destaqueGold",
            dataCriacao: "03/06/2026"
        },
        {
            id: 47,
            nome: "Lino Preciso",
            tipo: "lógico",
            tipoClass: "destaqueRed",
            dataCriacao: "10/06/2026"
        }
    ];

    return (
        <>
            <main className="mundosMain agentesMain">
                <aside className="mundosLista esquerdaAgentes">
                    <div className='topoAgentes'>
                        <h1>Agentes</h1>
                        <p className='paragrafoInformativo'>Todos os agentes que você criou e salvou. Clique em um para editar as configurações.</p>
                    </div>
                    <div className='divListaMundos'>

                        {agentes.map((agente) => (
                            <div key={agente.id} className='itemListaMundos itemListaAgentesCustomizados'>
                                <div className='esquerda'>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h2>{agente.nome}</h2>
                                        <p><span className='destaqueGold'>ID: {agente.id}</span></p>
                                    </div>
                                    <p className={agente.tipoClass}>Agente {agente.tipo}</p>
                                    <p className='paragrafoInformativo'><b>Criado em: </b> {agente.dataCriacao}</p>
                                </div>
                                <div className='direita'>
                                    <button className='botaoExcluir'>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}


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
                                    Esse agente não tem sentimentos, apenas segue um conjunto de regras definidas em sua programação
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
                                <p>Escolha um dos seus agentes para editar</p>
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
                                // -----------------------------------------------------------------------
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
                                    <p className='paragrafoInformativo'>
                                        Se você realmente leu e sabe como funciona (eu vou confiar em você), então deve ter percebido o quanto a pontuação é importante! A pontuação define o nível de <span className='destaqueGold'>premiação</span> ou <span className='destaqueRed'>punição</span> para cada ação daquele agente. É muito importante que isso seja bem definido para que o agente evolua corretamente para se comportar da maneira que você quer! Então, <b>esteja atento às pontuações</b> que você vai atribuir.
                                    </p>
                                    <br />
                                    <h2>Geração</h2>
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
                                        <input type="number" min={0} max={100} placeholder='0 a 100' />
                                        <p>Taxa de mutação (%) <br />
                                            <span className='paragrafoInformativo'>
                                                O quanto os agentes irão mudar em cada nascimento?
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxiliarCongifAgentesEvolutivos'>
                                        <input type="number" min={0} max={100} placeholder='0 a 100' />
                                        <p>Taxa de cruzamento (%) <br />
                                            <span className='paragrafoInformativo'>
                                                Define quantos indivíduos irão cruzar 😏 (Note: a prioridade é dada aos indivíduos com pontuações maiores)
                                            </span>
                                        </p>
                                    </div>
                                    <hr />
                                    <h2>Pontuação</h2>
                                    <p>Podem ser <span className='destaqueGold'>positivas para premiação</span> ou <span className='destaqueRed'>negativas para punição</span>, os valores definem a intensidade.</p>
                                    <span>
                                        Tipo:
                                        <select name="tipoDeConfigAgenteEvolutivo" id=""
                                            className='selectTipoConfiAgenteEvolutivo'
                                            onChange={(e) => setTipoConfigPontos(e.target.value)}
                                        >
                                            <option value="simples">
                                                Configuração simples
                                            </option>
                                            <option value="equacao">
                                                Equação fitness (avançado)
                                            </option>
                                        </select>
                                    </span>
                                    {tipoConfigPontos === 'simples' ?
                                        <>
                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        A cada passo válido<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        A cada passo inválido<br /></p>
                                                </div>
                                            </div>
                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        A cada tiro válido<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        A cada tiro inválido<br /></p>
                                                </div>
                                            </div>
                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        Entrou em sala com buraco<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        Entrou em sala com wumpus<br /></p>
                                                </div>
                                            </div>
                                            <div className='auxPontuacoesAgenteEvolutivo'>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        Pegou um ouro<br /></p>
                                                </div>
                                                <div className='auxiliarCongifAgentesEvolutivos'>
                                                    <input type="number" min={0} max={100} />
                                                    <p>
                                                        Entrou em sala com ouro voltou para a origem<br /></p>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <hr />
                                            <h3>Equação fitness</h3>
                                            <p>Se você está aqui, imagino que saiba o que está fazendo, então escreva a sua equação abaixo</p>
                                            <input type="text" placeholder='((PV * -1) +  (PI * -100) + (TI * -100) (TV * 100) + (SW * -100) + (SP * -100) (SO * 100) + (V * 1000)) / ' />
                                        </>
                                    }
                                    <div className='divControle controlesSalvarAgente'>
                                        <button>Salvar esse agente</button>
                                        <button>Excluir</button>
                                    </div>
                                </>
                        }
                    </div>
                </section>
            </main>
        </>
    )
}