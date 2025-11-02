import './styles/mapa.css'
import { useState } from 'react'

export default function Mapa() {

    const [largura, setLargura] = useState(10);
    const [altura, setAltura] = useState(10);

    const blocos = Array.from({ length: altura }, (_, y) => Array.from({ length: largura }, (_, x) => ({ x, y })));

    return (
        <main>
            <section className='janelaCentralizada'>
                <h1 className='h1-centralizado'>Gerador de ambientes</h1>
                <div className='div-geradorMapa'>
                    <div className='div-gerador-mapa-superior'>
                        <div className='div-deslizanteSuperior'>
                            <input
                                type="range"
                                id="larguraMapa"
                                min="4"
                                max="100"
                                onChange={(e) => setLargura(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className='div-gerador-mapa-inferior'>
                        <div className='div-deslizanteInferior'>
                            <input
                                type="range"
                                id="alturaMapa"
                                min="4"
                                max="100"
                                orient="vertical"
                                onChange={(e) => setAltura(Number(e.target.value))}
                            />
                        </div>
                        <div
                            className='mapa-blocos'
                            style={{
                                "--largura": largura,
                                "--altura": altura,
                            }}
                        >
                            {
                                blocos.map((linha, y) =>
                                    linha.map((bloco) => (
                                        <div key={`${bloco.x}-${y}`} className="bloco" />
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}