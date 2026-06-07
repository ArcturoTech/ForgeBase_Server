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
    createdAt: Date;
    updatedAt: Date;
}
