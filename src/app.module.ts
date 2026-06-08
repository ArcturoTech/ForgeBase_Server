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
import { CryptoModule } from './common/crypto/crypto.module';
import { StorageModule } from './common/storage/storage.module';
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
import { ChatModule } from './modules/chat/chat.module';
import { ChatSpacesModule } from './modules/chat-spaces/chat-spaces.module';
import { EnvVarsModule } from './modules/env-vars/env-vars.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
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
        context: (ctx: Record<string, unknown>) => {
          const req = ctx.req as
            | { user?: { id?: string }; headers?: { authorization?: string } }
            | undefined;
          const extra = ctx.extra as { user?: { sub?: string } } | undefined;
          let currentUserId = req?.user?.id ?? extra?.user?.sub ?? null;
          if (!currentUserId) {
            const header = req?.headers?.authorization;
            if (header?.startsWith('Bearer ')) {
              try {
                const payload = jwt.verify<{ sub?: string }>(header.slice(7), {
                  secret: config.get<string>('jwt.accessSecret'),
                });
                currentUserId = payload.sub ?? null;
              } catch {
                currentUserId = null;
              }
            }
          }
          return { ...ctx, loaders: createLoaders(prisma, currentUserId) };
        },
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    ScheduleModule.forRoot(),
    PubSubModule,
    CryptoModule,
    StorageModule,
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
    ChatModule,
    ChatSpacesModule,
    EnvVarsModule,
    ResourcesModule,
    AttachmentsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: GqlThrottlerGuard }],
})
export class AppModule {}
