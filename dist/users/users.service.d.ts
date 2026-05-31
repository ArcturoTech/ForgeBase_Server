import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findUserById(id: string): Promise<{
        name: string | null;
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            stripeCustomerId: string | null;
            stripeSubscriptionId: string | null;
            stripePriceId: string | null;
            stripeCurrentPeriodEnd: Date | null;
            status: import("generated/prisma").$Enums.SubscriptionStatus;
            plan: import("generated/prisma").$Enums.Plan;
        } | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import("generated/prisma").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeUser(id: string): Promise<{
        message: string;
    }>;
}
