import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatSpaceRole } from '@/common/graphql/enums';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { ChatService } from '@/modules/chat/chat.service';
import { Channel } from '@/modules/chat/models/channel.model';
import { ChatSpacesService } from './chat-spaces.service';
import { ChatSpace } from './models/chat-space.model';
import { ChatSpaceMember } from './models/chat-space-member.model';
import { CreateChatSpaceInput } from './dto/create-chat-space.input';
import { UpdateChatSpaceInput } from './dto/update-chat-space.input';
import { InviteChatSpaceMemberInput } from './dto/invite-chat-space-member.input';

@Resolver(() => ChatSpace)
export class ChatSpacesResolver {
  constructor(
    private readonly chatSpacesService: ChatSpacesService,
    private readonly chatService: ChatService,
  ) {}

  @Query(() => [ChatSpace])
  @UseGuards(GqlAuthGuard)
  listMyChatSpaces(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<ChatSpace[]> {
    return this.chatSpacesService.listChatSpacesForUser(user.id, orgId) as Promise<ChatSpace[]>;
  }

  @Query(() => ChatSpace)
  @UseGuards(GqlAuthGuard)
  findChatSpaceById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ChatSpace> {
    return this.chatSpacesService.findChatSpaceById(user.id, id) as Promise<ChatSpace>;
  }

  @Query(() => [ChatSpaceMember])
  @UseGuards(GqlAuthGuard)
  listChatSpaceMembers(
    @CurrentUser() user: AuthenticatedUser,
    @Args('spaceId', { type: () => ID }) spaceId: string,
  ): Promise<ChatSpaceMember[]> {
    return this.chatSpacesService.listChatSpaceMembers(
      user.id,
      spaceId,
    ) as Promise<ChatSpaceMember[]>;
  }

  @Query(() => [Channel])
  @UseGuards(GqlAuthGuard)
  listChannelsBySpace(
    @CurrentUser() user: AuthenticatedUser,
    @Args('spaceId', { type: () => ID }) spaceId: string,
  ): Promise<Channel[]> {
    return this.chatService.listChannelsBySpace(user.id, spaceId) as Promise<Channel[]>;
  }

  @Mutation(() => ChatSpace)
  @UseGuards(GqlAuthGuard)
  createChatSpace(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateChatSpaceInput,
  ): Promise<ChatSpace> {
    return this.chatSpacesService.createChatSpace(user.id, input) as Promise<ChatSpace>;
  }

  @Mutation(() => ChatSpace)
  @UseGuards(GqlAuthGuard)
  updateChatSpace(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateChatSpaceInput,
  ): Promise<ChatSpace> {
    return this.chatSpacesService.updateChatSpace(user.id, id, input) as Promise<ChatSpace>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeChatSpace(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.chatSpacesService.removeChatSpace(user.id, id);
  }

  @Mutation(() => ChatSpaceMember)
  @UseGuards(GqlAuthGuard)
  inviteChatSpaceMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: InviteChatSpaceMemberInput,
  ): Promise<ChatSpaceMember> {
    return this.chatSpacesService.inviteChatSpaceMember(
      user.id,
      input,
    ) as Promise<ChatSpaceMember>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeChatSpaceMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('spaceId', { type: () => ID }) spaceId: string,
    @Args('targetUserId', { type: () => ID }) targetUserId: string,
  ): Promise<boolean> {
    return this.chatSpacesService.removeChatSpaceMember(user.id, spaceId, targetUserId);
  }

  @Mutation(() => ChatSpaceMember)
  @UseGuards(GqlAuthGuard)
  updateChatSpaceMemberRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('spaceId', { type: () => ID }) spaceId: string,
    @Args('targetUserId', { type: () => ID }) targetUserId: string,
    @Args('role', { type: () => ChatSpaceRole }) role: ChatSpaceRole,
  ): Promise<ChatSpaceMember> {
    return this.chatSpacesService.updateChatSpaceMemberRole(
      user.id,
      spaceId,
      targetUserId,
      role,
    ) as Promise<ChatSpaceMember>;
  }
}
