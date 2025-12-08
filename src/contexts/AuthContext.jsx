import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const tokenSalvo = localStorage.getItem("access_token");
        const userSalvo = localStorage.getItem("user");

        if (tokenSalvo && userSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(userSalvo));
        }

        setCarregando(false);
    }, []);

    async function login(email, password) {
        // const resposta = await fetch("/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email, password })
        // });

        const resposta = await fetch("https://wumpus-verse-api.onrender.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!resposta.ok) {
            throw new Error("Email ou senha incorretos");
        }

        const data = await resposta.json();

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.access_token);
        setUsuario(data.user);

        return data;
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setToken(null);
        setUsuario(null);
    }

    async function registrar(name, email, password) {
        const resposta = await fetch("https://wumpus-verse-api.onrender.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        if (!resposta.ok) {
            let erro = "Erro ao registrar";

            try {
                const dataErro = await resposta.json();
                if (dataErro?.detail?.[0]?.msg) {
                    erro = dataErro.detail[0].msg;
                }
            } catch { }

            throw new Error(erro);
        }

        const data = await resposta.json();

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.access_token);
        setUsuario(data.user);

        return data;
    }

    return (
        <AuthContext.Provider value={{ usuario, token, carregando, login, logout, registrar }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}