import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';

export const ACTIVITY_EVENTS = { recorded: 'activityRecorded' } as const;

const ACTOR_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

type RecordActivityInput = {
  orgId: string;
  userId: string;
  action: string;
  targetType?: string;
  targetId?: string;
};

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async recordActivity(input: RecordActivityInput) {
    const activity = await this.prisma.activity.create({
      data: {
        orgId: input.orgId,
        userId: input.userId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
      },
    });
    await this.pubSub.publish(ACTIVITY_EVENTS.recorded, {
      [ACTIVITY_EVENTS.recorded]: activity,
      orgId: activity.orgId,
    });
    return activity;
  }

  async listActivityByOrg(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    return this.prisma.activity.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
  }

  findActivityActor(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: ACTOR_FIELDS });
  }
}
