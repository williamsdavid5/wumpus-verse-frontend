import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export function useAuth() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const unscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setCarregando(false);
        });

        return unscribe;
    }, []);

    return { usuario, carregando };
}