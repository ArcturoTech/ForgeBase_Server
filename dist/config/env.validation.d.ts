declare class EnvironmentVariables {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ENCRYPTION_KEY: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    FRONTEND_URL?: string;
    PORT?: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
export {};
