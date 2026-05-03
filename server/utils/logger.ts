import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // In production, we leave transport undefined for maximum speed (JSON output)
    transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});

export default logger;
