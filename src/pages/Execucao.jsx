import { useEffect, useState, useCallback } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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

    //json que mostra ao usuário a estrutura que ele precisa para importar o seu proprio agente
    const jsonExample = {
        mundoId: 0,
        agenteSelecionado: -1,
        salaInicial: [0, 0],
        ativarDiagonal: false,
        passosExecucao: [
            {
                agente: -1,
                posicao_x: 5,
                posicao_y: 0,
                acao: '',
                tiro_position: [
                    -1, -1
                ],
                ouros: 0,
                flechas: 0,
                pontos: 0
            },
            {
                agente: -1,
                posicao_x: 5,
                posicao_y: 0,
                acao: '',
                tiro_position: [
                    -1, -1
                ],
                ouros: 0,
                flechas: 0,
                pontos: 0
            }
        ]
    };

    useEffect(() => {
        if (!executionConfig) return;
        setAgenteSelecionado(executionConfig.agenteSelecionado);
        setAtivarDiagonal(executionConfig.ativarDiagonal);
        setMundoSelecionado(executionConfig.mundoSelecionado);
        setSalaSelecionada(executionConfig.salaSelecionada);
    }, [executionConfig]);

    async function iniciar() {
        if (!mundoSelecionado || mundoSelecionado === -1) {
            await confirm({
                title: "Bobão",
                message: "Vai executar o que? onde? kkkkkkkkkkkkk selecione um mundo ou importe um JSON",
                type: "alert",
                botao1: "Droga"
            })
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

            partidaIniciada[0].flechas = partidaIniciada[1].flechas;

            // console.log('Partida iniciada:', partidaIniciada);
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
            agenteSelecionado: agenteSelecionado,
            salaInicial: salaSelecionada,
            ativarDiagonal: ativarDiagonal,
            passosExecucao: passosExecucao,
            metadata: {
                totalPassos: passosExecucao.length,
                agenteTipo: `Agente ${agenteSelecionado}`,
                dataGeracao: new Date().toISOString()
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

                const passos = dados.passosExecucao || [];
                const agente = dados.agenteSelecionado !== undefined ? dados.agenteSelecionado : 0;
                const mundoId = dados.mundoId !== undefined ? dados.mundoId : mundoSelecionado;
                const salaInicial = dados.salaInicial || [];
                const movimentoDiagonal = dados.ativarDiagonal !== undefined ? dados.ativarDiagonal : ativarDiagonal;

                if (!Array.isArray(passos) || passos.length === 0) {
                    throw new Error('Passos da execução inválidos ou vazios');
                }

                if (mundoId === -1 || mundoId === undefined) {
                    throw new Error('ID do mundo não encontrado no arquivo');
                }

                if (!Array.isArray(salaInicial) || salaInicial.length !== 2) {
                    throw new Error('Sala inicial inválida no arquivo');
                }

                setMundoSelecionado(mundoId);
                setAgenteSelecionado(agente);
                setSalaSelecionada(salaInicial);
                setAtivarDiagonal(movimentoDiagonal);
                setPassosExecucao(passos);
                setPartida(passos);
                setSalaInvalida(false);
                setModoEditarSala(false);
                setExecutandoAnimacao(false);

            } catch (error) {
                console.error('Erro ao importar JSON:', error);
                alert('Erro ao importar arquivo: ' + error.message);
            } finally {
                setCarregando(false);
            }
        };

        input.click();
    }, [mundoSelecionado, ativarDiagonal]);


    // const importarJSON = useCallback(() => {
    //     const input = document.createElement('input');
    //     input.type = 'file';
    //     input.accept = '.json';

    //     input.onchange = async (e) => {
    //         const file = e.target.files[0];
    //         if (!file) return;

    //         try {
    //             setCarregando(true);
    //             const texto = await file.text();
    //             const dados = JSON.parse(texto);

    //             if (!dados.passosExecucao && !dados.passos) {
    //                 throw new Error('Formato de arquivo inválido: faltam passos da execução');
    //             }

    //             const passos = dados.passosExecucao || dados.passos;

    //             const agente = dados.agenteSelecionado !== undefined ? dados.agenteSelecionado :
    //                 (dados.agente !== undefined ? dados.agente : 0);

    //             const mundoId = dados.mundoId || dados.mundoSelecionado || mundoSelecionado;

    //             const salaInicial = dados.salaInicial || dados.salaSelecionada || salaSelecionada;

    //             const movimentoDiagonal = dados.ativarDiagonal !== undefined ? dados.ativarDiagonal :
    //                 (dados.movimentoDiagonal !== undefined ? dados.movimentoDiagonal : ativarDiagonal);

    //             if (!Array.isArray(passos)) {
    //                 throw new Error('Os passos da execução não estão em formato válido');
    //             }

    //             if (mundoId === -1 || mundoId === undefined) {
    //                 throw new Error('ID do mundo não encontrado no arquivo');
    //             }

    //             if (!salaInicial || !Array.isArray(salaInicial) || salaInicial.length !== 2) {
    //                 throw new Error('Sala inicial inválida no arquivo');
    //             }

    //             setMundoSelecionado(mundoId);
    //             setAgenteSelecionado(agente);
    //             setSalaSelecionada(salaInicial);
    //             setAtivarDiagonal(movimentoDiagonal);
    //             setPassosExecucao(passos);
    //             setPartida(passos);
    //             setSalaInvalida(false);
    //             setModoEditarSala(false);
    //             setExecutandoAnimacao(false);

    //         } catch (error) {
    //             console.error('Erro ao importar JSON:', error);
    //             alert('Erro ao importar arquivo: ' + error.message);
    //         } finally {
    //             setCarregando(false);
    //         }
    //     };

    //     input.click();
    // }, [mundoSelecionado, agenteSelecionado, salaSelecionada, ativarDiagonal]);

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
                            <p>Volte à página anterior e selecione um mundo, ou importe algum JSON que você tenha salvo.</p>
                        </div>
                    )}
                    {mundoSelecionado == -1 && (
                        <>
                            <footer className="rodapeControlesExecucao">
                                <p></p>
                            </footer>
                        </>
                    )}
                </section>
                <aside className="configsExecucao">
                    <div className="divControle">
                        <h2>Controle de Execução</h2>
                        <p className="paragrafoInformativo">
                            Envie seu agente para esta perigosa missão de recuperar suas barras de ouro de dentro de uma caverna escura. Ele enfrentará o perigoso (mas nem tanto) Wumpus, e tentará não cair em nenhum buraco pelo caminho. Não se proecupe, ele tem uma shotgun e não tem medo de usá-la!
                        </p>

                        <h3 className="h3PequenoTituloSecao">Regras Atuais</h3>
                        <p className="paragrafoInformativo">Você escolherá o ponto de entrada no mapa, este também será o ponto de saída. Seu agente possui a missão de recolher uma barra de ouro e retornar vivo para a saída da caverna. Detectando brisa, ele poderá se desviar de buracos. Detectando fedor, ele poderá deduzir onde está o wumpus e descer o chumbo no desgraçado! <br />
                            Você poderá reconfigurar o básico da execução quando desejar.
                        </p>
                    </div>
                    {passosExecucao.length == 0 && (
                        <div className="divControle reconfigurar">
                            <h3 className="h3PequenoTituloSecao">
                                Reconfigure a exeução
                            </h3>
                            <p className="paragrafoInformativo">
                                Você pode ativar ou desativar o movimento diagonal, assim como alterar a sala inicial. Para alterar o mundo ou o agente utilizado, você precisa voltar para a tela anterior.
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
                                    title="A sala inicial define onde o agente começa e termina a partida"
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
                                        title="Peça uma nova partida ao backend para que possa ser visualizada aqui"
                                    >
                                        Iniciar nova partida
                                    </button>
                                    <p><span style={{ fontWeight: 'bold', marginTop: '20px' }}>Funcionamento</span><br />
                                        As partidas são individuais, ao iniciar uma nova, essa partida é baixada para o seu computador onde você poderá exibi-la de diversas maneiras. Caso você deseje outra, esta será baixada individualmente da mesma maneira. Faça um teste, baixe uma partida!
                                    </p>
                                    <p>Você também pode <b>baixar ou importar um arquivo de partida </b> baixado anteriormente, isto permite que você guarde suas partida favoritas e importe quando quiser!</p>
                                    <button
                                        onClick={importarJSON}
                                        className="botaoImportar"
                                        disabled={passosExecucao.length > 0}
                                        title="Caso você tenha um JSON guardado, importe e execute uma partida aqui!"
                                    >
                                        Importar JSON
                                    </button>
                                    <h2>Gostaria de usar o seu próprio agente?</h2>
                                    <p>Você pode desenvolver o seu próprio agente, na linguagem que preferir, e utilizar este frontend para visualizar a sua execução, desde que siga os seguintes passos:
                                        <br /><br />
                                        <b>1. Criar e exportar um mundo utilizando esta plataforma</b><br />
                                        Não é para forçar você a usar o nosso site, mas um requisito de lógica! O botão <b>'Importar JSON'</b> acima faz a importação apenas dos passos do agente, o mundo da partida, utilizando o ID, é resgatado diretamente do banco de dados,
                                        isso significa que você deve ter aquele mundo armazenado na sua conta para que tudo possa funcionar. <br /><br />
                                        Nesse caso, você pode criar o mundo normalmente pelo nosso site e salvar na sua conta, o arquivo daquele mundo pode ser baixado em formato JSON, permitindo que você possa fazer a importação no seu próprio código.
                                        <br /><br />
                                        <b>2. Converter os passos da sua partida para o formato correto</b>
                                        Se o seu código exportar um arquivo JSON dos passos da execução com o mesmo formato que estamos utilizando, e usar um mundo existente na sua conta, você será capaz de visualizar o seu agente no nosso frontend!
                                        <br /><br />A estrutura é esta:
                                    </p>
                                    <SyntaxHighlighter
                                        language="json"
                                        style={oneDark}
                                        showLineNumbers
                                    >
                                        {JSON.stringify(jsonExample, null, 2)}
                                    </SyntaxHighlighter>
                                    <p>Os dados inúteis para você seriam:
                                        <br />- <b>Agente selecionado:</b> você não estaria utilizando um dos nossos agentes, então este ID não seria utilizado. Mas é importante que você envie com o valor -1 para que o código possa identificar que este é um agente criado por você!
                                        <br />- <b>Ativar diagonal:</b> você estaria criando a sua própria execução, então você tem a liberdade de ativar ou não movimentos na diagonal, logo, esta variável não será utilizada. Mas é importante que você envie seu valor de acordo com a sua execução para facilitar a vida de todo mundo!
                                        <br /><br />
                                        Dados com os quais você deve ter muita atenção: <br />
                                        - <b>ID do mundo:</b> é muitíssimo importante que você utilize um mundo que existe, e com exatamente o mesmo layout e elementos! o ID do mundo pode ser resgatado na tela de criação, ao exportar um mundo (que já foi criado e salvo), ou na própria listagem, onde exibimos o ID de cada mundo para facilitar o seu trabalho. <br />
                                        - <b>Sala inicial e posição do agente:</b> esteja atento à orientação das coordenadas! pode ser que no seu código elas estejam invertidas! Então uma dica: escreva a sua lógica de forma que, ao alterar uma única variável (booleana talvez?), a orientação que você está usando seja invertida.
                                    </p>
                                </div>
                            )}

                            {passosExecucao.length > 0 && (
                                <>
                                    <p style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Partida Gerada! Mas se preferir: </p><br />
                                    <button
                                        className="botaoNovaExecucao"
                                        title="Peça uma nova partida ao backend para que possa ser visualizada aqui"
                                        onClick={async () => {
                                            const resposta = await confirm({
                                                title: "Tem certeza?",
                                                message: "Se você fizer isso, você perderá essa partida para sempre...",
                                                type: "confirm",
                                                botao1: "Sem problemas",
                                                botao2: 'Vou baixar o JSON'
                                            })

                                            if (resposta == 'yes') {
                                                setPassosExecucao([]);
                                                setPartida([]);
                                                console.log("agente selecionado: ", agenteSelecionado);
                                                setExecutandoAnimacao(false);
                                            }
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
                            <div className="divControle divPontos">
                                <p>Pontuação para esta partida</p>
                                <h1
                                    className={`${partida[partida.length - 1].pontos < 1 ? 'pontosNegativo' : ''}`}
                                >{partida[partida.length - 1].pontos}</h1>
                                {
                                    partida[partida.length - 1].pontos < 1 ?
                                        <>
                                            <p>Seu agente perdeu, meus pêsames.</p>
                                        </> :
                                        <>
                                            <p>Seu agente venceu!</p>
                                        </>
                                }
                            </div>
                            <div className="divControle">
                                <p><span style={{ fontWeight: 'bold' }}>Salvar partida</span><br />
                                    Você pode salvar a partida completa em formato de arquivo no seu próprio computador, ou você pode salvar os resultados desta partida no banco de dados. Por limitações técnicas, as partidas salvas no banco <span className="destaqueRed">não são salvas de forma completa</span>, apenas os seus resultados.
                                </p>
                                <div className="divAuxBotoesEmLinha">
                                    <button
                                        title="Baixe o arquivo referente à essa partida, assim você poderá executá-la de novo futuramente"
                                        onClick={baixarJSON}
                                        className="botaoBaixar"
                                    >
                                        Baixar JSON da partida
                                    </button>
                                    <button
                                        title="Salve o resultado desta partida na sua conta, mas apenas dados básicos, você não poder executar novamente esta partida!"
                                    >
                                        Salvar resultados na minha conta
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