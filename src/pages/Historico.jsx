import './styles/historico.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import Buraco from '../assets/skins/buraco.png'

export default function Historico() {


    const execucoes = [
        {
            id: 1,
            numero: 56,
            data: "04/05/2026",
            agente: "Lino malucão",
            agenteId: 25,
            mundo: "espiral",
            mundoId: 17
        },
        {
            id: 2,
            numero: 72,
            data: "12/03/2026",
            agente: "Dra. Silva",
            agenteId: 42,
            mundo: "labirinto",
            mundoId: 8
        },
        {
            id: 3,
            numero: 31,
            data: "28/02/2026",
            agente: "Caçador Noturno",
            agenteId: 7,
            mundo: "deserto",
            mundoId: 23
        },
        {
            id: 4,
            numero: 89,
            data: "19/01/2026",
            agente: "Velho Lobo",
            agenteId: 53,
            mundo: "floresta negra",
            mundoId: 11
        },
        {
            id: 5,
            numero: 44,
            data: "05/04/2026",
            agente: "Águia de Fogo",
            agenteId: 38,
            mundo: "montanha sagrada",
            mundoId: 5
        },
        {
            id: 6,
            numero: 67,
            data: "22/03/2026",
            agente: "Mestre Zen",
            agenteId: 61,
            mundo: "templo antigo",
            mundoId: 14
        },
        {
            id: 7,
            numero: 93,
            data: "11/02/2026",
            agente: "Tempestade Silenciosa",
            agenteId: 19,
            mundo: "oceano profundo",
            mundoId: 31
        },
        {
            id: 8,
            numero: 12,
            data: "30/01/2026",
            agente: "Caminhante das Estrelas",
            agenteId: 73,
            mundo: "céu infinito",
            mundoId: 26
        },
        {
            id: 9,
            numero: 55,
            data: "18/04/2026",
            agente: "Guardião do Abismo",
            agenteId: 84,
            mundo: "vulcão adormecido",
            mundoId: 42
        },
        {
            id: 10,
            numero: 78,
            data: "07/05/2026",
            agente: "Sombra Veloz",
            agenteId: 13,
            mundo: "cidade perdida",
            mundoId: 9
        }
    ];

    return (
        <>
            <main className="historicoMain mundosMain">
                <aside className="mundosLista execucoesLista">
                    <div className='topoMundosSalvos'>
                        <div className='a'>
                            <h1>
                                Execuções salvas
                            </h1>
                            <p className='paragrafoInformativo'>
                                Execuções que você decidiu salvar
                            </p>
                        </div>
                        <div className='topoMundosAuxiliar'>
                        </div>
                    </div>
                    <div className='divListaMundos'>
                        {execucoes.map((execucao) => (
                            <div
                                key={execucao.id}
                                className={`itemListaMundos itemListaExecoes`}
                            >
                                <div className='esquerda'>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h2>Execução {execucao.numero}</h2>
                                        <p><span className='destaqueGold'>{execucao.data}</span></p>
                                    </div>

                                    <p className='paragrafoInformativo'><b>Agente:</b> {execucao.agente} (ID {execucao.agenteId})</p>
                                    <p className='paragrafoInformativo'><b>Mundo:</b> {execucao.mundo} (ID {execucao.mundoId})</p>
                                </div>
                                <div className='direita'>
                                    <button className='botaoExcluir'>Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <section className="direitaHistorico">
                    <div className='divDuplaHistorico'>
                        <h1>Execução 79</h1>
                        <p className='destaqueGold'>01/04/2026</p>
                    </div>
                    <div className='divRolagem'>
                        <div className='auxMesmaLinha'>
                            <div className='divDuplaHistorico agenteHistorico'>
                                {/* <p><b>Agente usado</b></p> */}
                                <div className='divAgenteHistorico'>
                                    <div className='esquerdaAgente'>
                                        <div className='auxImagemAgente'>
                                            <img src={LinoEvolutivo} alt="" />
                                        </div>
                                    </div>
                                    <div className='direitaAgente'>
                                        <p><b>Agente usado</b></p>
                                        <span className='spanMesmaLinha'>
                                            <h2>Lino das cavernas</h2>
                                            <p className='destaqueGold'>ID 23</p>
                                        </span>
                                        <span className='spanMesmaLinha'>
                                            <p className='paragrafoInformativo paragrafoInforAgente'>
                                                <b>A cada passo válido:</b> +10 pontos <br />
                                                <b>A cada passo inválido:</b> -5 pontos <br />
                                                <b>A cada tiro válido:</b> +15 pontos <br />
                                                <b>A cada tiro inválido:</b> -8 pontos <br />
                                                <b>Entrou em sala com buraco:</b> -20 pontos <br />
                                            </p>
                                            <p className='paragrafoInformativo paragrafoInforAgente'>
                                                <b>Entrou em sala com wumpus:</b> -30 pontos <br />
                                                <b>Pegou um ouro:</b> +50 pontos <br />
                                                <b>Voltou para a origem com ouro:</b> +25 pontos
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='divDuplaHistorico execucaoHistorico'>
                                {/* <p><b>Configurações de execução</b></p> */}
                                <div className='divAgenteHistorico'>
                                    <div className='esquerdaAgente'>
                                        <div className='auxImagemAgente'>
                                            <img src={Buraco} alt="" />
                                        </div>
                                    </div>
                                    <div className='direitaAgente'>
                                        <h2>Configurações de execução</h2>
                                        <p className='paragrafoInformativo paragrafoInforAgente'>
                                            <b>Sala inicial: </b> 2,3 <br />
                                            <b>Movimento diagonal: </b> desativado <br />
                                            <b>Como vencer a partida: </b> O agente só precisa de um ouro. <br />
                                            <b>Sobre o canva: </b> Eliminar todos! <br />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}