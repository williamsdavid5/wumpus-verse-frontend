import './styles/mundosSalvos.css'
import { useNavigate } from 'react-router-dom'

export default function MundosSalvos() {

    const navigate = useNavigate();

    const mundosExemplo = [
        {
            nome: "Mundo Deserto",
            data: "05/10/2025",
            salas: 60,
            buracos: 10,
            ouros: 5,
            wumpus: 1
        },
        {
            nome: "Caverna",
            data: "12/09/2025",
            salas: 120,
            buracos: 25,
            ouros: 8,
            wumpus: 3
        },
        {
            nome: "Labirinto Simples",
            data: "20/11/2025",
            salas: 16,
            buracos: 3,
            ouros: 2,
            wumpus: 1
        },
        {
            nome: "Abismo Mortal",
            data: "03/12/2025",
            salas: 80,
            buracos: 35,
            ouros: 12,
            wumpus: 5
        },
        {
            nome: "Mina Dourada",
            data: "15/08/2025",
            salas: 100,
            buracos: 15,
            ouros: 20,
            wumpus: 2
        }
    ];


    return (
        <>
            <main className='mundosMain'>
                <aside className='mundosLista'>

                    <div className='topoMundosSalvos'>
                        <div className='topoMundosAuxiliar'>
                            <h1>
                                Mundos salvos
                            </h1>
                            <p className='paragrafoInformativo'>
                                Todos os mundos que você criou e salvou
                            </p>
                        </div>
                        <div className='topoMundosAuxiliar'>
                            <button className='botaoNovoMundo' onClick={() => navigate('/mapa')}>Novo</button>
                        </div>
                    </div>

                    <div className='divListaMundos'>
                        {mundosExemplo.map((mundo, index) => (
                            <div key={index} className='itemListaMundos'>
                                <div className='esquerda'>
                                    <h2>{mundo.nome}</h2>
                                    <p className='paragrafoInformativo'>Data de criação: {mundo.data}</p>
                                    <p className='paragrafoInformativo'>
                                        <b>Salas:</b> {mundo.salas} <br />
                                        <b>Buracos:</b> {mundo.buracos} <br />
                                        <b>Ouros:</b> {mundo.ouros} <br />
                                        <b>Wumpus:</b> {mundo.wumpus}
                                    </p>
                                </div>
                                <div className='direita'>
                                    <button className='botaoEditar'>Editar</button>
                                    <button className='botaoExcluir'>Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>

                </aside>
                <section className='mundosVisualizador'>
                    exibição
                </section>
            </main>
        </>
    )
}