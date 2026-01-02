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

    async function getMundosSalvos(pagina = 1, limite = 6) {
        try {
            const response = await api.get("/environment/list-user", {
                params: {
                    page: pagina,
                    limit: limite
                }
            });

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
            return [];
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

    async function atualizarMundo(environment_id, mundo) {
        try {
            const response = await api.put(
                "/environment/user",
                mundo,
                {
                    params: {
                        environment_id
                    }
                }
            );

            return true;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro detalhado:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return false;
        }
    }

    async function getMundoById(environment_id) {
        try {
            const response = await api.get("/environment/user", {
                params: {
                    environment_id
                }
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar mundo:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return null;
        }
    }


    return (
        <AuthContext.Provider value={{ usuario, token, carregando, login, logout, registrar, getMundosSalvos, salvarMundo, getMiniMapa, excluirmundo, atualizarMundo, getMundoById }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}