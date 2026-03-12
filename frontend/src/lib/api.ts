import axios from "axios";
import { signOut } from "next-auth/react";

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
    withCredentials: true, // CRITICAL: Send cookies with every request so auth works
});

let isRedirecting = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Only handle 401 (Unauthorized) errors
        if (error.response?.status === 401 && typeof window !== "undefined" && !isRedirecting) {
            isRedirecting = true;
            
            // Sign out and redirect to login
            await signOut({ redirect: true, callbackUrl: "/login" });
            
            isRedirecting = false;
        }
        return Promise.reject(error);
    }
);

export default api;
