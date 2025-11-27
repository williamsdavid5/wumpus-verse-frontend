import './styles/saibaMais.css'

// imagens
// são importadas aqui para evitar erros de renderização no deploy
import LinoVsCanva from '../assets/linoVsCanva.png'
import LinkedinLogo from '../assets/linkedin_logo.png'
import gitlogo from '../assets/gitLogo.png'
import otavio from '../assets/otavio.jpeg'
import jose from '../assets/jose.jpg'
import pedro from '../assets/pedro.jpg'
import williams from '../assets/williams.jpg'
import lino from '../assets/linoPerfil.png'
import loopInfinito from '../assets/loopInfinito.png'
import julgamento from '../assets/julgamentoAgente.png'
import logo from '../assets/wumpus_verse_logo_white.svg'

export default function SaibaMais() {
    return (
        <main className="mainSaibaMais">
            <section className='divisaoHorizontal'>
                <section className="secaoSaibaMais">
                    <h1 className='tituloInicio'>Sobre o Mundo de Wumpus</h1>
                    <p className='pargrafoNormalJustificado'>
                        O Mundo de Wumpus é um ambiente clássico de inteligência artificial usado para testar agentes autônomos em situações onde é necessário agir com base em informações incompletas. Ele consiste em um mapa dividido em células, onde um agente deve explorar esse ambiente, coletar ouro, evitar perigos e decidir qual ação tomar a cada passo.
                        <br />
                        Nesse mundo, o agente enfrenta riscos como:
                    </p>

                    <ul>
                        <li>O Wumpus, um monstro mortal escondido em alguma célula.</li>
                        <li>Poços, que fazem o agente cair e perder o jogo.</li>
                        <li>Brisas e Fedores, que não mostram o perigo diretamente, mas indicam que ele está próximo.</li>
                    </ul>

                    <p className='pargrafoNormalJustificado'>
                        O agente nunca vê os perigos diretamente. Ele recebe apenas pistas sensoriais e deve usá-las para raciocinar, inferir e tomar decisões, como mover-se, pegar o ouro ou atirar uma flecha contra o Wumpus.
                    </p>

                    <hr className='hrCompleta' />

                    <p className='pargrafoNormalJustificado'>
                        O Mundo de Wumpus é amplamente usado para pesquisa e ensino porque exige inteligência real, não apenas tentativa e erro. Para vencer, o agente precisa:
                    </p>

                    <ul>
                        <li>Interpretar sinais e deduzir o que não é visível</li>
                        <li>Planejar ações com consequências futuras</li>
                        <li>Lidar com incertezas e riscos</li>
                        <li>Construir conhecimento sobre o ambiente passo a passo</li>
                    </ul>

                    <p className='pargrafoNormalJustificado'>
                        Isso o torna ideal para treinar e avaliar agentes em áreas como:
                    </p>

                    <ul>
                        <li>Técnicas de busca e planejamento</li>
                        <li>Raciocínio lógico</li>
                        <li>Sistemas baseados em regras</li>
                        <li>Aprendizado de máquina e tomadas de decisão sob incerteza</li>
                    </ul>
                    {/* <hr className='hrCompleta' /> */}
                </section>
                <section className='secaoSaibaMaisDireita'>
                    <img src={LinoVsCanva} alt="Ilustração do game 'Lino vs Canva', primeira versão desenvolvida." className='LinoIlustracao' />
                    <p className='paragrafoInformativo legendaImagem'>Ilustração de "Lino vs Canva" (gerada por Gemni), primeira ferramenta que parte da equipe desenvolveu voltada ao mundo de wumpus com agentes inteligentes. Acesse <a href="https://williamsdavid5.github.io/wumpus_world/">aqui</a>.
                    </p>
                </section>
            </section>
            <hr className='hrCompleta' />
            <section className='divisaoHorizontal'>
                <section className='secaoSaibaMais'>
                    <h1 className='tituloInicio'>Sobre agentes inteligentes</h1>
                    <p className='pargrafoNormalJustificado'>
                        Agentes inteligentes são entidades capazes de perceber um ambiente, tomar decisões e agir para alcançar objetivos, muitas vezes sem intervenção humana direta. Eles utilizam informações recebidas por sensores (ou dados de entrada) e, a partir disso, escolhem ações que maximizam seus resultados, seja obtendo recompensas, evitando riscos ou concluindo tarefas específicas.

                        Um agente é considerado “inteligente” quando suas ações não se limitam a comandos pré-definidos, mas envolvem:
                    </p>
                    <ul>
                        <li>Interpretação do ambiente</li>
                        <li>Análise de consequências futuras</li>
                        <li>Adaptação frente a mudanças</li>
                        <li>Aprendizado com experiências</li>
                        <li>Planejamento para alcançar objetivos</li>
                    </ul>
                    <p className='pargrafoNormalJustificado'>Agentes inteligentes são aplicados em diversas áreas porque permitem automatizar tomadas de decisão complexas, especialmente em ambientes dinâmicos e imprevisíveis. Eles podem:</p>
                    <ul>
                        <li>Controlar e monitorar sistemas físicos (Carros autônomos, robôs industriais, drones, etc.)</li>
                        <li>Tomar decisões estratégicas (Controle de estoque, Planejamento de rotas)</li>
                        <li>Interagir com usuários (Como assistentes virtuais ou sistemas de recomendação)</li>
                        <li>Atuar em simulações e jogos (NPCs inteligentes)</li>
                    </ul>
                    <p className='pargrafoNormalJustificado'>Ao contrário de sistemas tradicionais, que executam comandos fixos, agentes inteligentes são capazes de responder a imprevistos, generalizar conhecimentos, tomar decisões com base em objetivos, aprender e melhorar com o tempo. <br /><br />
                        Isso os torna essenciais em cenários onde não é possível prever todas as situações, como tráfego, mercado financeiro, monitoramento ambiental, robótica e exploração de ambientes desconhecidos, exatamente o tipo de desafio que o Mundo de Wumpus representa.
                    </p>
                </section>
                <section className='secaoSaibaMaisDireita'>
                    <img src="https://d37iydjzbdkvr9.cloudfront.net/lista10/lista_robos-domesticos-que-ajudam-a-cuidar-da-casa/sgrd_2_3_r650explorebehaviorlowres.jpg" alt="Robô aspirador" className='roboAspirador LinoIlustracao' />
                    <p className='paragrafoInformativo legendaImagem'>
                        Um robô aspirador de pó é um exemplo clássico de agente inteligente visível.
                    </p>
                </section>
            </section>
            <hr className='hrCompleta' />
            <section className='divisaoHorizontal'>
                <section className='secaoSaibaMais'>
                    <h1 className='tituloInicio'>Sobre a nossa ferramenta</h1>
                    <p className='pargrafoNormalJustificado'>
                        Nosso objetivo com este projeto é oferecer ao usuário a liberdade de criar, testar e visualizar agentes inteligentes atuando no Mundo de Wumpus, explorando diferentes arquiteturas e estratégias de resolução de problemas. Embora o foco da plataforma seja esse ambiente clássico, ele funciona apenas como laboratório de experimentação, permitindo observar o comportamento dos agentes em situações reais de tomada de decisão sob incerteza.
                        <br /><br />
                        Ao compreender e aplicar as arquiteturas apresentadas aqui, o usuário estará desenvolvendo habilidades que podem ser utilizadas em uma ampla gama de aplicações da vida real, desde sistemas de recomendação e automação até robótica, logística e aprendizado de máquina. Nosso objetivo é que esta ferramenta seja um ponto de partida acessível e poderoso para qualquer pessoa interessada no desenvolvimento de agentes inteligentes.
                        <br /><br />
                        Aqui, o usuário poderá criar seu próprio Mundo de Wumpus, personalizando o ambiente e explorando diferentes formas de testar agentes inteligentes. Além disso, será possível escolher entre diversas arquiteturas de agentes, cada uma com suas características e estratégias de tomada de decisão. São esses:
                    </p>
                    <h2>Agentes Reativos Simples</h2>
                    <p className="pargrafoNormalJustificado">
                        Esse tipo de agente escolhe ações <strong>com base apenas na percepção atual</strong>, sem levar em conta o passado ou consequências futuras. Ele funciona como um “reflexo programado”: recebe uma entrada e executa a ação associada a ela (geralmente armazenada em uma tabela de regras). Apesar de simples, pode entrar em comportamentos repetitivos (como ciclos infinitos), podendo ser corrigido com ações aleatórias em situações de impasse.
                    </p>
                    <p className="pargrafoNormalJustificado"><strong>Características principais:</strong></p>
                    <ul>
                        <li>Age com base apenas nas <strong>percepções imediatas</strong></li>
                    </ul>
                    {/* <hr></hr> */}
                    <h2>Agentes Reativos Baseados em Modelo</h2>
                    <p className="pargrafoNormalJustificado">
                        Seu funcionamento é semelhante ao reativo simples, mas agora o agente <strong>mantém uma representação interna do ambiente</strong>. Em outras palavras, ele “se lembra” de percepções anteriores e usa esse conhecimento para inferir o que não é diretamente visível. Isso reduz a dependência de aleatoriedade e permite decisões mais inteligentes em ambientes parcialmente observáveis, como o Mundo de Wumpus.
                    </p>
                    <p className="pargrafoNormalJustificado"><strong>Características principais:</strong></p>
                    <ul>
                        <li>Usa percepções atuais <strong>e memória das passadas</strong></li>
                        <li>Possui uma noção de como o mundo funciona (modelo de transição)</li>
                    </ul>
                    {/* <hr></hr> */}
                    <h2>Agentes Baseados em Objetivo</h2>
                    <p className="pargrafoNormalJustificado">
                        Quando há diversas ações possíveis, o agente precisa escolher qual delas o aproxima mais de um resultado desejado. O agente baseado em objetivo compara alternativas e <strong>planeja ações pensando nas consequências futuras</strong>, ao contrário dos reativos, que agem apenas de forma imediata. Ele pode calcular sequências de ações que maximizam a chance de alcançar o objetivo.
                    </p>
                    <p className="pargrafoNormalJustificado"><strong>Características principais:</strong></p>
                    <ul>
                        <li>Usa percepções + memória + <strong>um objetivo definido</strong></li>
                        <li>Avalia várias ações e planeja suas consequências futuras</li>
                    </ul>
                    {/* <hr></hr> */}
                    <h2>Agentes Baseados em Utilidade</h2>
                    <p className="pargrafoNormalJustificado">
                        Nem sempre basta alcançar um objetivo: algumas soluções podem ser <strong>mais eficientes, seguras ou vantajosas que outras</strong>. Esse agente usa uma <strong>função de utilidade</strong> para medir o “quão boa” é cada ação ou estado, escolhendo a alternativa com maior benefício. Assim, ele não apenas atinge o objetivo, mas busca a <strong>melhor forma de alcançá-lo.</strong>
                    </p>
                    <p className="pargrafoNormalJustificado"><strong>Características principais:</strong></p>
                    <ul>
                        <li>Usa percepções, memória, objetivos <strong>e uma medida de utilidade/eficiência</strong></li>
                        <li>Busca maximizar o ganho, e não só chegar ao objetivo</li>
                    </ul>
                </section>
                <section className='secaoSaibaMaisDireita'>
                    <img src={loopInfinito} alt="Representação da movimentação do agente" className='movimentacaoAgenteAntigoImagem LinoIlustracao' />
                    <p className='paragrafoInformativo legendaImagem'>
                        Representação da movimentação do agente reativo baseado em modelo na antiga vesão desenvolvida desse game (Lino vs Canva). Essa ilustração mostra como esse agente pode desviar de obstáculos conhecidos, mas não impede que ele caia em loop infinito.
                    </p>
                    <img src={julgamento} alt="Representação do julgamento do agente" className='movimentacaoAgenteAntigoImagem LinoIlustracao imagemDupla' />
                    <p className='paragrafoInformativo legendaImagem'>
                        Representação do julgamento do agente baseado na percepção, também em Lino vs Canva. O agente era capaz de definir salas suspeitas na memória se baseando nas perpeções que ele se lembrava.
                    </p>
                </section>
            </section>
            <hr className='hrCompleta' />
            <section className='divisaoHorizontal divisaoSobreNos'>
                <h1 className='tituloInicio'>Sobre a nossa equipe</h1>
                <p className="pargrafoNormalJustificado">Somos estudantes de Engenharia de Computação da Universidade Federal do Pará — Campus Tucuruí. A ideia deste projeto surgiu no início de 2025, durante a disciplina Inteligência Computacional, cujo objetivo era compreender como agentes inteligentes funcionam internamente, ainda de maneira simplificada. O principal desafio da matéria era desenvolver agentes inteligentes (baseados nas arquiteturas descritas nesta plataforma) capazes de percorrer o Mundo de Wumpus e avaliar seu desempenho nessas interações.
                    <br /><br />
                    Durante o processo, surgiu uma pergunta: <br />
                    e se qualquer pessoa pudesse criar, testar e comparar seus próprios agentes inteligentes de forma simples?
                    <br /><br />
                    A partir disso, decidimos transformar o desafio acadêmico em uma ferramenta aberta para outros estudantes, curiosos e apaixonados por IA.
                    <br /><br />
                    Sabemos que ainda estamos entregando uma versão limitada em relação ao que planejamos, mas ela foi projetada com foco em escalabilidade e futuras melhorias, permitindo que, ao longo do tempo, possamos adicionar mais liberdade de customização e novas funcionalidades para criação e análise de agentes.
                    <br />
                    Todos os integrantes da equipe contribuem ativamente no desenvolvimento, especialmente nosso professor orientador, que incentivou a ideia desde o início, e Lino, nosso mascote corajoso, o único disposto a explorar cavernas escuras, procurar ouro e enfrentar o temível Wumpus (não se preocupe, ele foi o primeiro voluntário!).</p>
            </section>
            <section className='divisaoHorizontal divisaoCards'>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={williams} alt="" />
                    </div>
                    <p className='textBold'>Williams David Duarte</p>
                    <p className='paragrafoInformativo'>UX, Designer, Frontend</p>
                    <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/williamsdavid5/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
                        </a>
                        <a href="https://github.com/williamsdavid5" className='botaoLinkedin'>
                            <img src={gitlogo} alt="" className='logoLinkedin' />
                        </a>
                    </div>

                </div>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={pedro} alt="" />
                    </div>
                    <p className='textBold'>Pedro Pablo Valente Barroso</p>
                    {/* <p>Engenharia de computação - UFPA</p> */}
                    {/* <p>Universidade Federal do Pará</p> */}
                    <p className='paragrafoInformativo'>API, Banco de dados</p>
                    <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/pedro-pablo-430656359/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
                        </a>
                        <a href="https://github.com/Pedropablo087" className='botaoLinkedin'>
                            <img src={gitlogo} alt="" className='logoLinkedin' />
                        </a>
                    </div>
                </div>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={jose} alt="" />
                    </div>
                    <p className='textBold'>José Raimundo Maciel</p>
                    {/* <p>Engenharia de computação - UFPA</p> */}
                    {/* <p>Universidade Federal do Pará</p> */}
                    <p className='paragrafoInformativo'>IA de agentes, Integração geral</p>
                    <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/jose-maciel-developer/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
                        </a>
                        <a href="https://github.com/Johsep06" className='botaoLinkedin'>
                            <img src={gitlogo} alt="" className='logoLinkedin' />
                        </a>
                    </div>
                </div>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={otavio} alt="" />
                    </div>
                    <p className='textBold'>Dr. Otávio Noura Teixeira</p>
                    <p className='paragrafoInformativo'>Docente Orientador</p>
                    <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/onoura/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
                        </a>
                    </div>
                </div>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={lino} alt="" />
                    </div>
                    <p className='textBold'>Lino Duarte</p>
                    <p className='paragrafoInformativo'>Exterminador de wumpus, Mascote</p>
                    {/* <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/onoura/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
                        </a>
                    </div> */}
                </div>
            </section>
            <hr className='hrCompleta' />
            <section className='divisaoHorizontal divisaoCards'>
                <img src={logo} alt="" className='logo' />
            </section>
        </main>
    )
}