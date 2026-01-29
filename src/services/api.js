import axios from "axios";

const api = axios.create({
    baseURL: "https://wumpus-verse-api.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

// const api = axios.create({
//     baseURL: "/api",
//     headers: {
//         "Content-Type": "application/json"
//     }
// });


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

//tentativa de corrigir o erro de token invalido
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem("access_token");
//             // window.location.href = "/login";
//         }
//         if (error.response?.status === 422) {
//             localStorage.removeItem("access_token");
//             window.location.href = "/login";
//         }

//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const status = error.response?.status;

//         if (status === 422) {
//             localStorage.removeItem("access_token");

//             window.location.href = "/login";

//             return new Promise(() => { });
//         }

//         return Promise.reject(error);
//     }
// );


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        const method = error.config?.method;

        console.log('Interceptor error:', {
            url,
            method,
            status,
            data: error.response?.data
        });

        const rotasIgnoradas = [
            "/auth/login",
            "/auth/register"
        ];

        const ignorar = rotasIgnoradas.some(r => url?.includes(r));

        // if (!ignorar && (status === 401 || status === 422)) {
        //     console.log('Token inválido ou expirado, redirecionando para login');
        //     localStorage.removeItem("access_token");
        //     localStorage.removeItem("user");
        //     localStorage.removeItem("token_timestamp");
        //     window.location.replace("/login");

        //     return new Promise(() => { });
        // }

        return Promise.reject(error);
    }
);

export default api;