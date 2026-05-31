import { Module } from '@nestjs/common';
import { ProjectsResolver, ProjectMemberResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  providers: [ProjectsResolver, ProjectMemberResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
