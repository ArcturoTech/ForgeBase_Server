import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  findMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<User> {
    return this.usersService.findUserById(user.id) as Promise<User>;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUserProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<User> {
    return this.usersService.updateUser(user.id, input) as Promise<User>;
  }
}
