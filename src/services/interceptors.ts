import axios from "axios";
import { BASE_URL } from "./CONSTANTS";

const api = axios.create({
    baseURL: `${BASE_URL}/web-proxy/`,
    withCredentials: true,
    timeout: 1000,
    headers: {
        'Content-Type':  'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await axios.post(`${BASE_URL}/token/refresh/`, {},
                    { withCredentials: true }
                )
            } catch (authError) {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(authError);
            }
            return api.request(error.config);
        }
        return Promise.reject(error);
    }
);

export default api;