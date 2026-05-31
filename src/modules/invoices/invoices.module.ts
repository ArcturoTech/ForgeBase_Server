import { Module } from '@nestjs/common';
import { InvoicesResolver } from './invoices.resolver';
import { InvoicesService } from './invoices.service';

@Module({
  providers: [InvoicesResolver, InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
