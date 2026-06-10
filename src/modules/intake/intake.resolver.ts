import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';
import { IntakeService } from './intake.service';
import { IntakeForm, IntakeSubmissionResult, PublicIntakeForm } from './models/intake-form.model';
import { SubmitIntakeFormInput } from './dto/submit-intake-form.input';

@Resolver()
export class IntakeResolver {
  constructor(private readonly intake: IntakeService) {}

  // --- Authenticated (project owners/members) ---

  @Query(() => IntakeForm, { nullable: true })
  @UseGuards(GqlAuthGuard)
  projectIntakeForm(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ) {
    return this.intake.getProjectForm(user.id, projectId);
  }

  @Mutation(() => IntakeForm)
  @UseGuards(GqlAuthGuard)
  generateProjectIntakeForm(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
  ) {
    return this.intake.ensureProjectForm(user.id, projectId);
  }

  @Mutation(() => IntakeForm)
  @UseGuards(GqlAuthGuard)
  setProjectIntakeFormActive(
    @CurrentUser() user: AuthenticatedUser,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('active') active: boolean,
  ) {
    return this.intake.setActive(user.id, projectId, active);
  }

  // --- Public (no login). Rate-limited; the token is the only credential. ---

  @Query(() => PublicIntakeForm)
  intakeFormByToken(@Args('token') token: string) {
    return this.intake.getPublicFormByToken(token);
  }

  @Mutation(() => IntakeSubmissionResult)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  submitIntakeForm(
    @Args('token') token: string,
    @Args('input') input: SubmitIntakeFormInput,
  ) {
    return this.intake.submitByToken(token, input);
  }
}
