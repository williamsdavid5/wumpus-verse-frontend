import { useEffect, useState } from "react"
import { useExecution } from "../contexts/ExecutionContext";
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../contexts/ConfirmContext';
import './styles/execucao.css'
import Minimapa from "./Minimapa";
import LoadingPage from './LoadingPage';

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
    const [carregando, setCarregando] = useState(false);
    const { confirm } = useConfirm();

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
            setCarregando(true);

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
                // alert('Partida baixada, execute!');
                setModoEditarSala(false);
            }
        } catch (err) {
            console.log("Erro ao iniciar partida: ", err);
            // alert('Erro ao iniciar partida: ' + (err.message || 'Verifique os dados'));
        } finally {
            setCarregando(false);
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
                            <Minimapa
                                mundoId={mundoSelecionado}
                                salaInicial={salaSelecionada}
                                onSalaSelecionada={handleSalaSelecionada}
                                modoEdicao={modoEditarSala}
                                passosExecucao={passosExecucao}
                            />
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
                            Configure a execução e observe o agente caminhando pelo ambiente. O agente vence o jogo se conseguir coletar um ouro e voltar para a sala inical.
                        </p>
                    </div>
                    <div className="divControle reconfigurar">
                        <p className="paragrafoInformativo">
                            Reconfigure a execução atual. Você pode ativar ou desativar o movimento diagonal, assim como alterar a sala inicial, para alterar o mundo ou o agente utilizado, você precisa voltar para a tela anterior.
                        </p>
                        <div className="reconfiguracoes">
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
                            <button
                                className={`botaoEditarSala ${modoEditarSala ? 'ativo' : ''}`}
                                onClick={() => setModoEditarSala(!modoEditarSala)}
                                disabled={passosExecucao.length > 0}
                            >
                                {modoEditarSala ? 'Cancelar Edição' : 'Alterar Sala Inicial'}
                            </button>
                            <p>Sala atual: ({salaSelecionada[0]},{salaSelecionada[1]})</p>
                        </div>
                    </div>
                    {/* <div className="divControle">
                        <p><b>Agente:</b> {agenteSelecionado}</p>
                        <p><b>Mundo:</b> ID {mundoSelecionado}</p>
                        <p className={salaSelecionada.length > 0 ? 'valido' : 'invalido'}>
                            <b>Sala inicial:</b> {
                                salaSelecionada.length > 0
                                    ? `(${salaSelecionada[0]}, ${salaSelecionada[1]})`
                                    : 'Não definida'
                            }
                        </p>
                    </div> */}

                    <div className="divControle">
                        <div className="botoesExecucaoo">
                            {podeIniciar && (
                                <>
                                    <button
                                        className="botaoIniciar"
                                        onClick={iniciar}
                                    >
                                        Baixar uma partida
                                    </button>
                                </>
                            )}
                            {passosExecucao.length > 0 && (
                                <>
                                    <p style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Partida baixada! Mas se preferir: </p><br />
                                    <button
                                        className="botaoNovaExecucao"
                                        onClick={() => {
                                            setPassosExecucao([]);
                                            setPartida([]);
                                            setExecutandoAnimacao(false);

                                        }}
                                    >
                                        Baixar Nova partida
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </aside>
            </main>
            {carregando && <LoadingPage></LoadingPage>}
        </>
    )
}