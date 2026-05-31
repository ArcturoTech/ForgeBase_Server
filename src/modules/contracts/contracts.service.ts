import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TenancyService } from '@/common/tenancy/tenancy.service';
import { ContractStatus } from '@/common/graphql/enums';
import { PaginationInput } from '@/common/pagination/pagination.input';
import { PaginatedInterface } from '@/common/pagination/paginated.type';
import { Contract } from './models/contract.model';
import { CreateContractInput } from './dto/create-contract.input';
import { UpdateContractInput } from './dto/update-contract.input';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenancy: TenancyService,
  ) {}

  async listContracts(
    userId: string,
    orgId: string,
    pagination: PaginationInput,
  ): Promise<PaginatedInterface<Contract>> {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      orgId,
      ...(search
        ? {
            OR: [
              { clientName: { contains: search, mode: 'insensitive' as const } },
              { name: { contains: search, mode: 'insensitive' as const } },
              { number: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return {
      data: data as Contract[],
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
    };
  }

  async findContractById(userId: string, id: string) {
    const contract = await this.loadContractOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, contract.orgId);
    return contract;
  }

  findProjectByContract(projectId: string) {
    return this.prisma.project.findUnique({ where: { id: projectId } });
  }

  async listExpiringContracts(userId: string, orgId: string) {
    await this.tenancy.assertOrgMembership(userId, orgId);
    const now = new Date();
    const threshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.prisma.contract.findMany({
      where: {
        orgId,
        status: ContractStatus.ACTIVE,
        expiresAt: { gte: now, lte: threshold },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async createContract(userId: string, input: CreateContractInput) {
    await this.tenancy.assertOrgMembership(userId, input.orgId);
    return this.prisma.contract.create({
      data: {
        orgId: input.orgId,
        projectId: input.projectId,
        number: input.number,
        clientName: input.clientName,
        name: input.name,
        valueLabel: input.valueLabel,
        status: input.status,
        expiresAt: input.expiresAt,
      },
    });
  }

  async updateContract(userId: string, input: UpdateContractInput) {
    const contract = await this.loadContractOrThrow(input.id);
    await this.tenancy.assertOrgMembership(userId, contract.orgId);
    const { id, ...data } = input;
    return this.prisma.contract.update({ where: { id }, data });
  }

  async renewContract(userId: string, id: string, expiresAt: Date) {
    const contract = await this.loadContractOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, contract.orgId);
    return this.prisma.contract.update({
      where: { id },
      data: { expiresAt, status: ContractStatus.ACTIVE },
    });
  }

  async removeContract(userId: string, id: string) {
    const contract = await this.loadContractOrThrow(id);
    await this.tenancy.assertOrgMembership(userId, contract.orgId);
    await this.prisma.contract.delete({ where: { id } });
    return true;
  }

  private async loadContractOrThrow(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) throw new NotFoundException('Contrato não encontrado');
    return contract;
  }
}
