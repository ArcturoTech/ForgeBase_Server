import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
export declare class GqlThrottlerGuard extends ThrottlerGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
    getRequestResponse(context: ExecutionContext): {
        req: any;
        res: any;
    };
}
