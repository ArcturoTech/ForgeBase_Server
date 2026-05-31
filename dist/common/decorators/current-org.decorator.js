"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentOrg = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
exports.CurrentOrg = (0, common_1.createParamDecorator)((_data, context) => {
    const ctx = graphql_1.GqlExecutionContext.create(context);
    const header = ctx.getContext().req?.headers?.['x-org-id'];
    return typeof header === 'string' ? header : null;
});
//# sourceMappingURL=current-org.decorator.js.map