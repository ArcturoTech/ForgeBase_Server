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
exports.WebhookDelivery = void 0;
const graphql_1 = require("@nestjs/graphql");
let WebhookDelivery = class WebhookDelivery {
    id;
    webhookId;
    event;
    statusCode;
    durationMs;
    target;
    failed;
    retryLabel;
    createdAt;
};
exports.WebhookDelivery = WebhookDelivery;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "webhookId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "event", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebhookDelivery.prototype, "statusCode", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], WebhookDelivery.prototype, "durationMs", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "target", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], WebhookDelivery.prototype, "failed", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WebhookDelivery.prototype, "retryLabel", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], WebhookDelivery.prototype, "createdAt", void 0);
exports.WebhookDelivery = WebhookDelivery = __decorate([
    (0, graphql_1.ObjectType)()
], WebhookDelivery);
//# sourceMappingURL=webhook-delivery.model.js.map