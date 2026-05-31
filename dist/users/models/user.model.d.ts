import { Role } from "../../common/graphql/enums";
export declare class User {
    id: string;
    name?: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
