"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const path_1 = require("path");
require("./common/graphql/enums");
const prisma_module_1 = require("./prisma/prisma.module");
const prisma_service_1 = require("./prisma/prisma.service");
const loaders_1 = require("./common/dataloader/loaders");
const gql_throttler_guard_1 = require("./common/guards/gql-throttler.guard");
const pubsub_module_1 = require("./common/pubsub/pubsub.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const stripe_module_1 = require("./stripe/stripe.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const members_module_1 = require("./modules/members/members.module");
const projects_module_1 = require("./modules/projects/projects.module");
const sprints_module_1 = require("./modules/sprints/sprints.module");
const boards_module_1 = require("./modules/boards/boards.module");
const issues_module_1 = require("./modules/issues/issues.module");
const activity_module_1 = require("./modules/activity/activity.module");
const snapshots_module_1 = require("./modules/snapshots/snapshots.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const documents_module_1 = require("./modules/documents/documents.module");
const integrations_module_1 = require("./modules/integrations/integrations.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const tenancy_module_1 = require("./common/tenancy/tenancy.module");
const configuration_1 = __importDefault(require("./config/configuration"));
const env_validation_1 = require("./config/env.validation");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validate: env_validation_1.validateEnv,
            }),
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                imports: [config_1.ConfigModule, jwt_1.JwtModule.register({}), prisma_module_1.PrismaModule],
                inject: [config_1.ConfigService, jwt_1.JwtService, prisma_service_1.PrismaService],
                useFactory: (config, jwt, prisma) => ({
                    autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                    sortSchema: true,
                    playground: false,
                    introspection: process.env.NODE_ENV !== 'production',
                    validationRules: [(0, graphql_depth_limit_1.default)(10)],
                    plugins: [
                        process.env.NODE_ENV === 'production'
                            ? (0, default_1.ApolloServerPluginLandingPageProductionDefault)({ footer: false })
                            : (0, default_1.ApolloServerPluginLandingPageLocalDefault)(),
                    ],
                    subscriptions: {
                        'graphql-ws': {
                            onConnect: (context) => {
                                const params = context.connectionParams ?? {};
                                const header = params.authorization ?? params.Authorization;
                                if (typeof header === 'string' && header.startsWith('Bearer ')) {
                                    context.extra.user = jwt.verify(header.slice(7), {
                                        secret: config.get('jwt.accessSecret'),
                                    });
                                }
                            },
                        },
                    },
                    context: (ctx) => ({ ...ctx, loaders: (0, loaders_1.createLoaders)(prisma) }),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
            schedule_1.ScheduleModule.forRoot(),
            pubsub_module_1.PubSubModule,
            tenancy_module_1.TenancyModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            stripe_module_1.StripeModule,
            organizations_module_1.OrganizationsModule,
            members_module_1.MembersModule,
            projects_module_1.ProjectsModule,
            sprints_module_1.SprintsModule,
            boards_module_1.BoardsModule,
            issues_module_1.IssuesModule,
            activity_module_1.ActivityModule,
            snapshots_module_1.SnapshotsModule,
            contracts_module_1.ContractsModule,
            invoices_module_1.InvoicesModule,
            documents_module_1.DocumentsModule,
            integrations_module_1.IntegrationsModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [{ provide: core_1.APP_GUARD, useClass: gql_throttler_guard_1.GqlThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map