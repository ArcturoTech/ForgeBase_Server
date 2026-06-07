import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './models/attachment.model';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Attachment)
export class AttachmentsResolver {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Query(() => [Attachment])
  @UseGuards(GqlAuthGuard)
  listAttachmentsByTarget(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('targetType') targetType: string,
    @Args('targetId', { type: () => ID }) targetId: string,
  ): Promise<Attachment[]> {
    return this.attachmentsService.listAttachmentsByTarget(
      user.id,
      orgId,
      targetType,
      targetId,
    ) as Promise<Attachment[]>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeAttachment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.attachmentsService.removeAttachment(user.id, id);
  }
}
