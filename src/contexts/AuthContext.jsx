import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const salvarTokenComTimestamp = (token, timestamp) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("token_timestamp", timestamp.toString());
        setToken(token);
    };

    const isTokenExpirado = () => {
        const timestamp = localStorage.getItem("token_timestamp");
        if (!timestamp) return true;

        const tempoLogin = parseInt(timestamp);
        const tempoAtual = new Date().getTime();
        const diferenca = tempoAtual - tempoLogin;

        return diferenca > TOKEN_EXPIRATION_TIME;
    };

    function isTokenValido() {
        const tokenSalvo = localStorage.getItem("access_token");
        if (!tokenSalvo) return false;

        return !isTokenExpirado();
    };

    //para verificar se o token ainda é válido
    useEffect(() => {
        const tokenSalvo = localStorage.getItem("access_token");
        const userSalvo = localStorage.getItem("user");

        if (tokenSalvo && userSalvo) {
            if (!isTokenExpirado()) {
                setToken(tokenSalvo);
                setUsuario(JSON.parse(userSalvo));
            } else {
                logout();
            }
        }

        setCarregando(false);
    }, []);

    // useEffect(() => {
    //     const tokenSalvo = localStorage.getItem("access_token");
    //     const userSalvo = localStorage.getItem("user");

    //     if (tokenSalvo && userSalvo) {
    //         setToken(tokenSalvo);
    //         setUsuario(JSON.parse(userSalvo));
    //     }

    //     setCarregando(false);
    // }, []);

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const data = response.data;
        const timestampAtual = new Date().getTime();

        // localStorage.setItem("access_token", data.access_token);
        salvarTokenComTimestamp(data.access_token, timestampAtual);
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

    async function iniciarPartida(environment_id, diagonal_movement, agentesConfig) {
        // console.log('chegou');
        try {
            console.log('Enviando requisição:', {
                environment_id,
                diagonal_movement,
                agentesConfig
            });

            // O backend espera um ARRAY de agentes, mesmo que seja apenas um
            const response = await api.post(
                "/environment/execution",
                [agentesConfig], // Envolva em um array
                {
                    params: {
                        environment_id,
                        diagonal_movement
                    }
                }
            );

            console.log('Resposta recebida:', response.data);
            return response.data;
        } catch (error) {
            console.error(
                'Erro ao iniciar partida:',
                error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : error.message
            );
            // Propague o erro para que o componente possa tratá-lo
            throw error;
        }
    }

    async function criarAgente(agent_type, name, agentData) {
        try {
            const response = await api.post("/agents/user", agentData, {
                params: {
                    agent_type: agent_type,
                    name: name
                }
            });
            console.log('Agente criado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao criar agente:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    async function getAgentes(pagina = 1, limite = 5) {
        try {
            const response = await api.get("/agents/agents", {
                params: {
                    page: pagina,
                    limit: limite
                }
            });

            const data = response.data;

            let parsedData = data;
            if (typeof data === 'string') {
                parsedData = JSON.parse(data);
            }

            const hasMore = !parsedData[parsedData.length - 1];
            console.log("Booleana: ", hasMore);
            const agentes = parsedData.slice(0, -1);

            return {
                agentes: agentes,
                hasMore: hasMore
            };

        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar agentes:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return {
                agentes: [],
                hasMore: false
            };
        }
    }

    async function excluirAgente(agent_id) {
        try {
            const response = await api.delete("/agents/user", {
                params: {
                    agent_id: agent_id
                }
            });
            console.log('Agente excluído com sucesso:', response.data);
            return true;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao excluir agente:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{
            usuario, token, carregando,
            login,
            logout,
            registrar,
            getMundosSalvos,
            salvarMundo,
            getMiniMapa,
            excluirmundo,
            atualizarMundo,
            getMundoById,
            isTokenExpirado,
            iniciarPartida,
            criarAgente,
            getAgentes,
            excluirAgente
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}