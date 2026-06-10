import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { Invitation } from './models/invitation.model';
import { InviteToOrganizationInput } from './dto/invite-to-organization.input';
import { InvitationStatus } from '@/common/graphql/enums';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => Invitation)
export class InvitationsResolver {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Query(() => [Invitation])
  @UseGuards(GqlAuthGuard)
  listOrganizationInvitations(
    @CurrentUser() user: AuthenticatedUser,
    @Args('orgId', { type: () => ID }) orgId: string,
    @Args('status', { type: () => InvitationStatus, nullable: true }) status?: InvitationStatus,
  ): Promise<Invitation[]> {
    return this.invitationsService.listOrganizationInvitations(
      user.id,
      orgId,
      status ?? InvitationStatus.PENDING,
    ) as Promise<Invitation[]>;
  }

  @Query(() => Invitation)
  invitationByToken(@Args('token') token: string): Promise<Invitation> {
    return this.invitationsService.invitationByToken(token) as Promise<Invitation>;
  }

  @Mutation(() => Invitation)
  @UseGuards(GqlAuthGuard)
  inviteToOrganization(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: InviteToOrganizationInput,
  ): Promise<Invitation> {
    return this.invitationsService.inviteToOrganization(user.id, input) as Promise<Invitation>;
  }

  @Mutation(() => Invitation)
  @UseGuards(GqlAuthGuard)
  acceptInvitation(
    @CurrentUser() user: AuthenticatedUser,
    @Args('token') token: string,
  ): Promise<Invitation> {
    return this.invitationsService.acceptInvitation(user.id, token) as Promise<Invitation>;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  revokeInvitation(
    @CurrentUser() user: AuthenticatedUser,
    @Args('invitationId', { type: () => ID }) invitationId: string,
  ): Promise<boolean> {
    return this.invitationsService.revokeInvitation(user.id, invitationId);
  }

  @Mutation(() => Invitation)
  @UseGuards(GqlAuthGuard)
  resendInvitation(
    @CurrentUser() user: AuthenticatedUser,
    @Args('invitationId', { type: () => ID }) invitationId: string,
  ): Promise<Invitation> {
    return this.invitationsService.resendInvitation(user.id, invitationId) as Promise<Invitation>;
  }
}
