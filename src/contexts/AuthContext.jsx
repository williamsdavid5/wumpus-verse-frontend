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
        // console.log(data);
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
            // console.log("Booleana: ", hasMore);
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

    async function getAgenteById(agent_id) {
        try {
            const response = await api.get("/agents/user", {
                params: {
                    agent_id: agent_id
                }
            });
            console.log('Agente obtido:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar agente:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return null;
        }
    }

    async function atualizarAgente(agent_id, name, agentData) {
        try {
            const response = await api.put("/agents/user", agentData, {
                params: {
                    agent_id: agent_id,
                    name: name
                }
            });
            console.log('Agente atualizado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao atualizar agente:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    async function resetPassword(email) {
        try {
            const response = await api.post("/auth/reset-password", {
                email: email
            });

            console.log('Email de redefinição enviado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao solicitar redefinição de senha:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    async function reenviarLinkVerificacao(email) {
        try {
            const response = await api.post("/auth/resend-verification-link", {
                email: email
            });

            console.log('Link de verificação reenviado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao reenviar link de verificação:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    async function salvarExecution(agent_id, environment_id, agentData) {
        try {
            // Garante que é um array
            const bodyArray = Array.isArray(agentData) ? agentData : [agentData];

            const response = await api.post("/execution/user", bodyArray, {
                params: {
                    agent_id: agent_id,
                    environment_id: environment_id
                }
            });

            console.log('Execution salva com sucesso:', response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao salvar execution:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    async function getExecucoesUsuario(pagina = 1, limite = 5, agent_id = 0, environment_id = 0) {
        console.log(environment_id);
        try {
            const response = await api.get("/execution/list-user", {
                params: {
                    page: pagina,
                    limit: limite,
                    agent_id: agent_id,
                    environment_id: environment_id
                }
            });
            let dados = response.data;

            if (typeof dados === 'string') {
                dados = JSON.parse(dados);
            }

            let execucoes = [];
            let hasMore = false;

            if (Array.isArray(dados)) {
                const ultimoItem = dados[dados.length - 1];
                if (ultimoItem === false || ultimoItem === true) {
                    hasMore = ultimoItem;
                    execucoes = dados.slice(0, -1);
                } else {
                    execucoes = dados;
                    hasMore = dados.length === limite;
                }
            } else if (dados.data && Array.isArray(dados.data)) {
                execucoes = dados.data;
                hasMore = dados.hasMore || (dados.page && dados.page < dados.totalPages);
            } else if (dados.execucoes && Array.isArray(dados.execucoes)) {
                execucoes = dados.execucoes;
                hasMore = dados.hasMore || false;
            }

            return {
                execucoes: execucoes,
                hasMore: hasMore,
                total: dados.total || execucoes.length
            };

        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar execuções:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return {
                execucoes: [],
                hasMore: false,
                total: 0
            };
        }
    }

    async function getEnvironmentsWithExecutions(pagina = 1, limite = 5) {
        try {
            const response = await api.get("/execution/list_environments", {
                params: {
                    page: pagina,
                    limit: limite
                }
            });

            let dados = response.data;

            if (typeof dados === 'string') {
                dados = JSON.parse(dados);
            }

            let environments = [];
            let hasMore = false;
            let total = 0;

            if (Array.isArray(dados)) {
                const ultimoItem = dados[dados.length - 1];
                if (ultimoItem === false || ultimoItem === true) {
                    hasMore = ultimoItem;
                    environments = dados.slice(0, -1);
                } else {
                    environments = dados;
                    hasMore = dados.length === limite;
                }
                total = environments.length;
            } else if (dados.environments && Array.isArray(dados.environments)) {
                environments = dados.environments;
                hasMore = dados.hasMore || false;
                total = dados.total || environments.length;
            } else if (dados.data && Array.isArray(dados.data)) {
                environments = dados.data;
                hasMore = dados.hasMore || false;
                total = dados.total || environments.length;
            }

            return {
                environments: environments,
                hasMore: hasMore,
                total: total
            };

        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar ambientes com execuções:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return {
                environments: [],
                hasMore: false,
                total: 0
            };
        }
    }

    async function getAgentsWithExecutionsInEnvironment(environment_id, pagina = 1, limite = 10) {
        if (!environment_id) {
            console.warn('environment_id é obrigatório');
            return {
                agents: [],
                hasMore: false,
                total: 0
            };
        }

        try {
            const response = await api.get("/execution/list-_agents", {
                params: {
                    environment_id: environment_id,
                    page: pagina,
                    limit: limite
                }
            });

            let dados = response.data;

            if (typeof dados === 'string') {
                dados = JSON.parse(dados);
            }

            let agents = [];
            let hasMore = false;
            let total = 0;

            if (Array.isArray(dados)) {
                const ultimoItem = dados[dados.length - 1];
                if (ultimoItem === false || ultimoItem === true) {
                    hasMore = ultimoItem;
                    agents = dados.slice(0, -1);
                } else {
                    agents = dados;
                    hasMore = dados.length === limite;
                }
                total = agents.length;
            } else if (dados.agents && Array.isArray(dados.agents)) {
                agents = dados.agents;
                hasMore = dados.hasMore || false;
                total = dados.total || agents.length;
            } else if (dados.data && Array.isArray(dados.data)) {
                agents = dados.data;
                hasMore = dados.hasMore || false;
                total = dados.total || agents.length;
            }

            return {
                agents: agents,
                hasMore: hasMore,
                total: total
            };

        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao buscar agentes com execuções no ambiente:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return {
                agents: [],
                hasMore: false,
                total: 0
            };
        }
    }

    async function excluirExecution(execution_id) {
        if (!execution_id) {
            console.warn('execution_id é obrigatório');
            return false;
        }

        try {
            const response = await api.delete("/execution/user", {
                params: {
                    execution_id: execution_id
                }
            });

            console.log('Execução excluída com sucesso:', response.data);
            return true;

        } catch (error) {
            if (error.response) {
                console.error(
                    'Erro ao excluir execução:',
                    JSON.stringify(error.response.data, null, 2)
                );
            } else {
                console.error(error);
            }
            return false;
        }
    }

    async function updateUserName(new_user_name) {
        if (!new_user_name || new_user_name.trim() === '') {
            console.warn('new_user_name é obrigatório');
            return {
                success: false,
                message: 'O nome de usuário não pode estar vazio'
            };
        }

        try {
            const response = await api.put("/auth/user", null, {
                params: {
                    new_user_name: new_user_name.trim()
                }
            });

            // console.log('Nome de usuário atualizado com sucesso:', response.data);

            const userSalvo = localStorage.getItem("user");
            if (userSalvo) {
                const user = JSON.parse(userSalvo);
                user.name = new_user_name.trim();
                localStorage.setItem("user", JSON.stringify(user));
                setUsuario(user);
            }

            return {
                success: true,
                data: response.data,
                message: 'Nome atualizado com sucesso!'
            };

        } catch (error) {
            let errorMessage = 'Erro ao atualizar nome de usuário';

            if (error.response) {
                console.error(
                    'Erro ao atualizar nome:',
                    JSON.stringify(error.response.data, null, 2)
                );

                if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else {
                console.error(error);
                errorMessage = error.message || errorMessage;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    }

    async function getStaticsAgentsExecutionsInEnvironment(environment_id, agents_ids, length = 30) {
        if (!environment_id) {
            console.warn('environment_id é obrigatório');
            return {
                success: false,
                data: null,
                message: 'environment_id é obrigatório'
            };
        }

        if (!agents_ids || !Array.isArray(agents_ids) || agents_ids.length === 0) {
            console.warn('agents_ids é obrigatório e deve ser um array não vazio');
            return {
                success: false,
                data: null,
                message: 'agents_ids é obrigatório e deve ser um array não vazio'
            };
        }

        try {
            const response = await api.post("/execution/statics", {
                environment_id: environment_id,
                agents_ids: agents_ids
            }, {
                params: {
                    length: length
                }
            });

            console.log('Estatísticas obtidas com sucesso:', response.data);
            return {
                success: true,
                data: response.data,
                message: 'Estatísticas obtidas com sucesso'
            };
        } catch (error) {
            let errorMessage = 'Erro ao obter estatísticas das execuções';

            if (error.response) {
                console.error(
                    'Erro ao obter estatísticas:',
                    JSON.stringify(error.response.data, null, 2)
                );

                if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else {
                console.error(error);
                errorMessage = error.message || errorMessage;
            }

            return {
                success: false,
                data: null,
                message: errorMessage
            };
        }
    }

    async function reexecutarPartida(execution_id) {
        if (!execution_id) {
            console.warn('execution_id é obrigatório');
            throw new Error('execution_id é obrigatório');
        }

        try {
            const response = await api.post("/environment/re-execution", null, {
                params: {
                    execution_id: execution_id
                }
            });

            return response.data;

        } catch (error) {
            console.error(
                'Erro ao reexecutar partida:',
                error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : error.message
            );
            throw error;
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
            excluirAgente,
            getAgenteById,
            atualizarAgente,
            resetPassword,
            reenviarLinkVerificacao,
            salvarExecution,
            getExecucoesUsuario,
            getEnvironmentsWithExecutions,
            getAgentsWithExecutionsInEnvironment,
            excluirExecution,
            updateUserName,
            getStaticsAgentsExecutionsInEnvironment,
            reexecutarPartida
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}