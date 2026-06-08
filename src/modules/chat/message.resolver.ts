import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Message } from './models/message.model';
import { ReactionGroup } from './models/reaction-group.model';
import { Attachment } from '@/modules/attachments/models/attachment.model';
import type { AppLoaders } from '@/common/dataloader/loaders';

@Resolver(() => Message)
export class MessageResolver {
  @ResolveField(() => [ReactionGroup])
  reactions(
    @Parent() message: Message,
    @Context('loaders') loaders: AppLoaders,
  ): Promise<ReactionGroup[]> {
    return loaders.messageReactions.load(message.id);
  }

  @ResolveField(() => [Attachment])
  attachments(
    @Parent() message: Message,
    @Context('loaders') loaders: AppLoaders,
  ): Promise<Attachment[]> {
    return loaders.messageAttachments.load(message.id);
  }

  @ResolveField(() => Message, { nullable: true })
  replyTo(
    @Parent() message: Message,
    @Context('loaders') loaders: AppLoaders,
  ): Promise<Message | null> | null {
    if (!message.replyToId) return null;
    return loaders.messageById.load(message.replyToId);
  }
}
