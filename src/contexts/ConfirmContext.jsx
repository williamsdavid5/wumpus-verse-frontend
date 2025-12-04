import { createContext, useContext, useState } from "react";
import Modal from "../pages/Modal";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
    const [modalConfig, setModalCOnfig] = useState(null);
    const [resolver, setResolver] = useState(null);

    function confirm({ title, message, type = "alert", botao1 = "Ok", botao2 = "Não" }) {
        return new Promise((resolve) => {
            setModalCOnfig({ title, message, type, botao1, botao2 });
            setResolver(() => resolve);
        });
    }

    function close(result) {
        if (resolver) resolver(result);
        setModalCOnfig(null);
        setResolver(null);
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {modalConfig && (
                <Modal
                    {...modalConfig}
                    onClose={close}
                />
            )}
        </ConfirmContext.Provider>
    )
}

export function useConfirm() {
    return useContext(ConfirmContext)
}