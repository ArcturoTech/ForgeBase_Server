import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { InvitationsResolver } from './invitations.resolver';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [AuthModule],
  providers: [InvitationsResolver, InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
