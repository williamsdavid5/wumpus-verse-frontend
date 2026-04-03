import './styles/benchmark.css'

import Lino from '../assets/skins/lino_Armado.png'
import LinoRobo from '../assets/skins/linoRobo_armado.png'
import LinoEvolutivo from '../assets/skins/linoEvolutivo_Armado.png'

import { useEffect, useState, useRef, useTransition } from 'react';

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

function Bloco({ selecionado, wumpus, buraco, ouro }) {
    return (
        <div
            className={`bloco ${selecionado ? 'selecionado' : ''}`}
        >
            {wumpus && <div className='elemento wumpus'></div>}
            {buraco && <div className='elemento buraco'></div>}
            {ouro && <div className='elemento ouro'></div>}
        </div>
    )
}

export default function Benchmark() {

    const testes = [
        {
            id: 1,
            numero: 56,
            data: "04/05/2026",
            agente: "Lógico",
            mundo: "espiral",
            mundoId: 17
        },
        {
            id: 2,
            numero: 72,
            data: "12/03/2026",
            agente: "Evolutivo",
            mundo: "labirinto",
            mundoId: 8
        },
        {
            id: 3,
            numero: 31,
            data: "28/02/2026",
            agente: "Aleatório",
            mundo: "deserto",
            mundoId: 23
        },
        {
            id: 4,
            numero: 89,
            data: "19/01/2026",
            agente: "Lógico",
            mundo: "floresta negra",
            mundoId: 11
        },
        {
            id: 5,
            numero: 44,
            data: "05/04/2026",
            agente: "Evolutivo",
            mundo: "montanha sagrada",
            mundoId: 5
        },
        {
            id: 6,
            numero: 67,
            data: "22/03/2026",
            agente: "Aleatório",
            mundo: "templo antigo",
            mundoId: 14
        },
        {
            id: 7,
            numero: 93,
            data: "11/02/2026",
            agente: "Lógico",
            mundo: "oceano profundo",
            mundoId: 31
        },
        {
            id: 8,
            numero: 12,
            data: "30/01/2026",
            agente: "Evolutivo",
            mundo: "céu infinito",
            mundoId: 26
        },
        {
            id: 9,
            numero: 55,
            data: "18/04/2026",
            agente: "Aleatório",
            mundo: "vulcão adormecido",
            mundoId: 42
        },
        {
            id: 10,
            numero: 78,
            data: "07/05/2026",
            agente: "Lógico",
            mundo: "cidade perdida",
            mundoId: 9
        }
    ];

    const containerRef = useRef(null);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [miniGrid, setMiniGrid] = useState([]);
    const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
    const [cellSize, setCellSize] = useState(15);

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

    const passosPorPartida = [
        { id: 1, partida: 1, passos: 1250 },
        { id: 2, partida: 2, passos: 1890 },
        { id: 3, partida: 3, passos: 940 },
        { id: 4, partida: 4, passos: 2034 },
        { id: 5, partida: 5, passos: 1680 },
        { id: 6, partida: 6, passos: 1870 },
        { id: 7, partida: 7, passos: 1100 },
        { id: 8, partida: 8, passos: 1980 },
        { id: 9, partida: 9, passos: 1520 },
        { id: 10, partida: 10, passos: 1450 },
        { id: 11, partida: 11, passos: 1720 },
        { id: 12, partida: 12, passos: 980 },
        { id: 13, partida: 13, passos: 1850 },
        { id: 14, partida: 14, passos: 1340 },
        { id: 15, partida: 15, passos: 1930 },
        { id: 16, partida: 16, passos: 2090 },
        { id: 17, partida: 17, passos: 1760 },
        { id: 18, partida: 18, passos: 1190 },
        { id: 19, partida: 19, passos: 1050 },
        { id: 20, partida: 20, passos: 1940 },
        { id: 21, partida: 21, passos: 1670 },
        { id: 22, partida: 22, passos: 1410 },
        { id: 23, partida: 23, passos: 1820 },
        { id: 24, partida: 24, passos: 257 },
        { id: 25, partida: 25, passos: 1190 },
        { id: 26, partida: 26, passos: 2020 },
        { id: 27, partida: 27, passos: 1580 },
        { id: 28, partida: 28, passos: 920 },
        { id: 29, partida: 29, passos: 1780 },
        { id: 30, partida: 30, passos: 1830 }
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const { clientWidth, clientHeight } = containerRef.current;

        const sizeX = Math.floor(clientWidth / dimensoes.largura);
        const sizeY = Math.floor(clientHeight / dimensoes.altura);

        setCellSize(Math.min(15));
    }, [dimensoes]);

    useEffect(() => {
        const { grid, largura, altura } = carregarMapaEstatico();
        setMiniGrid(grid);
        setDimensoes({ largura, altura });
    }, []);

    function carregarMapaEstatico() {
        const mapaData = {
            "largura": 20,
            "altura": 20,
            "salas": [
                {
                    "x": 3,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 0,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 1,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 2,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": true
                },
                {
                    "x": 2,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 3,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 4,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 5,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 6,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 7,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 8,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 9,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 10,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 11,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 12,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 13,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 0,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 14,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 15,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 1,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 19,
                    "y": 16,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 2,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 17,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 18,
                    "y": 17,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 3,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 4,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 16,
                    "y": 18,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 5,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 6,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 7,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 8,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 9,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 10,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 11,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 12,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 13,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 14,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                },
                {
                    "x": 15,
                    "y": 19,
                    "wumpus": false,
                    "buraco": false,
                    "ouro": false
                }
            ]
        };

        const xs = mapaData.salas.map(s => s.x);
        const ys = mapaData.salas.map(s => s.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        const largura = maxX + 1;
        const altura = maxY + 1;

        const grid = Array.from({ length: altura }, () =>
            Array.from({ length: largura }, () => ({
                ativa: false,
                wumpus: false,
                buraco: false,
                ouro: false
            }))
        );

        mapaData.salas.forEach(sala => {
            grid[sala.y][sala.x] = {
                ativa: true,
                wumpus: sala.wumpus,
                buraco: sala.buraco,
                ouro: sala.ouro
            };
        });

        return { grid, largura, altura };
    }

    return (
        <>
            <main className="historicoMain benchmarkMain">
                <aside className="mundosLista">
                    <div className='topoMundosSalvos'>
                        <div className='a'>
                            <h1>
                                Benchmark
                            </h1>
                            <p className='paragrafoInformativo'>
                                Teste seus agentes nos mundos que você criou. Abaixo, os testes que você decidiu salvar.
                            </p>
                        </div>
                        <div className='topoMundosAuxiliar'>
                        </div>
                    </div>
                    <div className="divListaMundos">
                        {testes.map((execucao) => (
                            <div
                                key={execucao.id}
                                className={`itemListaMundos itemListaExecoes`}
                            >
                                <div className='esquerda'>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h2>Teste {execucao.numero}</h2>
                                        <p><span className='destaqueGold'>{execucao.data}</span></p>
                                    </div>

                                    <p className='paragrafoInformativo'><b>Agente:</b> {execucao.agente}</p>
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
                    <div className='direitaRolagem'>
                        <div className='divTopoRelatorio'>
                            <h1>Teste 56</h1>
                            <p className='destaqueGold'>02/04/2026</p>
                        </div>
                        <section className='agenteEMundo'>
                            <div className='agenteUsado'>
                                <h2>Agente usado</h2>
                                <div className='auxiliarAgenteUsado'>
                                    <img src={LinoRobo} alt="" />
                                    <div className='direita'>
                                        <hr />
                                        <p><b>Agente Lógico</b></p>
                                        <p className='paragrafoInformativo paragrafoInforAgente'>
                                            Segue um conjunto de regras gravadas em sua programação. Seu objetivo é pegar o ouro gastando o mínimo possível de sua energia e munição (e eliminar todos os Wumpus do caminho).
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='mundoUsado'>
                                <h2>Mapa usado</h2>
                                <p><b>Vórtice</b></p>
                                <div className='div-mapa'>
                                    <div ref={containerRef} className='div-mapa mapaHistorico'>
                                        <div
                                            className='mapa-blocos'
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: `repeat(${dimensoes.largura}, ${cellSize}px)`,
                                                gridTemplateRows: `repeat(${dimensoes.altura}, ${cellSize}px)`,
                                                width: `${dimensoes.largura * cellSize}px`,
                                                height: `${dimensoes.altura * cellSize}px`,
                                            }}
                                        >
                                            {miniGrid.map((linha, y) =>
                                                linha.map((sala, x) => (
                                                    <Bloco
                                                        key={`${x}-${y}`}
                                                        selecionado={sala.ativa}
                                                        wumpus={sala.wumpus}
                                                        buraco={sala.buraco}
                                                        ouro={sala.ouro}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='divInformacoesExecucao'>
                            <div className='esquerda'>
                                <h2>Sobre a execução</h2>
                                <p>Foram realizadas 30 partidas.</p>
                                <p><b>Vitórias:</b> 23</p>
                                <p><b>Derrotas:</b> 7</p>
                                <p><b>Média de pontuação:</b> 1360</p>
                                <hr />
                                <p><b>Média de wumpus mortos:</b> 1.2</p>
                                <p><b>Taxa de mortes de wumpus</b> 26%</p>
                                <p><b>Taxa de acerto de tiro:</b> 87%</p>
                                <hr />
                                <p><b>Média de ouro coletado:</b> 1.4</p>
                                <p><b>Taxa de coleta de ouro:</b> 98%</p>
                                <hr />
                                <p><b>Média de passos</b>: 3240</p>
                                <p><b>Passos na vitória mais eficiente:</b> 89</p>
                                <hr />
                                <h3>Essse agente venceu 70,3% das partidas</h3>
                            </div>
                            <div className='direita'>
                                <p><b>Pontuação por partida</b></p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={desempenhoAgente1} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid
                                            strokeDasharray="5 5"
                                            stroke="#374151"
                                            vertical={true}
                                            horizontal={true}
                                        />
                                        <XAxis
                                            dataKey="execucao"
                                            label={{
                                                value: 'Partidas',
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

                                        <Line
                                            type="linear"
                                            dataKey="pontuacao"
                                            stroke="red"
                                            name="Lógico"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                        <section className='graficosPartida'>
                            <div className='linha'>
                                <div className='graficoTotal'>
                                    <p><b>Passos por partida</b></p>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={passosPorPartida} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid
                                                strokeDasharray="5 5"
                                                stroke="#374151"
                                                vertical={true}
                                                horizontal={true}
                                            />
                                            <XAxis
                                                dataKey="partida"
                                                label={{
                                                    value: 'Partidas',
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
                                                    value: 'Passos',
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
                                                formatter={(value) => [`${value} passos`, 'Quantidade']}
                                                labelFormatter={(label) => `Partida ${label}`}
                                            />
                                            <Legend
                                                wrapperStyle={{ fill: '#f3f4f6' }}
                                                iconType="circle"
                                            />

                                            <Line
                                                type="linear"
                                                dataKey="passos"
                                                stroke="var(--roxoDestaque)"
                                                name="Passos por partida"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className='linha'>
                                <div className='esquerda'>
                                    <p><b>Ouro coletado por partida</b></p>
                                </div>
                                <div className='direita'>
                                    <p>dir</p>
                                </div>
                            </div>


                        </section>
                    </div>
                </section>
            </main>
        </>
    )
}