import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

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

    // async function login(email, password) {
    //     const resposta = await fetch("https://wumpus-verse-api.onrender.com/auth/login", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ email, password })
    //     });

    //     if (!resposta.ok) {
    //         throw new Error("Email ou senha incorretos");
    //     }

    //     const data = await resposta.json();
    //     console.log(data);

    //     localStorage.setItem("access_token", data.access_token);
    //     localStorage.setItem("user", JSON.stringify(data.user));

    //     setToken(data.access_token);
    //     setUsuario(data.user);

    //     return data;
    // }

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const data = response.data;

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

    // async function registrar(name, email, password) {
    //     const resposta = await fetch("https://wumpus-verse-api.onrender.com/auth/register", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name, email, password })
    //     });

    //     if (!resposta.ok) {
    //         let erro = "Erro ao registrar";

    //         try {
    //             const dataErro = await resposta.json();
    //             if (dataErro?.detail?.[0]?.msg) {
    //                 erro = dataErro.detail[0].msg;
    //             }
    //         } catch { }

    //         throw new Error(erro);
    //     }

    //     const data = await resposta.json();

    //     localStorage.setItem("access_token", data.access_token);
    //     localStorage.setItem("user", JSON.stringify(data.user));

    //     setToken(data.access_token);
    //     setUsuario(data.user);

    //     return data;
    // }

    async function registrar(name, email, password) {
        const response = await api.post("/auth/register", {
            name,
            email,
            password
        });


        const data = response.data;
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.access_token);
        setUsuario(data.user);

        return data;
    }

    async function getMundosSalvos() {

        try {
            const response = await api.get("/environment/list-user");

            const data = response.data;
            return data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro detalhado:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return error;
        }

    }

    async function salvarMundo(mundo) {

        try {
            const response = await api.post("/environment/user", mundo);
            console.log(response);
            return true;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro 422 detalhado:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return false;
        }
    }

    async function getMiniMapa(id) {
        try {
            const response = await api.get("/environment/mini-map", {
                params: {
                    environment_id: id
                }
            });

            return response.data;
        } catch (error) {
            console.error(error);
            return (error);
        }
    }

    async function excluirmundo(id) {
        try {
            const response = await api.delete("/environment/user", {
                params: {
                    environment_id: id
                }
            })
            return true;
        } catch (erro) {
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ usuario, token, carregando, login, logout, registrar, getMundosSalvos, salvarMundo, getMiniMapa, excluirmundo }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}