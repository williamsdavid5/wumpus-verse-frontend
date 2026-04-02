import './styles/ranking.css'

import Lino from '../assets/skins/lino_Armado.png'
import LinoRobo from '../assets/skins/linoRobo_armado.png'
import LinoEvolutivo from '../assets/skins/linoEvolutivo_Armado.png'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function Ranking() {

    const desempenhoAgente1 = [
        { id: 1, execucao: 1, pontuacao: 1250 },
        { id: 2, execucao: 2, pontuacao: 1890 },
        { id: 3, execucao: 3, pontuacao: 940 },
        { id: 4, execucao: 4, pontuacao: 2150 },
        { id: 5, execucao: 5, pontuacao: 1680 },
        { id: 6, execucao: 6, pontuacao: 2450 },
        { id: 7, execucao: 7, pontuacao: 1100 },
        { id: 8, execucao: 8, pontuacao: 1980 },
        { id: 9, execucao: 9, pontuacao: 2620 },
        { id: 10, execucao: 10, pontuacao: 1450 },
        { id: 11, execucao: 11, pontuacao: 2210 },
        { id: 12, execucao: 12, pontuacao: 980 },
        { id: 13, execucao: 13, pontuacao: 1870 },
        { id: 14, execucao: 14, pontuacao: 2530 },
        { id: 15, execucao: 15, pontuacao: 1340 },
        { id: 16, execucao: 16, pontuacao: 2090 },
        { id: 17, execucao: 17, pontuacao: 1760 },
        { id: 18, execucao: 18, pontuacao: 2380 },
        { id: 19, execucao: 19, pontuacao: 1050 },
        { id: 20, execucao: 20, pontuacao: 1940 },
        { id: 21, execucao: 21, pontuacao: 2670 },
        { id: 22, execucao: 22, pontuacao: 1410 },
        { id: 23, execucao: 23, pontuacao: 2280 },
        { id: 24, execucao: 24, pontuacao: 2700 },
        { id: 25, execucao: 25, pontuacao: 1190 },
        { id: 26, execucao: 26, pontuacao: 2020 },
        { id: 27, execucao: 27, pontuacao: 1580 },
        { id: 28, execucao: 28, pontuacao: 920 },
        { id: 29, execucao: 29, pontuacao: 2310 },
        { id: 30, execucao: 30, pontuacao: 1830 }
    ];

    const desempenhoAgente2 = [
        { id: 1, execucao: 1, pontuacao: 1250 },
        { id: 2, execucao: 2, pontuacao: 890 },
        { id: 3, execucao: 3, pontuacao: 1560 },
        { id: 4, execucao: 4, pontuacao: 740 },
        { id: 5, execucao: 5, pontuacao: 1680 },
        { id: 6, execucao: 6, pontuacao: 1120 },
        { id: 7, execucao: 7, pontuacao: 1840 },
        { id: 8, execucao: 8, pontuacao: 950 },
        { id: 9, execucao: 9, pontuacao: 1720 },
        { id: 10, execucao: 10, pontuacao: 1380 },
        { id: 11, execucao: 11, pontuacao: 1900 },
        { id: 12, execucao: 12, pontuacao: 810 },
        { id: 13, execucao: 13, pontuacao: 1490 },
        { id: 14, execucao: 14, pontuacao: 1030 },
        { id: 15, execucao: 15, pontuacao: 1770 },
        { id: 16, execucao: 16, pontuacao: 1210 },
        { id: 17, execucao: 17, pontuacao: 860 },
        { id: 18, execucao: 18, pontuacao: 1650 },
        { id: 19, execucao: 19, pontuacao: 1420 },
        { id: 20, execucao: 20, pontuacao: 1880 },
        { id: 21, execucao: 21, pontuacao: 770 },
        { id: 22, execucao: 22, pontuacao: 1590 },
        { id: 23, execucao: 23, pontuacao: 1310 },
        { id: 24, execucao: 24, pontuacao: 1800 },
        { id: 25, execucao: 25, pontuacao: 1060 },
        { id: 26, execucao: 26, pontuacao: 1520 },
        { id: 27, execucao: 27, pontuacao: 920 },
        { id: 28, execucao: 28, pontuacao: 1750 },
        { id: 29, execucao: 29, pontuacao: 1390 },
        { id: 30, execucao: 30, pontuacao: 1850 }
    ];

    const desempenhoAgente3 = [
        { id: 1, execucao: 1, pontuacao: 850 },
        { id: 2, execucao: 2, pontuacao: 1120 },
        { id: 3, execucao: 3, pontuacao: 430 },
        { id: 4, execucao: 4, pontuacao: -256 },
        { id: 5, execucao: 5, pontuacao: 680 },
        { id: 6, execucao: 6, pontuacao: 950 },
        { id: 7, execucao: 7, pontuacao: 1180 },
        { id: 8, execucao: 8, pontuacao: 540 },
        { id: 9, execucao: 9, pontuacao: 760 },
        { id: 10, execucao: 10, pontuacao: 1050 },
        { id: 11, execucao: 11, pontuacao: -760 },
        { id: 12, execucao: 12, pontuacao: 890 },
        { id: 13, execucao: 13, pontuacao: 410 },
        { id: 14, execucao: 14, pontuacao: 1150 },
        { id: 15, execucao: 15, pontuacao: 620 },
        { id: 16, execucao: 16, pontuacao: 980 },
        { id: 17, execucao: 17, pontuacao: 730 },
        { id: 18, execucao: 18, pontuacao: 1080 },
        { id: 19, execucao: 19, pontuacao: 470 },
        { id: 20, execucao: 20, pontuacao: -2180 },
        { id: 21, execucao: 21, pontuacao: 820 },
        { id: 22, execucao: 22, pontuacao: 1200 },
        { id: 23, execucao: 23, pontuacao: 560 },
        { id: 24, execucao: 24, pontuacao: 910 },
        { id: 25, execucao: 25, pontuacao: 690 },
        { id: 26, execucao: 26, pontuacao: 1020 },
        { id: 27, execucao: 27, pontuacao: 400 },
        { id: 28, execucao: 28, pontuacao: 870 },
        { id: 29, execucao: 29, pontuacao: 1130 },
        { id: 30, execucao: 30, pontuacao: 650 }
    ];

    const dadosCombinados = desempenhoAgente1.map((item, index) => ({
        execucao: item.execucao,
        agente1: item.pontuacao,
        agente2: desempenhoAgente2[index]?.pontuacao,
        agente3: desempenhoAgente3[index]?.pontuacao
    }));

    return (
        <>
            <main className='mainRanking'>
                <section className='auxRankinAgentes'>
                    <section className='esquerda'>
                        <p><b>Ranking</b></p>
                        <div className='cardAgenteRanking'>
                            <h1>1°</h1>
                            <div className='imagem'>
                                <img src={LinoRobo} alt="" />
                            </div>
                            <div className='informacoesAgenteRanking'>
                                <h2>Agente Lógico</h2>
                                <p className='paragrafoInformativo paragrafoInforAgente'>
                                    Segue um conjunto de regras gravadas em sua programação. Seu objetivo é pegar o ouro gastando o mínimo possível de sua energia e munição (e eliminar todos os Wumpus do caminho).
                                </p>
                                <hr />
                                <p>Vence <b>93%</b> das partidas; <b>Média de passos:</b> 1034.</p>
                            </div>
                        </div>
                        <div className='cardAgenteRanking'>
                            <h1>2°</h1>
                            <div className='imagem'>
                                <img src={LinoEvolutivo} alt="" />
                            </div>
                            <div className='informacoesAgenteRanking'>
                                <h2>Agente Evolutivo</h2>
                                <p className='paragrafoInformativo paragrafoInforAgente'>
                                    Descendente de uma geração de caçadores, este agente recebeu as melhores características dos ancestrais de sua tribo. Ele nasceu com seus objetivos gravados em seu DNA.
                                </p>
                                <hr />
                                <p>Vence <b>68%</b> das partidas; <b>Média de passos:</b> 359.</p>
                            </div>
                        </div>
                        <div className='cardAgenteRanking'>
                            <h1>3°</h1>
                            <div className='imagem'>
                                <img src={Lino} alt="" />
                            </div>
                            <div className='informacoesAgenteRanking'>
                                <h2>Agente Aleatório</h2>
                                <p className='paragrafoInformativo paragrafoInforAgente'>
                                    Simplesmente faz tudo o que quer, quando quer, sem se preocupar com as consequências, praticamente um adolescente, mas fortemente armado.
                                </p>
                                <hr />
                                <p>Vence <b>17%</b> das partidas; <b>Média de passos:</b> 36.</p>
                            </div>
                        </div>
                    </section>
                    <div className='direita'>
                        <p><b>Desempenho para as últimas 30 execuções</b></p>
                        <div className='auxGrafico'>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dadosCombinados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid
                                        strokeDasharray="5 5"
                                        stroke="#374151"
                                        vertical={true}
                                        horizontal={true}
                                    />
                                    <XAxis
                                        dataKey="execucao"
                                        label={{
                                            value: 'Execuções',
                                            position: 'insideBottom',
                                            offset: -5,
                                            fill: '#6b7280',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                        }}
                                        tick={{ fill: '#9ca3af' }}
                                        axisLine={{ stroke: '#4b5563' }}
                                        tickLine={{ stroke: '#4b5563' }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Pontuação',
                                            angle: -90,
                                            position: 'insideLeft',
                                            fill: '#6b7280',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                        }}
                                        tick={{ fill: '#9ca3af' }}
                                        axisLine={{ stroke: '#4b5563' }}
                                        tickLine={{ stroke: '#4b5563' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                        itemStyle={{ color: '#f3f4f6' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ fill: '#f3f4f6' }}
                                        iconType="circle"
                                    />

                                    {/* Alterações aqui */}
                                    <Line
                                        type="linear"  // Mude de "monotone" para "linear"
                                        dataKey="agente1"
                                        stroke="#bd0000"
                                        name="Lógico"
                                        strokeWidth={2}
                                        dot={false}  // Remove os pontos
                                        activeDot={false}  // Remove o destaque ao passar o mouse
                                    />
                                    <Line
                                        type="linear"  // Mude de "monotone" para "linear"
                                        dataKey="agente2"
                                        stroke="#ff6f00"
                                        name="Evolutivo"
                                        strokeWidth={2}
                                        dot={false}  // Remove os pontos
                                        activeDot={false}  // Remove o destaque ao passar o mouse
                                    />
                                    <Line
                                        type="linear"  // Mude de "monotone" para "linear"
                                        dataKey="agente3"
                                        stroke="#dcdcdc"
                                        name="Aleatório"
                                        strokeWidth={2}
                                        dot={false}  // Remove os pontos
                                        activeDot={false}  // Remove o destaque ao passar o mouse
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
                <section className='rankingPorExecucao'>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                    <h1>aaaaaaa</h1>
                </section>
            </main>
        </>
    )
}