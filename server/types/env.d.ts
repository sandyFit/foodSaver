declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        JWT_SECRET: string;
        JWT_EXPIRE_TIME: string;
        PORT?: string;
        NODE_ENV?: string;
    }
}
