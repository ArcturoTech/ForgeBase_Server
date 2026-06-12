import { UsersService } from './users.service';
import type { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(user: AuthenticatedUser): Promise<{
        name: string | null;
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            plan: import("generated/prisma").$Enums.Plan;
            status: import("generated/prisma").$Enums.SubscriptionStatus;
            stripeCustomerId: string | null;
            stripeSubscriptionId: string | null;
            stripePriceId: string | null;
            stripeCurrentPeriodEnd: Date | null;
        } | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        avatarUrl: string | null;
        jobTitle: string | null;
        bio: string | null;
        theme: string;
        locale: string;
        phone: string | null;
        linkedIn: string | null;
        timezone: string;
        dateFormat: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(user: AuthenticatedUser, dto: UpdateUserDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        avatarUrl: string | null;
        jobTitle: string | null;
        bio: string | null;
        theme: string;
        locale: string;
        phone: string | null;
        linkedIn: string | null;
        timezone: string;
        dateFormat: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadMyAvatar(user: AuthenticatedUser, file: Express.Multer.File): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        avatarUrl: string | null;
        jobTitle: string | null;
        bio: string | null;
        theme: string;
        locale: string;
        phone: string | null;
        linkedIn: string | null;
        timezone: string;
        dateFormat: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMe(user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
