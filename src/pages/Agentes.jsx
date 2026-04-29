import './styles/agentes.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';

import LoadingPage from './LoadingPage';
import LinoDormindo from '../assets/linoDormindo.png'
import LoadingGif from '../assets/loadingGif.gif'

export default function Agentes() {

    const { criarAgente, getAgentes, excluirAgente } = useAuth();
    const { confirm } = useConfirm();

    const [carregando, setCarregando] = useState(false);
    const [carregandoLista, setCarregandoLista] = useState(false);
    const [mostrarLinoDormindo, setMostrarLinoDormindo] = useState(false);

    const [tipoAgenteSelecionado, setTipoAgenteSelerionado] = useState('');
    const [tipoIntAgenteSelecionado, setTipoIntAgenteSelecionado] = useState(0);
    const [mostrarFuncionamento, setMostrarFuncionamento] = useState(false);
    const [tipoConfigPontos, setTipoConfigPontos] = useState('simples');
    const [nomeAgente, setNomeAgente] = useState('');

    // agente logico
    const [garimpeiro, setGarimpeiro] = useState(false);
    const [explorador, setExplorador] = useState(false);
    const [coragem, setCoragem] = useState(false);
    const [odio, setOdio] = useState(false);
    const [formaDeBusca, setFormaDeBusca] = useState(1);

    //agente evloutivo
    const [populacao, setPopulacao] = useState(1);
    const [geracoes, setGeracoes] = useState(1);
    const [taxaCruzamento, setTaxaCruzamento] = useState(1);
    const [taxaMutacao, setTaxaMutacao] = useState(1);
    const [fitness, setFitness] = useState('');

    //evolutivo pontuacao
    const [passoValido, setPassoValido] = useState(0);
    const [passoInvalido, setPassoInvalido] = useState(0);
    const [tiroValido, setTiroValido] = useState(0);
    const [tiroInvalido, setTiroInvalido] = useState(0);
    const [entradaBuraco, setEntradaBuraco] = useState(0);
    const [entradaWumpus, setEntradaWumpus] = useState(0);
    const [pegouOuro, setPegouOuro] = useState(0);
    const [ouroVoltouOrigem, setOuroVoltouOrigem] = useState(0);

    //lista de agentes
    const [agentes, setAgentes] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [carregandoMais, setCarregandoMais] = useState(false);

    //para salvar agentes
    async function handleSalvarAgente() {

        if (!nomeAgente.trim()) {
            const resposta = await confirm({
                title: "Não tá esquecendo de nada?",
                message: "Cadê o nome do agente?",
                type: "alert",
                botao1: "Realmente",
            })
            return;
        }

        const resposta2 = await confirm({
            title: "Quer mesmo salvar esse agente?",
            message: "Ele ficará muito feliz por viver!",
            type: "confirm",
            botao1: "Sim",
            botao2: "Me enganei"
        })

        if (resposta2 === 'yes') {
            setCarregando(true);

            let agentData = {};

            if (tipoAgenteSelecionado === 'logico') {
                agentData = {
                    second_agent_schemas: {
                        corajoso: coragem,
                        explorador: explorador,
                        cacador: odio,
                        garimpeiro: garimpeiro,
                        forma_de_busca: formaDeBusca
                    }
                };
            } else if (tipoAgenteSelecionado === 'evolutivo') {
                if (tipoConfigPontos === 'simples') {
                    const fitnessEquation = `((PV * ${passoValido}) + (PI * ${passoInvalido}) + (TI * ${tiroInvalido}) + (TV * ${tiroValido}) + (SW * ${entradaWumpus}) + (SP * ${entradaBuraco}) + (SO * ${pegouOuro}) + (V * ${ouroVoltouOrigem}))`;

                    agentData = {
                        third_agent_schemas: {
                            populacao: populacao,
                            geracoes: geracoes,
                            taxa_de_cruzamento: taxaCruzamento,
                            taxa_de_mutacao: taxaMutacao,
                            fitness: fitnessEquation
                        }
                    };
                } else {
                    agentData = {
                        third_agent_schemas: {
                            populacao: populacao,
                            geracoes: geracoes,
                            taxa_de_cruzamento: taxaCruzamento,
                            taxa_de_mutacao: taxaMutacao,
                            fitness: fitness
                        }
                    };
                }
            }

            try {
                const resultado = await criarAgente(tipoIntAgenteSelecionado, nomeAgente, agentData);
                await carregarAgentes();
                console.log('Resultado:', resultado);
            } catch (error) {
                const resposta2 = await confirm({
                    title: "Ah não",
                    message: "Alguma coisa deu errado ao salvar o seu agente",
                    type: "alert",
                    botao1: "Vou tentar de novo",
                })
            }

            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarAgentes();
    }, []);

    async function carregarAgentes(reset = true) {
        if (reset) {
            setCarregandoLista(true);
            setPaginaAtual(1);
        } else {
            setCarregandoMais(true);
        }

        const data = await getAgentes(reset ? 1 : paginaAtual + 1, 5);

        if (reset) {
            setAgentes(data.agentes);
            setPaginaAtual(1);
        } else {
            setAgentes(prev => [...prev, ...data.agentes]);
            setPaginaAtual(prev => prev + 1);
        }

        setHasMore(data.hasMore);

        if (reset) {
            setCarregandoLista(false);
        } else {
            setCarregandoMais(false);
        }
    }

    async function handleCarregarMais() {
        if (!hasMore || carregandoMais) return;
        await carregarAgentes(false);
    }

    async function handleExcluirAgente(agentId, agentName) {

        const resposta = await confirm({
            title: "Quer mesmo excluir esse agente?",
            message: "Ele só quer viver 😭😭",
            type: "confirm",
            botao1: "Sim, eu sou mal",
            botao2: "Tadinho 🥺"
        })

        if (resposta === "no") {
            return;
        }

        if (resposta === "yes") {
            setCarregandoLista(true);

            const sucesso = await excluirAgente(agentId);

            if (sucesso) {
                await carregarAgentes();
            } else {
                const resposta2 = await confirm({
                    title: "Putz",
                    message: "Infelizmente o seu agente não pôde ser excluído...",
                    type: "alert",
                    botao1: "Maldito programador backend",
                })
            }

            setCarregandoLista(false);
        }
    }

    useEffect(() => {
        if (!carregandoLista) {
            setMostrarLinoDormindo(false);
            return;
        }

        const timer = setTimeout(() => {
            setMostrarLinoDormindo(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, [carregandoLista]);

    return (
        <>
            <main className="mundosMain agentesMain">
                <aside className="mundosLista esquerdaAgentes">
                    <div className='topoAgentes'>
                        <h1>Agentes</h1>
                        <p className='paragrafoInformativo'>Todos os agentes que você criou e salvou. Clique em um para editar as configurações.</p>
                    </div>
                    <div className='divListaMundos'>
                        {agentes.length === 0 && !carregandoLista ? (
                            <p className='paragrafoInformativo' style={{ textAlign: 'center', padding: '20px' }}>
                                Nenhum agente salvo ainda. Crie seu primeiro agente!
                            </p>
                        ) : (
                            agentes.map((agente) => (
                                <div key={agente.id} className='itemListaMundos itemListaAgentesCustomizados'>
                                    <div className='esquerda'>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <h2>{agente.nome}</h2>
                                            <p><span className='destaqueGold'>ID: {agente.id}</span></p>
                                        </div>
                                        <p className={agente.tipo === 2 ? 'destaqueRed' : 'destaqueGold'}>
                                            Agente {agente.tipo === 2 ? 'Lógico' : 'Evolutivo'}
                                        </p>
                                        <p className='paragrafoInformativo'>
                                            <b>Criado em: </b> {new Date(agente.data).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className='direita'>
                                        <button
                                            className='botaoExcluir'
                                            onClick={() => handleExcluirAgente(agente.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {carregandoLista &&
                            <div className='loadingPequeno'>
                                <img src={LoadingGif} alt="" />
                                <p className='paragrafoInformativo'>Se demorar, provavelmente a API está dormindo...</p>

                                {mostrarLinoDormindo && (
                                    <img src={LinoDormindo} alt="" className='fade-in linoDormindoImg' />
                                )}
                            </div>
                        }

                        {hasMore && !carregandoLista && (
                            <div className='loadingPequeno'>
                                {carregandoMais ?
                                    <>
                                        <img src={LoadingGif}></img>
                                    </>
                                    :
                                    <>
                                        <button
                                            style={{ padding: '10px' }}
                                            onClick={handleCarregarMais}
                                            disabled={carregandoMais}
                                        >
                                            Carregando
                                        </button>
                                    </>
                                }
                            </div>
                        )}
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
                            <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'logico' ? 'blocoTipoSelecionado' : ''}`}
                                onClick={() => {
                                    setTipoAgenteSelerionado('logico');
                                    setTipoIntAgenteSelecionado(2);
                                }}>
                                <img src={LinoLogico} alt="" className={`imagemSelecaoAgente ${tipoAgenteSelecionado === 'logico' ? 'agenteTipoSelecionado' : 'agenteTipoNaoSelecionado'}`} />
                                <h3>Lógico</h3>
                                <p className='paragrafoInformativo'>
                                    Esse agente não tem sentimentos, apenas segue um conjunto de regras definidas em sua programação
                                </p>
                            </div>
                            <div className={`blocoTipoAgente ${tipoAgenteSelecionado === 'evolutivo' ? 'blocoTipoSelecionado' : ''}`}
                                onClick={() => {
                                    setTipoAgenteSelerionado('evolutivo');
                                    setTipoIntAgenteSelecionado(3);
                                }}>
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
                                    <input
                                        type="text"
                                        placeholder='Nome do agente'
                                        value={nomeAgente}
                                        onChange={(e) => setNomeAgente(e.target.value)}
                                    />
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input type="checkbox"
                                                    onChange={e => setExplorador(e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Explorador</b><br />
                                            <span className='paragrafoInformativo'>
                                                O agente irá explorar ao máximo aquele ambiente em vez de simplesmente encerrar a sua busca ao coletar um ouro.
                                            </span>
                                        </p>
                                    </div>
                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input type="checkbox"
                                                    onChange={e => setCoragem(e.target.checked)}
                                                />
                                                <span className="slider"></span>
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
                                            <label className="switch">
                                                <input type="checkbox"
                                                    onChange={e => setGarimpeiro(e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <p>
                                            <b>Garimpeiro</b><br />
                                            <span className='paragrafoInformativo'>
                                                Se ativado, o agente dá prioridade a captura do ouro. Se desativado, ele ainda fará a coleta de ouro, mas apenas se esbarrar nele por aí.
                                            </span>
                                        </p>
                                    </div>

                                    <div className='auxInterruptores'>
                                        <div className='switchAgente'>
                                            <label className="switch">
                                                <input type="checkbox"
                                                    onChange={(e) => {
                                                        setOdio(e.target.checked);
                                                    }}
                                                />
                                                <span className="slider"></span>
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
                                        <button onClick={handleSalvarAgente}>Salvar esse agente</button>
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
            {carregando &&
                <>
                    <LoadingPage></LoadingPage>
                </>
            }
        </>
    )
}