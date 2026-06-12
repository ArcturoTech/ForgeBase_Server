import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../common/mail/mail.service";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private mail;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, mail: MailService);
    registerUser(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    registerInvitedUser(params: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        user: {
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
            password: string | null;
            refreshToken: string | null;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    loginUser(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshUserTokens(userId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutUser(userId: string): Promise<{
        message: string;
    }>;
    verifyEmailOtp(userId: string, code: string): Promise<boolean>;
    resendEmailOtp(userId: string): Promise<boolean>;
    requestPasswordReset(email: string): Promise<boolean>;
    resetPassword(token: string, newPassword: string): Promise<boolean>;
    private sendEmailVerificationFor;
    private issueTokens;
    private slugifyOrgName;
    private generateUniqueOrgSlug;
    private generateTokens;
    private saveRefreshToken;
}
