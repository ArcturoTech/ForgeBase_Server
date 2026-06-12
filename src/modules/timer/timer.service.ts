import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { StartTimerInput } from './dto/start-timer.input';

@Injectable()
export class TimerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async getActiveTimer(userId: string) {
    return this.prisma.timeEntry.findFirst({
      where: { userId, stoppedAt: null },
    });
  }

  async startTimer(userId: string, input: StartTimerInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    const active = await this.getActiveTimer(userId);
    if (active) {
      await this.stopTimerEntry(active.id);
    }
    return this.prisma.timeEntry.create({
      data: {
        orgId: input.orgId,
        userId,
        issueId: input.issueId,
      },
    });
  }

  async stopTimer(userId: string) {
    const active = await this.getActiveTimer(userId);
    if (!active) throw new NotFoundException('Nenhum timer ativo encontrado');
    return this.stopTimerEntry(active.id);
  }

  private async stopTimerEntry(id: string) {
    const entry = await this.prisma.timeEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Timer não encontrado');
    const stoppedAt = new Date();
    const duration = Math.round((stoppedAt.getTime() - entry.startedAt.getTime()) / 1000);
    return this.prisma.timeEntry.update({
      where: { id },
      data: { stoppedAt, duration },
    });
  }
}
