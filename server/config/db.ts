import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectToMongoDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URI;

        // TypeScript Guard: Ensure the URI exists before passing it to mongoose
        if (!MONGO_URL) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }

        const conn = await mongoose.connect(MONGO_URL)   
        logger.info(`Database connected to MongoDB: ${conn.connection.host}`);
        // 1 = connected, 2 = connecting, etc.
        logger.info(`Connection state: ${mongoose.connection.readyState}`);

    } catch (error: any) {
        logger.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the application if DB connection fails
    }
};

export default connectToMongoDB;
