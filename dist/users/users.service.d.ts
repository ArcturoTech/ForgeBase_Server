import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../common/storage/storage.service";
import { UpdateUserProfileInput } from './dto/update-user-profile.input';
import { UpdateUserPreferencesInput } from './dto/update-user-preferences.input';
import { UpdateUserPasswordInput } from './dto/update-user-password.input';
export declare class UsersService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    findUserById(id: string): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserProfile(id: string, input: UpdateUserProfileInput): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserPreferences(id: string, input: UpdateUserPreferencesInput): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserPassword(id: string, input: UpdateUserPasswordInput): Promise<boolean>;
    updateUserAvatar(id: string, file: Express.Multer.File): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeUserAvatar(id: string): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeUser(id: string): Promise<{
        message: string;
    }>;
}
