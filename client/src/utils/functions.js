import { format } from 'date-fns';

export const formatDate = (date) => {
    if (!date) return 'N/A';

    // Crear el objeto Date sin conversión automática de zona horaria
    const dateObj = new Date(date);

    // Forzamos la fecha para que se mantenga en UTC
    const utcDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());

    // Formateamos la fecha en formato YYYY-MM-DD
    return format(utcDate, 'yyyy-MM-dd');
};
