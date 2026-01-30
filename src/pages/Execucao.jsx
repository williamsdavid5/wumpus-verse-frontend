import { useEffect, useState } from "react"
import { useExecution } from "../contexts/ExecutionContext";
import { useAuth } from '../contexts/AuthContext';
import './styles/execucao.css'

export default function Execucao() {
    const { iniciarPartida } = useAuth();

    const [mundoSelecionado, setMundoSelecionado] = useState(-1);
    const [ativarDiagonal, setAtivarDiagonal] = useState(false);
    const [agenteSelecionado, setAgenteSelecionado] = useState(-1);
    const [salaSelecionada, setSalaSelecionada] = useState([]);
    const [partida, setPartida] = useState([]);
    const [mapaEstrutura, setMapaEstrutura] = useState(null);

    const { executionConfig } = useExecution();

    useEffect(() => {
        if (!executionConfig) return;
        setAgenteSelecionado(executionConfig.agenteSelecionado);
        setAtivarDiagonal(executionConfig.ativarDiagonal);
        setMundoSelecionado(executionConfig.mundoSelecionado);
        setSalaSelecionada(executionConfig.salaSelecionada);
    }, [executionConfig]);

    async function iniciar() {
        if (!mundoSelecionado) {
            alert('Selecione um mundo primeiro!');
            return;
        }

        if (salaSelecionada.length === 0) {
            alert('Selecione uma sala inicial!');
            return;
        }

        try {
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

            if (partidaIniciada) {
                alert('Partida iniciada com sucesso!');

            }
        } catch (err) {
            console.log("Erro ao iniciar partida: ", err);
        }
    }


    return (
        <>
            <main className="execucaoMain">
                <section className="secaoMapaExecucao">
                    mapa
                </section>
                <aside className="configsExecucao">
                    configs
                </aside>
            </main>
        </>
    )
}