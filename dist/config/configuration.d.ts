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
};
export default _default;
