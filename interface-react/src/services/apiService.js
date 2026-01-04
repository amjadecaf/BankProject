import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            authService.logout();
            window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
    }
);

const apiService = {
    // Customer/Client APIs
    createCustomer: (customerData) => {
        return apiClient.post('/api/rest/customer/create', customerData);
    },

    getAllCustomers: () => {
        return apiClient.get('/api/rest/customer/all');
    },

    // Bank Account APIs
    createBankAccount: (accountData) => {
        return apiClient.post('/api/rest/bank/create', accountData);
    },

    getAllBankAccounts: () => {
        return apiClient.get('/api/rest/bank/all');
    },

    getBankAccountByRib: (rib) => {
        return apiClient.get(`/api/rest/bank?rib=${rib}`);
    },

    // Dashboard APIs
    getDashboard: (rib = null, page = 0, size = 10) => {
        let url = `/api/rest/dashboard?page=${page}&size=${size}`;
        if (rib) {
            url += `&rib=${rib}`;
        }
        return apiClient.get(url);
    },

    // Transfer APIs
    executeTransfer: (transferData) => {
        return apiClient.post('/api/rest/transaction/transfer', transferData);
    },

    // Auth APIs
    changePassword: (currentPassword, newPassword) => {
        return apiClient.post('/api/rest/auth/change-password', {
            currentPassword,
            newPassword
        });
    }
};

export default apiService;
