import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

interface ThrottledRequest extends Record<string, unknown> {
  res?: Record<string, unknown>;
}

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext<{ req?: ThrottledRequest }>();
      if (!gqlContext?.req || !gqlContext.req.res) return true;
    }
    return super.canActivate(context);
  }

  getRequestResponse(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext<{ req: ThrottledRequest }>();
      return { req: gqlContext.req, res: gqlContext.req.res };
    }
    const httpContext = context.switchToHttp();
    return { req: httpContext.getRequest(), res: httpContext.getResponse() };
  }
}
