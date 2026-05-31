import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(user: AuthenticatedUser, _dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
