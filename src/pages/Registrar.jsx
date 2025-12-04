import { useState } from 'react';
import logo from '../assets/logo_vertical_branca.svg'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';

export default function Registrar() {

    const { registrar } = useAuth();

    const [email, setEmail] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [trolagem, setTrolagem] = useState(false);

    const [senhaValida, setSenhaValida] = useState(true);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const navigate = useNavigate();

    function verificarEspacos(string) {
        if (/\s/.test(string)) {
            return false;
        } else {
            return true;
        }
    }

    async function enviar(e) {
        e.preventDefault();
        setErro("");
        setSucesso("");

        try {
            await registrar(usuario, email, senha);

            setSucesso("Registrado com sucesso!");
            navigate('/');
        } catch (err) {
            setErro(err.message || "Erro no registro");
        }

        console.log('enviar');

    }

    return (
        <main className='mainLogin'>
            <form className="loginJanela" autoComplete="off">
                <h1 className='tituloH1'>Registro</h1>
                <p className='paragrafoInformativo pInput'>Nome de usuário</p>
                <input
                    type="text"
                    name="inputNomeUsuario"
                    id="inputNomeUsuario"
                    className='inputRegistro'
                    placeholder='fulaninhodasilva24'
                    onChange={(e) => setUsuario(e.target.value.trim())}
                    autoComplete="off"

                />
                <p className='paragrafoInformativo pInput'>Email</p>
                <input
                    type="email"
                    name="inputEmail"
                    id="inputEmail"
                    className='inputRegistro'
                    placeholder='fulanodasilva@hotmail.com'
                    onChange={(e) => setEmail(e.target.value.trim())}
                    // value={""}
                    autoComplete="off"
                />
                <p className='paragrafoInformativo pInput'>Senha</p>
                <input
                    type="password"
                    name="inputSenha" id="inputSenha"
                    className='inputRegistro'
                    placeholder='*******'
                    onChange={(e) => setSenha(e.target.value.trim())}
                    onBlur={() => {
                        if (senha.trim() != '') {
                            setTrolagem(!trolagem)
                        }
                    }}
                    // autoComplete="new-password"
                    autoComplete="off"

                />
                {
                    trolagem && (
                        <p className='paragrafoInformativo pVermelho'>O usuário "davidduart04" já usa essa senha (brincadeira kkkkk)</p>
                    )
                }
                <p className='paragrafoInformativo pInput'>Confirme a senha</p>
                <input
                    type="password"
                    name="inputConfirmarSenha"
                    id="inputConfirmarSenha"
                    className='inputRegistro'
                    placeholder='*******'
                    onChange={(e) => {
                        if (e.target.value.trim() != senha) {
                            e.target.classList.add('senhaIncompativelInput');
                            setSenhaValida(false);
                        } else {
                            e.target.classList.remove('senhaIncompativelInput');
                            setSenhaValida(true);
                        }
                    }}
                    // value={""}
                    autoComplete="off"
                />
                {!senhaValida && (
                    <p className='paragrafoInformativo pVermelho'>Essa não é a mesma senha amigo!</p>
                )
                }
                <button type="button" onClick={enviar} className='botaoLogin'>Enviar</button>
                {/* <p>ou</p>
                <button className='botaoLogin' onClick={() => navigate('/registrar')}>Registrar</button> */}
                <img src={logo} alt="" className='logo' />
            </form>
        </main>
    )
}