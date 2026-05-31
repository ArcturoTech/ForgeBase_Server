import { Module } from '@nestjs/common';
import { ContractsResolver } from './contracts.resolver';
import { ContractsService } from './contracts.service';

@Module({
  providers: [ContractsResolver, ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
