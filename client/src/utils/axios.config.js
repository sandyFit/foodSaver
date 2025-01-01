import axios from 'axios';

// Configura Axios para enviar cookies en las solicitudes
axios.defaults.withCredentials = true;

// Configura la URL base si es necesario
axios.defaults.baseURL = 'http://localhost:5555/api/';

// También puedes configurar otros valores predeterminados de Axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Exporta la instancia de Axios para usarla en otras partes de tu aplicación
export default axios;
