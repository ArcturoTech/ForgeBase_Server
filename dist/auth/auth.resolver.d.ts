import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthTokens } from './models/auth-tokens.model';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class AuthResolver {
    private readonly authService;
    private readonly jwt;
    private readonly config;
    constructor(authService: AuthService, jwt: JwtService, config: ConfigService);
    registerUser(input: RegisterUserInput): Promise<AuthTokens>;
    loginUser(input: LoginUserInput): Promise<AuthTokens>;
    refreshToken(token: string): Promise<AuthTokens>;
    logoutUser(user: AuthenticatedUser): Promise<boolean>;
}
