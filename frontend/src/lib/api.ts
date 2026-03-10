import axios from "axios";

const getBaseURL = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "/api";
    // Ensure the /api prefix is present for the backend routing
    if (url.startsWith("http") && !url.includes("/api")) {
        return url.endsWith("/") ? `${url}api` : `${url}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
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
