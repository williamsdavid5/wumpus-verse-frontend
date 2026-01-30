import { createContext, useState, useContext } from "react";

const ExecutionContext = createContext();

export function ExecutionProvider({ children }) {
    const [executionConfig, setExecutionConfig] = useState(null);

    return (
        <ExecutionContext.Provider value={{ executionConfig, setExecutionConfig }}>
            {children}
        </ExecutionContext.Provider>
    )
}

export function useExecution() {
    return useContext(ExecutionContext);
}