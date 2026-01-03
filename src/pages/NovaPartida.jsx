import "./styles/novaPartida.css"

export default function () {
    return (
        <>
            <main className="mainNovaPartida">
                <aside className="esquerdaNovaPartida">
                    <div className="divControle">
                        <h1>Nova partida</h1>
                        <p className="paragrafoInformativo">Selecione um mundo e um agente para continuar. Claro, você precisa ter criado um mundo antes de iniciar uma partida!</p>
                    </div>
                    <div className="listaMundos">
                        <p>Não sobrou nada</p>
                    </div>
                </aside>
                <section className="centroNovaPartida">
                    <div className="divMapa">
                        mapa aqui
                    </div>
                    <div className="divInformacoes">
                        <p className="paragrafoInformativo">Selecione onde seu agente será posicionado no início da partida, essa posição também será a saída do mundo, o que indica o fim da partida.</p>
                    </div>
                </section>
                <aside className="direitaNovaPartida">
                    direita
                </aside>
            </main>
            {/* <footer className="rodapeNovaPartida">
                rodapé
            </footer> */}
        </>
    )
}