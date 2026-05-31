import { ContractsService } from './contracts.service';
import { Contract } from './models/contract.model';
import { Project } from "../projects/models/project.model";
import { PaginatedContracts } from './models/paginated-contracts.model';
import { CreateContractInput } from './dto/create-contract.input';
import { UpdateContractInput } from './dto/update-contract.input';
import { PaginationInput } from "../../common/pagination/pagination.input";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
export declare class ContractsResolver {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    listContracts(user: AuthenticatedUser, orgId: string, pagination: PaginationInput): Promise<PaginatedContracts>;
    findContractById(user: AuthenticatedUser, id: string): Promise<Contract>;
    listExpiringContracts(user: AuthenticatedUser, orgId: string): Promise<Contract[]>;
    createContract(user: AuthenticatedUser, input: CreateContractInput): Promise<Contract>;
    updateContract(user: AuthenticatedUser, input: UpdateContractInput): Promise<Contract>;
    renewContract(user: AuthenticatedUser, id: string, expiresAt: Date): Promise<Contract>;
    removeContract(user: AuthenticatedUser, id: string): Promise<boolean>;
    project(contract: Contract): Promise<Project | null>;
}
