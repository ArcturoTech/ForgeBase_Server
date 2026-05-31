import { Module } from '@nestjs/common';
import { SnapshotsResolver } from './snapshots.resolver';
import { SnapshotsService } from './snapshots.service';

@Module({
  providers: [SnapshotsResolver, SnapshotsService],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
