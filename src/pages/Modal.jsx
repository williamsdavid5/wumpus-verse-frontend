import './styles/modal.css'

export default function Modal({ title, message, type, onClose, botao1, botao2 }) {
    return (
        <>
            <div className="modalBackgrund">
                <div className="janelaModal">
                    <h2>{title}</h2>
                    <p className='pragrafoInformativo pModal'>{message}</p>

                    {type === "alert" && (
                        <div className="botoes">
                            <button onClick={() => onClose("ok")}>{botao1}</button>
                        </div>

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