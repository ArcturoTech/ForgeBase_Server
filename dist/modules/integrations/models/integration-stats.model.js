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
exports.IntegrationStats = void 0;
const graphql_1 = require("@nestjs/graphql");
let IntegrationStats = class IntegrationStats {
    activeApiKeys;
    totalWebhooks;
    failingWebhooks;
    averageSuccessRate;
};
exports.IntegrationStats = IntegrationStats;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], IntegrationStats.prototype, "activeApiKeys", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], IntegrationStats.prototype, "totalWebhooks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], IntegrationStats.prototype, "failingWebhooks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], IntegrationStats.prototype, "averageSuccessRate", void 0);
exports.IntegrationStats = IntegrationStats = __decorate([
    (0, graphql_1.ObjectType)()
], IntegrationStats);
//# sourceMappingURL=integration-stats.model.js.map