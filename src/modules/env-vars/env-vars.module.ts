import { Module } from '@nestjs/common';
import { ActivityModule } from '@/modules/activity/activity.module';
import { EnvVarsResolver } from './env-vars.resolver';
import { EnvVarsService } from './env-vars.service';

@Module({
  imports: [ActivityModule],
  providers: [EnvVarsResolver, EnvVarsService],
  exports: [EnvVarsService],
})
export class EnvVarsModule {}
