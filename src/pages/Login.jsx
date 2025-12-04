import './styles/login.css'
import logo from '../assets/logo_vertical_branca.svg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useConfirm } from '../contexts/ConfirmContext';

import LoadingPage from './LoadingPage';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState("");
    const { confirm } = useConfirm();
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(false);

    async function enviar(e) {
        e.preventDefault();
        setErro("");
        setCarregando(true);
        if (email.trim() == '' || senha.trim() == '') {
            await confirm({
                title: "Eu pareço um vidende pra você?",
                message: "Preencha todos os campos! 😠",
                type: "alert",
                botao1: "Tá bom"
            })
            setCarregando(false)
            return;
        } else {
            try {
                await login(email, senha);
                navigate('/');
            } catch (err) {

                await confirm({
                    title: "Ops!",
                    message: "Parece que algo deu errado no seu login! Verifique com cuidado o que você digitou. Ou você não se cadastrou ainda? 🤨",
                    type: "alert",
                    botao1: "Tá bom"
                })

                setErro(err.message);
                console.log(erro);
            }
        }
        setCarregando(false)
    }

    return (
        <main className='mainLogin'>
            <form autoComplete="off" className="loginJanela">
                <h1 className='tituloH1'>Login</h1>
                {/* <p className='paragrafoInformativo'>Por favor, faça login, ou se registre caso não tenha uma conta</p> */}
                <p className='paragrafoInformativo pInput'>Email</p>
                <input
                    type="email"
                    name=""
                    id="inputEmail"
                    className='inputRegistro'
                    placeholder='fulanodasilva@gmail.com'
                    onChange={(e) => setEmail(e.target.value.trim())}
                    onKeyDown={(e) => {
                        if (e.key === " ") {
                            e.preventDefault();
                        }
                    }}
                />
                <p className='paragrafoInformativo pInput'>Senha</p>
                <input
                    type="password"
                    name=""
                    id="inputSenha"
                    className='inputRegistro'
                    placeholder='*******'
                    onChange={(e) => setSenha(e.target.value.trim())}
                    onKeyDown={(e) => {
                        if (e.key === " ") {
                            e.preventDefault();
                        }
                    }}
                />
                <button type="button" onClick={enviar} className='botaoLogin'>Entrar</button>
                <p className='paragrafoInformativo'>ou</p>
                <button type="button" className='botaoLogin' onClick={() => navigate('/registrar')}>Registrar</button>
                <p className='paragrafoInformativo'>caso você não tenha uma conta</p>
                <img src={logo} alt="" className='logo' />
            </form>

            {carregando && (
                <LoadingPage></LoadingPage>
            )}
        </main>
    )
}