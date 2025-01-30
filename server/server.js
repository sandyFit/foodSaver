import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/db.js';
import swaggerDocs from './docs/swaggerDocs.js';
import itemRoutes from './routes/itemRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware para datos codificados en URL
app.use(cookieParser());

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true // Permitir cookies
}));

// Connect to the database
connectToMongoDB();

// Routes
app.use('/api', itemRoutes);
app.use('/api', recipeRoutes);
app.use('/api', userRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', notificationRoutes);

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Ruta registrada: ${middleware.route.path}`);
    }
});


// Swagger Docs
swaggerDocs(app, process.env.PORT || 5555);

// Server setup
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} in mode: ${process.env.NODE_ENV }`);
});
