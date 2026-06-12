"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../common/mail/mail.service");
const bcrypt = __importStar(require("bcryptjs"));
const OTP_TTL_MS = 15 * 60 * 1000;
const RESET_TTL_MS = 30 * 60 * 1000;
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    mail;
    constructor(prisma, jwt, config, mail) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.mail = mail;
    }
    async registerUser(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
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
    async registerInvitedUser(params) {
        const exists = await this.prisma.user.findUnique({ where: { email: params.email } });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(params.password, 10);
        const user = await this.prisma.user.create({
            data: { name: params.name, email: params.email, password: hashed },
        });
        await this.sendEmailVerificationFor(user.id, user.email);
        const tokens = await this.issueTokens(user.id, user.email);
        return { user, tokens };
    }
    async loginUser(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user?.password)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueTokens(user.id, user.email);
    }
    async refreshUserTokens(userId, email) {
        return this.issueTokens(userId, email);
    }
    async logoutUser(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
    async verifyEmailOtp(userId, code) {
        const record = await this.prisma.emailVerification.findUnique({ where: { userId } });
        if (!record || record.code !== code.trim()) {
            throw new common_1.BadRequestException('Código de verificação inválido');
        }
        if (record.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('Código de verificação expirado');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: userId }, data: { emailVerified: true } }),
            this.prisma.emailVerification.delete({ where: { userId } }),
        ]);
        return true;
    }
    async resendEmailOtp(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, emailVerified: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        if (user.emailVerified)
            return true;
        await this.sendEmailVerificationFor(userId, user.email);
        return true;
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email: email.trim() } });
        if (user) {
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            const expiresAt = new Date(Date.now() + RESET_TTL_MS);
            await this.prisma.passwordReset.create({ data: { userId: user.id, token, expiresAt } });
            const frontendUrl = this.config.get('app.frontendUrl') ?? 'http://localhost:3000';
            void this.mail.sendPasswordReset({
                to: user.email,
                resetUrl: `${frontendUrl}/reset-password?token=${token}`,
            });
        }
        return true;
    }
    async resetPassword(token, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new common_1.BadRequestException('A senha deve ter ao menos 6 caracteres');
        }
        const record = await this.prisma.passwordReset.findUnique({ where: { token } });
        if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('Link de redefinição inválido ou expirado');
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
    async sendEmailVerificationFor(userId, email) {
        const code = (0, crypto_1.randomInt)(100000, 1000000).toString();
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);
        await this.prisma.emailVerification.upsert({
            where: { userId },
            create: { userId, code, expiresAt },
            update: { code, expiresAt },
        });
        void this.mail.sendEmailVerification({ to: email, code });
    }
    async issueTokens(userId, email) {
        const tokens = await this.generateTokens(userId, email);
        await this.saveRefreshToken(userId, tokens.refreshToken);
        return tokens;
    }
    slugifyOrgName(value) {
        const slug = value
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 40);
        return slug || 'org';
    }
    async generateUniqueOrgSlug(name) {
        const base = this.slugifyOrgName(name);
        let slug = base;
        let suffix = 1;
        while (await this.prisma.organization.findUnique({ where: { slug } })) {
            slug = `${base}-${suffix}`;
            suffix += 1;
        }
        return slug;
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
        const accessOptions = {
            secret: this.config.get('jwt.accessSecret'),
            expiresIn: this.config.get('jwt.accessExpiresIn'),
        };
        const refreshOptions = {
            secret: this.config.get('jwt.refreshSecret'),
            expiresIn: this.config.get('jwt.refreshExpiresIn'),
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, accessOptions),
            this.jwt.signAsync(payload, refreshOptions),
        ]);
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const hashed = await bcrypt.hash(token, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map