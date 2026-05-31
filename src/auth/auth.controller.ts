import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  login(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@CurrentUser() user: AuthenticatedUser, @Body() _dto: RefreshTokenDto) {
    return this.authService.refreshUserTokens(user.id, user.email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logoutUser(user.id);
  }
}
