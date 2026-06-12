import { Role } from "../../common/graphql/enums";
export declare class User {
    id: string;
    name?: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    avatarUrl?: string;
    jobTitle?: string;
    bio?: string;
    theme: string;
    locale: string;
    phone?: string;
    linkedIn?: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
