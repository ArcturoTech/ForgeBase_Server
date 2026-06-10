import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    registerUser(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private slugifyOrgName;
    private generateUniqueOrgSlug;
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
    private generateTokens;
    private saveRefreshToken;
}
