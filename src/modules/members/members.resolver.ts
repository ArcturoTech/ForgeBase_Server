import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './models/member.model';
import { User } from '@/users/models/user.model';
import { MemberRole } from '@/common/graphql/enums';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { InviteMemberByEmailInput } from './dto/invite-member-by-email.input';

@Resolver(() => Member)
export class MembersResolver {
  constructor(private readonly membersService: MembersService) {}

  @Query(() => [Member])
  @UseGuards(GqlAuthGuard)
  listMembers(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
  ): Promise<Member[]> {
    return this.membersService.listMembers(user.id, orgId) as Promise<Member[]>;
  }

  @Mutation(() => Member)
  @UseGuards(GqlAuthGuard)
  inviteMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @Args('role', { type: () => MemberRole, nullable: true }) role?: MemberRole,
    @Args('title', { nullable: true }) title?: string,
  ): Promise<Member> {
    return this.membersService.inviteMember(user.id, orgId, userId, role, title) as Promise<Member>;
  }

  @Mutation(() => Member)
  @UseGuards(GqlAuthGuard)
  inviteMemberByEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: InviteMemberByEmailInput,
  ): Promise<Member> {
    return this.membersService.inviteMemberByEmail(user.id, input) as Promise<Member>;
  }

  @Mutation(() => Member)
  @UseGuards(GqlAuthGuard)
  updateMemberRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('membershipId', { type: () => ID }) membershipId: string,
    @Args('role', { type: () => MemberRole }) role: MemberRole,
  ): Promise<Member> {
    return this.membersService.updateMemberRole(user.id, membershipId, role) as Promise<Member>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Args('membershipId', { type: () => ID }) membershipId: string,
  ): Promise<boolean> {
    return this.membersService.removeMember(user.id, membershipId);
  }

  @ResolveField(() => User)
  user(@Parent() member: Member): Promise<User> {
    return this.membersService.findUserByMember(member.userId) as Promise<User>;
  }
}
