import axios from './axios.config';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:5555/api';

export const apiClient = {
    async request(url, method = 'GET', data = null) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            // Add auth token for protected routes
            if (!url.includes('register') && !url.includes('login')) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }

            const config = {
                method,
                url: `${BASE_URL}/${url}`,
                headers,
                withCredentials: true,
                ...(data && { data })
            };

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('No autorizado. Por favor inicia sesión.');
            }
            throw error;
        }
    }
};
