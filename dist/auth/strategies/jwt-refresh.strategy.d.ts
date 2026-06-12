import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from "../../prisma/prisma.service";
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private config;
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(req: Request, payload: {
        sub: string;
        email: string;
    }): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        avatarUrl: string | null;
        jobTitle: string | null;
        bio: string | null;
        theme: string;
        locale: string;
        phone: string | null;
        linkedIn: string | null;
        timezone: string;
        dateFormat: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
