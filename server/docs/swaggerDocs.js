import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Food Saver API', // API title
            version: '1.0.0', // API version
            description: 'API documentation for the Food Saver application', // API description
        },
        servers: [
            {
                url: 'http://localhost:5555', // URL for your API
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your API docs (adjust the path if necessary)
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Set up Swagger UI at /api-docs
};
