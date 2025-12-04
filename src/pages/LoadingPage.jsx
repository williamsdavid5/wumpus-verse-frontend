import LoadingGif from '../assets/loadingGif.gif'

export default function LoadingPage() {
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
            </div>
        </>
    )
}