"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_tokens_model_1 = require("./models/auth-tokens.model");
const register_user_input_1 = require("./dto/register-user.input");
const login_user_input_1 = require("./dto/login-user.input");
const gql_auth_guard_1 = require("../common/guards/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuthResolver = class AuthResolver {
    authService;
    jwt;
    config;
    constructor(authService, jwt, config) {
        this.authService = authService;
        this.jwt = jwt;
        this.config = config;
    }
    registerUser(input) {
        return this.authService.registerUser(input);
    }
    loginUser(input) {
        return this.authService.loginUser(input);
    }
    async refreshToken(token) {
        const payload = await this.jwt.verifyAsync(token, {
            secret: this.config.get('jwt.refreshSecret'),
        });
        return this.authService.refreshUserTokens(payload.sub, payload.email);
    }
    async logoutUser(user) {
        await this.authService.logoutUser(user.id);
        return true;
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => auth_tokens_model_1.AuthTokens),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_input_1.RegisterUserInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "registerUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_tokens_model_1.AuthTokens),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_input_1.LoginUserInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_tokens_model_1.AuthTokens),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logoutUser", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map