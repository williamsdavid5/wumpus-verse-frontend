import './styles/avisoLayout.css'
import logo from '../assets/logo_vertical_branca.svg'

export function AvisoLayout() {
    return (
        <div className='divAvisoTela'>
            <h1 className='tituloInicio'>Opa calma lá amigo</h1>
            <p className='paragrafoInicio'>Esta plataforma não funciona em calculadoras. Por favor, use um dispositivo com tela maior.</p>
            <img src={logo} alt="" className='logo' />
        </div>
    )
}