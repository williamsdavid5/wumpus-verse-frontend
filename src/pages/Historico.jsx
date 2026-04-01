import './styles/historico.css'
import LinoLogico from '../assets/linoLogico.png'
import LinoEvolutivo from '../assets/linoEvolutivo.png'
import Buraco from '../assets/skins/buraco.png'

import { useEffect, useState, useRef, useTransition } from 'react';

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

export default function Historico() {

    const containerRef = useRef(null);
    const [mundoSelecionado, setMundoSelecionado] = useState(null);
    const [miniGrid, setMiniGrid] = useState([]);
    const [dimensoes, setDimensoes] = useState({ largura: 0, altura: 0 });
    const [cellSize, setCellSize] = useState(20);

    useEffect(() => {
        if (!containerRef.current) return;

        const { clientWidth, clientHeight } = containerRef.current;

        const sizeX = Math.floor(clientWidth / dimensoes.largura);
        const sizeY = Math.floor(clientHeight / dimensoes.altura);

        setCellSize(Math.min(20));
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
                        <div className='mapaExecucao'>
                            <div className='mundosVisualizador visualizadorMapaExecucao'>
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
                            <div className='topoMapaExecucao'>
                                <h2>Mapa usado: Vórtice <span className='destaqueGold'>ID 8</span></h2>
                                <p className='paragrafoInformativo paragrafoInforAgente'>
                                    <b>Data de criação:</b> 24/02/2026 - 17:26 <br />
                                    <b>Salas ativas:</b> 262 <br />
                                    <b>Buracos:</b> 0 <br />
                                    <b>Ouros:</b> 1 <br />
                                    <b>Wumpus:</b> 0
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}