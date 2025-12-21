import LoadingGif from '../assets/loadingGif.gif'
import LinoDormindo from '../assets/linoDormindo.png'
import './styles/loadingPage.css'
import { useEffect, useState } from 'react'

export default function LoadingPage() {

    const [mostrarLinoDormindo, setMostrarLinoDormindo] = useState(false);

    useEffect(() => {
        const tempo = setTimeout(() => {
            setMostrarLinoDormindo(true);
        }, 7000);

        return () => clearTimeout(tempo);
    }, []);

    return (
        <>
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white'
            }}>
                <img
                    style={{
                        width: '80px'
                    }}
                    src={LoadingGif}
                    alt="" />
                <p>Carregando...</p>
                <p className='paragrafoInformativo'>Se demorar, provavelmente a API está dormindo, mas aguarde.</p>
                {mostrarLinoDormindo && <>
                    <img
                        src={LinoDormindo} alt=""
                        className='fade-in linoDormindoImg'
                    />
                </>}

            </div>
        </>
    )
}