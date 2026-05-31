import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        subscription: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async removeUser(id: string) {
    await this.findUserById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }
}
