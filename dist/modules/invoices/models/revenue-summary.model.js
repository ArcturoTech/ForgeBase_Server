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
exports.RevenueSummary = void 0;
const graphql_1 = require("@nestjs/graphql");
let RevenueSummary = class RevenueSummary {
    mrrCents;
    receivableCents;
    overdueCents;
    receivedCents;
};
exports.RevenueSummary = RevenueSummary;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RevenueSummary.prototype, "mrrCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RevenueSummary.prototype, "receivableCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RevenueSummary.prototype, "overdueCents", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RevenueSummary.prototype, "receivedCents", void 0);
exports.RevenueSummary = RevenueSummary = __decorate([
    (0, graphql_1.ObjectType)()
], RevenueSummary);
//# sourceMappingURL=revenue-summary.model.js.map