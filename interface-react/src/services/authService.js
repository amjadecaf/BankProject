import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const AUTH_TOKEN_KEY = 'ebank_auth_token';
const USER_KEY = 'ebank_user';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/rest/auth/login`, {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erreur de connexion' };
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    getToken: () => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    isTokenExpired: () => {
        const token = authService.getToken();
        if (!token) return true;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    },

    isAuthenticated: () => {
        const token = authService.getToken();
        return token && !authService.isTokenExpired();
    },

    hasRole: (role) => {
        const user = authService.getCurrentUser();
        return user && user.roles && user.roles.includes(role);
    }
};

export default authService;
