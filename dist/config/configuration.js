"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3333', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        proPriceId: process.env.STRIPE_PRO_PRICE_ID,
        enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    },
    app: {
        url: process.env.APP_URL ?? 'http://localhost:3333',
        frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    },
    encryption: {
        key: process.env.ENCRYPTION_KEY,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_FOLDER ?? 'forgebase',
    },
    mail: {
        region: process.env.AWS_SES_REGION,
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
        from: process.env.MAIL_FROM,
    },
});
//# sourceMappingURL=configuration.js.map