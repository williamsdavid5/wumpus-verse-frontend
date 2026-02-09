import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";

export const STATE_TO_ROUTE = {
    INICIO: "/",
    SAIBA_MAIS: "/saibamais",
    LOGIN: "/login",
    REGISTRAR: "/registrar",
    MUNDOS_SALVOS: "/mundos-salvos",
    MAPA: "/mapa",
    NOVA_PARTIDA: "/nova-partida",
    EXECUCAO: "/execucao"
};


export function useAppNavigation() {
    const navigate = useNavigate();
    const { state, dispatch } = useNavigation();

    function go(toState) {
        dispatch({ type: "GO", to: toState });
        navigate(STATE_TO_ROUTE[toState]);
    }

    function back() {
        dispatch({ type: "BACK" });
        const previous = state.history[state.history.length - 1];
        if (previous) {
            navigate(STATE_TO_ROUTE[previous]);
        }
    }

    return { go, back, current: state.current };
}
