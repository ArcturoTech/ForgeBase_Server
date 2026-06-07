import { Module } from '@nestjs/common';
import { ResourcesResolver } from './resources.resolver';
import { ResourcesService } from './resources.service';

@Module({
  providers: [ResourcesResolver, ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
