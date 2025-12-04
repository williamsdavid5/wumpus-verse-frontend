import './styles/modal.css'

export default function Modal({ title, message, type, onClose, botao1, botao2 }) {
    return (
        <>
            <div className="modalBackgrund">
                <div className="janelaModal">
                    <h2 className='tituloInicio'>{title}</h2>
                    <p className='pragrafoInformativo pModal'>{message}</p>

                    {type === "alert" && (
                        <button onClick={() => onClose("ok")}>{botao1}</button>
                    )}

                    {type === "confirm" && (
                        <div className="botoes">
                            <button onClick={() => onClose("yes")}>{botao1}</button>
                            <button onClick={() => onClose("no")}>{botao2}</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}