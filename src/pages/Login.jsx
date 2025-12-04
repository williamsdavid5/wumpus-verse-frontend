import './styles/login.css'
import logo from '../assets/logo_vertical_branca.svg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function enviar(e) {
        e.preventDefault();
        setErro("");

        try {
            await login(email, senha);
            navigate('/');
        } catch (err) {
            setErro("Erro de login!");
        }

        console.log('enviar');
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
                />
                <p className='paragrafoInformativo pInput'>Senha</p>
                <input
                    type="password"
                    name=""
                    id="inputSenha"
                    className='inputRegistro'
                    placeholder='*******'
                    onChange={(e) => setSenha(e.target.value.trim())}
                />
                <button type="button" onClick={enviar} className='botaoLogin'>Entrar</button>
                <p className='paragrafoInformativo'>ou</p>
                <button type="button" className='botaoLogin' onClick={() => navigate('/registrar')}>Registrar</button>
                <p className='paragrafoInformativo'>caso você não tenha uma conta</p>
                <img src={logo} alt="" className='logo' />
            </form>
        </main>
    )
}