import './styles/inicio.css'
import { useNavigate } from 'react-router-dom'

import logo from '../assets/wumpus_verse_logo_white.svg'
import { useState } from 'react';

import { AvisoLayout } from './AvisoLayout';

export default function Inicio() {
    const navigate = useNavigate();
    const [logado, setLogado] = useState(false);
    const [botaoHover, setBotaoHover] = useState(null);

    const botoes = [
        { id: 1, texto: 'Editor de mundos', acao: () => navigate('/mapa') },
        { id: 2, texto: 'Editor de agentes', acao: () => { } },
        { id: 3, texto: 'Histórico', acao: () => { } },
        { id: 4, texto: 'Nova partida', acao: () => { } },
    ];

    return (
        <>
            <main className='mainInicio'>
                <section className="inicioJanela">
                    <h1 className='tituloInicio'>
                        Crie agentes inteligentes,
                        crie mundos desafiadores,
                        teste os limites da sua lógica
                    </h1>
                    <p className='paragrafoInicio'>
                        Baseado no jogo lógico “mundo de wumpus“, a plataforma <span className='destaqueRoxo' style={{ fontWeight: 'bold' }}>WUMPUS VERSE</span> permite
                        que qualquer pessoa crie mundos e personalize agentes inteligentes para testar
                        as diversas formas de vencer esse jogo
                    </p>
                    <div className='divBotoesInicio'>
                        <button onClick={() => navigate('/mapa')} >Editor de mundos</button>
                        {botoes.slice(1, 3).map(b => (
                            <button
                                key={b.id}
                                onClick={b.acao}
                                onMouseEnter={() => setBotaoHover(b.id)}
                                onMouseLeave={() => setBotaoHover(null)}
                                className={`${logado ? '' : 'botaoInicioSemLogin'}`}
                            >
                                {logado
                                    ? b.texto
                                    : botaoHover === b.id
                                        ? 'faça login'
                                        : b.texto}
                            </button>
                        ))}
                    </div>
                </section>
                <footer>
                    <button
                        className={`botaoNovaPartida ${logado ? '' : 'botaoInicioSemLogin'}`}
                        onClick={botoes[3].acao}
                        onMouseEnter={() => setBotaoHover(4)}
                        onMouseLeave={() => setBotaoHover(null)}
                    >
                        {logado
                            ? botoes[3].texto
                            : botaoHover === 4
                                ? 'faça login'
                                : botoes[3].texto}
                    </button>
                </footer>
                <img src={logo} alt="" className='logoInicio' />
            </main>
            <AvisoLayout />
        </>
    )
}