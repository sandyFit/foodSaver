import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './config/db.js';
import swaggerDocs from './docs/swaggerDocs.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as i18nextMiddleware from 'i18next-http-middleware';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { sanitizeResponse } from './middleware/responseSanitizer.js';
import logger from './utils/logger.js';


dotenv.config();
// console.log("ENV CHECK:", process.env.MONGO_URI);
const app = express();

// ✅ Type-safe CORS config
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://localhost:5178',
        'http://localhost:5179',
    ],

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// ✅ Body parsing configuration
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'DELETE') {
        // Skip body parsing for DELETE requests
        next();
    } else {
        // Parse JSON for other methods
        express.json()(req, res, next);
    }
});

app.use(cookieParser());
// Get current directory path in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize i18next
// Initialize i18next
await i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
            addPath: join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json')
        },
        fallbackLng: 'en',
        preload: ['en', 'es'],
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        debug: process.env.I18N_DEBUG === 'true',
        saveMissing: true,
        missingKeyHandler: (lng, ns, key) => {
            //console.warn(`Missing translation: ${key}`);
        }
    });

// ✅ Apply middleware
app.use(i18nextMiddleware.handle(i18next));

app.use(sanitizeResponse);

// ✅ DB connection (add await later when you type it)
await connectToMongoDB();

// ✅ Routes with specific prefixes for each resource
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ Dev-only route logging (typed safely) for debugging
if (process.env.NODE_ENV === 'development') {
    const router = (app as any)._router;
    if (router?.stack) {
        router.stack.forEach((middleware: any) => {
            if (middleware.route) {
                logger.debug(`Registered route: ${middleware.route.path}`);
            }
        });
    }
}

// ✅ Swagger Docs
swaggerDocs(app, process.env.PORT || 5555);

// ✅ Server setup
const PORT: number = Number(process.env.PORT) || 5555;

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT} in mode: ${process.env.NODE_ENV}`);
});
