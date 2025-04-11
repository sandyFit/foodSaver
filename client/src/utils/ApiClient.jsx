import axios from 'axios';
import { toast } from 'react-hot-toast';
import i18next from 'i18next';

const BASE_URL = 'http://localhost:5555/api';
const PUBLIC_ROUTES = ['login', 'register'];
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

class ApiClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                this.logRequest(config);
                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                this.logResponse(response);
                return response;
            },
            async (error) => {
                console.error('Response interceptor error:', error);
                return this.handleError(error);
            }
        );
    }

    logRequest(config) {
        console.log('📝 Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data || 'No body',
        });
    }

    logResponse(response) {
        console.log('📝 Response:', {
            status: response.status,
            data: response.data,
        });
    }

    async handleError(error) {

        // Add CORS specific error handling
        if (error.message.includes('Network Error') || error.message.includes('CORS')) {
            const message = i18next.t('errors.corsError', {
                origin: window.location.origin,
                api: BASE_URL
            });
            toast.error(message);
            console.error('CORS Error:', {
                origin: window.location.origin,
                api: BASE_URL,
                error: error.message
            });
            throw new Error(message);
        };
        
        if (!error.response) {
            // Network error
            toast.error(i18next.t('errors.networkError'));
            throw new Error(i18next.t('errors.networkError'));
        }

        const { status, data } = error.response;
        const isPublicRoute = PUBLIC_ROUTES.some(route =>
            error.config.url.includes(route)
        );

        // Handle 401 Unauthorized
        if (status === 401 && !isPublicRoute) {
            localStorage.removeItem('token');
            const message = i18next.t('auth.sessionExpired');
            toast.error(message);
            throw new Error(message);
        }

        // Handle other errors
        const message = data?.message
            ? i18next.t(data.message)
            : i18next.t('errors.operationFailed');

        toast.error(message);
        throw new Error(message);
    }

    async request(url, method = 'GET', data = null, retries = MAX_RETRIES) {
        try {
            const isPublicRoute = PUBLIC_ROUTES.some(route => url.includes(route));
            const headers = { 'Accept': 'application/json' };

            // Only set Content-Type for requests that may have a body
            if (method !== 'GET' && method !== 'DELETE') {
                headers['Content-Type'] = 'application/json';
            }

            // Add auth token for protected routes
            if (!isPublicRoute) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
            }

            const config = {
                method,
                url,
                headers,
            };

            // Only include data for methods that support a body
            if (method !== 'GET' && method !== 'DELETE' && data) {
                config.data = data;
            }

            const response = await this.axiosInstance(config);
            return response.data;

        } catch (error) {
            if (retries > 0 && this.shouldRetry(error)) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return this.request(url, method, data, retries - 1);
            }
            throw error;
        }
    }

    // logRequest(config) {
    //     console.log('📝 Request:', {
    //         method: config.method.toUpperCase(),
    //         url: config.url,
    //         fullUrl: config.baseURL + config.url, 
    //         headers: config.headers,
    //         data: config.data || 'No body',
    //     });
    // }

    shouldRetry(error) {
        // Retry on network errors or 5xx server errors
        return !error.response ||
            (error.response.status >= 500 && error.response.status < 600);
    }

    // Convenience methods
    get(url) {
        return this.request(url);
    }

    post(url, data) {
        return this.request(url, 'POST', data);
    }

    put(url, data) {
        return this.request(url, 'PUT', data);
    }

    delete(url) {
        return this.request(url, 'DELETE');
    }
}

export const apiClient = new ApiClient();
