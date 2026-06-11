import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthTokens } from './models/auth-tokens.model';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Mutation(() => AuthTokens)
  registerUser(@Args('input') input: RegisterUserInput): Promise<AuthTokens> {
    return this.authService.registerUser(input);
  }

  @Mutation(() => AuthTokens)
  loginUser(@Args('input') input: LoginUserInput): Promise<AuthTokens> {
    return this.authService.loginUser(input);
  }

  @Mutation(() => AuthTokens)
  async refreshToken(@Args('token') token: string): Promise<AuthTokens> {
    const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(token, {
      secret: this.config.get<string>('jwt.refreshSecret'),
    });
    return this.authService.refreshUserTokens(payload.sub, payload.email);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logoutUser(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    await this.authService.logoutUser(user.id);
    return true;
  }

  @Mutation(() => Boolean)
  requestPasswordReset(@Args('email') email: string): Promise<boolean> {
    return this.authService.requestPasswordReset(email);
  }

  @Mutation(() => Boolean)
  resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    return this.authService.resetPassword(token, newPassword);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  verifyEmailOtp(
    @CurrentUser() user: AuthenticatedUser,
    @Args('code') code: string,
  ): Promise<boolean> {
    return this.authService.verifyEmailOtp(user.id, code);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  resendEmailOtp(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    return this.authService.resendEmailOtp(user.id);
  }
}
