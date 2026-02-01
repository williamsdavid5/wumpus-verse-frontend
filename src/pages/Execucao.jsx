import { useEffect, useState } from "react"
import { useExecution } from "../contexts/ExecutionContext";
import { useAuth } from '../contexts/AuthContext';
import './styles/execucao.css'
import Minimapa from "./Minimapa";

export default function Execucao() {
    const { iniciarPartida } = useAuth();

    const [mundoSelecionado, setMundoSelecionado] = useState(-1);
    const [ativarDiagonal, setAtivarDiagonal] = useState(false);
    const [agenteSelecionado, setAgenteSelecionado] = useState(-1);
    const [salaSelecionada, setSalaSelecionada] = useState([]);
    const [partida, setPartida] = useState([]);
    const [passosExecucao, setPassosExecucao] = useState([]);
    const [mapaEstrutura, setMapaEstrutura] = useState(null);
    const [infoMundo, setInfoMundo] = useState(null);
    const [salaInvalida, setSalaInvalida] = useState(false);
    const [modoEditarSala, setModoEditarSala] = useState(false);
    const [executandoAnimacao, setExecutandoAnimacao] = useState(false);

    const podeIniciar =
        mundoSelecionado &&
        mundoSelecionado !== -1 &&
        salaSelecionada.length > 0 &&
        !salaInvalida &&
        passosExecucao.length === 0;

    const { executionConfig } = useExecution();

    useEffect(() => {
        if (!executionConfig) return;
        setAgenteSelecionado(executionConfig.agenteSelecionado);
        setAtivarDiagonal(executionConfig.ativarDiagonal);
        setMundoSelecionado(executionConfig.mundoSelecionado);
        setSalaSelecionada(executionConfig.salaSelecionada);
    }, [executionConfig]);

    async function iniciar() {
        if (!mundoSelecionado || mundoSelecionado === -1) {
            alert('Selecione um mundo primeiro!');
            return;
        }

        if (salaSelecionada.length === 0) {
            alert('Selecione uma sala inicial!');
            return;
        }

        if (salaInvalida) {
            alert('A sala selecionada é inválida!');
            return;
        }

        try {
            setExecutandoAnimacao(false);

            const partidaIniciada = await iniciarPartida(
                mundoSelecionado,
                ativarDiagonal,
                {
                    id: 0,
                    type: agenteSelecionado,
                    position_x: salaSelecionada[0],
                    position_y: salaSelecionada[1]
                }
            );

            console.log('Partida iniciada:', partidaIniciada);
            setPartida(partidaIniciada);
            setPassosExecucao(partidaIniciada);
            setExecutandoAnimacao(true);

            if (partidaIniciada) {
                alert('Partida iniciada com sucesso! A animação começará automaticamente.');
                setModoEditarSala(false);
            }
        } catch (err) {
            console.log("Erro ao iniciar partida: ", err);
            alert('Erro ao iniciar partida: ' + (err.message || 'Verifique os dados'));
        }
    }

    function handleSalaSelecionada(novaSala, invalida, desativarEdicao = false) {
        setSalaSelecionada(novaSala);
        setSalaInvalida(invalida);

        if (!invalida && novaSala.length > 0 && desativarEdicao) {
            setModoEditarSala(false);
        }
    }

    function pararAnimacao() {
        setExecutandoAnimacao(false);
    }

    return (
        <>
            <main className="execucaoMain">
                <section className="secaoMapaExecucao">
                    {mundoSelecionado && mundoSelecionado !== -1 ? (
                        <>
                            {/* <div className="infoMundo">
                                <h3>Execução em Tempo Real</h3>
                                {passosExecucao.length > 0 && (
                                    <div className="infoExecucaoResumo">
                                        <p>
                                            <b>Total de passos:</b> {passosExecucao.length}<br />
                                            <b>Passo atual:</b> {passosExecucao[0] ? '1' : '0'} de {passosExecucao.length}<br />
                                            <b>Status:</b> {executandoAnimacao ? '▶️ Em execução' : '⏸️ Pausado'}
                                        </p>
                                    </div>
                                )}
                            </div> */}

                            <Minimapa
                                mundoId={mundoSelecionado}
                                salaInicial={salaSelecionada}
                                onSalaSelecionada={handleSalaSelecionada}
                                modoEdicao={modoEditarSala}
                                passosExecucao={passosExecucao} // Passar os passos para o Minimapa
                            />

                            {/* <div className="statusSala">
                                {salaSelecionada.length > 0 ? (
                                    <div className={`infoSala ${salaInvalida ? 'invalida' : 'valida'}`}>
                                        <h4>Sala Inicial Selecionada</h4>
                                        <p>
                                            <b>Coordenadas:</b> ({salaSelecionada[0]}, {salaSelecionada[1]})<br />
                                            <b>Status:</b> {salaInvalida ? '❌ Inválida' : '✅ Válida'}<br />
                                            {passosExecucao.length > 0 && (
                                                <>
                                                    <b>Execução:</b> {passosExecucao.length} passos carregados
                                                </>
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="infoSala">
                                        <h4>Sala Inicial</h4>
                                        <p>Nenhuma sala selecionada. {modoEditarSala ? 'Clique no mapa para selecionar.' : 'Ative o modo edição para selecionar.'}</p>
                                    </div>
                                )}
                            </div> */}
                        </>
                    ) : (
                        <div className="semMundo">
                            <p>Nenhum mundo selecionado para execução.</p>
                            <p>Volte à página anterior e selecione um mundo.</p>
                        </div>
                    )}
                </section>
                <aside className="configsExecucao">
                    <div className="divControle">
                        <h2>Controle de Execução</h2>
                        <p>
                            Configure a execução e observe o agente caminhando pelo ambiente.
                        </p>
                    </div>
                    <label htmlFor="" className="checkMovimento">
                        <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={(e) => { setAtivarDiagonal(e.target.checked) }}
                            checked={ativarDiagonal}
                            disabled={passosExecucao.length > 0}
                        />
                        Ativar movimento diagonal
                    </label>

                    <div className="divControle">
                        <p><b>Agente:</b> Tipo {agenteSelecionado}</p>
                        <p><b>Mundo:</b> ID {mundoSelecionado}</p>
                        <p className={salaSelecionada.length > 0 ? 'valido' : 'invalido'}>
                            <b>Sala inicial:</b> {
                                salaSelecionada.length > 0
                                    ? `(${salaSelecionada[0]}, ${salaSelecionada[1]})`
                                    : 'Não definida'
                            }
                        </p>
                    </div>

                    <div className="divControle">
                        <div className="botoesExecucaoo">
                            <button
                                className={`botaoEditarSala ${modoEditarSala ? 'ativo' : ''}`}
                                onClick={() => setModoEditarSala(!modoEditarSala)}
                                disabled={passosExecucao.length > 0}
                            >
                                {modoEditarSala ? 'Cancelar Edição' : 'Alterar Sala Inicial'}
                            </button>
                            {podeIniciar && (
                                <button
                                    className="botaoIniciar"
                                    onClick={iniciar}
                                >
                                    Iniciar Execução
                                </button>
                            )}
                            {passosExecucao.length > 0 && (

                                <button
                                    className="botaoNovaExecucao"
                                    onClick={() => {
                                        setPassosExecucao([]);
                                        setPartida([]);
                                        setExecutandoAnimacao(false);
                                    }}
                                >
                                    Nova Execução
                                </button>

                            )}
                        </div>

                    </div>


                    {/* {partida && partida.length > 0 && (
                        <div className="divControles">
                            <h3>Detalhes da Execução</h3>
                            <p><b>Total de passos:</b> {partida.length}</p>
                            <p><b>Primeiro passo:</b>
                                {partida[0] && ` Posição (${partida[0].posicao_x}, ${partida[0].posicao_y}), Ação: ${partida[0].acao}`}
                            </p>
                            <p><b>Último passo:</b>
                                {partida[partida.length - 1] && ` Posição (${partida[partida.length - 1].posicao_x}, ${partida[partida.length - 1].posicao_y})`}
                            </p>

                            <div className="listaPassos">
                                <h4>Últimos 5 passos:</h4>
                                {partida.slice(-5).map((passo, index) => (
                                    <div key={index} className="passoItem">
                                        <span>Passo {partida.indexOf(passo) + 1}:</span>
                                        <span>Posição ({passo.posicao_x}, {passo.posicao_y})</span>
                                        <span>Ação: {passo.acao}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </aside>
            </main>
        </>
    )
}