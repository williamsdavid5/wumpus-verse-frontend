import axios from "axios";

const api = axios.create({
    baseURL: "https://wumpus-verse-api.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 422) {
            localStorage.removeItem("access_token");

            window.location.href = "/login";

            return new Promise(() => { });
        }

        return Promise.reject(error);
    }
);


export default api;