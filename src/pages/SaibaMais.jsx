import './styles/saibaMais.css'
import LinoVsCanva from '../assets/linoVsCanva.png'
import LinkedinLogo from '../assets/linkedin_logo.png'
import otavio from '../assets/otavio.jpeg'
import jose from '../assets/jose.jpg'
import pedro from '../assets/pedro.jpg'
import williams from '../assets/williams.jpg'
import lino from '../assets/linoPerfil.png'

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
                    <hr className='hrCompleta' />
                </section>
                <section className='secaoSaibaMaisDireita'>
                    <img src={LinoVsCanva} alt="Ilustração do game 'Lino vs Canva', primeira versão desenvolvida." className='LinoIlustracao' />
                    <p className='paragrafoInformativo legendaImagem'>Ilustração de "Lino vs Canva" (gerada por Gemni), primeira ferramenta que parte da equipe desenvolveu voltada ao mundo de wumpus com agentes inteligentes. Acesse <a href="https://williamsdavid5.github.io/wumpus_world/">aqui</a>.
                    </p>
                </section>
            </section>
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
                <h1 className='tituloInicio'>Equipe</h1>
                {/* <p>Nossa equipe trabalhou duro para o desenvolvimento desse projeto, com o objetivo de tornar mais acessível e agradável à pessoas interessadas a observação de agentes inteligentes em campo.</p> */}
            </section>
            <section className='divisaoHorizontal divisaoCards'>
                <div className='cardPessoa'>
                    <div className='imagem'>
                        <img src={williams} alt="" />
                    </div>
                    <p className='textBold'>Williams David Duarte</p>
                    <p className='paragrafoInformativo'>UX, Direção de arte, Frontend</p>
                    <div className='auxiliarLinkedin'>
                        <a className='botaoLinkedin' href='https://www.linkedin.com/in/williamsdavid5/'>
                            <img src={LinkedinLogo} alt="" className='logoLinkedin' />
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
        </main>
    )
}