import axios from 'axios';

// Configura Axios para enviar cookies en las solicitudes
axios.defaults.withCredentials = true;

// Configura la URL base si es necesario
axios.defaults.baseURL = 'http://localhost:5555/api/';

// También puedes configurar otros valores predeterminados de Axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// axios response interceptor to handle 403 errors globally
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Exporta la instancia de Axios para usarla en otras partes de tu aplicación
export default axios;
