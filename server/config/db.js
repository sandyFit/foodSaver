import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URI;
        const conn = await mongoose.connect(MONGO_URL)   
        console.log(`Database connected to MongoDB: ${conn.connection.host} \nDatabase connected: ${mongoose.connection.readyState}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the application if DB connection fails
    }
};

export default connectToMongoDB;
