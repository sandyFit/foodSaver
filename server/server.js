import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/db.js';
import swaggerDocs from './docs/swaggerDocs.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Body parsing configuration
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.method === 'DELETE') {
        // Skip body parsing for DELETE requests
        next();
    } else {
        // Parse JSON for other methods
        express.json()(req, res, next);
    }
});

app.use(cookieParser());

// DB Connection
connectToMongoDB();

// Routes
app.use('/api', recipeRoutes);
app.use('/api', userRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', notificationRoutes);

// Route logging (for debugging)
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Registered route: ${middleware.route.path}`);
    }
});

// Swagger Docs
swaggerDocs(app, process.env.PORT || 5555);

// Server setup
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} in mode: ${process.env.NODE_ENV}`);
});
