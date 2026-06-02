import './styles/inicio.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/wumpus_verse_logo_white.svg'
import LoadingGif from '../assets/loadingGif.gif'
import { useEffect, useState } from 'react';
import { useConfirm } from '../contexts/ConfirmContext';

function JanelaUsername({ setJanelaAlterarNome }) {
    const { usuario, updateUserName } = useAuth();
    const { confirm } = useConfirm();
    const [novoNome, setNovoNome] = useState('');
    const [carregandoUpaneNome, setCarregandoUpadateNome] = useState(false);

    const handleUpdateName = async () => {
        if (!novoNome || novoNome.trim() === '') {
            await confirm({
                title: "Calma lá amigo",
                message: "Quer colocar um nome vazio? Isso não é possível",
                type: "alert",
                botao1: "Tá bom"
            });
            return;
        }

        if (novoNome.trim() === usuario?.name) {
            await confirm({
                title: "Espera aí",
                message: "Quer colocar o mesmo nome? Sério?",
                type: "alert",
                botao1: "Ops"
            });
            setCarregandoUpadateNome(false);
            return;
        }

        const resposta = await confirm({
            title: "Confirmar alteração",
            message: `Deseja alterar seu nome de "${usuario?.name}" para "${novoNome}"?`,
            type: "confirm",
            botao1: "Sim, alterar",
            botao2: "Cancelar"
        });

        if (resposta === 'yes') {
            setCarregandoUpadateNome(true);
            try {
                const result = await updateUserName(novoNome);

                if (result.success) {
                    await confirm({
                        title: "Sucesso!",
                        message: 'Seu nome foi alterado!',
                        type: "alert",
                        botao1: "Ainda bem"
                    });

                    setCarregandoUpadateNome(false);
                    setJanelaAlterarNome(false);

                } else {
                    await confirm({
                        title: "Erro",
                        message: 'Certeza que a culpa é do programador backend',
                        type: "alert",
                        botao1: "Maldito!"
                    });
                    setNovoNome(usuario?.name || '');
                }
            } catch (error) {
                console.error('Erro:', error);
                await confirm({
                    title: "Erro",
                    message: "Ocorreu um erro inesperado. Você pode tentar novamente, ou culpar o programador backend.",
                    type: "alert",
                    botao1: "Certo"
                });
            }
        } else {
            setNovoNome(usuario?.name || '');
            setCarregandoUpadateNome(false);
        }
    };

    return (
        <>
            <div className='janelaUserName'>
                {carregandoUpaneNome ?
                    <>
                        <span className='loadingPequeno'>
                            <img src={LoadingGif} alt="" />
                        </span>
                    </>
                    :
                    <>
                        <p>Alterar nome de usuário</p>
                        <input type="text" placeholder={usuario?.name} onChange={(e) => setNovoNome(e.target.value)} />
                        <span className='spanMesmaLinha'>
                            <button onClick={() => handleUpdateName()}>Confirmar</button>
                            <button onClick={() => setJanelaAlterarNome(false)}>Cancelar</button>
                        </span>
                    </>
                }
            </div>
        </>
    )
}

