import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/common/storage/storage.service';
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import { UpdateUserPreferencesInput } from './dto/update-user-preferences.input';
import { UpdateUserPasswordInput } from './dto/update-user-password.input';

const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  avatarUrl: true,
  jobTitle: true,
  bio: true,
  phone: true,
  linkedIn: true,
  theme: true,
  locale: true,
  timezone: true,
  dateFormat: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...PROFILE_SELECT, subscription: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserProfile(id: string, input: UpdateUserProfileInput) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: input,
      select: PROFILE_SELECT,
    });
  }

  async updateUserPreferences(id: string, input: UpdateUserPreferencesInput) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: input,
      select: PROFILE_SELECT,
    });
  }

  async updateUserPassword(id: string, input: UpdateUserPasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.password)
      throw new BadRequestException('Esta conta não usa senha local');

    const matches = await bcrypt.compare(input.currentPassword, user.password);
    if (!matches) throw new UnauthorizedException('Senha atual incorreta');

    const hashed = await bcrypt.hash(input.newPassword, 10);
    await this.prisma.user.update({ where: { id }, data: { password: hashed } });
    return true;
  }

  async updateUserAvatar(id: string, file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('Arquivo não enviado');
    if (!file.mimetype.startsWith('image/'))
      throw new BadRequestException('Envie um arquivo de imagem');

    await this.findUserById(id);
    const stored = await this.storage.saveFile(
      file.buffer,
      file.originalname,
      'avatars',
    );
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl: stored.url },
      select: PROFILE_SELECT,
    });
  }

  async removeUserAvatar(id: string) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl: null },
      select: PROFILE_SELECT,
    });
  }

  async removeUser(id: string) {
    await this.findUserById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }

  async revokeAllUserSessions(userId: string) {
    await this.findUserById(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return true;
  }

  async deleteMyAccount(userId: string) {
    await this.findUserById(userId);
    await this.prisma.user.delete({ where: { id: userId } });
    return true;
  }

  async findUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        jobTitle: true,
        bio: true,
        createdAt: true,
        userStatus: true,
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
