import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Food Saver API', // API title
            version: '1.0.0', // API version
            description: 'API documentation for the Food Saver application', // API description
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5555}/api`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to your API docs (adjust the path if necessary)
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default (app, port) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Set up Swagger UI at /api-docs
    console.log(`Docs available at http://localhost:${port}/api-docs`);
};



