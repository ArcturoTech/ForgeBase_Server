import { Args, ID, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChatService, CHAT_EVENTS } from './chat.service';
import { Channel } from './models/channel.model';
import { Message } from './models/message.model';
import { MessageReaction } from './models/message-reaction.model';
import { ReactionChangedEvent } from './models/reaction-changed-event.model';
import { MessageDeletedEvent } from './models/message-deleted-event.model';
import { CreateGroupChannelInput } from './dto/create-group-channel.input';
import { SendMessageInput } from './dto/send-message.input';
import { AddReactionInput } from './dto/add-reaction.input';
import { PUB_SUB } from '@/common/pubsub/pubsub.module';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

interface MessageEventPayload {
  channelId: string;
}

@Resolver(() => Channel)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  listMyChannels(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Channel[]> {
    return this.chatService.listMyChannels(user.id, orgId) as Promise<Channel[]>;
  }

  @Query(() => Channel)
  @UseGuards(GqlAuthGuard)
  findChannelById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Channel> {
    return this.chatService.findChannelById(user.id, id) as Promise<Channel>;
  }

  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Args('channelId', { type: () => ID }) channelId: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('before', { nullable: true }) before?: string,
  ): Promise<Message[]> {
    return this.chatService.listChannelMessages(
      user.id,
      channelId,
      limit,
      before,
    ) as Promise<Message[]>;
  }

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  createGroupChannel(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateGroupChannelInput,
  ): Promise<Channel> {
    return this.chatService.createGroupChannel(user.id, input) as Promise<Channel>;
  }

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  openDirectChannel(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('targetUserId', { type: () => ID }) targetUserId: string,
    @Args('spaceId', { type: () => ID }) spaceId: string,
  ): Promise<Channel> {
    return this.chatService.openDirectChannel(
      user.id,
      orgId,
      targetUserId,
      spaceId,
    ) as Promise<Channel>;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: SendMessageInput,
  ): Promise<Message> {
    return this.chatService.sendMessage(user.id, input) as Promise<Message>;
  }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  editMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('body') body: string,
  ): Promise<Message> {
    return this.chatService.editMessage(user.id, id, body) as Promise<Message>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.chatService.removeMessage(user.id, id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  markChannelRead(
    @CurrentUser() user: AuthenticatedUser,
    @Args('channelId', { type: () => ID }) channelId: string,
  ): Promise<boolean> {
    return this.chatService.markChannelRead(user.id, channelId);
  }

  @Mutation(() => MessageReaction)
  @UseGuards(GqlAuthGuard)
  addReactionToMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: AddReactionInput,
  ): Promise<MessageReaction> {
    return this.chatService.addReactionToMessage(user.id, input) as Promise<MessageReaction>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeReactionFromMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Args('messageId', { type: () => ID }) messageId: string,
    @Args('emoji') emoji: string,
  ): Promise<boolean> {
    return this.chatService.removeReactionFromMessage(user.id, messageId, emoji);
  }

  @Subscription(() => Message, {
    filter: (payload: MessageEventPayload, variables: { channelId: string }) =>
      payload.channelId === variables.channelId,
  })
  messageReceived(@Args('channelId', { type: () => ID }) _channelId: string) {
    return this.pubSub.asyncIterator(CHAT_EVENTS.messageReceived);
  }

  @Subscription(() => Message, {
    filter: (payload: MessageEventPayload, variables: { channelId: string }) =>
      payload.channelId === variables.channelId,
  })
  messageEdited(@Args('channelId', { type: () => ID }) _channelId: string) {
    return this.pubSub.asyncIterator(CHAT_EVENTS.messageEdited);
  }

  @Subscription(() => MessageDeletedEvent, {
    filter: (payload: MessageEventPayload, variables: { channelId: string }) =>
      payload.channelId === variables.channelId,
  })
  messageDeleted(@Args('channelId', { type: () => ID }) _channelId: string) {
    return this.pubSub.asyncIterator(CHAT_EVENTS.messageDeleted);
  }

  @Subscription(() => ReactionChangedEvent, {
    filter: (payload: MessageEventPayload, variables: { channelId: string }) =>
      payload.channelId === variables.channelId,
  })
  reactionChanged(@Args('channelId', { type: () => ID }) _channelId: string) {
    return this.pubSub.asyncIterator(CHAT_EVENTS.reactionChanged);
  }
}
