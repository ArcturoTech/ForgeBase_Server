import { UsersService } from './users.service';
import { User } from './models/user.model';
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    findMyProfile(user: AuthenticatedUser): Promise<User>;
    updateUserProfile(user: AuthenticatedUser, input: UpdateUserProfileInput): Promise<User>;
}
