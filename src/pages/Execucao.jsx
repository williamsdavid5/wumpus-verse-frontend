import { useEffect, useState, useCallback } from "react"
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

    const baixarJSON = useCallback(() => {
        if (passosExecucao.length === 0) {
            alert('Nenhuma partida para baixar!');
            return;
        }

        const dadosPartida = {
            mundoId: mundoSelecionado,
            agente: agenteSelecionado,
            salaInicial: salaSelecionada,
            movimentoDiagonal: ativarDiagonal,
            passos: passosExecucao,
            dataGeracao: new Date().toISOString(),
            metadata: {
                totalPassos: passosExecucao.length,
                agenteTipo: `Tipo ${agenteSelecionado}`
            }
        };

        const jsonString = JSON.stringify(dadosPartida, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `partida_mundo_${mundoSelecionado}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Partida baixada com sucesso!');
    }, [passosExecucao, mundoSelecionado, agenteSelecionado, salaSelecionada, ativarDiagonal]);


    const importarJSON = useCallback(() => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                setCarregando(true);
                const texto = await file.text();
                const dados = JSON.parse(texto);

                if (!dados.passos || !Array.isArray(dados.passos)) {
                    throw new Error('Formato de arquivo inválido: faltam passos da execução');
                }

                setMundoSelecionado(dados.mundoId || mundoSelecionado);
                setAgenteSelecionado(dados.agente || agenteSelecionado);
                setSalaSelecionada(dados.salaInicial || salaSelecionada);
                setAtivarDiagonal(dados.movimentoDiagonal || ativarDiagonal);
                setPassosExecucao(dados.passos);
                setPartida(dados.passos);

                alert(`Partida importada com sucesso! ${dados.passos.length} passos carregados.`);

            } catch (error) {
                console.error('Erro ao importar JSON:', error);
                alert('Erro ao importar arquivo: ' + error.message);
            } finally {
                setCarregando(false);
            }
        };

        input.click();
    }, [mundoSelecionado, agenteSelecionado, salaSelecionada, ativarDiagonal]);

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
                    {passosExecucao.length == 0 && (
                        <div className="divControle reconfigurar">
                            <p className="paragrafoInformativo">
                                Reconfigure a execução atual. Você pode ativar ou desativar o movimento diagonal, assim como alterar a sala inicial. Para alterar o mundo ou o agente utilizado, você precisa voltar para a tela anterior.
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
                    )}

                    <div className="divControle">
                        <div className="botoesExecucaoo">

                            {passosExecucao.length == 0 && (
                                <div className="divIniciarNova">
                                    <button
                                        className="botaoIniciar"
                                        onClick={iniciar}
                                    >
                                        Iniciar nova partida
                                    </button>
                                    <p><span style={{ fontWeight: 'bold', marginTop: '20px' }}>Funcionamento</span><br />
                                        As partidas são individuais, ao iniciar uma nova, essa partida é baixada para o seu computador onde você poderá exibi-la de diversas maneiras. Caso você deseje outra, esta será baixada individualmente da mesma maneira. Faça um teste, baixe uma partida!
                                    </p>
                                    <button
                                        onClick={importarJSON}
                                        className="botaoImportar"
                                        disabled={passosExecucao.length > 0}
                                    >
                                        Importar JSON
                                    </button>
                                </div>
                            )}

                            {passosExecucao.length > 0 && (
                                <>
                                    <p style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Partida Gerada! Mas se preferir: </p><br />
                                    <button
                                        className="botaoNovaExecucao"
                                        onClick={() => {
                                            setPassosExecucao([]);
                                            setPartida([]);
                                            setExecutandoAnimacao(false);

                                        }}
                                    >
                                        Gerar Nova partida
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {passosExecucao.length > 0 && (
                        <>
                            <div className="divControle">
                                <p><span style={{ fontWeight: 'bold' }}>Salvar partida</span><br />
                                    Você pode salvar a partida completa em formato de arquivo no seu próprio computador, ou você pode salvar os resultados desta partida no banco de dados. Por limitações técnicas, as partidas salvas no banco <span className="destaqueRed">não são salvas de forma completa</span>, apenas os seus resultados.
                                </p>
                                <div className="divAuxBotoesEmLinha">
                                    <button
                                        onClick={baixarJSON}
                                        className="botaoBaixar"
                                    >
                                        Baixar JSON da partida
                                    </button>
                                    <button>
                                        Salvar resultados da minha conta
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </aside>
            </main>
            {carregando && <LoadingPage></LoadingPage>}
        </>
    )
}