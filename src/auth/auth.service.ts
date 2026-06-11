import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/common/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

const OTP_TTL_MS = 15 * 60 * 1000;
const RESET_TTL_MS = 30 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const orgSlug = dto.orgName ? await this.generateUniqueOrgSlug(dto.orgName) : null;

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { name: dto.name, email: dto.email, password: hashed },
      });
      if (dto.orgName && orgSlug) {
        const organization = await tx.organization.create({
          data: { name: dto.orgName, slug: orgSlug },
        });
        await tx.membership.create({
          data: { orgId: organization.id, userId: created.id, role: 'OWNER' },
        });
      }
      return created;
    });

    await this.sendEmailVerificationFor(user.id, user.email);
    return this.issueTokens(user.id, user.email);
  }

  async registerInvitedUser(params: { name: string; email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(params.password, 10);
    const user = await this.prisma.user.create({
      data: { name: params.name, email: params.email, password: hashed },
    });

    await this.sendEmailVerificationFor(user.id, user.email);
    const tokens = await this.issueTokens(user.id, user.email);
    return { user, tokens };
  }

  async loginUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user?.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email);
  }

  async refreshUserTokens(userId: string, email: string) {
    return this.issueTokens(userId, email);
  }

  async logoutUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  async verifyEmailOtp(userId: string, code: string) {
    const record = await this.prisma.emailVerification.findUnique({ where: { userId } });
    if (!record || record.code !== code.trim()) {
      throw new BadRequestException('Código de verificação inválido');
    }
    if (record.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Código de verificação expirado');
    }
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { emailVerified: true } }),
      this.prisma.emailVerification.delete({ where: { userId } }),
    ]);
    return true;
  }

  async resendEmailOtp(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.emailVerified) return true;
    await this.sendEmailVerificationFor(userId, user.email);
    return true;
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.trim() } });
    if (user) {
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TTL_MS);
      await this.prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });
      const frontendUrl = this.config.get<string>('app.frontendUrl') ?? 'http://localhost:3000';
      await this.mail.sendPasswordReset({
        to: user.email,
        resetUrl: `${frontendUrl}/reset-password?token=${token}`,
      });
    }
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('A senha deve ter ao menos 6 caracteres');
    }
    const record = await this.prisma.passwordReset.findUnique({ where: { token } });
    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Link de redefinição inválido ou expirado');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed, refreshToken: null },
      }),
      this.prisma.passwordReset.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    ]);
    return true;
  }

  private async sendEmailVerificationFor(userId: string, email: string) {
    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await this.prisma.emailVerification.upsert({
      where: { userId },
      create: { userId, code, expiresAt },
      update: { code, expiresAt },
    });
    await this.mail.sendEmailVerification({ to: email, code });
  }

  private async issueTokens(userId: string, email: string) {
    const tokens = await this.generateTokens(userId, email);
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private slugifyOrgName(value: string): string {
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    return slug || 'org';
  }

  private async generateUniqueOrgSlug(name: string): Promise<string> {
    const base = this.slugifyOrgName(name);
    let slug = base;
    let suffix = 1;
    while (await this.prisma.organization.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessOptions: JwtSignOptions = {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiresIn') as JwtSignOptions['expiresIn'],
    };
    const refreshOptions: JwtSignOptions = {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn') as JwtSignOptions['expiresIn'],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, accessOptions),
      this.jwt.signAsync(payload, refreshOptions),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
