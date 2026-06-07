declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        accessSecret: string | undefined;
        refreshSecret: string | undefined;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        proPriceId: string | undefined;
        enterprisePriceId: string | undefined;
    };
    app: {
        url: string;
        frontendUrl: string;
    };
    encryption: {
        key: string | undefined;
    };
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
        folder: string;
    };
};
export default _default;
