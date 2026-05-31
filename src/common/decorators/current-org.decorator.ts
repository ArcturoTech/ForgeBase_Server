import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentOrg = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    const ctx = GqlExecutionContext.create(context);
    const header = ctx.getContext().req?.headers?.['x-org-id'];
    return typeof header === 'string' ? header : null;
  },
);
