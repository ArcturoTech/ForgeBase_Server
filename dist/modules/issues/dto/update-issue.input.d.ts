import { Priority } from "../../../common/graphql/enums";
export declare class UpdateIssueInput {
    id: string;
    title?: string;
    description?: string;
    points?: number;
    priority?: Priority;
    urgent?: boolean;
    done?: boolean;
}
