import { createContext, useContext, useReducer } from "react";

const NavigationContext = createContext();

const initialState = {
    current: "INICIO",
    history: []
}

function navigationReducer(state, action) {
    switch (action.type) {
        case "GO":
            return {
                current: action.to,
                history: [...state.history, state.current]
            };

        case "BACK":
            if (state.history.length === 0) return state;
            const previous = state.history[state.history.length - 1];
            return {
                current: previous,
                history: state.history.slice(0, -1)
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

export function NavigationProvider({ children }) {
    const [state, dispatch] = useReducer(navigationReducer, initialState);

    return (
        <NavigationContext.Provider value={{ state, dispatch }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}