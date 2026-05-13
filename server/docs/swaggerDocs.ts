import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { Express } from 'express';
import logger from '../utils/logger.js';

dotenv.config();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Food Saver API',
            version: '1.0.0',
            description: 'API documentation for the Food Saver application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5555}/api`,
                description: 'Local server',
            },
        ],
        security: [{
            bearerAuth: []
        }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token in format: Bearer <token>'
                },
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Authentication failed',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: 'Unauthorized',
                                },
                            }
                        },
                    },
                },
            },
        },
        basePath: '/api', // Add this line to specify the base path
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default (app: Express, port: number | string): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    logger.info(`Docs available at http://localhost:${port}/api-docs`);
};