export default function Inicio() {
    const { usuario, token, logout, reenviarLinkVerificacao } = useAuth();
    const { confirm } = useConfirm();
    const navigate = useNavigate();
    // const [logado, setLogado] = useState(false);
    const logado = !!usuario;
    const verificado = true;
    const [botaoHover, setBotaoHover] = useState(null);
    const [janelaAlterarNome, setJanelaAlterarNome] = useState(false);

    const [carregandoVerificacao, setCarregandoVerificacao] = useState(false);

    const botoes = [
        { id: 1, texto: 'Mundos', acao: () => logado ? navigate('/mundos-salvos') : navigate('/login') },
        { id: 2, texto: 'Agentes', acao: () => logado ? navigate('/agentes') : navigate('/login') },
        { id: 3, texto: 'Histórico', acao: () => logado ? navigate('/historico') : navigate('/login') },
        { id: 4, texto: 'Benchmark', acao: () => logado ? navigate('/benchmark') : navigate('/login') },
        { id: 5, texto: 'Nova partida', acao: () => logado ? navigate('/nova-partida') : navigate('/login') },
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
            message: "Sério mesmo? Você tem coragem????",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não..."
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

    async function handleReenviarVerificacao() {
        const resposta = await confirm({
            title: "Reenviar verificação",
            message: "Reenvie a verificação de conta caso o link tenha expirado. Reenviar?",
            type: "confirm",
            botao1: "Sim",
            botao2: "Não"
        });

        if (resposta === 'yes') {
            try {
                setCarregandoVerificacao(true);
                await reenviarLinkVerificacao(usuario?.email);
                await confirm({
                    title: "E-mail enviado!",
                    message: "Um novo link de verificação foi enviado para o seu e-mail.",
                    type: "alert",
                    botao1: "Ok"
                });
            } catch (error) {
                await confirm({
                    title: "Erro",
                    message: "Não foi possível reenviar o link, você pode tentar de novo para garantir que não é um erro de API.",
                    type: "alert",
                    botao1: "Entendi"
                });
            }
            setCarregandoVerificacao(false);
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
                        as diversas formas de vencer esse jogo. <br /><a href="/saibamais" className='animarTexto'>Saiba mais</a>
                    </p>
                    <p className='pAvisoTelaInicio'>Atenção: a experiência em dispositivos com tela pequena <span>não é completa!</span> Algumas funções só estão disponíveis em computadores.</p>
                    <div className='divBotoesInicio'>
                        {botoes.slice(0, 3).map(b => (
                            <button
                                key={b.id}
                                onClick={b.acao}
                                onMouseEnter={() => setBotaoHover(b.id)}
                                onMouseLeave={() => setBotaoHover(null)}
                                className={(!logado || (logado && !usuario?.is_verified)) ? 'botaoInicioSemLogin' : ''}
                            >
                                {logado ? (
                                    !usuario?.is_verified && botaoHover === b.id ?
                                        'verifique sua conta' : b.texto
                                ) : (
                                    botaoHover === b.id ? 'faça login' : b.texto
                                )}
                            </button>
                        ))}
                    </div>
                </section>
                <footer className={!usuario?.is_verified && 'footeNaoVerificado'}>
                    {logado && (
                        <>
                            <div className='controlesConta'>
                                <button onClick={sair} className='botaoLogado'>
                                    <span style={{ fontWeight: 'bold', margin: '0' }}>{usuario?.name}</span> <br />
                                    clique para sair
                                    {!usuario?.is_verified && <><p className='animarTexto'><b>Não verificado</b></p></>}
                                </button>
                                {carregandoVerificacao && (
                                    <span className='spanCarregandoSenha'>
                                        <img src={LoadingGif} alt="" />
                                    </span>
                                )}
                                {!usuario?.is_verified &&
                                    <><button
                                        className='botaoExcluirConta botaoReenviarVerificacao'
                                        onClick={() => handleReenviarVerificacao()
                                        }>Sua conta não está funcionando <br /> clique para verificar</button></>}
                                <button className='botaoExcluirConta botaoEditarUserName' onClick={() => setJanelaAlterarNome(!janelaAlterarNome)}>
                                    Alterar nome de usuário
                                </button>

                                <button className='botaoExcluirConta' onClick={() => deletarConta()}>
                                    Excluir minha conta
                                </button>
                            </div>
                        </>

                    )}

                    {!logado && (
                        <div></div>
                    )}

                    <button
                        className={`botaoNovaPartida ${(!logado || (logado && !usuario?.is_verified)) ? 'botaoInicioSemLogin' : ''}`}
                        onClick={botoes[4].acao}
                        onMouseEnter={() => setBotaoHover(5)}
                        onMouseLeave={() => setBotaoHover(null)}
                        title={`${logado ? 'Escolha um agente e um mundo e inicie uma partida' : ''}`}
                    >
                        {logado ? (
                            !usuario?.is_verified && botaoHover === 5 ?
                                'verifique sua conta' : botoes[4].texto
                        ) : (
                            botaoHover === 5 ? 'faça login' : botoes[4].texto
                        )}
                    </button>
                </footer>
                <img src={logo} alt="" className='logoInicio' />
            </main>
            {janelaAlterarNome && (
                <JanelaUsername
                    setJanelaAlterarNome={setJanelaAlterarNome}
                ></JanelaUsername>
            )}
        </>
    )
}