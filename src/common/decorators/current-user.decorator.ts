import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
