import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/db.js';
import swaggerDocs from './docs/swaggerDocs.js';
import itemRoutes from './routes/itemRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: false, // Si se envia cookies o encabezados de autenticación
}));

// Connect to the database
connectToMongoDB();

// Routes
app.use('/api', itemRoutes);
app.use('/api', recipeRoutes);
app.use('/api', userRoutes);

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Ruta registrada: ${middleware.route.path}`);
    }
});


swaggerDocs(app);

// Server setup
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} in mode: ${process.env.NODE_ENV }`);
});
