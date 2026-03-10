import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: false, // Prevents CORS preflight failures on many shared hosting envs
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
