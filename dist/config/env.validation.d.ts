declare class EnvironmentVariables {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    FRONTEND_URL?: string;
    PORT?: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
export {};
