import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import './common/graphql/enums';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { createLoaders } from './common/dataloader/loaders';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StripeModule } from './stripe/stripe.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MembersModule } from './modules/members/members.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { BoardsModule } from './modules/boards/boards.module';
import { IssuesModule } from './modules/issues/issues.module';
import { ActivityModule } from './modules/activity/activity.module';
import { SnapshotsModule } from './modules/snapshots/snapshots.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TenancyModule } from './common/tenancy/tenancy.module';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, JwtModule.register({}), PrismaModule],
      inject: [ConfigService, JwtService, PrismaService],
      useFactory: (config: ConfigService, jwt: JwtService, prisma: PrismaService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: false,
        introspection: process.env.NODE_ENV !== 'production',
        validationRules: [depthLimit(10)],
        plugins: [
          process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
            : ApolloServerPluginLandingPageLocalDefault(),
        ],
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: {
              connectionParams?: Record<string, unknown>;
              extra: unknown;
            }) => {
              const params = context.connectionParams ?? {};
              const header = params.authorization ?? params.Authorization;
              if (typeof header === 'string' && header.startsWith('Bearer ')) {
                (context.extra as Record<string, unknown>).user = jwt.verify(header.slice(7), {
                  secret: config.get<string>('jwt.accessSecret'),
                });
              }
            },
          },
        },
        context: (ctx: Record<string, unknown>) => ({ ...ctx, loaders: createLoaders(prisma) }),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    ScheduleModule.forRoot(),
    PubSubModule,
    TenancyModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    StripeModule,
    OrganizationsModule,
    MembersModule,
    ProjectsModule,
    SprintsModule,
    BoardsModule,
    IssuesModule,
    ActivityModule,
    SnapshotsModule,
    ContractsModule,
    InvoicesModule,
    DocumentsModule,
    IntegrationsModule,
    NotificationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GqlThrottlerGuard }],
})
export class AppModule {}
