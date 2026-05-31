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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/graphql/enums");
let ApiKey = class ApiKey {
    id;
    name;
    prefix;
    scope;
    status;
    lastUsedAt;
    callCount;
    createdAt;
};
exports.ApiKey = ApiKey;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ApiKey.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ApiKey.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ApiKey.prototype, "prefix", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ApiKey.prototype, "scope", void 0);
__decorate([
    (0, graphql_1.Field)(() => enums_1.ApiKeyStatus),
    __metadata("design:type", String)
], ApiKey.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], ApiKey.prototype, "lastUsedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ApiKey.prototype, "callCount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ApiKey.prototype, "createdAt", void 0);
exports.ApiKey = ApiKey = __decorate([
    (0, graphql_1.ObjectType)()
], ApiKey);
//# sourceMappingURL=api-key.model.js.map