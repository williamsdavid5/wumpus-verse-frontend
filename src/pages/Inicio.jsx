import './styles/inicio.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/wumpus_verse_logo_white.svg'
import { useEffect, useState } from 'react';
import { useConfirm } from '../contexts/ConfirmContext';

export default function Inicio() {
    const { usuario, token, logout } = useAuth();
    const { confirm } = useConfirm();
    const navigate = useNavigate();
    // const [logado, setLogado] = useState(false);
    const logado = !!usuario;
    const [botaoHover, setBotaoHover] = useState(null);

    const botoes = [
        { id: 1, texto: 'Mundos', acao: () => logado ? navigate('/mundos-salvos') : navigate('/login') },
        { id: 2, texto: 'Agentes', acao: () => logado ? navigate('/agentes') : navigate('/login') },
        { id: 3, texto: 'Histórico', acao: () => logado ? navigate('/historico') : navigate('/login') },
        { id: 4, texto: 'Nova partida', acao: () => logado ? navigate('/nova-partida') : navigate('/login') },
    ];

    async function sair() {
        const resposta = await confirm({
            title: "Logout",
            message: "Quer sair mesmo ou só queria saber o que o botão faz?",
            type: "confirm",
            botao1: "Eu quero sair",
            botao2: "Só tava curioso kkk"
        })

        if (resposta === "yes") {
            logout()
        }
    }

    async function deletarConta() {

        const resposta = await confirm({
            title: "Excluir conta",
            message: "Sério mesmo?",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não"
        })

        if (resposta === "yes") {
            try {

                const resposta = await fetch(
                    "https://wumpus-verse-api.onrender.com/auth/user",
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (resposta.ok) {
                    const dados = await resposta.json();

                    logout();

                    return {
                        success: true,
                        message: "Conta deletada com sucesso",
                        data: dados
                    };
                } else {
                    const erro = await resposta.json().catch(() => ({}));
                    throw new Error(erro.detail || erro.message || "Erro ao deletar conta");
                }

            } catch (error) {
                console.error('Erro:', error);
                return {
                    success: false,
                    message: error.message
                };
            }
        }
    }

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
                        as diversas formas de vencer esse jogo. <br /><a href="/saibamais">Saiba mais</a>
                    </p>
                    <div className='divBotoesInicio'>
                        {/* <button onClick={() => navigate('/mundos-salvos')} >Mundos</button> */}
                        {botoes.slice(0, 3).map(b => (
                            <button
                                key={b.id}
                                onClick={b.acao}
                                onMouseEnter={() => setBotaoHover(b.id)}
                                onMouseLeave={() => setBotaoHover(null)}
                                className={`${logado ? '' : 'botaoInicioSemLogin'}`}
                            >
                                {logado ?
                                    b.texto : botaoHover === b.id ?
                                        'faça login' : b.texto}
                            </button>
                        ))}
                    </div>
                </section>
                <footer>
                    {logado && (
                        <>
                            <button onClick={sair} className='botaoLogado'>
                                <p style={{ fontWeight: 'bold', margin: '0' }}>{usuario?.name}</p>
                                clique para sair
                            </button>
                            {import.meta.env.DEV &&
                                <button onClick={() => deletarConta()}>
                                    Excluir conta
                                </button>
                            }
                        </>

                    )}

                    {!logado && (
                        <div></div>
                    )}

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
        </>
    )
}